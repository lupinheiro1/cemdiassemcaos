/**
 * @file DiscoverSection.tsx
 * @modified 2026-08-20
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Reforma da página de vendas (protótipo aprovado em design/): os 6 itens de
 *         "você vai descobrir" viviam dentro do Hero, competindo por espaço com a
 *         promessa do app na mesma dobra. Depois: GA4/Meta Ads mostraram gente abrindo o
 *         checkout da Hotmart direto por esse CTA, sem ver a Oferta/preço no site.
 * @objective Segunda dobra dedicada só a esses itens (agora 5, um foi cortado por
 *            redundância com o Hero — ver design/100-dias-sem-caos-copy-pagina-vendas_4.md,
 *            item 65), sem disputar atenção com o resto do Hero.
 * @solution Nova seção, extraída do HeroSection.tsx real (mesma técnica visual: lista
 *           corrida com Check grosso na cor de destaque, "leia com atenção..." em
 *           marca-texto inline). Sem componente HowItWorks/Benefits equivalente no site
 *           original — é conteúdo novo de posição, não novo visualmente. Testado ao vivo
 *           pela Luiza: sem padding-top nenhum (só pb-*, como no protótipo), a seção
 *           colava direto no Hero sem respiro — adicionado pt-12 md:pt-16. Título também
 *           padronizado pra text-3xl md:text-4xl, igual ao resto dos h2 da página (estava
 *           num tamanho um pouco menor, só nesta seção). Depois: CTAButton passa a apontar
 *           pra "#antes-da-oferta" (ver TransformationSection.tsx) em vez de abrir o
 *           checkout direto.
 */
import { Check } from "lucide-react";
import { CTAButton } from "@/components/ui/cta-button";

const discoveries = [
  <>
    Como saber, entre as mil tarefas possíveis,{" "}
    <strong className="font-semibold text-foreground">quais realmente importam agora</strong> —
    e a ordem certa pra resolver cada uma.
  </>,
  <>
    Um passo a passo que te acompanha por toda a gravidez até o parto — para que os{" "}
    <strong className="font-semibold text-foreground">100 dias antes e depois dele</strong>{" "}
    sejam mais leves.
  </>,
  <>
    Como organizar enxoval, mala da maternidade e rede de apoio{" "}
    <strong className="font-semibold text-foreground">num só lugar</strong>, sem juntar
    informação espalhada nem recomeçar planilhas do zero.
  </>,
  <>
    Os principais pontos de atenção sobre{" "}
    <strong className="font-semibold text-foreground">
      saúde mental, amamentação e sono do bebê
    </strong>
    , reunidos num guia que você consulta sempre que precisar, direto no app.
  </>,
  <>
    Como ter a tranquilidade de saber que você está fazendo o melhor para o seu bebê, mesmo
    em meio a tantas opiniões e informações conflitantes.
  </>,
];

export const DiscoverSection = () => {
  return (
    <section className="pt-12 pb-16 md:pt-16 md:pb-24 bg-background">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-5">
            A partir de agora você não ficará mais perdida ao se preparar para a sua
            maternidade.
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
            Se você está grávida e quer se preparar para o puerpério{" "}
            <strong className="font-semibold text-foreground">
              sabendo exatamente o que fazer, na ordem em que fazer
            </strong>{" "}
            — em vez de descobrir tudo na correria —{" "}
            <mark className="bg-[hsl(18_70%_48%)] text-white font-bold px-1.5 box-decoration-clone">
              leia com atenção o que você vai encontrar:
            </mark>
          </p>

          <div className="flex flex-col gap-5 mt-6">
            {discoveries.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-base md:text-lg text-muted-foreground leading-relaxed"
              >
                <Check
                  className="mt-1 h-5 w-5 shrink-0 text-[hsl(18_70%_48%)]"
                  strokeWidth={3}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center lg:justify-start">
            <CTAButton href="#antes-da-oferta" trackingLabel="descubra">Quero Viver Meus 100 Dias Sem Caos{" →"}</CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
};
