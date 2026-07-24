/**
 * @file deploy.mjs
 * @modified 2026-07-24
 * @authors Marcelo Arana + Claude Opus 4.8
 * @reason O deploy era manual (dois scp com caminhos longos) e exigia lembrar de
 *         NÃO substituir a pasta inteira — `public_html/100-dias-sem-caos/obrigado/`
 *         é a página de conversão, tem deploy próprio e não sai do build. Um
 *         `scp -r` distraído a apagaria.
 * @objective `npm run deploy` publica a produção sem que ninguém precise lembrar
 *            de regra nenhuma.
 * @solution Envia apenas index.html + assets/ (nunca a pasta), confere obrigado/
 *           antes e depois, e valida o site no ar ao final. Aborta em qualquer
 *           divergência.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(root, "dist-prerender-prod");
const HOST = "mate6679@108.179.252.173";
const PORT = "2222";
const KEY = join(homedir(), ".ssh", "lfcm_hostgator_deploy_ed25519_bash");
const REMOTE = "/home2/mate6679/public_html/100-dias-sem-caos";
const SITE = "https://maternologia.com.br/100-dias-sem-caos/";

const sh = (cmd, args) => execFileSync(cmd, args, { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const ssh = (cmd) => sh("ssh", ["-i", KEY, "-p", PORT, HOST, cmd]);
const die = (msg) => { console.error(`\n❌ ${msg}\n`); process.exit(1); };

// --- 1. o build existe e é o de produção? ---
if (!existsSync(join(DIST, "index.html"))) die("dist-prerender-prod/ não existe. Rode `npm run build` primeiro.");

const html = readFileSync(join(DIST, "index.html"), "utf-8");
if (!html.includes("<h1")) die("Build sem <h1> — não é o prerender.");
if (/noindex/i.test(html)) die("Build com noindex — tiraria o site do Google.");
if (!html.includes("GTM-5MLMK2BS")) die("Build sem o GTM.");
if (html.includes("100-dias-sem-caos-prerender")) die("Build aponta para a pasta de PREVIEW, não produção.");
const ctas = (html.match(/href="https:\/\/pay\.hotmart\.com/g) || []).length;
if (ctas < 7) die(`Build com ${ctas} CTAs (esperado >= 7).`);

console.log(`✓ build validado — H1, GTM, ${ctas} CTAs, sem noindex, base de produção`);

// --- 2. a página de conversão existe hoje? ---
const obrigadoAntes = ssh(`test -f ${REMOTE}/obrigado/index.html && echo ok || echo faltou`);
if (obrigadoAntes !== "ok") die("obrigado/index.html não encontrado no servidor. Abortado por segurança.");
console.log("✓ obrigado/ presente antes do deploy");

// --- 3. envio: apenas index.html e assets/. NUNCA a pasta inteira. ---
const assets = readdirSync(join(DIST, "assets")).map((f) => join(DIST, "assets", f));
sh("scp", ["-i", KEY, "-P", PORT, "-q", ...assets, `${HOST}:${REMOTE}/assets/`]);
console.log(`✓ ${assets.length} assets enviados (os antigos permanecem)`);

const raiz = ["index.html", "favicon.ico", "robots.txt", "placeholder.svg", "logo-maternologia-100-dias-sem-caos-v2.png"]
  .map((f) => join(DIST, f))
  .filter(existsSync);
sh("scp", ["-i", KEY, "-P", PORT, "-q", ...raiz, `${HOST}:${REMOTE}/`]);
console.log("✓ index.html publicado");

// --- 4. o site no ar está correto? ---
const fetchText = async (url) => (await fetch(url, { cache: "no-store" })).text();
await new Promise((r) => setTimeout(r, 2000));

const noAr = await fetchText(`${SITE}?deploy=${Date.now()}`);
if (!noAr.includes("<h1")) die("Site no ar sem <h1>. RESTAURE: deploy/100-dias-sem-caos-PRODUCAO-backup-20260724/");
if (!noAr.includes("GTM-5MLMK2BS")) die("Site no ar sem GTM. RESTAURE o backup.");

const jsPath = noAr.match(/\/100-dias-sem-caos\/assets\/index-[^"]+\.js/)?.[0];
if (!jsPath) die("Não achei o bundle no HTML publicado.");

// SEM cache-buster: é assim que o visitante real pede. A Cloudflare pode ter
// cacheado um 404 desse caminho (plano Free não expõe purge) e devolver a página
// de erro no lugar do bundle — a página quebra e um teste com ?cb= não veria.
const jsResp = await fetch(`https://maternologia.com.br${jsPath}`);
const tipo = jsResp.headers.get("content-type") || "";

if (!tipo.includes("javascript")) {
  console.log(`⚠ bundle voltou como "${tipo}" — 404 cacheado na Cloudflare. Renomeando…`);

  const nome = jsPath.split("/").pop();
  const novo = nome.replace(/\.js$/, `-c${Date.now().toString(36).slice(-3)}.js`);
  ssh(`cp ${REMOTE}/assets/${nome} ${REMOTE}/assets/${novo}`);

  const htmlPath = join(DIST, "index.html");
  writeFileSync(htmlPath, readFileSync(htmlPath, "utf-8").replaceAll(nome, novo), "utf-8");
  sh("scp", ["-i", KEY, "-P", PORT, "-q", htmlPath, `${HOST}:${REMOTE}/`]);

  await new Promise((r) => setTimeout(r, 2000));
  const retry = await fetch(`https://maternologia.com.br/100-dias-sem-caos/assets/${novo}`);
  const tipo2 = retry.headers.get("content-type") || "";
  if (!tipo2.includes("javascript")) die(`Ainda "${tipo2}" após renomear. RESTAURE o backup.`);
  console.log(`✓ contornado — bundle agora é ${novo} (${tipo2})`);
} else {
  console.log(`✓ bundle servido como ${tipo}`);
}

const obrigadoDepois = await fetch(`${SITE}obrigado/`, { cache: "no-store" });
if (!obrigadoDepois.ok) die("obrigado/ parou de responder! RESTAURE o backup.");
console.log("✓ obrigado/ intacta");

console.log(`\n🚀 No ar: ${SITE}\n   Rode o PageSpeed para confirmar: https://pagespeed.web.dev/\n`);
