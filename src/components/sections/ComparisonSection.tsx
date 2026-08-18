/**
 * @file ComparisonSection.tsx
 * @modified 2026-08-17
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Reforma da página de vendas (protótipo aprovado em design/): tabela reescrita
 *         pra falar de app (não mais e-book), tirando "reta final da gravidez" e trocando
 *         por "qualquer momento da gravidez"; adicionada a linha "Planilhas e apps
 *         genéricos de gravidez", que não existia na tabela antiga.
 * @objective Tabela alinhada com a copy final (ver
 *            design/100-dias-sem-caos-copy-pagina-vendas_4.md, seção 12).
 * @solution Linhas/textos trocados pela versão da tabela do .md (mais completa que o
 *           resumo do protótipo HTML). font-serif → font-sans no cabeçalho. CTA com seta.
 */
import { Check, Minus } from "lucide-react";
import { CTAButton } from "@/components/ui/cta-button";

const comparisons = [
  {
    solution: "Google e redes sociais",
    reality: "Informações soltas, contraditórias e difíceis de filtrar",
    ours: "Um app com passo a passo organizado, pensado pra qualquer momento da gravidez e o pós-parto real",
  },
  {
    solution: "Grupos e WhatsApp",
    reality: "Palpites, opiniões e excesso de informação",
    ours: "Orientação clara, com seu progresso salvo — sem sobrecarga",
  },
  {
    solution: "Planilhas e apps genéricos de gravidez",
    reality: "Genéricos, sem ligação com o resto da sua preparação",
    ours: "Enxoval, mala, scripts e passo a passo, tudo no mesmo lugar, personalizado pela sua data prevista",
  },
  {
    solution: "Cursos muito longos",
    reality: "Teóricos, cansativos e difíceis de aplicar",
    ours: "Prático, leve e possível de consultar no dia a dia, direto no celular",
  },
  {
    solution: "Apoio profissional isolado",
    reality: "Importante, mas nem sempre acessível o tempo todo",
    ours: "Um apoio acessível para consultar quando você precisar",
  },
];

export const ComparisonSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Por que esse é o melhor caminho?
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-sage">
                  <th className="text-left py-4 px-4 font-sans text-lg">Solução</th>
                  <th className="text-left py-4 px-4 font-sans text-lg">Como costuma ser</th>
                  <th className="text-left py-4 px-4 font-sans text-lg text-primary">
                    100 Dias Sem Caos
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr
                    key={row.solution}
                    className="border-b border-border hover:bg-accent/30 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium">{row.solution}</td>
                    <td className="py-4 px-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Minus className="w-4 h-4 text-muted-foreground shrink-0" />
                        {row.reality}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-secondary-foreground">
                        <Check className="w-4 h-4 text-sage shrink-0" />
                        {row.ours}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-10">
            <CTAButton>Quero Viver Meus 100 Dias Sem Caos{" →"}</CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
};
