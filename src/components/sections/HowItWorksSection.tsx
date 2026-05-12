import { Sparkles, Target, Users, Shield, Calendar, MessageCircle } from "lucide-react";

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
    icon: Calendar,
    text: "Busca um plano prático para não se sentir sobrecarregada",
  },
  {
    icon: MessageCircle,
    text: "Quer preservar seus relacionamentos com a arte da comunicação",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          {/* How it works */}
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Como funciona o guia?
            </h2>
            <div className="bg-sage-light rounded-2xl p-8 md:p-10">
              <p className="text-lg text-foreground font-light mb-4">
                O "100 Dias Sem Caos" é um guia digital que organiza, de forma simples e prática, o que você precisa saber para atravessar o puerpério com mais leveza e segurança.
                <br /><br />
                Ele reúne orientações emocionais e práticas para o dia a dia, ajudando você a tomar decisões com mais clareza, reduzir a sobrecarga e viver esse início com mais direção.
              </p>
              <p className="text-lg text-foreground font-light">
                A base do <strong className="text-secondary-foreground">Método Mãe Jardineira</strong>, o guia te ajuda a construir uma rotina adaptada para a sua realidade, fortalecendo o vínculo com o bebê enquanto te ajuda a se sentir mais segura ao longo desse processo.
              </p>
            </div>
          </div>

          {/* Target audience */}
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
              Se você:
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {targetAudience.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-5 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-peach-light rounded-full flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <p className="text-foreground font-light">{item.text}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xl font-serif font-semibold text-primary">
            Esse material pode fazer a diferença para você.
          </p>
        </div>
      </div>
    </section>
  );
};
