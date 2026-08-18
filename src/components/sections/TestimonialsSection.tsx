/**
 * @file TestimonialsSection.tsx
 * @description Secao de depoimentos com imagens em carrossel horizontal.
 *
 * @changed_by GitHub Copilot (GPT-5.3-Codex)
 * @change_date 2026-07-13T00:00:00
 * @reason Reduzir concorrencia de rede no first paint para beneficiar LCP.
 * @changes
 *   - Marca imagens de depoimentos como lazy para priorizar recursos acima da dobra.
 *
 * @modified 2026-08-18
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Reforma da página de vendas (protótipo aprovado em design/): revisão de
 *         tipografia da página inteira — tirar a serifa (Playfair Display) dos títulos.
 *         Depois: pedido da Luiza de reordenar os depoimentos, o da Izis (antes o
 *         último) pra 2ª posição.
 * @objective Conteúdo sem alterações de texto (ver
 *            design/100-dias-sem-caos-copy-pagina-vendas_4.md, seção 8); só a fonte muda.
 *            Depois: nova ordem dos cards do carrossel.
 * @solution font-serif → font-sans no h2. Depois: array `testimonials` reordenado —
 *           Jária, Izis, Simara, Taynara, Isabela.
 */
import depoimentoJaria from "@/assets/depoimento-jaria.webp";
import depoimentoSimara from "@/assets/depoimento-simara.webp";
import depoimentoTaynara from "@/assets/depoimento-taynara.webp";
import depoimentoIsabela from "@/assets/depoimento-isabela.webp";
import depoimentoIzis from "@/assets/depoimento-izis.webp";

const testimonials = [
  { image: depoimentoJaria, alt: "Depoimento da Jária" },
  { image: depoimentoIzis, alt: "Depoimento da Izis" },
  { image: depoimentoSimara, alt: "Depoimento da Simara" },
  { image: depoimentoTaynara, alt: "Depoimento da Taynara" },
  { image: depoimentoIsabela, alt: "Depoimento da Isabela" },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-peach-light">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
            O que outras mães estão dizendo
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Histórias reais de mães que transformaram sua maternidade
          </p>
        </div>
      </div>

      {/* Horizontal scrolling container */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 px-4 md:px-8 w-max">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-72 md:w-80 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all"
            >
              <img
                src={testimonial.image}
                alt={testimonial.alt}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center mt-4">
        <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-primary/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};
