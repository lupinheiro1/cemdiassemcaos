import { CTAButton } from "@/components/ui/cta-button";
import { Heart, CheckCircle2 } from "lucide-react";
import logoMaternologia from "@/assets/logo-maternologia.svg";

const benefits = [
  "Os 3 fundamentos para uma maternidade mais leve, mesmo em meio ao puerpério",
  "Dicas reais (e possíveis!) pra viver o puerpério com mais leveza",
  "Conselhos que você gostaria de ouvir da sua melhor amiga, não do Google",
  "Reflexões sinceras pra aliviar a culpa e reforçar o seu instinto",
  "Ferramentas práticas para evitar o caos sem virar uma mãe robô",
  "Ah, e zero julgamentos. Só apoio, carinho e direção!",
];

export const HeroSection = () => {
  return (
    <section className="relative flex items-start justify-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-light via-background to-peach-light" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-sage-light rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-40 right-10 w-48 h-48 bg-lavender-light rounded-full blur-3xl opacity-50" />
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-peach-light rounded-full blur-2xl opacity-40" />

      <div className="container relative z-10 px-4 pt-2 pb-6 md:pt-4 md:pb-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-1 animate-fade-in">
            <img 
              src={logoMaternologia} 
              alt="Maternologia - 100 Dias Sem Caos" 
              className="h-24 md:h-36 w-auto mx-auto"
            />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-sm mb-8 animate-fade-in">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Guia Essencial para Mães
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            100 dias sem caos:{" "}
            <span className="text-primary">o guia essencial</span> para mães que
            querem viver o início da maternidade com{" "}
            <span className="relative inline-block">
              leveza
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C50 2 150 2 198 8" stroke="hsl(var(--peach))" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
            , segurança e direção
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Descubra como atravessar os primeiros 100 dias com o bebê sem culpa,
            sem desespero e sem se perder de si mesma — mesmo sendo mãe de
            primeira viagem.
          </p>

          {/* Benefits */}
          <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8 mb-10 text-left animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-center mb-6">
              O que tem nesse e-book que parece abraço de mãe?
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <CTAButton>Quero Viver Meus 100 Dias Sem Caos</CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
};
