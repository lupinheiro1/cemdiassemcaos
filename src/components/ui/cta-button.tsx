/**
 * @file cta-button.tsx
 * @modified 2026-08-18
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Botão de compra usava um href fixo, perdendo parâmetros de rastreamento
 *         (UTM/fbclid/gclid) da campanha que trouxe o visitante até a página. Depois: a
 *         Luiza trocou o produto na Hotmart (novo ID, mesmo checkoutMode).
 * @objective Repassar esses parâmetros pro checkout do Hotmart automaticamente.
 * @solution href calculado com buildCheckoutUrl (src/lib/checkoutUrl.ts) a partir da URL
 *           atual da página — sem parâmetros na URL, o link continua idêntico ao de antes.
 *           Depois: CHECKOUT_URL atualizada pro novo produto — buildCheckoutUrl não muda,
 *           ela só mescla parâmetros na URL base recebida, então o rastreamento por
 *           UTM/fbclid/gclid continua funcionando igual com o link novo.
 */
import { cn } from "@/lib/utils";
import { buildCheckoutUrl } from "@/lib/checkoutUrl";

interface CTAButtonProps {
  children: React.ReactNode;
  className?: string;
}

const CHECKOUT_URL = "https://pay.hotmart.com/D107212680M?checkoutMode=10";

export const CTAButton = ({ children, className }: CTAButtonProps) => {
  return (
    <a
      href={buildCheckoutUrl(CHECKOUT_URL)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold",
        "bg-gradient-to-br from-peach to-[hsl(18_70%_48%)] text-white rounded-full",
        "shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40",
        "transform hover:-translate-y-0.5 hover:brightness-105 transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-peach focus:ring-offset-2",
        className
      )}
    >
      {children}
    </a>
  );
};
