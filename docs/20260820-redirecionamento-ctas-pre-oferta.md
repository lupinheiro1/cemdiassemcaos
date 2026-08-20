# Redirecionamento dos CTAs antes da Oferta (20/08/2026)

## Contexto

Primeira campanha ativa no Meta Ads desde a migração do e-book pro app (18/08):
27 cliques → 19 visualizações da página → 12 aberturas de checkout na Hotmart →
**0 compras**. Validação ainda em andamento (regra da Luiza: 2-3 vendas em 2 dias,
orçamento de metade do valor do produto, antes de escalar).

## Diagnóstico

"Finalizações de compra iniciada" (Meta) / `begin_checkout` (GA4) não significa
"começou a preencher o checkout" — significa só "clicou num botão do site que abre
o checkout da Hotmart em nova aba". Cruzando dois eventos do GA4 do mesmo dia
(19/08): `scroll_25` = 6, `begin_checkout` = 14. Mais que o dobro de aberturas de
checkout do que gente que rolou sequer 25% da página — e a seção da Oferta (preço)
fica por volta de 60-70% da página. Ou seja: boa parte de quem abre o checkout da
Hotmart nunca viu o preço no site — só vê pela primeira vez já na tela da Hotmart.

Causa raiz: a página tem 4 CTAs ("Quero Viver Meus 100 Dias Sem Caos") **antes**
da seção de Oferta — Hero, segunda dobra (`DiscoverSection`), "Pensado de mãe para
mãe" (`HighlightSection`) e o banner após "Por que a estrutura importa"
(`CTABannerSection`) — e todos levavam direto pro checkout da Hotmart, sem passar
pela Oferta.

## Decisão

Não abandonar a estrutura de copy longa (construir valor antes do preço é o padrão
certo pra um produto de consideração mais alta, e o preço é reconhecidamente um
pouco alto frente à concorrência — precisa da construção de valor pra se
justificar). A mudança é cirúrgica: só os 4 CTAs **antes** da Oferta passam a
rolar a página até a seção imediatamente anterior a ela ("A transformação que
você merece", `TransformationSection`), em vez de abrir o checkout. O botão
dentro da própria Oferta, e os que vêm depois dela (Objeções, Comparação, CTA
final), continuam levando direto pro checkout — quem chega até ali já viu o
preço.

Descartado nesse momento: encurtar a página inteira no estilo do app Colo
(referência trazida pela Luiza). O Colo consegue ser curto porque é freemium
(baixa grátis, assina depois de já usar) — decisão leve, quase reversível. O 100
Dias Sem Caos é pagamento único antecipado, sem uso grátis antes — pede mais
construção de confiança, que é o que a página longa já faz. Testar as duas coisas
juntas também contaminaria o experimento (não daria pra saber qual mudança
resolveu o quê).

## O que mudou (implementação)

- `src/components/ui/cta-button.tsx`: `CTAButton` ganhou duas props opcionais.
  `href` — quando informada, o botão vira link âncora pra outra seção da própria
  página em vez de abrir o checkout da Hotmart (comportamento default, sem `href`,
  continua 100% igual ao de antes). `trackingLabel` — dispara
  `cta_pre_oferta_click` no `dataLayer` do GTM (`GTM-5MLMK2BS`) no clique,
  identificando qual CTA foi.
- `src/components/sections/TransformationSection.tsx`: recebeu
  `id="antes-da-oferta"` e `scroll-mt-6` — é o alvo de destino dos 4 CTAs.
- `src/components/sections/HeroSection.tsx`,
  `DiscoverSection.tsx`, `HighlightSection.tsx`, `CTABannerSection.tsx`: o
  `CTAButton` de cada um passou a usar `href="#antes-da-oferta"` e um
  `trackingLabel` (`hero`, `descubra`, `destaque`, `banner`, respectivamente).
- `src/index.css`: adicionado `scroll-behavior: smooth` no `html`, pra o salto até
  `#antes-da-oferta` ser suave, não um pulo seco.

Nenhuma mudança de copy, cores ou layout — só o destino de 4 botões e um evento
de rastreamento novo.

## Impacto esperado nas métricas

"Finalizações de compra iniciada" / `begin_checkout` deve **cair** depois desse
deploy — é esperado e saudável, não uma regressão. O número vai parar de contar
clique cedo sem contexto e passar a refletir só quem chegou perto da Oferta antes
de abrir o checkout de verdade. Comparar taxa de conversão do checkout (compras /
checkout aberto) antes e depois é mais informativo que comparar o volume bruto de
aberturas.

## Validação (20/08/2026)

Rodado localmente antes da publicação: `tsc --noEmit` limpo; `eslint` nos 6
arquivos alterados sem apontamentos (`eslint .` geral quebra por um
`.pytest_cache/` sem permissão de leitura na raiz do repo, sem relação com essa
mudança); `vitest run` passou (suíte do repo tem só 1 teste de exemplo, não cobre
componentes); `vite build` (bundle de produção) completo sem erros. Ordem das
seções em `Index.tsx` conferida: `TransformationSection` é de fato a seção
imediatamente anterior a `OfferSection`, e os CTAs pós-Oferta
(`ComparisonSection`, `FinalCTASection`, `OfferSection`) seguem sem a prop
`href`, indo direto pro checkout como antes.

## Em aberto

- **Tag nova no GTM pendente.** O evento `cta_pre_oferta_click` já dispara no
  `dataLayer`, mas só vira métrica visível no GA4 depois de criar lá um trigger de
  evento customizado + tag de evento GA4 (não configurado ainda).
- Depois de rodar uns dias, revisar se a nova conversão (visualização de
  `#antes-da-oferta` → abertura de checkout → compra) confirma a hipótese, ou se o
  gargalo está em outro lugar.
