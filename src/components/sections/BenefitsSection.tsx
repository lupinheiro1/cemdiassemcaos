import { CheckCircle2 } from "lucide-react";
import { CTAButton } from "@/components/ui/cta-button";

const benefits = [
  "Os 3 fundamentos para uma maternidade mais leve, mesmo em meio ao puerpério",
  "Um passo a passo para atravessar os primeiros dias com mais segurança, com decisões e conversas já antecipadas",
  "Conselhos que você gostaria de ouvir da sua melhor amiga, não do Google",
  "Reflexões sinceras para aliviar a culpa e reforçar o seu instinto",
  "Ferramentas práticas para evitar o caos sem virar uma mãe robô",
  "Um espaço sem julgamentos, com apoio, carinho e direção",
];

export const BenefitsSection = () => {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-lg p-6 md:p-10 text-left">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-8">
              O que tem nesse e-book que parece um abraço de mãe?
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 p-3 rounded-lg"
                >
                  <CheckCircle2 className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                  <span className="text-foreground font-light">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <CTAButton>Quero Viver Meus 100 Dias Sem Caos</CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};