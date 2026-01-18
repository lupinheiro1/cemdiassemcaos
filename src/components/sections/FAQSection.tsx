import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Esse guia serve para mães de primeira viagem?",
    answer:
      "Ele foi pensado principalmente para você, mãe de primeira viagem! Coloquei tudo o que eu gostaria de ter ouvido no meu primeiro puerpério, e que teria facilitado e MUITO a minha vida com um recém-nascido no colo. Mas ele também serve para as mamães que já são marinheiras antigas, mas que precisam ressignificar começos traumáticos. Aqui você encontra zero julgamentos, porque disso já recebemos demais sem nem precisar pedir.",
  },
  {
    question: "Vou precisar de muito tempo para ler?",
    answer:
      'A resposta curta é não. Apesar de ter bastante informação, escrevi para ser uma leitura gostosa e fluida. Mas ele vai te provocar algumas reflexões, e a prática pede um pouco de tempo. Se sua vida já é corrida agora, imagina com um bebê recém-nascido? A ideia de esperar "ter tempo" é ilusória. O que o livro oferece não é mais uma tarefa, é uma ferramenta pra diminuir o peso das tarefas que já existem e, acima de tudo, criar o melhor início possível para a melhor fase da sua vida!',
  },
  {
    question: "O conteúdo é prático? Vou conseguir aplicar mesmo?",
    answer:
      "O 100 dias sem caos tem tanto uma parte mais teórica (focada em ser um abraço em você), e uma parte prática, com o objetivo de realmente desenhar o que você precisa antecipar para esses meses iniciais com o seu bebê.",
  },
  {
    question: "Ajuda também no emocional?",
    answer:
      "Principalmente! O nosso emocional vira uma montanha-russa nos primeiros meses com o bebê (se já não virou durante a gravidez). Eu negligenciei isso no meu primeiro puerpério, e agora, jamais. Enquanto muitos conteúdos de maternidade focam nos aspectos materiais, aqui você vai focar no começo de tudo: em você.",
  },
];

export const FAQSection = () => {
  return (
    <section className="py-16 md:py-24 bg-sage-light">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Perguntas Frequentes
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl px-6 shadow-sm border-none"
              >
                <AccordionTrigger className="text-left font-serif text-lg hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Support */}
          <div className="bg-card rounded-xl p-6 mt-8 text-center shadow-sm">
            <p className="text-muted-foreground">
              Você pode tirar suas dúvidas entrando em contato conosco via e-mail.
              <br />
              Nosso prazo de retorno é de <strong>48 horas úteis</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
