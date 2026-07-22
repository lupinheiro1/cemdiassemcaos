/**
 * @file HeroSection.tsx
 * @description Seção principal da landing page.
 */

import { Check, Heart } from "lucide-react";
import logoMaternologia from "@/assets/logo-maternologia.svg";
import { CTAButton } from "@/components/ui/cta-button";

export const HeroSection = () => {
  return (
    <section className="relative flex items-start justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-rose-light via-background to-peach-light" />

      <div className="hidden md:block absolute top-20 left-10 w-32 h-32 bg-sage-light rounded-full blur-3xl opacity-60" />
      <div className="hidden md:block absolute bottom-40 right-10 w-48 h-48 bg-lavender-light rounded-full blur-3xl opacity-50" />
      <div className="hidden md:block absolute top-1/2 left-1/3 w-24 h-24 bg-peach-light rounded-full blur-2xl opacity-40" />

      <div className="container relative z-10 px-4 pt-2 pb-10 md:pt-4 md:pb-14">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-1">
            <img
              src={logoMaternologia}
              alt="Maternologia - 100 Dias Sem Caos"
              width="360"
              height="144"
              decoding="async"
              className="h-24 md:h-36 w-auto mx-auto"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-sm mb-8">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Guia prático para o início da maternidade
            </span>
          </div>

          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.08] mb-6 tracking-tight">
            Todo mundo ensina a preparar o bebê.
            <br />
            Mas quem ensina a preparar a{" "}
            <span className="text-[hsl(18_70%_48%)]">mãe?</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Se você está grávida e quer viver o início da maternidade com mais{" "}
            <strong className="font-semibold text-foreground">
              segurança, leveza e direção
            </strong>
            , leia esta página com atenção.
          </p>

          <div className="mt-6 mb-6">
            <span className="inline bg-[hsl(18_70%_48%)] px-3 py-1 text-lg md:text-xl font-bold leading-relaxed text-white box-decoration-clone">
              Você vai descobrir:
            </span>
          </div>

          <ul className="max-w-3xl mx-auto space-y-5 text-left text-lg md:text-xl text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-3">
              <Check className="mt-1 h-5 w-5 shrink-0 text-[hsl(18_70%_48%)]" strokeWidth={3} />
              <span>
                <strong className="font-semibold text-foreground">
                  O que realmente precisa ser preparado antes do bebê nascer
                </strong>{" "}
                (e quase ninguém ensina).
              </span>
            </li>

            <li className="flex items-start gap-3">
              <Check className="mt-1 h-5 w-5 shrink-0 text-[hsl(18_70%_48%)]" strokeWidth={3} />
              <span>
                Como tomar decisões com mais confiança, lidar com os palpites e{" "}
                <strong className="font-semibold text-foreground">
                  preservar seus relacionamentos
                </strong>{" "}
                nesse período de tantas mudanças.
              </span>
            </li>

            <li className="flex items-start gap-3">
              <Check className="mt-1 h-5 w-5 shrink-0 text-[hsl(18_70%_48%)]" strokeWidth={3} />
              <span>
                Como ter a tranquilidade de saber que{" "}
                <strong className="font-semibold text-foreground">
                  você está fazendo o melhor para o seu bebê
                </strong>
                , mesmo em meio a tantas opiniões e informações conflitantes.
              </span>
            </li>

            <li className="flex items-start gap-3">
              <Check className="mt-1 h-5 w-5 shrink-0 text-[hsl(18_70%_48%)]" strokeWidth={3} />
              <span>
                Quais são os principais pontos de atenção sobre{" "}
                <strong className="font-semibold text-foreground">
                  saúde mental, amamentação e sono
                </strong>
                , reunidos em um único lugar para que você não precise enfrentar
                essa fase sozinha.
              </span>
            </li>
          </ul>

          <div className="mt-8">
            <CTAButton>Quero Viver Meus 100 Dias Sem Caos</CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
};