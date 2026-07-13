/**
 * @file main.tsx
 * @modified 2026-07-13
 * @authors Marcelo Arana + GitHub Copilot GPT-5.3-Codex
 * @reason Reduzir o custo de fontes no caminho critico sem alterar a identidade visual
 * @objective Diminuir CSS bloqueante e assets de fonte mantendo os mesmos pesos e familias tipograficas
 * @solution Manter apenas pesos usados e trocar imports genericos do @fontsource pelos subsets latin correspondentes ao conteudo PT-BR
 */
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/playfair-display/latin-400.css";
import "@fontsource/playfair-display/latin-600.css";
import "@fontsource/playfair-display/latin-700.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
