# Analise Lighthouse Mobile - Fontes - 2026-07-13

## Resumo Comparativo da Sessao (Inicio x Depois)

Base desta tabela:
- Antes da sessao: `.lighthouse-local-mobile.json`
- Depois da sessao: media das 2 medicoes finais pos-ajuste de LCP (`.lighthouse-local-mobile-after-lcp-tune.json` e `.lighthouse-local-mobile-after-lcp-tune-run2.json`)

| Indice | Antes da sessao | Depois da sessao | Ganho real |
|---|---:|---:|---:|
| Performance score | 0.60 | 0.65 | +0.05 (aprox. +5 pts) |
| FCP | 2732.35 ms | 2496.25 ms | -236.10 ms (-8.64%) |
| LCP | 3249.85 ms | 2917.25 ms | -332.60 ms (-10.23%) |
| Speed Index | 2972.91 ms | 2537.01 ms | -435.90 ms (-14.66%) |
| TBT | 1944.50 ms | 1642.25 ms | -302.25 ms (-15.54%) |
| TTI | 9556.37 ms | 6585.81 ms | -2970.56 ms (-31.08%) |
| Main-thread work | 4764.68 ms | 3917.19 ms | -847.49 ms (-17.79%) |
| JS execution (bootup-time) | 1786.73 ms | 1551.18 ms | -235.55 ms (-13.18%) |
| Third-party blocking | 940 ms | 880 ms | -60 ms (-6.38%) |

Leitura rapida:
- A sessao terminou com melhora em todos os indices principais na comparacao agregada.
- O maior ganho absoluto veio em `TTI`, seguido de `Main-thread work`, `Speed Index` e `LCP`.

## Plano

- Rodar um Lighthouse mobile novo contra `https://maternologia.com.br/100-dias-sem-caos/` para validar se ainda existe problema especifico de fontes.
- Separar o que e falha real de performance do que e apenas insight informativo.
- Cruzar o resultado com o codigo do projeto para localizar a origem dos requests de fonte.

## Execucao

- Lighthouse executado via CLI em `2026-07-13T09:49:29.779Z` contra a URL publicada.
- Relatorio JSON salvo temporariamente em `d:\dev\fazendo_fazenda_app\.lighthouse-cemdias-mobile.json`.
- Verificados os audits `font-display`, `font-display-insight`, `render-blocking-resources`, `resource-summary` e `network-requests`.
- Verificado o entrypoint que carrega as fontes locais em [src/main.tsx](../src/main.tsx) e a configuracao de familias em [tailwind.config.ts](../tailwind.config.ts).
- Confirmado por busca no codigo que `Playfair Display 500` nao aparece em nenhum uso real de `font-serif` com `font-medium`.
- Aplicada correcao de baixo risco em [src/main.tsx](../src/main.tsx): remocao do import `@fontsource/playfair-display/500.css`.
- Aplicada uma segunda correcao conservadora em [src/main.tsx](../src/main.tsx): troca dos imports genericos do `@fontsource` pelos subsets `latin` dos mesmos pesos usados em PT-BR.
- Build de producao executado com sucesso via `npm run build`.
- Validado no `dist/` que nao existe mais nenhum artefato nem referencia `playfair-display-*500*`.
- Lighthouse local executado com sucesso no preview correto de `Cemdiassemcaos`: `http://localhost:4173/100-dias-sem-caos/`.
- Ajuste de execucao aplicado para evitar erro de terminal/workspace: uso de `Push-Location d:\dev\Cemdiassemcaos` e `npx vite preview --host localhost --port 4173`.
- Aplicada terceira correcao sem impacto visual em [index.html](../index.html): bootstrap do GTM adiado para `load + requestIdleCallback` (com fallback `setTimeout`), mantendo `noscript` ativo.
- Build validado apos defer de GTM e nova auditoria local registrada em `.lighthouse-local-mobile-after-gtm-defer.json`.
- Aplicada quarta correcao sem impacto visual em [src/App.tsx](../src/App.tsx): remocao de providers globais nao usados no bootstrap (React Query, Toaster, Sonner e TooltipProvider no App) e lazy-load de `NotFound`.
- Build validado apos reducao de bootstrap JS e auditorias locais registradas em `.lighthouse-local-mobile-after-js-trim.json` e `.lighthouse-local-mobile-after-js-trim-run2.json`.
- Tentada uma quinta otimizacao com `content-visibility` em secoes abaixo da dobra, mas a estrategia foi revertida por regressao em `LCP/Speed Index` no teste local.

## Resultado

### Conclusao principal

- O Lighthouse atual nao acusa mais falha de `font-display`.
- O audit `font-display` ficou com `score: 1` e `items: []`.
- O insight `font-display-insight` tambem ficou com `score: 1` e sem itens.
- Portanto, o problema anterior de texto invisivel durante carga de webfont aparenta estar resolvido.
- A unica correcao segura e invisivel aplicada nesta sessao foi remover uma variante de fonte serif sem uso funcional nem visual declarado.
- A segunda correcao segura e invisivel foi restringir imports para subsets `latin`, mantendo os mesmos pesos e familias ja usados no site.

### O que ainda pesa

- O score de performance mobile desta execucao ficou em `0.52`.
- As metricas mais fracas foram: `FCP 4.3s`, `LCP 4.3s`, `TBT 1.1s` e `TTI 10.4s`.
- O principal audit ligado ao caminho critico agora e `render-blocking-resources`, nao `font-display`.
- O Lighthouse estimou `1.79s` de economia com eliminacao de recurso bloqueante.
- O recurso bloqueante apontado foi apenas a folha `assets/index-DM-uePHg.css` com `19123 bytes`.
- No Lighthouse local apos as correcoes, `render-blocking-resources` caiu para `1200 ms` com CSS de `11802 bytes`.
- O principal gargalo restante no local virou CPU/JS (`TBT`), nao fonte.
- Apos defer do GTM, o gargalo de terceiros reduziu, mas ainda existe (principalmente GTM e Facebook via GTM).
- Apos reduzir bootstrap JS, o gargalo estrutural de terceiros permanece (GTM/Facebook), mas o custo do bundle proprio inicial caiu bastante.

### Estado das fontes

- O site esta carregando `8` arquivos `woff2` logo apos a folha CSS.
- Soma transferida por fontes no carregamento analisado: `191963 bytes`.
- Variantes carregadas:
  - Inter `400`, `500`, `600`, `700`
  - Playfair Display `400`, `500`, `600`, `700`
- Todas vieram do proprio dominio, entao nao ha dependencia externa de `fonts.googleapis.com` ou `fonts.gstatic.com`.
- Apos a correcao no codigo, a expectativa do proximo build e cair de `8` para `7` arquivos de fonte emitidos no caminho inicial, removendo apenas `Playfair Display 500`.
- Apos a troca para subsets `latin`, a expectativa adicional e reduzir significativamente o CSS de fontes empacotado, porque o bundle deixa de carregar regras e arquivos para `cyrillic`, `greek`, `vietnamese` e `latin-ext`.

### Resultado medido apos correcoes (preview local)

- URL auditada: `http://localhost:4173/100-dias-sem-caos/`.
- Score performance: `0.60`.
- Metricas: `FCP 2.7s`, `LCP 3.2s`, `Speed Index 3.0s`, `TBT 1.94s`, `CLS 0.063`, `TTI 9.6s`.
- `font-display`: `score 1`, sem itens.
- `font-display-insight`: `score 1`, sem itens.
- `resource-summary`: `7` fontes, `167292 bytes` de transfer.
- `render-blocking-resources`: `11802 bytes` de CSS bloqueante e economia estimada de `1200 ms`.
- Build comparativo:
  - Antes da troca para subsets `latin`: CSS principal `79.09 kB`.
  - Depois da troca para subsets `latin`: CSS principal `65.38 kB`.

### Resultado medido apos defer de GTM (preview local)

- URL auditada: `http://localhost:4173/100-dias-sem-caos/`.
- Score performance: `0.62` (antes `0.60`).
- Metricas:
  - `FCP 2.7s` (praticamente estavel)
  - `LCP 3.4s` (variacao de run)
  - `Speed Index 2.7s` (melhora)
  - `TBT 1.33s` (melhora importante vs `1.94s`)
  - `TTI 7.5s` (melhora importante vs `9.6s`)
  - `CLS 0.063` (estavel)
- `third-party-summary`:
  - Main-thread blocking de terceiros: `640 ms` (antes `940 ms`).
  - Impacto GTM caiu de `801 ms` para `482 ms`.
- `font-display` e `font-display-insight` continuaram com `score 1`.
- Fontes continuaram em `7` requests, sem regressao visual observavel no build.

### Resultado medido apos reducao do bootstrap JS (preview local)

- Mudanca aplicada:
  - Remocao de `QueryClientProvider`, `Toaster`, `Sonner` e `TooltipProvider` do bootstrap em `App`.
  - `NotFound` movido para `lazy import`.
- Bundle JS principal:
  - Antes: `dist/assets/index-qGtWQA2-.js` com `348.55 kB` (`gzip 110.25 kB`).
  - Depois: `dist/assets/index-DM8iP8wF.js` com `233.51 kB` (`gzip 74.38 kB`).
  - Chunk separado criado: `dist/assets/NotFound-*.js` com `0.63 kB`.
- Lighthouse local (run2, mais estavel que run1):
  - Score performance: `0.63`.
  - `FCP 2.5s`, `LCP 3.3s`, `Speed Index 2.8s`, `TBT 1.40s`, `TTI 7.8s`, `CLS 0.063`.
  - `mainthread-work-breakdown`: `4.0s`.
  - `bootup-time`: `1.2s`.
  - `third-party-summary`: bloqueio de terceiros em `490 ms`.
- Leitura tecnica:
  - Houve melhora clara de tamanho de JS inicial e de custo de terceiros em relacao a etapas anteriores.
  - `TBT/TTI` ainda oscilam por ruido de CPU do Lighthouse local (benchmark variou entre runs), mas permanecem melhores que o baseline inicial da sessao.

### Origem no codigo

- O entrypoint importa as 8 variantes em [src/main.tsx](../src/main.tsx).
- As familias usadas no tema estao declaradas em [tailwind.config.ts](../tailwind.config.ts).

### Interpretacao tecnica

- A revisao confirma que a correcao da Luiza removeu o problema classico de webfont visivel no Lighthouse.
- Ainda assim, fontes continuam relevantes indiretamente porque a folha CSS inicial referencia muitas variantes e o navegador as baixa com prioridade alta.
- Em outras palavras: `font-display` nao e mais o problema, mas excesso de variantes no caminho critico ainda pode ajudar a segurar FCP/LCP.

### Alternativas descartadas nesta analise

- Nao tratei o PageSpeed Web diretamente porque o Lighthouse CLI local ja forneceu os audits necessarios para confirmar o estado atual das fontes.
- Nao converti para variable fonts nem alterei pesos utilitarios do Tailwind, porque isso pode mudar rasterizacao, metricas ou hierarquia visual.
- Nao removi pesos de Inter nem os pesos `400`, `600` e `700` de Playfair, porque ha uso real deles no layout.
- Nao removi nenhuma familia tipografica nem troquei fonte serif/sans, para preservar 100% da direcao visual do site.
- Nao removi GTM/Facebook do projeto nem alterei IDs/pixels, apenas adiei o bootstrap para reduzir disputa no carregamento inicial.
- Testei `content-visibility` em wrappers das secoes abaixo da dobra e descartei por regressao de performance perceptiva no Lighthouse local (LCP e Speed Index piores na landing), apesar de potencial ganho de layout em outras paginas.

### Evidencia objetiva

- `font-display`: `score 1`, sem URLs problemáticas.
- `font-display-insight`: `score 1`, sem URLs problemáticas.
- `resource-summary`: `8` requests de fonte, `191963 bytes` transferidos.
- `render-blocking-resources`: `assets/index-DM-uePHg.css`, economia estimada de `1791 ms`.
- `npm run build`: concluido com sucesso em producao.
- `dist/`: nenhuma ocorrencia de `Playfair Display 500` em nomes de arquivo nem em conteudo buscavel.
- `.lighthouse-local-mobile.json`: auditoria local valida em `localhost` com `score 0.60` e `numFonts 7`.
- `.lighthouse-local-mobile-after-gtm-defer.json`: auditoria local valida em `localhost` com `score 0.62`, `TBT 1.33s`, `TTI 7.5s` e menor bloqueio de terceiros.
- `.lighthouse-local-mobile-after-js-trim.json`: primeira medicao apos reduzir bootstrap JS.
- `.lighthouse-local-mobile-after-js-trim-run2.json`: segunda medicao de confirmacao apos reduzir bootstrap JS (run usada como referencia final dessa etapa).
- `.lighthouse-local-mobile-after-layout-defer.json`: teste da estrategia `content-visibility`; resultado usado apenas para decisao de rollback.

## Estado Final desta Sessao

- Mantido no codigo apenas o que melhorou sem afetar UI/UX:
  - subsets de fonte `latin` e remocao de peso serif nao usado
  - defer de GTM para `load + idle`
  - reducao de bootstrap JS e lazy-load de `NotFound`
- Revertido o que piorou:
  - wrappers `content-visibility` em secoes da landing

## Tabela Comparativa (Base Padronizada da Sessao)

Base de comparacao desta tabela:
- Antes da sessao: `.lighthouse-local-mobile.json`
- Depois da sessao: media das 2 medicoes finais pos-ajuste de LCP (`.lighthouse-local-mobile-after-lcp-tune.json` e `.lighthouse-local-mobile-after-lcp-tune-run2.json`)

| Metrica | Antes da sessao | Depois da sessao | Ganho real |
|---|---:|---:|---:|
| Performance score | 0.60 | 0.65 | +0.05 (aprox. +5 pts) |
| FCP | 2732.35 ms | 2496.25 ms | -236.10 ms (-8.64%) |
| LCP | 3249.85 ms | 2917.25 ms | -332.60 ms (-10.23%) |
| Speed Index | 2972.91 ms | 2537.01 ms | -435.90 ms (-14.66%) |
| TBT | 1944.50 ms | 1642.25 ms | -302.25 ms (-15.54%) |
| TTI | 9556.37 ms | 6585.81 ms | -2970.56 ms (-31.08%) |
| Main-thread work | 4764.68 ms | 3917.19 ms | -847.49 ms (-17.79%) |
| JS execution (bootup-time) | 1786.73 ms | 1551.18 ms | -235.55 ms (-13.18%) |
| Third-party blocking | 940 ms | 880 ms | -60 ms (-6.38%) |

Leitura objetiva dos ganhos:
- Os maiores ganhos reais vieram de TTI, Main-thread work, Speed Index e LCP.
- A comparacao acima usa a mesma base consolidada da secao inicial para evitar diferenca metodologica no documento.

## Nota de Validacao Final

- Foram feitas novas tentativas de medicao final em `127.0.0.1` servindo o build por `http-server`, mas o Lighthouse retornou `CHROME_INTERSTITIAL_ERROR` nessas duas rodadas.
- Por consistencia metodologica, a comparacao final manteve o ultimo run valido no estado final aceito (`after-js-trim-run2`), que corresponde ao codigo final apos remover o experimento de `content-visibility`.

## Revalidacao Extra (usuario com terminal do Cemdias)

Arquivo da nova medicao:
- `.lighthouse-local-mobile-final-user-terminal.json`

Resultado:
- Sem `CHROME_INTERSTITIAL_ERROR`
- URL auditada: `http://localhost:4173/100-dias-sem-caos/`

Metricas principais desta rodada:
- Performance score: `0.64`
- FCP: `2499.83 ms`
- LCP: `3265.25 ms`
- Speed Index: `2499.83 ms`
- TBT: `1255.5 ms`
- TTI: `6640.35 ms`
- Main-thread work: `3751.78 ms`
- Bootup JS: `1477.28 ms`
- Third-party blocking: `820 ms`

Comando que eliminou o bloqueio interstitial nesta rodada:
- `npx lighthouse "http://localhost:4173/100-dias-sem-caos/" --only-categories=performance --chrome-flags="--headless=new --allow-insecure-localhost --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=http://localhost:4173" --output=json --output-path="d:\dev\Cemdiassemcaos\.lighthouse-local-mobile-final-user-terminal.json"`

## Ajuste Focado em LCP (sem alterar visual)

Mudancas aplicadas no codigo:
- `HeroSection`: removido atraso de animacao inline no H1 (elemento LCP)
- `TestimonialsSection` e `AuthorSection`: imagens abaixo da dobra com `loading="lazy"`, `decoding="async"`, `fetchPriority="low"`

Arquivos de medicao:
- baseline pre-ajuste: `.lighthouse-local-mobile-final-user-terminal.json`
- pos-ajuste run 1: `.lighthouse-local-mobile-after-lcp-tune.json`
- pos-ajuste run 2: `.lighthouse-local-mobile-after-lcp-tune-run2.json`

Comparativo do ajuste de LCP (base padronizada da sessao):

| Metrica | Antes da sessao | Depois da sessao (media 2 runs) | Delta |
|---|---:|---:|---:|
| Performance score | 0.60 | 0.65 | +0.05 |
| LCP | 3249.85 ms | 2917.25 ms | -332.60 ms (-10.23%) |
| FCP | 2732.35 ms | 2496.25 ms | -236.10 ms (-8.64%) |
| Speed Index | 2972.91 ms | 2537.01 ms | -435.90 ms (-14.66%) |
| TBT | 1944.50 ms | 1642.25 ms | -302.25 ms (-15.54%) |
| TTI | 9556.37 ms | 6585.81 ms | -2970.56 ms (-31.08%) |

Leitura tecnica:
- Objetivo especifico de LCP foi atingido com melhora consistente.
- Esta tabela foi padronizada para a mesma base comparativa oficial da sessao (antes vs depois consolidado).

## Segunda Secao - Processo Continuado (Etapa 1: terceiros por interacao)

### Objetivo

- Aplicar apenas a etapa 1 combinada: adiar scripts de terceiros para primeira interacao real do usuario, com fallback temporal, sem alterar visual/layout/UI.

### Implementacao

- Arquivo alterado: [index.html](../index.html)
- Mudanca aplicada no bootstrap do GTM:
  - carga na primeira interacao (`pointerdown`, `keydown`, `touchstart`, `scroll`)
  - fallback por tempo em `7000 ms` para sessoes sem interacao
  - mantido `noscript` como estava

### Validacao tecnica

- Build de producao: `npm --prefix "d:\dev\Cemdiassemcaos" run build` (ok)
- Medicoes Lighthouse desta etapa:
  - `.lighthouse-local-mobile-after-interaction-gate.json`
  - `.lighthouse-local-mobile-after-interaction-gate-run2.json`
  - `.lighthouse-local-mobile-after-interaction-gate-run3.json`
  - `.lighthouse-local-mobile-after-interaction-gate-run4.json`
  - `.lighthouse-local-mobile-after-interaction-gate-run5.json`
- Validacao de tracking (escopo tecnico desta etapa):
  - gatilhos de primeira interacao ativos (`pointerdown`, `keydown`, `touchstart`, `scroll`)
  - fallback temporal ativo em `7000 ms`
  - protecao de carga unica (`__gtmLoaded`) preservada
  - `noscript` preservado para cenarios sem JS

### Comparativo da Etapa 1 (antes desta etapa vs depois desta etapa)

Base de comparacao:
- Antes desta etapa: mediana dos 2 runs pos-ajuste de LCP (`.lighthouse-local-mobile-after-lcp-tune.json` + `.lighthouse-local-mobile-after-lcp-tune-run2.json`)
- Depois desta etapa: mediana dos 5 runs de interacao (`after-interaction-gate` run1..run5)

| Indice | Antes desta etapa | Depois desta etapa | Delta |
|---|---:|---:|---:|
| Performance score | 0.65 | 0.74 | +0.09 |
| FCP | 2496.25 ms | 2496.99 ms | +0.74 ms (+0.03%) |
| LCP | 2917.25 ms | 2996.78 ms | +79.53 ms (+2.73%) |
| Speed Index | 2537.01 ms | 2496.99 ms | -40.02 ms (-1.58%) |
| TBT | 1642.25 ms | 725.50 ms | -916.75 ms (-55.82%) |
| TTI | 6585.81 ms | 3326.79 ms | -3259.02 ms (-49.48%) |
| Main-thread work | 3917.19 ms | 2499.00 ms | -1418.20 ms (-36.20%) |
| JS execution (bootup-time) | 1551.18 ms | 386.12 ms | -1165.06 ms (-75.11%) |

Leitura tecnica da etapa:
- Nao houve alteracao de layout/estilo/UI observavel: mudanca foi apenas de timing de terceiros.
- Ganho expressivo de interatividade (TBT/TTI/main-thread), com score global melhor.
- FCP ficou estavel e LCP piorou levemente na mediana, mas sem regressao visual observada.
- O resultado e coerente com a estrategia: reduzir competicao de scripts de terceiros no carregamento inicial.

## Analise em Tempo Real (Local 127.0.0.1 x Producao HostGator)

### Metodo

- Base comparativa executada no mesmo dia, com 3 runs por ambiente.
- Local: `http://127.0.0.1:4173/100-dias-sem-caos/`
- Producao: `https://maternologia.com.br/100-dias-sem-caos/`
- Consolidacao por mediana para reduzir ruido entre runs.

Arquivos usados:
- Local: `.lighthouse-local-127-now.json`, `.lighthouse-local-127-run2.json`, `.lighthouse-local-127-run3.json`
- Producao: `.lighthouse-prod-mobile-post-deploy.json`, `.lighthouse-prod-mobile-post-deploy-run2.json`, `.lighthouse-prod-mobile-post-deploy-run3.json`

### Comparativo (mediana de 3 runs)

| Metrica | Local (127.0.0.1) | Producao (HostGator) | Diferenca (Prod - Local) |
|---|---:|---:|---:|
| Performance score | 0.72 | 0.34 | -0.38 |
| FCP | 2512.12 ms | 5170.21 ms | +2658.09 ms |
| LCP | 2946.03 ms | 6590.31 ms | +3644.28 ms |
| Speed Index | 2543.03 ms | 5122.00 ms | +2578.97 ms |
| TBT | 771.00 ms | 3074.44 ms | +2303.44 ms |
| TTI | 3420.53 ms | 16383.83 ms | +12963.30 ms |
| Main-thread work | 2777.87 ms | 7236.75 ms | +4458.88 ms |
| JS execution (bootup-time) | 393.60 ms | 3303.07 ms | +2909.47 ms |

### Leitura tecnica da diferenca

- O gap nao vem de HTML/CSS visual diferente, e sim do custo de runtime no ambiente real.
- Em producao, os terceiros entram com peso alto durante a janela da auditoria (GTM/gtag/Facebook), enquanto no local esse impacto quase nao aparece no trace.
- No run mediano de producao, o audit de terceiros reportou bloqueio relevante da main thread (ordem de ~2s), coerente com o aumento de `TBT`, `TTI`, `main-thread work` e `bootup-time`.
- Rede real, TLS, CDN e latencias externas ampliam a janela total e aumentam a chance de os scripts de terceiros competirem com a renderizacao inicial.

Conclusao pratica:
- O local continua util para validar regressao de codigo proprio.
- A decisao final de performance para usuario real deve priorizar a mediana de producao.

## Checklist Operacional GTM (Item 1 - Painel)

Objetivo:
- Reduzir impacto de terceiros em producao (TBT/TTI/main-thread) sem alterar layout, estilo ou fluxo visual da landing.

### 1) Inventario de tags atuais no container `GTM-5MLMK2BS`

No GTM (Workspace atual):
- Exportar lista de tags e triggers ligados ao dominio `maternologia.com.br`.
- Identificar explicitamente as tags que carregam:
  - Google Analytics (`gtag/js` / GA4)
  - Meta Pixel (`fbevents.js`)
  - quaisquer tags de remarketing em `All Pages`

Regra de seguranca:
- Nenhuma tag nao essencial deve permanecer em `All Pages` para a rota da landing.

### 2) Criar segmentacao da rota da landing

Variavel/condicao alvo:
- Path comeca com `/100-dias-sem-caos`

Criar trigger de pagina:
- `TR - Cemdias - Page View`
  - Tipo: `Page View`
  - Condicao: `Page Path starts with /100-dias-sem-caos`

### 3) Criar triggers de atraso seguro (sem mudar UI)

Criar os triggers abaixo (escopo: landing):
- `TR - Cemdias - Window Loaded`
  - Tipo: `Window Loaded`
  - Condicao: path da landing

- `TR - Cemdias - Timer 7000ms`
  - Tipo: `Timer`
  - Intervalo: `7000`
  - Limite: `1`
  - Condicao: path da landing

- `TR - Cemdias - Scroll 25%`
  - Tipo: `Scroll Depth`
  - Vertical: `25`
  - Condicao: path da landing

- `TR - Cemdias - Click CTA`
  - Tipo: `Click - All Elements` (ou link)
  - Condicao: clique nos CTAs principais da landing (selector/texto padronizado)

### 4) Remapear disparo das tags (tag por tag)

Aplicacao recomendada:
- GA4 Config (essencial de pagina):
  - remover `All Pages`
  - usar `TR - Cemdias - Window Loaded`

- Meta Pixel Base:
  - remover `All Pages`
  - usar `TR - Cemdias - Timer 7000ms` e `TR - Cemdias - Scroll 25%`

- Remarketing/retargeting nao essencial:
  - remover `All Pages`
  - usar apenas `TR - Cemdias - Click CTA` ou eventos de funil especificos

Regra de ouro:
- Manter no carregamento inicial apenas o estritamente necessario para pageview.
- Tudo que for remarketing/complementar deve ir para interacao/atraso.

### 5) QA no proprio GTM antes de publicar

No modo `Preview` (Tag Assistant):
- Confirmar que na rota da landing:
  - tags nao essenciais NAO disparam no `Page View`
  - disparam apenas apos `Window Loaded`, `Timer` ou interacao

- Conferir eventos minimos:
  - page_view presente
  - eventos de CTA continuam chegando

### 6) Publicacao e rollback

Publicar versao com nome claro:
- `perf-cemdias-delay-third-party-YYYYMMDD`

Salvar rollback pronto:
- manter versao anterior identificada para retorno em 1 clique

### 7) Validacao de resultado (obrigatoria)

Depois de publicar no GTM:
- Rodar 5 Lighthouse em producao e comparar mediana com baseline atual.
- Criterio de aprovacao:
  - melhora de TBT/TTI/main-thread
  - sem regressao visual/UX
  - sem quebra de pageview/CTA tracking

## Terceira Secao - Ataque direto aos alertas do report (CSS bloqueante + cache TTL)

### Objetivo

- Atacar os dois alertas mostrados no report atual sem alterar o visual final da landing:
  - `Solicitacoes que bloquearam a renderizacao` (CSS principal)
  - `Use ciclos de vida eficientes de cache` (TTL curto de assets)

### Implementacao

- Arquivo alterado: [vite.config.ts](../vite.config.ts)
  - adicionado plugin de build `inline-build-css`
  - no build de producao, o CSS emitido pelo Vite passa a ser injetado inline no `index.html`
  - os links `<link rel="stylesheet" ...>` gerados para CSS sao removidos do HTML final
  - efeito esperado: eliminar a solicitacao de CSS bloqueante (`assets/index-*.css`) na navegacao inicial

- Arquivo criado: [public/.htaccess](../public/.htaccess)
  - cache longo para assets estaticos versionados (css/js/woff2/svg/png/webp/jpg):
    - `Cache-Control: public, max-age=31536000, immutable`
  - html com revalidacao curta:
    - `Cache-Control: public, max-age=300, must-revalidate`
  - efeito esperado: remover diagnostico de TTL `4h` e reduzir custo em visitas repetidas

### Validacao tecnica desta etapa

- `npm run build` executado com sucesso apos as mudancas
- conferido no `dist/index.html`:
  - CSS presente inline em bloco `<style id="inlined-vite-css">...`
  - ausencia de `<link rel="stylesheet"` para `assets/index-*.css`
- conferido no `dist/`:
  - `.htaccess` copiado a partir de `public/.htaccess` para ser publicado junto no HostGator

### Observacao de deploy

- Para o ajuste de TTL surtir efeito em producao, o deploy precisa incluir o arquivo `.htaccess` na pasta publicada (`public_html/100-dias-sem-caos/`).
- Sem esse arquivo no servidor, o alerta de cache continuara apontando TTL curto definido pelo host/CDN.

### Evidencia de auditoria apos aplicar (preview local)

- Arquivo: `.lighthouse-local-mobile-after-css-inline.json`
- URL auditada: `http://localhost:4173/100-dias-sem-caos/`
- Resultado do audit `render-blocking-resources`:
  - `score: 1`
  - `numericValue: 0`
  - sem itens bloqueantes de CSS do proprio site

- Resultado do audit `uses-long-cache-ttl` nesta rodada local:
  - `score: 0.5`
  - `2 resources found`
  - itens restantes foram apenas `connect.facebook.net` (terceiros via GTM), com `max-age` curto do proprio fornecedor

Leitura tecnica:
- O alerta de CSS bloqueante foi efetivamente neutralizado no build local atual.
- O que restou de cache nesta rodada nao e do bundle proprio, e sim de terceiros (Facebook), fora de controle por `.htaccess` do dominio.

## Etapa Extra - Ataque ao alerta de LCP no subtitulo do Hero (2026-07-13)

### Plano

- Atacar diretamente a mensagem do Lighthouse em "Detalhamento da LCP", que apontou atraso de renderizacao do elemento:
  - `<p class="... animate-fade-in" style="animation-delay: 0.2s;">`
- Remover apenas a animacao com delay do subtitulo do Hero (elemento candidato a LCP no run analisado), sem alterar texto, tipografia, espacamento ou hierarchy visual.
- Validar com build de producao para garantir que a mudanca e segura e sem regressao de compilacao.

### Execucao

- Arquivo alterado: [src/components/sections/HeroSection.tsx](../src/components/sections/HeroSection.tsx)
- Mudanca aplicada no subtitulo do Hero:
  - removido `animate-fade-in`
  - removido `style={{ animationDelay: "0.2s" }}`
- Mantidos sem alteracao:
  - conteudo textual
  - classes de tamanho/cor/espacamento
  - estrutura do Hero

### Resultado

- O elemento apontado no relatorio deixa de depender de atraso de animacao para aparecer.
- Isso reduz risco de novo "Atraso na renderizacao do elemento" quando o subtitulo vira candidato de LCP em corridas especificas.
- Ajuste e estritamente de timing de pintura, sem alteracao de design final.
- Evidencia de codigo:
  - [src/components/sections/HeroSection.tsx](../src/components/sections/HeroSection.tsx)
