/**
 * @file OfferSection.tsx
 * @modified 2026-08-17
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Reforma da página de vendas (protótipo aprovado em design/): a oferta virou o
 *         app completo, não mais um e-book + planilhas avulsas. O item "perfil
 *         personalizado" foi cortado por não agregar valor de venda (ver
 *         design/100-dias-sem-caos-copy-pagina-vendas_4.md, v12).
 * @objective Lista de itens reescrita no formato título + descrição curta, com o "Passo a
 *            passo completo" como item central (sem ícone de presente) e os demais como
 *            bônus (com ícone de presente); adicionada a informação de acesso por 1 ano.
 * @solution Itens/preço/nota reescritos conforme a copy aprovada (seção 10 do .md acima).
 *           font-serif → font-sans nos títulos. Selos e garantia mantidos como já estavam
 *           (sem mudança documentada no changelog). Testado ao vivo pela Luiza: título
 *           estava em text-2xl no mobile (menor que o padrão text-3xl do resto da página,
 *           pra caber o texto mais longo) — padronizado de volta, a quebra de linha extra
 *           no mobile é preferível à inconsistência de tamanho entre seções.
 */
import { CheckCircle2, Package, Briefcase, MessageCircle, BookOpen, Gift, Shield, Zap, Headphones } from "lucide-react";
import { CTAButton } from "@/components/ui/cta-button";

const items = [
  {
    icon: CheckCircle2,
    title: "Passo a passo completo",
    text: "Pra você saber o que fazer primeiro, independente da semana de gravidez.",
  },
  {
    icon: Package,
    title: "Checklist de enxoval",
    text: "Com seu progresso sempre salvo.",
  },
  {
    icon: Briefcase,
    title: "Lista da mala da maternidade",
    text: "Organizada por quem leva o quê.",
  },
  {
    icon: MessageCircle,
    title: "Scripts de conversa prontos",
    text: "Pra pedir ajuda sem constrangimento.",
  },
  {
    icon: BookOpen,
    title: "Guia completo",
    text: "Pra consultar sempre que a dúvida bater.",
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
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Ao adquirir o 100 Dias Sem Caos, você recebe o app completo:
          </h2>

          {/* Items */}
          <div className="bg-card rounded-2xl shadow-xl p-6 md:p-10 mb-10">
            <div className="space-y-2.5 mb-8">
              {items.map((item, index) => (
                <div
                  key={item.title}
                  className={`flex items-start gap-4 p-4 rounded-xl ${
                    index === 0 ? "bg-rose-light" : "bg-accent/50"
                  }`}
                >
                  <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-sm shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className={`font-semibold flex items-center gap-1.5 ${index === 0 ? "text-lg" : "text-[15.5px]"}`}>
                      {index !== 0 && <Gift className="w-4 h-4 text-peach shrink-0" />}
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
              <p className="font-sans text-4xl md:text-5xl font-bold text-primary mb-2">
                Hoje: R$ 47
              </p>
              <p className="text-sm text-muted-foreground mb-8 italic">
                Pagamento único, com <strong className="font-semibold">acesso por 1 ano</strong>{" "}
                — tempo de sobra pra você se organizar no seu ritmo, ao longo de toda a
                gravidez.
              </p>

              <CTAButton>Quero Viver Meus 100 Dias Sem Caos{" →"}</CTAButton>
            </div>
          </div>

          {/* Guarantee */}
          <div className="bg-sage-light rounded-2xl p-8 text-center mb-8">
            <Shield className="w-16 h-16 text-sage mx-auto mb-4" />
            <h3 className="font-sans text-2xl font-bold text-foreground mb-4">
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
