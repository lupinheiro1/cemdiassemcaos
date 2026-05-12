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
      "Sim — principalmente para elas. O 100 Dias Sem Caos foi pensado para ajudar mães que estão entrando nesse universo agora e querem viver esse começo com mais leveza, direção e segurança.",
  },
  {
    question: "Vou precisar de muito tempo para ler?",
    answer:
      "Não. O guia foi pensado para ser leve, direto e fácil de consultar, mesmo na rotina corrida do puerpério. Você pode ler no seu tempo e voltar sempre que precisar.",
  },
  {
    question: "O conteúdo é prático? Vou conseguir aplicar mesmo?",
    answer:
      "Sim. Além das reflexões emocionais, o material traz orientações práticas e possíveis de aplicar na vida real, sem perfeccionismo e sem complicação.",
  },
  {
    question: "Ajuda também no emocional?",
    answer:
      "Muito. O puerpério não é só uma fase prática — ele também mexe profundamente com a identidade, emoções e relações da mãe. Por isso, o guia olha para você como parte central dessa experiência.",
  },
  {
    question: "E se eu comprar e sentir que não era o que eu precisava?",
    answer:
      "Você tem 7 dias de garantia para acessar o material com calma. Se sentir que ele não faz sentido para você, devolvemos 100% do valor.",
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
