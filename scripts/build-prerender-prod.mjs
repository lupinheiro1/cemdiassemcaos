/**
 * @file build-prerender-prod.mjs
 * @modified 2026-07-24
 * @authors Marcelo Arana + Luiza Pinheiro + Claude Opus 4.8
 * @reason O build-prerender.mjs (Luiza) é fixo na base de PREVIEW
 *         (/100-dias-sem-caos-prerender/) e o plugin do vite.config injeta
 *         `noindex` em todo build com mode="prerender". Publicar isso em produção
 *         quebraria os assets E tiraria a landing do Google.
 * @objective Gerar o MESMO artefato pré-renderizado, porém publicável em
 *            /100-dias-sem-caos/.
 * @solution Reusa o pipeline dela (build cliente + build SSR pelo Vite, mesmas URLs
 *           de asset), sobrescrevendo `base` e `outDir`, removendo o meta noindex e
 *           injetando o bootstrap de UTM. Aborta se qualquer garantia falhar.
 */
import { build } from "vite";
import { mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "..");
const clientOutDir = join(root, "dist-prerender-prod");
const serverOutDir = join(root, "node_modules", ".cache", "cemdias-prerender-ssr-prod");
const serverEntryName = "prerender-server.mjs";
const serverEntryPath = join(serverOutDir, serverEntryName);
const htmlPath = join(clientOutDir, "index.html");
const rootMarker = '<div id="root"></div>';
const PROD_BASE = "/100-dias-sem-caos/";
const PREVIEW_BASE = "100-dias-sem-caos-prerender";

/** Espelha TRACKED_PARAMS de src/lib/checkoutUrl.ts. */
const TRACKED = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"];

/**
 * Script síncrono injetado no fim do <body>: fecha a janela (~1,3s em 4G) entre a
 * primeira pintura e a hidratação, em que o CTA está clicável sem os parâmetros de
 * campanha. O prerender-client.tsx faz o mesmo ao hidratar — este só antecipa,
 * produzindo href idêntico (validado caso a caso), então não há mismatch.
 */
const utmBootstrap = `(function(){try{var K=${JSON.stringify(TRACKED)};var q=new URLSearchParams(location.search);if(!K.some(function(k){return q.get(k)}))return;var a=document.querySelectorAll('a[href*="pay.hotmart.com"]');for(var i=0;i<a.length;i++){var u=new URL(a[i].href);for(var j=0;j<K.length;j++){var v=q.get(K[j]);if(v)u.searchParams.set(K[j],v)}a[i].href=u.toString()}}catch(e){}})();`;

rmSync(clientOutDir, { recursive: true, force: true });

await build({ root, mode: "prerender", base: PROD_BASE, build: { outDir: clientOutDir } });

rmSync(serverOutDir, { recursive: true, force: true });
mkdirSync(serverOutDir, { recursive: true });

await build({
  root,
  mode: "prerender",
  base: PROD_BASE,
  build: {
    ssr: join(root, "src", "prerender-server.tsx"),
    outDir: serverOutDir,
    emptyOutDir: false,
    copyPublicDir: false,
    minify: false,
    rollupOptions: { output: { entryFileNames: serverEntryName, format: "es" } },
  },
});

const serverModule = await import(`${pathToFileURL(serverEntryPath).href}?build=${Date.now()}`);
const appHtml = serverModule.renderLanding();
let documentHtml = readFileSync(htmlPath, "utf8");

// --- garantias herdadas do script da Luiza ---
if (!documentHtml.includes(rootMarker)) throw new Error("[prod] Root vazio não encontrado no HTML do Vite.");
if (!appHtml.includes("<h1")) throw new Error("[prod] O H1 não foi gerado pelo render de servidor.");
if (!appHtml.includes("Todo mundo ensina a preparar")) throw new Error("[prod] Texto esperado da Hero ausente.");
if (/\b(?:src|href)="(?:undefined)?"/.test(appHtml)) throw new Error("[prod] HTML contém asset/link sem URL válida.");

// O plugin prerenderHtmlPlugin injeta noindex em TODO build mode="prerender".
// Em produção isso removeria a landing do índice do Google.
documentHtml = documentHtml.replace(/\s*<meta name="robots" content="noindex, nofollow"\s*\/?>/gi, "");

let outputHtml = documentHtml.replace(rootMarker, `<div id="root" data-prerendered="true">${appHtml}</div>`);
outputHtml = outputHtml.replace("</body>", `    <script id="utm-bootstrap">${utmBootstrap}</script>\n  </body>`);

// --- garantias específicas de produção ---
if (!outputHtml.includes(`${PROD_BASE}assets/`)) throw new Error("[prod] Assets não usam a base de produção.");
if (outputHtml.includes(PREVIEW_BASE)) throw new Error("[prod] Sobrou caminho de PREVIEW no HTML.");
if (/noindex/i.test(outputHtml)) throw new Error("[prod] noindex presente — abortado (tiraria o site do Google).");
if (!outputHtml.includes("GTM-5MLMK2BS")) throw new Error("[prod] Snippet do GTM ausente.");
if (!outputHtml.includes("utm-bootstrap")) throw new Error("[prod] Bootstrap de UTM não foi injetado.");

const ctas = (outputHtml.match(/href="https:\/\/pay\.hotmart\.com/g) || []).length;
if (ctas < 7) throw new Error(`[prod] Esperados >=7 CTAs, encontrados ${ctas}.`);

writeFileSync(htmlPath, outputHtml, "utf8");

console.log(
  `[prod] OK — base ${PROD_BASE} · sem noindex · GTM presente · ${ctas} CTAs · ` +
    `UTM bootstrap ativo · ${(statSync(htmlPath).size / 1024).toFixed(1)} KB em dist-prerender-prod/`
);
