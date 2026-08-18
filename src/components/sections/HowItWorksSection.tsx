/**
 * @file HowItWorksSection.tsx
 * @modified 2026-08-17
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Reforma da página de vendas (protótipo aprovado em design/): a oferta virou um
 *         app, não mais um "guia digital" em PDF — a seção antiga descrevia um produto
 *         que não existe mais.
 * @objective Mostrar como o app resolve a bagunça de listas soltas/grupos de WhatsApp num
 *            passo a passo, com prova visual real (screenshots do cemdias-app) em vez de
 *            só texto.
 * @solution Título e texto reescritos a partir de
 *           design/100-dias-sem-caos-copy-pagina-vendas_4.md (seção 4); mantido o padrão
 *           visual real (caixa sage-light dentro de seção de fundo neutro, não a seção
 *           inteira colorida — ver changelog v12, item 56, do mesmo arquivo). 3 telas do
 *           app real (src/assets/app-fases.webp, app-materiais.webp,
 *           app-guia-principal.webp) dentro de PhoneMockup, no lugar da recriação de UI em
 *           CSS que o protótipo usava — não são mais "captura ilustrativa", são reais.
 */
import appFases from "@/assets/app-fases.webp";
import appMateriais from "@/assets/app-materiais.webp";
import appGuiaPrincipal from "@/assets/app-guia-principal.webp";
import { PhoneMockup } from "@/components/ui/phone-mockup";

const screens = [
  {
    src: appFases,
    alt: "Tela de passo a passo do app 100 Dias Sem Caos, com as 5 fases da preparação",
    title: "1. Você sabe o que vem primeiro",
    description:
      "Sem deduzir sozinha o que é prioridade — o passo a passo já vem na ordem certa.",
  },
  {
    src: appMateriais,
    alt: "Tela de materiais do app, com Enxoval Simplificado, Lista Maternidade e Scripts de conversas",
    title: "2. Tudo num só lugar",
    description:
      "Enxoval, mala e conversas difíceis organizados — sem planilha esquecida.",
  },
  {
    src: appGuiaPrincipal,
    alt: "Tela do Guia Principal do app, com os capítulos por tema",
    title: "3. Consulta sempre que a dúvida bater",
    description: "Guia completo, no seu ritmo — sem sair caçando resposta em fórum.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center px-4 py-2 bg-card rounded-full shadow-sm text-sm font-medium text-muted-foreground mb-4">
            Como funciona
          </span>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground">
            Um app que resolve as pendências da gravidez inteira
          </h2>
        </div>

        <div className="max-w-2xl mx-auto text-center bg-sage-light rounded-2xl p-7 md:p-10 mb-14">
          <p className="text-base md:text-lg text-foreground font-light mb-3.5">
            Ele pega a bagunça de listas soltas, dúvidas de grupo de WhatsApp e informações
            contraditórias, e transforma isso num{" "}
            <strong className="font-semibold">passo a passo</strong>: o que fazer primeiro,
            o que vem depois, e o que você já resolveu.
          </p>
          <p className="text-base md:text-lg text-foreground font-light">
            Depois da compra, o acesso chega no seu e-mail, pronto pra usar — sem senha pra
            decorar. Funciona no seu celular, Android ou iPhone,{" "}
            <strong className="font-semibold">independente da semana de gravidez</strong> em
            que você está.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-9 items-start justify-items-center">
          {screens.map((screen) => (
            <div key={screen.title} className="text-center max-w-[260px]">
              <PhoneMockup src={screen.src} alt={screen.alt} size="sm" />
              <h3 className="font-sans text-lg md:text-xl font-bold text-foreground mt-5 mb-2">
                {screen.title}
              </h3>
              <p className="text-sm md:text-[15px] text-muted-foreground">
                {screen.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
