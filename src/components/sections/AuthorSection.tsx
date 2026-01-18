import { Heart, Star, Users } from "lucide-react";

export const AuthorSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-peach-light to-background">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Quem criou esse conteúdo com muito amor
            <span className="block text-lg font-normal text-muted-foreground mt-2">
              (e algumas olheiras)
            </span>
          </h2>

          <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              {/* Image placeholder */}
              <div className="md:w-1/3 bg-gradient-to-br from-rose-light to-peach-light flex items-center justify-center p-8">
                <div className="w-48 h-48 bg-card rounded-full flex items-center justify-center shadow-lg">
                  <span className="font-serif text-6xl text-primary">LP</span>
                </div>
              </div>

              {/* Content */}
              <div className="md:w-2/3 p-8">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                  Luiza Pinheiro
                </h3>
                <p className="text-muted-foreground mb-4">
                  Ex-gerente de operações e atual especialista em{" "}
                  <strong className="text-foreground">maternidade possível</strong>.
                </p>
                <p className="text-muted-foreground mb-4">
                  Mãe de dois, esposa de médico pediatra (que revisa todo o conteúdo),
                  e fundadora do <strong className="text-foreground">Método Mãe Jardineira</strong> e criadora do projeto{" "}
                  <em>100 Dias Sem Caos</em>, ela trocou planilhas por paninhos de
                  ombro e descobriu que o amor materno não precisa ser acompanhado de
                  caos.
                </p>
                <p className="text-muted-foreground mb-6">
                  Por isso, criou um guia que ela mesma gostaria de ter tido. Seu
                  diferencial é unir conhecimento real da vida materna com linguagem
                  acessível, apoio emocional e foco na prática.
                </p>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-sage-light rounded-full">
                    <Star className="w-4 h-4 text-sage" />
                    <span className="text-sm font-medium">4 anos de dedicação</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-rose-light rounded-full">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Dezenas de famílias impactadas</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-peach-light rounded-full">
                    <Heart className="w-4 h-4 text-accent-foreground" />
                    <span className="text-sm font-medium">Mãe de 2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quote banner */}
          <div className="bg-primary rounded-2xl p-8 mt-8 text-center">
            <p className="text-lg md:text-xl text-primary-foreground italic">
              "Porque toda mulher merece viver a melhor maternidade possível — a sua."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
