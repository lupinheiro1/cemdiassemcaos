/**
 * @file inject-utm-bootstrap.mjs
 * @modified 2026-07-24
 * @authors Marcelo Arana + Claude Opus 4.8
 * @reason No HTML pré-renderizado o CTA já é um <a href> clicável na primeira pintura,
 *         mas com o link "pelado" (sem utm, fbclid, gclid) — o build acontece antes de
 *         existir visitante. Os parâmetros só entram quando o bundle (~236 KB) hidrata,
 *         ~1,3s depois em 4G. Clique nessa janela = venda na Hotmart sem atribuição de
 *         campanha. A SPA atual não tem esse problema (o CTA só existe após o JS).
 * @objective Fechar a janela sem tocar em GTM/GA/Meta Pixel nem no comportamento visual.
 * @solution Injeta no final do <body> — depois dos <a>, antes do bundle deferido — um
 *           script inline síncrono que replica buildCheckoutUrl() e reescreve os href de
 *           pay.hotmart.com com os parâmetros da URL da visitante. Roda em ~1ms.
 *           Idempotente: o React recalcula o mesmo href na hidratação, então não há
 *           mismatch (o DOM já bate com o que o cliente vai renderizar).
 */
import { readFileSync, writeFileSync } from "node:fs";

/**
 * Espelha TRACKED_PARAMS de src/lib/checkoutUrl.ts. Se aquela lista mudar, esta precisa
 * mudar junto — a validação em validate-prerender.mjs falha o build se divergirem.
 */
const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
];

const MARKER = "utm-bootstrap";

/**
 * Script minificado à mão (não passa por bundler). Usa var/function para rodar em
 * qualquer engine sem transpilação. `searchParams.set` sobrescreve, igual ao
 * buildCheckoutUrl — os params do próprio link (checkoutMode) são preservados porque
 * não estão na lista rastreada.
 */
const bootstrap = `(function(){try{var K=${JSON.stringify(TRACKED_PARAMS)};var q=new URLSearchParams(location.search);var hit=K.some(function(k){return q.get(k)});if(!hit)return;var a=document.querySelectorAll('a[href*="pay.hotmart.com"]');for(var i=0;i<a.length;i++){var u=new URL(a[i].href);for(var j=0;j<K.length;j++){var v=q.get(K[j]);if(v)u.searchParams.set(K[j],v)}a[i].href=u.toString()}}catch(e){}})();`;

const file = process.argv[2];
if (!file) {
  console.error("[utm-bootstrap] uso: node scripts/inject-utm-bootstrap.mjs <caminho/index.html>");
  process.exit(1);
}

let html = readFileSync(file, "utf-8");

if (html.includes(MARKER)) {
  console.log("[utm-bootstrap] já presente — nada a fazer.");
  process.exit(0);
}

// Precisa vir DEPOIS dos <a> no DOM (por isso fim do body, não <head>) e ANTES do
// bundle deferido. Um <script> síncrono aqui executa antes de qualquer type="module".
const anchor = "</body>";
if (!html.includes(anchor)) {
  console.error("[utm-bootstrap] </body> não encontrado — abortando sem alterar.");
  process.exit(1);
}

html = html.replace(anchor, `    <script id="${MARKER}">${bootstrap}</script>\n  ${anchor}`);
writeFileSync(file, html, "utf-8");

console.log(`[utm-bootstrap] OK — ${bootstrap.length} bytes injetados antes de </body>.`);
