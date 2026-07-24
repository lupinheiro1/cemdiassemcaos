/**
 * @file OfferSection.tsx
 * @modified 2026-07-24
 * @authors Marcelo Arana + Claude Opus 4.8
 * @reason Ajuste do preço da oferta do anúncio ativo.
 * @objective Preço "Hoje" passa de R$ 37 para R$ 47 (valor original R$ 127 mantido).
 * @solution Troca do único texto de preço na seção; o link do checkout (Hotmart)
 *           não muda — o valor real é definido no produto da Hotmart, não aqui.
 */
import { Book, FileSpreadsheet, FileText, Calendar, Gift, Shield, Zap, Headphones } from "lucide-react";
import { CTAButton } from "@/components/ui/cta-button";

const items = [
  {
    icon: Book,
    title: "Guia principal",
    text: "O eBook completo do 100 Dias Sem Caos, com orientações práticas e emocionais para viver o início da maternidade com mais leveza, segurança e direção.",
  },
  {
    icon: FileSpreadsheet,
    title: "Planilha de Enxoval Simplificado",
    text: "Para evitar excessos e focar no que realmente importa.",
  },
  {
    icon: FileText,
    title: "Guia de comunicação assertiva",
    text: "Scripts de conversa para tornar a comunicação nos 100 dias mais objetiva e mais leve",
  },
  {
    icon: FileText,
    title: "Lista Mala Maternidade",
    text: "Tudo o que você precisa levar, sem correria de última hora.",
  },
];

const guarantees = [
  { icon: Shield, text: "Garantia incondicional 7 dias" },
  { icon: Zap, text: "Acesso imediato 100% online" },
  { icon: Shield, text: "Hotmart Compra Segura" },
  { icon: Headphones, text: "Suporte direto com Luiza Pinheiro" },
];

export const OfferSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-rose-light to-background">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Ao adquirir o 100 Dias Sem Caos, você recebe:
          </h2>

          {/* Items */}
          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-10 mb-10">
            <div className="space-y-4 mb-8">
              {items.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-xl ${
                    index === 0 ? "bg-rose-light" : "bg-accent/50"
                  }`}
                >
                  <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-sm shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className={`font-semibold ${index === 0 ? "text-lg" : ""}`}>
                      {index !== 0 && <Gift className="w-4 h-4 inline-block mr-2 text-peach" />}
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 font-light">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="text-center">
              <p className="text-muted-foreground line-through text-lg mb-1">
                Valor original: R$ 127
              </p>
              <p className="font-serif text-4xl md:text-5xl font-bold text-primary mb-2">
                Hoje: R$ 47
              </p>
              <p className="text-sm text-muted-foreground mb-8 italic">
                Um valor simbólico para esse momento que muda tudo.
              </p>

              <CTAButton>Quero Viver Meus 100 Dias Sem Caos</CTAButton>
            </div>
          </div>

          {/* Guarantee */}
          <div className="bg-sage-light rounded-2xl p-8 text-center mb-8">
            <Shield className="w-16 h-16 text-sage mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
              Você pode adquirir sem medo
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Você tem 7 dias para testar. Se achar que o material não te ajuda de
              verdade, devolvemos seu dinheiro sem perguntas.
            </p>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {guarantees.map((item, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-4 text-center shadow-sm"
              >
                <item.icon className="w-8 h-8 text-sage mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
