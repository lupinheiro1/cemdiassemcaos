import { AlertCircle, Heart, Clock, Shield } from "lucide-react";

const stats = [
  {
    icon: AlertCircle,
    stat: "1 em cada 4 mulheres desenvolve depressão pós-parto",
    description: "E, na maioria dos casos, isso vem acompanhado de falta de preparo e sobrecarga emocional.",
  },
  {
    icon: Heart,
    stat: "O número de divórcios aumenta no primeiro ano do bebê",
    description: "Porque, sem alinhamento e comunicação, a rotina vira um campo de tensão.",
  },
  {
    icon: Clock,
    stat: "Tempo é um dos recursos mais escassos no puerpério",
    description: "E sair procurando informação em vários lugares só aumenta a confusão.",
  },
  {
    icon: Shield,
    stat: "Ter apoio muda completamente essa experiência",
    description: "Mães com suporte emocional atravessam esse período com mais segurança e menos culpa.",
  },
];

export const StatsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-lavender-light">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Por que a estrutura importa?
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-rose-light rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="font-serif text-2xl font-bold text-primary mb-2">
                  {item.stat}
                </p>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
