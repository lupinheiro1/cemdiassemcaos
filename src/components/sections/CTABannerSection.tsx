/**
 * @file CTABannerSection.tsx
 * @modified 2026-08-17
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Reforma da página de vendas (protótipo aprovado em design/): todos os botões de
 *         CTA da página passam a terminar com uma seta, decisão já aplicada de forma
 *         consistente em todo o protótipo (ver changelog v14, item 71, em
 *         design/100-dias-sem-caos-copy-pagina-vendas_4.md).
 * @objective Seção sem mudança de conteúdo — só o texto do botão.
 * @solution Adicionada a seta " →" ao final do texto do CTAButton existente.
 */
import { CTAButton } from "@/components/ui/cta-button";

export const CTABannerSection = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-peach-light via-rose-light to-lavender-light">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <CTAButton className="text-lg md:text-xl">
            Quero Viver Meus 100 Dias Sem Caos{" →"}
          </CTAButton>
        </div>
      </div>
    </section>
  );
};
