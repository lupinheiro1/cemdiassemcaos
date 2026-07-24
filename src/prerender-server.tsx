/**
 * Entrada de servidor exclusiva do build prerender.
 *
 * Renderiza exatamente a mesma raiz usada por prerender-client.tsx. O bundle
 * SSR é produzido pelo Vite para que imports de SVG, WebP e demais assets usem
 * as mesmas URLs versionadas do bundle cliente.
 */
import { renderToString } from "react-dom/server";
import Index from "./pages/Index";

export function renderLanding(): string {
  return renderToString(<Index />);
}
