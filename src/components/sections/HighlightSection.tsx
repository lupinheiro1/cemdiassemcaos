/**
 * @file HighlightSection.tsx
 * @modified 2026-08-17
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Reforma da página de vendas (protótipo aprovado em design/): erro de tempo
 *         verbal no card de destaque — "cuida... desse bebê que acabou de nascer" fala
 *         como se o bebê já tivesse nascido, mas a página inteira se dirige a gestantes
 *         se preparando antes do parto (ver design/100-dias-sem-caos-copy-pagina-vendas_4.md,
 *         v15, item 72).
 * @objective Corrigir o tempo verbal; atualizar a nota final pra falar do app (passo a
 *            passo, checklist, progresso salvo) em vez de "separamos com carinho"; tirar a
 *            serifa do título e das frases de destaque.
 * @solution "cuida... que acabou de nascer" → "vai cuidar... desde o primeiro segundo de
 *           vida". Nota final reescrita conforme a copy aprovada. font-serif → font-sans.
 *           Testado ao vivo pela Luiza: o card de destaque ficou "enorme" — o Inter em
 *           negrito, no mesmo tamanho em px que a Playfair Display tinha, renderiza
 *           visivelmente maior (x-height mais alto); reduzido um degrau (text-2xl→text-xl
 *           etc). Parágrafos de corpo (intro e a frase antes da nota) também estavam acima
 *           do padrão do resto do site (text-lg/xl em vez do text-base sem seções como
 *           ObjectionsSection/TargetAudienceSection usam) — trazidos pro mesmo tamanho.
 */
import { Heart } from "lucide-react";
import { CTAButton } from "@/components/ui/cta-button";

export const HighlightSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-rose-light via-peach-light to-lavender-light">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-6">
            Pensado de mãe para mãe
          </h2>
          <p className="text-base text-muted-foreground mb-6">
            O maior erro da maioria dos cursos de maternidade é focar apenas no
            bebê que já está nos seus braços. Porém, eles esquecem de uma verdade
            simples.
          </p>

          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 mb-8">
            <Heart className="w-12 h-12 text-primary mx-auto mb-6 animate-pulse-soft" />
            <p className="font-sans text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-snug">
              Existe alguém que vai cuidar{" "}
              <span className="text-primary">24 horas por dia</span> desse bebê,
              desde o primeiro segundo de vida.
            </p>
            <p className="font-sans text-xl md:text-2xl lg:text-3xl font-bold text-primary mt-2">
              E esse alguém é você, mãe.
            </p>
          </div>

          <p className="text-base text-muted-foreground mb-10">
            E para você conseguir curtir 100% o seu filho, os cuidados precisam ir
            muito além dele.
          </p>

          <div className="bg-card rounded-xl p-6 shadow-md max-w-xl mx-auto mb-10">
            <p className="text-sm text-muted-foreground italic">
              Por isso, organizamos <strong className="font-semibold">num só app</strong> —
              com passo a passo, checklist e{" "}
              <strong className="font-semibold">progresso salvo</strong> — o que sempre é
              esquecido nesse início, mas que faz toda a diferença.
            </p>
          </div>

          <CTAButton>Quero Viver Meus 100 Dias Sem Caos{" →"}</CTAButton>
        </div>
      </div>
    </section>
  );
};
