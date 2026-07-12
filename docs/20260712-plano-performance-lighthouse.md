# Plano: Performance mobile — 100 Dias Sem Caos

Data: 2026-07-12
Status: **parcialmente concluído** — fix de fontes aplicado; ação principal (GTM/Pixel) pendente, fora do escopo do código.

## Contexto

Luiza recebeu um relatório de performance (aparentemente gerado por IA, assumindo
WordPress) recomendando plugins como WP Rocket, Elementor, Litespeed Cache — nada
disso se aplica aqui. Este site (`D:\dev\Cemdiassemcaos`) é uma SPA Vite + React
+ TypeScript, buildada estática e deployada manualmente via SCP pro cPanel
(`https://maternologia.com.br/100-dias-sem-caos/`). Rodei o Lighthouse de
verdade (`npx lighthouse`, mobile, headless Chrome local) pra ter números reais
em vez de reagir ao relatório genérico.

## Diagnóstico (Lighthouse mobile, antes de qualquer fix)

| Categoria | Nota |
|---|---|
| Performance | 27 |
| Accessibility | 98 |
| Best Practices | 100 |
| SEO | 100 |

| Métrica | Valor |
|---|---|
| FCP / LCP | 8.3s (idênticos) |
| TBT | 4.180 ms |
| Speed Index | 8.2s |
| TTI | 14.6s |
| CLS | 0.053 (ok) |

**Causa real (via `mainthread-work-breakdown` + `bootup-time` + `network-requests`
do relatório JSON do Lighthouse):**
- Imagens já eram `.webp`, pequenas (12-49KB) — não é o problema.
- Bundle JS do próprio site: 137KB — não é o problema.
- **~3.4s dos 4.18s de TBT vêm de rastreadores de terceiros carregados pelo
  Google Tag Manager** (container `GTM-5MLMK2BS`, gerenciado pela conta
  Maternologia, não está no código deste repo):
  - `gtag.js` (Google Analytics via GTM): 161KB, 1.3s de script
  - `fbevents.js` + config do Pixel do Facebook: 99KB + 57KB, ~1s de script
  - `gtm.js` (container): 125KB, ~300ms
- Segundo ponto, menor e resolvível no código: a folha de fontes do Google
  (`fonts.googleapis.com`) bloqueava a primeira renderização por ~1.7s
  (`render-blocking-resources`).

## O que foi feito

### Fix aplicado — fontes auto-hospedadas
- Instalado `@fontsource/inter` e `@fontsource/playfair-display` (pesos
  400/500/600/700, os mesmos que a URL antiga do Google Fonts pedia).
- `src/main.tsx` passou a importar os CSS dessas fontes diretamente (ficam
  empacotados no build, servidos pelo próprio domínio).
- `index.html`: removidas as tags `<link rel="preconnect">` e
  `<link rel="stylesheet">` que apontavam pra `fonts.googleapis.com` /
  `fonts.gstatic.com`.
- Build (`npm run build`) e deploy via SCP pra
  `public_html/100-dias-sem-caos/` no cPanel HostGator (mesmo fluxo dos
  deploys anteriores — ver
  [[../../../Dropbox/Marcelo/A_medita_em_acao/0_App/Obsidian&Claude/Einstein/Maternologia/Planos/20260712-relatorio-og-image-redirect-link-hotmart|relatório de deploy da sessão]]).
- **Commit:** `852a212` — *"perf: auto-hospeda Inter e Playfair Display via
  @fontsource"*

### Resultado medido (Lighthouse mobile, depois do fix)
| Métrica | Antes | Depois |
|---|---|---|
| Performance | 27 | 29 |
| FCP / LCP | 8.3s | 7.7s |
| Render-blocking | 740ms | 370ms |
| TBT | 4.180ms | 4.260ms (~igual, ruído) |
| TTI | 14.6s | 15.8s |

Ganho real (~0.6s no FCP/LCP), mas pequeno perto do problema principal — bate
com o diagnóstico: o TBT não mexeu porque o gargalo é o GTM, não código do
site.

## Pendente — ação fora do código (quem tem acesso ao GTM da Luiza)

O container GTM (`GTM-5MLMK2BS`, tagmanager.google.com) dispara Google
Analytics + Pixel do Facebook no trigger padrão "All Pages" (imediato). Isso
é responsável por ~80% do travamento (3.4s de 4.2s de TBT).

**Recomendação a passar pra quem administra essa conta GTM:** trocar o
trigger dessas tags de "All Pages" para:
- **Timer com delay de 2-3s**, ou
- **Primeira interação/rolagem do usuário**

As conversões continuam sendo contadas normalmente (a venda em si é
processada pelo Hotmart, independente do timing do pixel), só param de
competir com o carregamento inicial da página. Essa mudança não pode ser
feita por código — é configuração dentro do painel do GTM.

## Comandos usados (reprodutível)

```bash
# instalar fontes locais
npm install @fontsource/inter @fontsource/playfair-display

# build
npm run build

# rodar Lighthouse real (mobile) contra a URL publicada
npx lighthouse https://maternologia.com.br/100-dias-sem-caos/ \
  --only-categories=performance,accessibility,best-practices,seo \
  --preset=perf --form-factor=mobile --screenEmulation.mobile \
  --output=json --output-path=./lh-report.json \
  --chrome-flags="--headless --no-sandbox" --quiet
```

## Ver também
- [Relatório de deploy da sessão (og:image, redirect, link Hotmart)](../../../Dropbox/Marcelo/A_medita_em_acao/0_App/Obsidian&Claude/Einstein/Maternologia/Planos/20260712-relatorio-og-image-redirect-link-hotmart.md)
