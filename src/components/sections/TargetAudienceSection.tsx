/**
 * @file TargetAudienceSection.tsx
 * @modified 2026-08-17
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Reforma da página de vendas (protótipo aprovado em design/): o item "Busca um
 *         plano prático para não se sentir sobrecarregada" era vago e não refletia o que
 *         o app resolve de fato — organizar enxoval, mala e rede de apoio num só lugar.
 * @objective Alinhar o 5º item à proposta real do app; tipografia sem serifa (título e
 *            frase de fechamento), parte da revisão de tipografia da página inteira.
 * @solution Texto do 5º item trocado (ver design/100-dias-sem-caos-copy-pagina-vendas_4.md,
 *           seção 2); ícone trocado de Calendar pra Briefcase, condizente com "organizar
 *           tudo num só lugar". font-serif → font-sans no h2 e na frase de fechamento.
 */
import {
  Sparkles,
  Target,
  Users,
  Shield,
  Briefcase,
  MessageCircle,
} from "lucide-react";

const targetAudience = [
  {
    icon: Users,
    text: "É mãe de primeira viagem ou está esperando seu primeiro bebê",
  },
  {
    icon: Sparkles,
    text: "Sente que está entrando em um mundo totalmente novo e quer se preparar",
  },
  {
    icon: Shield,
    text: "Tem medo do puerpério, da exaustão ou de perder sua identidade",
  },
  {
    icon: Target,
    text: "Quer evitar o excesso de palpites e viver a maternidade com mais autonomia",
  },
  {
    icon: Briefcase,
    text: "Prefere ter um só lugar pra organizar tudo — enxoval, mala, rede de apoio — em vez de anotações soltas",
  },
  {
    icon: MessageCircle,
    text: "Quer preservar seus relacionamentos com a arte da comunicação",
  },
];

export const TargetAudienceSection = () => {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-3">
              Você vai se identificar se...
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {targetAudience.map((item) => (
              <div
                key={item.text}
                className="flex items-start gap-4 p-5 bg-card rounded-xl shadow-sm"
              >
                <div className="w-10 h-10 bg-peach-light rounded-full flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-accent-foreground" />
                </div>

                <p className="text-foreground font-light">{item.text}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xl font-sans font-semibold text-primary">
            Esse material pode fazer a diferença para você.
          </p>
        </div>
      </div>
    </section>
  );
};
