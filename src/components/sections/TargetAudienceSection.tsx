import {
    Sparkles,
    Target,
    Users,
    Shield,
    Calendar,
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
      icon: Calendar,
      text: "Busca um plano prático para não se sentir sobrecarregada",
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
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
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
  
            <p className="text-center text-xl font-serif font-semibold text-primary">
              Esse material pode fazer a diferença para você.
            </p>
          </div>
        </div>
      </section>
    );
  };