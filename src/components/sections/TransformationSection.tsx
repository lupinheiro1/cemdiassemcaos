/**
 * @file TransformationSection.tsx
 * @modified 2026-08-20
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Reforma da página de vendas (protótipo aprovado em design/): revisão de
 *         tipografia da página inteira — tirar a serifa (Playfair Display) dos títulos.
 *         Depois: essa é a seção logo acima da Oferta (a próxima no Index.tsx) — os 4 CTAs
 *         que ficam antes da Oferta (Hero, DiscoverSection, HighlightSection,
 *         CTABannerSection) passaram a rolar a página até aqui em vez de abrir o checkout
 *         direto, já que dados de GA4/Meta Ads indicaram gente abrindo o checkout sem ver a
 *         Oferta/preço no site.
 * @objective Conteúdo desta seção sem alterações (ver
 *            design/100-dias-sem-caos-copy-pagina-vendas_4.md, seção 9); só a fonte muda.
 *            Depois: dar um alvo de âncora estável pra esses 4 CTAs apontarem.
 * @solution font-serif → font-sans no h2 e nos h3 de cada coluna. Depois: adicionado
 *           `id="antes-da-oferta"` e `scroll-mt-6` na section (folga no topo ao rolar até
 *           aqui via âncora, pra o título não colar na borda da tela).
 */
import { X, Check } from "lucide-react";

const transformations = [
  {
    before: "Sensação constante de estar perdida",
    after: "Clareza sobre o que fazer em cada fase",
  },
  {
    before: "Dúvidas a cada nova fase",
    after: "Decisões mais seguras e leves",
  },
  {
    before: "Exaustão física e emocional acumulando",
    after: "Mais organização no dia a dia",
  },
  {
    before: "Palpites de todos os lados",
    after: "Autonomia para seguir suas próprias escolhas",
  },
  {
    before: "Conflitos por falta de alinhamento",
    after: "Comunicação mais tranquila nos relacionamentos",
  },
  {
    before: "Busca constante por respostas sem saber em quem confiar",
    after: "Confiança de que você está fazendo o melhor possível",
  },
];

export const TransformationSection = () => {
  return (
    <section id="antes-da-oferta" className="py-16 md:py-24 bg-background scroll-mt-6">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            A transformação que você merece
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="bg-muted-box rounded-2xl p-6 md:p-8">
              <h3 className="font-sans text-xl font-semibold text-foreground/70 mb-6 text-center">
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
              <h3 className="font-sans text-xl font-semibold text-secondary-foreground mb-6 text-center">
                Com o 100 Dias Sem Caos
              </h3>
              <div className="space-y-3">
                {transformations.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-card/70 rounded-lg"
                  >
                    <Check className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                    <span className="text-foreground font-light">{item.after}</span>
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
