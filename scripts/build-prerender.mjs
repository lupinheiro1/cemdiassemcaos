import { build } from "vite";
import {
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "..");
const clientOutDir = join(root, "dist-prerender");
const serverOutDir = join(
  root,
  "node_modules",
  ".cache",
  "cemdias-prerender-ssr"
);
const serverEntryName = "prerender-server.mjs";
const serverEntryPath = join(serverOutDir, serverEntryName);
const htmlPath = join(clientOutDir, "index.html");
const rootMarker = '<div id="root"></div>';
const previewBase = "/100-dias-sem-caos-prerender/";

await build({
  root,
  mode: "prerender",
});

rmSync(serverOutDir, { recursive: true, force: true });
mkdirSync(serverOutDir, { recursive: true });

await build({
  root,
  mode: "prerender",
  build: {
    ssr: join(root, "src", "prerender-server.tsx"),
    outDir: serverOutDir,
    emptyOutDir: false,
    copyPublicDir: false,
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: serverEntryName,
        format: "es",
      },
    },
  },
});

const serverModule = await import(
  `${pathToFileURL(serverEntryPath).href}?build=${Date.now()}`
);
const appHtml = serverModule.renderLanding();
const documentHtml = readFileSync(htmlPath, "utf8");

if (!documentHtml.includes(rootMarker)) {
  throw new Error("[prerender] Root vazio não encontrado no HTML do Vite.");
}

if (!appHtml.includes("<h1")) {
  throw new Error("[prerender] O H1 não foi gerado pelo render de servidor.");
}

if (!appHtml.includes("Todo mundo ensina a preparar")) {
  throw new Error("[prerender] O texto esperado da Hero não está no HTML.");
}

if (/\b(?:src|href)="(?:undefined)?"/.test(appHtml)) {
  throw new Error("[prerender] O HTML contém asset ou link sem URL válida.");
}

const outputHtml = documentHtml.replace(
  rootMarker,
  `<div id="root" data-prerendered="true">${appHtml}</div>`
);

if (!outputHtml.includes(`${previewBase}assets/`)) {
  throw new Error("[prerender] Assets não usam o caminho da versão paralela.");
}

if (!outputHtml.includes('src="/100-dias-sem-caos-prerender/assets/')) {
  throw new Error("[prerender] O bundle cliente não usa a base do preview.");
}

writeFileSync(htmlPath, outputHtml, "utf8");

const htmlKb = (statSync(htmlPath).size / 1024).toFixed(1);
console.log(
  `[prerender] OK: H1 no HTML, assets preservados e ${htmlKb} KB gerados em dist-prerender.`
);
