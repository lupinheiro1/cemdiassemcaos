import { Check, Minus } from "lucide-react";

const comparisons = [
  {
    solution: "Google / Redes",
    reality: "Informal, confuso, disperso",
    ours: "Organizado, direto ao ponto",
  },
  {
    solution: "Grupos / WhatsApp",
    reality: "Palpites e opiniões",
    ours: "Orientação clara e segura",
  },
  {
    solution: "Cursos longos",
    reality: "Teóricos, cansativos",
    ours: "Prático e aplicável no caos",
  },
  {
    solution: "Apoio de profissionais",
    reality: "Caro e nem sempre acessível",
    ours: "Acessível e imediato",
  },
];

export const ComparisonSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Por que esse é o melhor caminho?
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-sage">
                  <th className="text-left py-4 px-4 font-serif text-lg">Solução</th>
                  <th className="text-left py-4 px-4 font-serif text-lg">Como é na real</th>
                  <th className="text-left py-4 px-4 font-serif text-lg text-primary">
                    100 Dias Sem Caos
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-border hover:bg-accent/30 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium">{row.solution}</td>
                    <td className="py-4 px-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Minus className="w-4 h-4 text-muted-foreground" />
                        {row.reality}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-secondary-foreground">
                        <Check className="w-4 h-4 text-sage" />
                        {row.ours}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
