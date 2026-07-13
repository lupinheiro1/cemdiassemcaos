/**
 * @file App.tsx
 * @modified 2026-07-13
 * @authors Marcelo Arana + GitHub Copilot GPT-5.3-Codex
 * @reason Reduzir custo de JavaScript inicial sem impacto visual
 * @objective Remover providers globais nao utilizados na landing e atrasar codigo de rota secundaria
 * @solution Eliminar QueryClientProvider/Toasters/TooltipProvider do bootstrap e carregar NotFound via lazy
 */
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <BrowserRouter basename="/100-dias-sem-caos">
    <Routes>
      <Route path="/" element={<Index />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route
        path="*"
        element={
          <Suspense fallback={null}>
            <NotFound />
          </Suspense>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default App;
