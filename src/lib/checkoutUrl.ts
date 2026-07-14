/**
 * @file checkoutUrl.ts
 * @modified 2026-07-14
 * @authors Marcelo Arana + Claude Sonnet 5
 * @reason Cliques no checkout perdiam os parâmetros de rastreamento (UTM/fbclid/gclid)
 *         da campanha que trouxe o visitante até a página.
 * @objective Repassar esses parâmetros pro link do Hotmart automaticamente, sem alterar
 *            comportamento quando não há nenhum parâmetro na URL.
 * @solution buildCheckoutUrl mescla os parâmetros de rastreamento da URL atual na URL de
 *           checkout, preservando os que já existirem nela (ex: cupom, oferta).
 */

const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

/**
 * Acrescenta os parâmetros de rastreamento presentes na URL atual do navegador à URL de
 * checkout informada, sem remover nenhum parâmetro que a URL de checkout já tiver.
 * @param baseUrl URL de checkout (ex: link do Hotmart)
 */
export function buildCheckoutUrl(baseUrl: string): string {
  if (typeof window === "undefined") return baseUrl;

  const currentParams = new URLSearchParams(window.location.search);
  const url = new URL(baseUrl);

  TRACKED_PARAMS.forEach((key) => {
    const value = currentParams.get(key);
    if (value) url.searchParams.set(key, value);
  });

  return url.toString();
}
