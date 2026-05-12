import { Heart } from "lucide-react";
import { CTAButton } from "@/components/ui/cta-button";

export const HighlightSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-rose-light via-peach-light to-lavender-light">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
            Pensado de mãe para mãe
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-6">
            O maior erro da maioria dos cursos de maternidade é focar apenas no
            bebê que já está nos seus braços. Porém, eles esquecem de uma verdade
            simples.
          </p>

          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 mb-8">
            <Heart className="w-12 h-12 text-primary mx-auto mb-6 animate-pulse-soft" />
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-snug">
              Existe alguém que cuida{" "}
              <span className="text-primary">24 horas por dia</span> desse bebê
              que acabou de nascer.
            </p>
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2">
              E esse alguém é você, mãe.
            </p>
          </div>

          <p className="text-lg text-muted-foreground mb-10">
            E para você conseguir curtir 100% o seu filho, os cuidados precisam ir
            muito além dele.
          </p>

          <div className="bg-card rounded-xl p-6 shadow-md max-w-xl mx-auto mb-10">
            <p className="text-sm text-muted-foreground italic">
              Por isso, separamos com muito carinho e dedicação o que sempre é esquecido nesse início, mas que faz toda a diferença.
            </p>
          </div>

          <CTAButton>Quero Viver Meus 100 Dias Sem Caos</CTAButton>
        </div>
      </div>
    </section>
  );
};
