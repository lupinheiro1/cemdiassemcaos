/**
 * @file FinalCTASection.tsx
 * @modified 2026-08-17
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Reforma da página de vendas (protótipo aprovado em design/): "esses primeiros
 *         100 dias" restringia o produto ao pós-parto; ele serve pra gravidez inteira, não
 *         só depois do bebê nascer (ver
 *         design/100-dias-sem-caos-copy-pagina-vendas_4.md, seção 15).
 * @objective Parágrafo final fala em "a gravidez — e os 100 dias que vêm depois".
 * @solution Texto trocado; font-serif → font-sans no h2 e no wordmark do rodapé; CTA com
 *           seta, igual ao resto da página.
 */
import { CTAButton } from "@/components/ui/cta-button";
import { Heart, Sparkles } from "lucide-react";

export const FinalCTASection = () => {
  return (
    <section className="pt-16 md:pt-24 bg-gradient-to-b from-background to-rose-light">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main message */}
          <div className="mb-10">
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-6">
              A maternidade pode ser vivida com{" "}
              <span className="text-primary">leveza</span>,{" "}
              <span className="text-sage">consciência</span> e{" "}
              <span className="text-peach">presença</span>.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Você merece atravessar a gravidez — e os 100 dias que vêm depois — com mais apoio, clareza e direção: por você, pelo seu bebê e pela história que vocês estão começando a construir juntos.
            </p>
          </div>

          {/* Final CTA */}
          <div className="space-y-4">
            <CTAButton className="text-xl px-10 py-5">
              Quero Viver Meus 100 Dias Sem Caos{" →"}
            </CTAButton>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Acesso imediato após a compra
              <Sparkles className="w-4 h-4" />
            </p>
          </div>

        </div>
      </div>

      {/* Dark Footer */}
      <div className="mt-16 bg-warm-brown py-12">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-rose-light" />
              <span className="font-sans text-lg text-cream font-light">100 Dias Sem Caos</span>
            </div>
            <p className="text-sm text-cream/80 mb-2">
              © 2026 Luiza Pinheiro. Todos os direitos reservados.
            </p>
            <a 
              href="#" 
              className="text-sm text-cream/70 hover:text-cream underline underline-offset-2 mb-6 inline-block"
            >
              Política de Privacidade
            </a>
            <p className="text-xs text-cream/60 max-w-2xl mx-auto leading-relaxed mt-4">
              <strong className="text-cream/80">Aviso Legal:</strong> "Nenhuma informação contida neste produto deve ser interpretada como uma afirmação da obtenção de resultados. Qualquer referência ao desempenho passado ou potencial de uma estratégia abordada no conteúdo não é, e não deve ser interpretada como uma recomendação ou como garantia de qualquer resultado específico."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
