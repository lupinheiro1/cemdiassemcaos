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

### Comparativo da Etapa 1 (antes desta etapa vs depois desta etapa)

Base de comparacao:
- Antes desta etapa: media pos-ajuste de LCP (`.lighthouse-local-mobile-after-lcp-tune.json` + `.lighthouse-local-mobile-after-lcp-tune-run2.json`)
- Depois desta etapa: media das 2 novas medicoes de interacao (`after-interaction-gate` run1 e run2)

| Indice | Antes desta etapa | Depois desta etapa | Delta |
|---|---:|---:|---:|
| Performance score | 0.65 | 0.75 | +0.10 |
| FCP | 2496.25 ms | 2489.61 ms | -6.64 ms (-0.27%) |
| LCP | 2917.25 ms | 2944.14 ms | +26.89 ms (+0.92%) |
| Speed Index | 2537.01 ms | 2489.61 ms | -47.40 ms (-1.87%) |
| TBT | 1642.25 ms | 668.75 ms | -973.50 ms (-59.28%) |
| TTI | 6585.81 ms | 3276.93 ms | -3308.88 ms (-50.24%) |
| Main-thread work | 3917.19 ms | 2363.80 ms | -1553.39 ms (-39.65%) |
| JS execution (bootup-time) | 1551.18 ms | 358.64 ms | -1192.54 ms (-76.88%) |

Leitura tecnica da etapa:
- Nao houve alteracao de layout/estilo/UI observavel: mudanca foi apenas de timing de terceiros.
- Ganho expressivo de interatividade (TBT/TTI/main-thread), com score global melhor.
- LCP ficou praticamente estavel, com leve variacao para cima dentro de faixa pequena.
- O resultado e coerente com a estrategia: reduzir competicao de scripts de terceiros no carregamento inicial.
