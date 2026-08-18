/**
 * @file HeroSection.tsx
 * @modified 2026-08-17
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Reforma da página de vendas (protótipo aprovado em design/, 15 rodadas de
 *         ajuste): a oferta virou um app, não mais um e-book/guia em PDF. O hero antigo
 *         prometia "um guia" e trazia os 6 itens de "você vai descobrir" competindo por
 *         espaço com a promessa do produto na mesma dobra.
 * @objective Hero focado numa coisa só: validar a dor (a lista de 50 tarefas) e prometer
 *            a solução (um app com passo a passo), com uma screenshot real do app pra dar
 *            prova visual imediata. Os 6 itens de "você vai descobrir" saíram pra uma
 *            seção própria (ver DiscoverSection.tsx), sem concorrer com essa promessa.
 * @solution Estrutura em 2 colunas (texto + celular) a partir do protótipo HTML aprovado.
 *           Screenshot real (src/assets/app-home.webp) dentro de PhoneMockup, no lugar da
 *           recriação de UI em CSS que o protótipo usava (não temos mais só uma direção
 *           visual — temos a tela real do app cemdias-app). Testado ao vivo pela Luiza:
 *           logo real em h-7 ficou ilegível (o SVG é um selo quase quadrado, não um
 *           ícone+texto lado a lado como no protótipo) — corrigido pra h-12/h-14, ainda
 *           pequeno demais numa segunda rodada de teste, aumentado de novo pra h-16/h-20.
 *           Padding
 *           lateral reforçado e max-width do grid reduzido de 6xl pra 5xl (conteúdo colado
 *           na borda em telas largas). H1 padronizado pra text-4xl md:text-5xl — mesma
 *           escala usada nos h2 do resto da página, um degrau acima, pra manter hierarquia
 *           clara (estava quase do mesmo tamanho dos h2 seguintes).
 */
import { Heart } from "lucide-react";
import logoMaternologia from "@/assets/logo-maternologia.svg";
import appHome from "@/assets/app-home.webp";
import { CTAButton } from "@/components/ui/cta-button";
import { PhoneMockup } from "@/components/ui/phone-mockup";

export const HeroSection = () => {
  return (
    <section className="relative flex items-start justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-rose-light via-background to-peach-light" />

      <div className="hidden md:block absolute top-20 left-10 w-32 h-32 bg-sage-light rounded-full blur-3xl opacity-60" />
      <div className="hidden md:block absolute bottom-40 right-10 w-48 h-48 bg-lavender-light rounded-full blur-3xl opacity-50" />
      <div className="hidden md:block absolute top-1/2 left-1/3 w-24 h-24 bg-peach-light rounded-full blur-2xl opacity-40" />

      <div className="container relative z-10 px-6 sm:px-8 lg:px-12 pt-2 pb-10 md:pt-4 md:pb-14">
        <div className="flex items-center justify-center gap-2 mb-8">
          <img
            src={logoMaternologia}
            alt="Maternologia"
            width="120"
            height="48"
            decoding="async"
            className="h-16 md:h-20 w-auto"
          />
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center max-w-5xl mx-auto">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-sm mb-6">
              <Heart className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-medium text-muted-foreground">
                Passo a passo para a gravidez inteira, direto no seu celular
              </span>
            </div>

            <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-foreground leading-[1.15] mb-5 tracking-tight">
              Uma lista de 50 coisas pra resolver antes do bebê nascer.
              <br />
              Por onde você <span className="text-[hsl(18_70%_48%)]">começa?</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-7">
              <strong className="font-semibold text-foreground">O 100 Dias Sem Caos</strong>{" "}
              pega essa lista gigante e transforma num{" "}
              <strong className="font-semibold text-foreground">
                passo a passo, na ordem certa
              </strong>
              , pra você saber exatamente o que fazer em cada etapa sem se perder ou deduzir
              tudo sozinha. Tudo isso com poucos cliques.
            </p>

            <div className="flex flex-col items-center lg:items-start gap-2.5">
              <CTAButton>Quero Viver Meus 100 Dias Sem Caos{" →"}</CTAButton>
              <span className="text-sm text-muted-foreground">
                ✨ Acesso imediato, direto no seu celular
              </span>
            </div>
          </div>

          <div className="relative flex justify-center">
            <PhoneMockup src={appHome} alt="Tela inicial do app 100 Dias Sem Caos" />

            <div className="hidden lg:flex absolute top-[6%] -left-6 items-center gap-2 bg-card rounded-2xl px-3.5 py-2.5 shadow-lg text-sm font-semibold text-foreground">
              <span className="w-2 h-2 rounded-full bg-sage shrink-0" />
              Progresso sempre salvo
            </div>
            <div className="hidden lg:flex absolute bottom-[10%] -right-6 items-center gap-2 bg-card rounded-2xl px-3.5 py-2.5 shadow-lg text-sm font-semibold text-foreground">
              <span className="w-2 h-2 rounded-full bg-sage shrink-0" />
              Guia completo dentro do app
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
