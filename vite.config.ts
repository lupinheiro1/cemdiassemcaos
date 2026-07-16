/**
 * @file vite.config.ts
 * @modified 2026-07-16
 * @authors Marcelo Arana + GitHub Copilot GPT-5.3-Codex + Claude Fable 5
 * @reason PageSpeed: LCP (h1 do herói) espera as fontes no fim de uma cadeia crítica de ~830ms
 * @objective Antecipar o download das 2 fontes do herói (Playfair 700 do título + Inter 400 do corpo)
 * @solution preloadHeroFontsPlugin injeta <link rel="preload"> no index.html apontando pros
 *           arquivos hasheados do bundle (regex, sobrevive a rebuild). Mantido o inline de CSS do Codex.
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Fontes do herói (LCP): apenas estas 2 — preload demais compete com o próprio LCP.
const HERO_FONT_PATTERNS = [
  /^assets\/playfair-display-latin-700-normal-[^.]+\.woff2$/,
  /^assets\/inter-latin-400-normal-[^.]+\.woff2$/,
];

function preloadHeroFontsPlugin(base: string) {
  return {
    name: "preload-hero-fonts",
    apply: "build",
    enforce: "post",
    transformIndexHtml(html: string, ctx: { bundle?: Record<string, { type: string; fileName: string }> }) {
      if (!ctx?.bundle) return html;

      const links = Object.values(ctx.bundle)
        .filter((a) => a.type === "asset" && HERO_FONT_PATTERNS.some((re) => re.test(a.fileName)))
        .map((a) => `    <link rel="preload" href="${base}${a.fileName}" as="font" type="font/woff2" crossorigin />`)
        .join("\n");

      if (!links) return html;
      return html.replace("<!-- Google Tag Manager", `${links}\n    <!-- Google Tag Manager`);
    },
  };
}

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
  plugins: [react(), inlineBuildCssPlugin(), preloadHeroFontsPlugin('/100-dias-sem-caos/'), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
