/**
 * @file ReinforceSection.tsx
 * @modified 2026-08-17
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Reforma da página de vendas (protótipo aprovado em design/): o "quem prepara a
 *         mãe" vivia no Hero, competindo pela primeira impressão com a promessa do app.
 *         Decisão da Luiza (ver design/100-dias-sem-caos-copy-pagina-vendas_4.md, seção
 *         10.5): esse reforço emocional funciona melhor depois que a leitora já viu o que
 *         está levando e quanto custa, não antes.
 * @objective Bloco curto de citação em destaque, entre OfferSection e ObjectionsSection.
 * @solution Nova seção, sugestão de implementação do próprio .md: mesmo estilo do banner
 *           de citação já usado em AuthorSection.tsx (bg-primary sólido), mas na cor de
 *           destaque (--highlight) a pedido da Luiza — o azul sólido não funcionou aqui.
 */
export const ReinforceSection = () => {
  return (
    <section className="py-14 bg-[hsl(18_70%_48%)] text-white text-center">
      <div className="container px-4">
        <div className="max-w-2xl mx-auto">
          <blockquote className="font-sans text-xl md:text-2xl italic font-medium mb-4">
            "Preparar o quarto do bebê é só parte da história. Todo mundo ensina a preparar
            o bebê. Mas quem ensina a preparar a mãe?"
          </blockquote>
          <p className="max-w-lg mx-auto text-sm opacity-85">
            Você não está investindo só num enxoval organizado ou numa mala pronta. Está
            investindo em chegar no pós-parto com mais segurança pra você também — porque
            você merece se preparar tanto quanto o seu bebê.
          </p>
        </div>
      </div>
    </section>
  );
};
