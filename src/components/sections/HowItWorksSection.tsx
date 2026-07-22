export const HowItWorksSection = () => {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
            Como funciona o guia?
          </h2>

          <div className="bg-sage-light rounded-2xl p-8 md:p-10">
            <p className="text-lg text-foreground font-light mb-5">
              O <strong>100 Dias Sem Caos</strong> é um guia digital que
              organiza, de forma simples e prática, o que você precisa saber
              para atravessar o puerpério com mais leveza e segurança.
            </p>

            <p className="text-lg text-foreground font-light mb-5">
              Ele reúne orientações emocionais e práticas para o dia a dia,
              ajudando você a tomar decisões com mais clareza, reduzir a
              sobrecarga e viver esse início com mais direção.
            </p>

            <p className="text-lg text-foreground font-light">
              Com base no{" "}
              <strong className="text-secondary-foreground">
                Método Mãe Jardineira
              </strong>
              , o guia ajuda você a construir uma rotina adaptada à sua
              realidade, fortalecer o vínculo com o bebê e se sentir mais
              segura ao longo desse processo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};