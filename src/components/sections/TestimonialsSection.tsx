import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marina S.",
    text: "Esse guia foi meu porto seguro no puerpério. Me senti acolhida e menos perdida. Vale cada centavo!",
    stars: 5,
  },
  {
    name: "Carla R.",
    text: "Eu li durante a gravidez e foi a melhor decisão. Quando minha bebê nasceu, eu sabia exatamente o que fazer.",
    stars: 5,
  },
  {
    name: "Patricia M.",
    text: "O conteúdo sobre comunicação com o parceiro salvou meu casamento. Sério! Deveriam ensinar isso na maternidade.",
    stars: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-peach-light">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
            O que outras mães estão dizendo
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Histórias reais de mães que transformaram sua maternidade
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <Quote className="w-8 h-8 text-sage mb-4" />
                <p className="text-foreground mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-peach text-peach" />
                  ))}
                </div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
