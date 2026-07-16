/**
 * @file vite.config.ts
 * @modified 2026-07-16
 * @authors Marcelo Arana + GitHub Copilot GPT-5.3-Codex + Claude Fable 5
 * @reason Regressão real medida no PageSpeed (82→74, LCP 3,5s→4,6s): o preload de fontes
 *         competia por banda com o próprio bundle JS — e nesta SPA o <h1> do LCP só existe
 *         depois que o bundle roda, então atrasar o bundle atrasa o LCP mais do que preloadar
 *         a fonte economiza.
 * @objective Remover o preload de fontes (revertendo a mudança de mais cedo hoje).
 * @solution preloadHeroFontsPlugin removido. Mantido o inline de CSS do Codex.
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
