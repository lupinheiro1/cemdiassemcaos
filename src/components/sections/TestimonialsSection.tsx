import depoimentoJaria from "@/assets/depoimento-jaria.webp";
import depoimentoSimara from "@/assets/depoimento-simara.webp";
import depoimentoTaynara from "@/assets/depoimento-taynara.webp";
import depoimentoIsabela from "@/assets/depoimento-isabela.webp";
import depoimentoIzis from "@/assets/depoimento-izis.webp";

const testimonials = [
  { image: depoimentoJaria, alt: "Depoimento da Jária" },
  { image: depoimentoSimara, alt: "Depoimento da Simara" },
  { image: depoimentoTaynara, alt: "Depoimento da Taynara" },
  { image: depoimentoIsabela, alt: "Depoimento da Isabela" },
  { image: depoimentoIzis, alt: "Depoimento da Izis" },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-peach-light">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
            O que outras mães estão dizendo
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Histórias reais de mães que transformaram sua maternidade
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.alt}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
