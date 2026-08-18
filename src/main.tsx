/**
 * @file main.tsx
 * @modified 2026-08-17
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Reduzir o custo de fontes no caminho critico sem alterar a identidade visual.
 *         Depois: a reforma da página de vendas (protótipo aprovado em design/) tirou a
 *         serifa (Playfair Display) de todos os títulos — era a única fonte no site usando
 *         essa família, então os 3 arquivos de fonte ficaram sem nenhum uso.
 * @objective Diminuir CSS bloqueante e assets de fonte mantendo os mesmos pesos e familias
 *            tipograficas. Depois: remover de vez o carregamento da Playfair Display, já
 *            que nenhuma classe font-serif restou no código.
 * @solution Manter apenas pesos usados e trocar imports genericos do @fontsource pelos
 *           subsets latin correspondentes ao conteudo PT-BR. Depois: removidos os 3
 *           imports de @fontsource/playfair-display — 3 requisições de fonte a menos em
 *           toda carga de página.
 */
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
