/**
 * @file cta-button.tsx
 * @modified 2026-08-20
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Botão de compra usava um href fixo, perdendo parâmetros de rastreamento
 *         (UTM/fbclid/gclid) da campanha que trouxe o visitante até a página. Depois: a
 *         Luiza trocou o produto na Hotmart (novo ID, mesmo checkoutMode). Depois: dados de
 *         GA4 (scroll_25 bem menor que begin_checkout) e do Meta Ads (Finalizações de
 *         compra iniciada alto, 0 compras) mostraram gente abrindo o checkout da Hotmart
 *         direto pelos CTAs do topo da página (Hero, segunda dobra, "Pensado de mãe para
 *         mãe", banner após "Por que a estrutura importa"), sem chegar a ver a Oferta/preço
 *         no site — o preço só aparecia pela primeira vez já dentro do checkout da Hotmart.
 * @objective Repassar esses parâmetros pro checkout do Hotmart automaticamente. Depois:
 *            permitir que CTAs específicos (os 4 que ficam antes da seção de Oferta) levem
 *            a pessoa pra dentro da própria página em vez de abrir o checkout direto — sem
 *            mudar em nada os CTAs que já vêm depois da Oferta, que continuam abrindo o
 *            checkout normalmente.
 * @solution href calculado com buildCheckoutUrl (src/lib/checkoutUrl.ts) a partir da URL
 *           atual da página — sem parâmetros na URL, o link continua idêntico ao de antes.
 *           Depois: CHECKOUT_URL atualizada pro novo produto — buildCheckoutUrl não muda,
 *           ela só mescla parâmetros na URL base recebida, então o rastreamento por
 *           UTM/fbclid/gclid continua funcionando igual com o link novo. Depois: nova prop
 *           opcional `href` — quando informada, o botão vira um link âncora pra outra seção
 *           da própria página (sem target blank, sem passar por buildCheckoutUrl); quando
 *           omitida, o comportamento é 100% igual ao de antes (abre o checkout da Hotmart).
 *           Nova prop opcional `trackingLabel`, só com efeito junto de `href`: dispara
 *           `cta_pre_oferta_click` no dataLayer do GTM (GTM-5MLMK2BS, já carregado em
 *           index.html) no clique, identificando qual CTA foi — esse clique não tinha
 *           nenhum rastreamento próprio antes, porque só o clique final no checkout da
 *           Hotmart era capturado (pelo trigger de outbound click do próprio GTM).
 */
import { cn } from "@/lib/utils";
import { buildCheckoutUrl } from "@/lib/checkoutUrl";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

interface CTAButtonProps {
  children: React.ReactNode;
  className?: string;
  /** Quando informado, o botão vira um link âncora pra essa seção da própria página
   * (ex: "#antes-da-oferta") em vez de abrir o checkout da Hotmart. */
  href?: string;
  /** Rótulo enviado no evento `cta_pre_oferta_click` do dataLayer pra identificar qual CTA
   * foi clicado (ex: "hero", "descubra", "destaque", "banner"). Só tem efeito com `href`. */
  trackingLabel?: string;
}

const CHECKOUT_URL = "https://pay.hotmart.com/D107212680M?checkoutMode=10";

export const CTAButton = ({ children, className, href, trackingLabel }: CTAButtonProps) => {
  const isInternalLink = Boolean(href);

  const handleClick = () => {
    if (isInternalLink && trackingLabel && typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "cta_pre_oferta_click", cta_location: trackingLabel });
    }
  };

  return (
    <a
      href={isInternalLink ? href : buildCheckoutUrl(CHECKOUT_URL)}
      onClick={handleClick}
      {...(!isInternalLink && { target: "_blank", rel: "noopener noreferrer" })}
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
