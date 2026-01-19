import { X, Check } from "lucide-react";

const transformations = [
  {
    before: "Sentimento constante de estar perdida",
    after: "Sentimento de viver o dia a dia com direção e sentido",
  },
  {
    before: "Dúvidas a cada novo desafio",
    after: "Respostas diretas, sem enrolação",
  },
  {
    before: "Exaustão física e emocional sem trégua",
    after: "Orientações para reduzir a sobrecarga",
  },
  {
    before: "Palpites por todos os lados",
    after: "Autonomia para seguir as próprias escolhas",
  },
  {
    before: "Conflitos com o parceiro por falta de alinhamento",
    after: "Comunicação mais leve e estruturada",
  },
  {
    before: 'Culpa por não estar "dando conta"',
    after: "Confiança de estar fazendo o melhor",
  },
  {
    before: "Busca aleatória no Google e redes",
    after: "Conteúdo organizado, pronto para consultar",
  },
  {
    before: "Sensação de estar sozinha na maternidade",
    after: "Acolhimento real, mesmo sem grupo ou curso",
  },
  {
    before: "Sensação de culpa constante",
    after: "Entende que o erro faz parte do processo",
  },
];

export const TransformationSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            A transformação que você merece
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="bg-muted-box rounded-2xl p-6 md:p-8">
              <h3 className="font-serif text-xl font-semibold text-foreground/70 mb-6 text-center">
                Sem o 100 Dias Sem Caos
              </h3>
              <div className="space-y-3">
                {transformations.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-card rounded-lg"
                  >
                    <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item.before}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* After */}
            <div className="bg-sage-light rounded-2xl p-6 md:p-8">
              <h3 className="font-serif text-xl font-semibold text-secondary-foreground mb-6 text-center">
                Com o 100 Dias Sem Caos
              </h3>
              <div className="space-y-3">
                {transformations.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-card/70 rounded-lg"
                  >
                    <Check className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                    <span className="text-foreground">{item.after}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
