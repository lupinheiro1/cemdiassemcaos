import { CTAButton } from "@/components/ui/cta-button";
import { Clock, Heart, Sparkles } from "lucide-react";

export const FinalCTASection = () => {
  return (
    <section className="pt-16 md:pt-24 bg-gradient-to-b from-background to-rose-light">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main message */}
          <div className="mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              A maternidade pode ser vivida com{" "}
              <span className="text-primary">leveza</span>,{" "}
              <span className="text-sage">consciência</span> e{" "}
              <span className="text-peach">presença</span>.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Você merece atravessar esses primeiros 100 dias com mais apoio, clareza e direção — por você, pelo seu bebê e pela história que vocês estão começando a construir juntos.
            </p>
          </div>

          {/* Final CTA */}
          <div className="space-y-4">
            <CTAButton className="text-xl px-10 py-5">
              Quero Viver Meus 100 Dias Sem Caos
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
              <span className="font-serif text-lg text-cream font-light">100 Dias Sem Caos</span>
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
