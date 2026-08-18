/**
 * @file prerender-client.tsx
 * @modified 2026-08-17
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Entrada exclusiva do build prerender. O HTML já contém a landing completa.
 *         Antes de hidratar, os links do Hotmart recebem os mesmos parâmetros de campanha
 *         que o primeiro render do React vai calcular. Assim, o DOM pré-renderizado e o
 *         DOM do cliente permanecem iguais mesmo quando a visita contém UTM, fbclid ou
 *         gclid. Depois: a reforma da página de vendas tirou a serifa (Playfair Display)
 *         de todos os títulos — mesmo motivo do main.tsx.
 * @objective Hidratar o HTML pré-renderizado sem divergir do DOM do servidor.
 * @solution Removidos os 3 imports de @fontsource/playfair-display, espelhando a mesma
 *           remoção feita em main.tsx (os dois entry points carregam fontes hoje).
 */
import { hydrateRoot } from "react-dom/client";
import Index from "./pages/Index";
import { buildCheckoutUrl } from "./lib/checkoutUrl";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "./index.css";

const root = document.getElementById("root");

if (!root || root.dataset.prerendered !== "true") {
  throw new Error("[prerender] HTML pré-renderizado não encontrado.");
}

root
  .querySelectorAll<HTMLAnchorElement>('a[href*="pay.hotmart.com"]')
  .forEach((link) => {
    link.href = buildCheckoutUrl(link.href);
  });

hydrateRoot(root, <Index />, {
  onRecoverableError(error) {
    console.error("[prerender] Erro recuperável de hidratação:", error);
  },
});
