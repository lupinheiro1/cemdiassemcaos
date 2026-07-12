/**
 * @file main.tsx
 * @modified 2026-07-12
 * @authors Marcelo Arana + Claude Sonnet 5
 * @reason Lighthouse mobile apontou 1.7s de render-blocking pela folha de fontes do Google Fonts
 * @objective Eliminar a requisição render-blocking pra fonts.googleapis.com
 * @solution Auto-hospedar Inter e Playfair Display via @fontsource, empacotadas no build
 */
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
