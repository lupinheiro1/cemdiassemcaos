/**
 * @file vite.config.ts
 * @modified 2026-07-13
 * @authors Marcelo Arana + GitHub Copilot GPT-5.3-Codex
 * @reason Reduzir alerta de CSS bloqueante sem alterar identidade visual
 * @objective Eliminar a solicitacao externa de CSS no carregamento inicial e manter o mesmo estilo final
 * @solution Injetar o CSS gerado diretamente no index.html no build e remover links de stylesheet emitidos pelo Vite
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

function inlineBuildCssPlugin() {
  return {
    name: "inline-build-css",
    apply: "build",
    enforce: "post",
    transformIndexHtml(html: string, ctx: { bundle?: Record<string, { type: string; fileName: string; source?: string | Uint8Array }> }) {
      if (!ctx?.bundle) return html;

      const cssAssets = Object.values(ctx.bundle).filter(
        (asset) => asset.type === "asset" && asset.fileName.endsWith(".css")
      );

      if (cssAssets.length === 0) return html;

      const inlinedCss = cssAssets
        .map((asset) => (typeof asset.source === "string" ? asset.source : Buffer.from(asset.source ?? "").toString("utf-8")))
        .join("\n")
        .replace(/<\/style/gi, "<\\/style");

      const htmlWithoutCssLinks = html.replace(/<link rel="stylesheet"[^>]*href="[^"]*\.css"[^>]*>/g, "");

      return htmlWithoutCssLinks.replace(
        "</head>",
        `    <style id="inlined-vite-css">${inlinedCss}</style>\n  </head>`
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/100-dias-sem-caos/',
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), inlineBuildCssPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
