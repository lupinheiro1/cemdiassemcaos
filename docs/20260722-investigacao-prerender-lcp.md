# Investigação: prerender (SSG) para o LCP da landing — 2026-07-22

**Status:** 🧊 **CONGELADO na branch `perf/prerender-hero`** (sem commit, sem
deploy). Prerender funciona tecnicamente; ganho de LCP **inconclusivo** em
medição local. Retomar via medição em produção real (PageSpeed) antes de
decidir deploy ou descarte.

Espelho no Einstein: `Einstein/Cemdias/Planos/20260722-investigacao-prerender-lcp.md`.

---

## Gatilho

Métrica de negócio: **>50% de quem clica no anúncio (Meta Ads) não chega a ver
a página** — LPV baixo. O `initiate_checkout` ruim é consequência disso, não
causa. LCP mobile de produção ~4,5s (medido antes via PageSpeed). Objetivo:
melhorar o LCP mesmo que a nota do Lighthouse caia (o que importa é a pessoa
ver o conteúdo, não o score).

## Diagnóstico da causa raiz (CONFIRMADO no código)

A landing é uma **SPA Vite pura**: o `index.html` servido tem só
`<div id="root"></div>`. O `<h1>` (elemento de LCP, texto) **só existe depois**
que o bundle (~95 KB gzip na rede / 236 KB parseados) baixa, parseia e o React
monta. O "render delay" de ~1,6s do Lighthouse é essencialmente *"tempo até o
React commitar"*. Nenhuma animação/fonte esconde o H1 — é puramente o bootstrap
da SPA. (Isso já estava registrado no `vite.config.ts:5-8`, do incidente do
preload de fontes.)

## Benchmark que converte: Leandro Ladeira (`vendatodosantodia.com.br`)

Verificado ao vivo (a URL `/pg-prints/` dá redirect 308 → `/pv0622`, a página
real). Achado decisivo:

| | Ladeira (`/pv0622`) | Cem Dias |
| --- | --- | --- |
| Framework | **Next.js (SSR)** | Vite SPA |
| H1 no HTML servido | **Sim** (vem pronto) | **Não** (só após JS) |
| HTML | 370 KB, todo o conteúdo renderizado | ~vazio (#root) |
| Borda | Cloudflare + CloudFront | Cloudflare (só) |
| Lighthouse | 64 | 73 |
| LCP | **~2s** | ~4,5s |

**Prova o argumento:** Ladeira tem Lighthouse *pior* e LCP **2x melhor** porque
serve o texto pronto no HTML. A nota baixa dele vem de JS de tracking/hidratação
*depois* da dobra, que não afeta o LCP. É exatamente a estratégia desejada.

## Infra real do Cem Dias (CORRIGIDO nesta sessão)

O que a memória `cemdias-maternologia-deploy-cpanel` supunha (HostGator único)
estava incompleto:

- **Borda = Cloudflare** (`Server: cloudflare`, `CF-RAY`, IPs `104.21.x`).
  HostGator é só a origem; deploy continua SCP.
- **TTFB do Brasil ~0,3s** — ótimo, não é problema.
- **HTML sai em Brotli** (68 KB → 12,7 KB). ✅
- ⚠️ **JS bundle sai em gzip, não Brotli** (236 KB → 95 KB; Brotli daria ~78 KB).
  Ligar Brotli/Compression Rule no painel Cloudflare = **ganho de risco zero
  pendente** (não feito — depende de acesso ao painel).

## Solução implementada (branch `perf/prerender-hero`)

Prerender manual pós-build, escolhido em vez de `vite-react-ssg` ou islands por
ser a **menor pegada** pro contexto solo (nenhuma dependência de runtime nova):

- `scripts/prerender.mjs` — esbuild empacota a árvore num bundle CJS
  auto-contido (evita conflito ESM×CJS do `lucide-react`), renderiza `<Index/>`
  com `renderToString` e injeta o HTML dentro do `#root` do `dist/index.html`.
- `scripts/prerender-entry.tsx` — renderiza `<Index/>` (NÃO `<App/>`: o `App`
  usa `<BrowserRouter>`, que acessa `document` e quebra em Node; `Index` não usa
  router, e o HTML da rota "/" é idêntico).
- `src/main.tsx` — `hydrateRoot` quando o `#root` tem conteúdo (produção
  pré-renderizada), `createRoot` como fallback (dev/prerender ausente).
- `package.json` — `build` = `vite build && node scripts/prerender.mjs`.
- 2× `fetchPriority` → `fetchpriority` (lowercase, HTML válido) em
  Testimonials/Author — elimina mismatch de hidratação.
- `.gitignore` — artefatos de medição.

**Fatos verificados:** H1 no HTML servido ✅ · hidratação sem warnings ✅ · CTA
preserva UTMs (guard `typeof window` já existia) ✅ · bundle do cliente NÃO
cresceu (74,8 KB gzip) ✅ · TypeScript passa ✅ · 1 `<h1>`, 15 `<section>` ✅.

**Descoberta útil:** só o **FAQ** precisa de JS (accordion Radix). As outras 14
seções são HTML estático puro; todos os CTAs são `<a href>` (funcionam sem JS).

## Medições (o ponto crítico — leia com atenção)

Máquina local **saturada** (TBT de baseline ~2800ms vs ~340ms esperado em prod
→ há CPU concorrente inflando tudo). `vite preview` + Lighthouse mobile
`simulate`, mediana de 3 runs:

| Métrica | Baseline (SPA) | Prerender (SSG) | Delta |
| --- | --- | --- | --- |
| **LCP** | 3,08s | 3,36s | 🔴 +0,28s (dentro do ruído) |
| FCP | 2,45s | 2,61s | 🔴 +0,16s |
| **TBT** | 2803ms | 1834ms | 🟢 **−969ms** |
| Speed Index | 2,78s | 2,61s | 🟢 −0,17s |
| CLS | 0,060 | 0,055 | ≈ |

- 1ª medição (única run, ruidosa) deu LCP prerender 2,9s → **retirada**, não
  confiável.
- **Ganho de LCP INCONCLUSIVO localmente.** As duas medições divergem 0,46s =
  ruído dominando. A máquina não tem resolução pra provar o ganho.
- **TBT melhora de forma consistente** (as duas medições concordam). Plausível:
  hidratar (anexar listeners a nós existentes) < montar (criar 578 nós do zero).

## Balanço honesto

- ✅ Prerender **funciona** e o TBT melhora — fatos.
- ❓ Ganho de **LCP não comprovado**. Teoria + benchmark Ladeira dizem que
  deveria ajudar, mas medição local não confirma.
- ⚠️ **Custo de manutenção:** script de build próprio (esbuild + renderToString)
  a manter; quebra se alguma seção passar a usar `window`/`useEffect` sem guard.
  Superfície nova pra um projeto solo. Se o ganho real for pequeno, **pode não
  valer** — reverter é decisão legítima.

## Próximo passo (quando retomar)

**Único jeito de número confiável = produção real.** Deploy paralelo numa URL de
teste (ex: `/100-dias-sem-caos-preview/`) sem tocar na landing no ar → PageSpeed
real (Cloudflare + CPU de celular real, sem o ruído local) contra a produção
atual. Se o LCP cair de fato → mergear + deploy. Se não → reverter a branch.

---

## RESULTADO — 2026-07-23: ganho CONFIRMADO em produção real

Preview subiu em `/100-dias-sem-caos-prerender/` (com `noindex,nofollow`).
PageSpeed oficial rodado nas duas URLs **no mesmo minuto** (21:18 BRT),
Moto G Power emulado, 4G lenta, Lighthouse 13.4.0:

| Métrica | Produção (SPA) | Prerender | Δ |
| --- | --- | --- | --- |
| **LCP** | 3,4 s | **2,1 s** | **−1,3 s** ✅ |
| FCP | 2,6 s | 2,1 s | −0,5 s ✅ |
| TBT | 450 ms | 400 ms | −50 ms ✅ |
| Speed Index | 2,8 s | 2,6 s | −0,2 s ✅ |
| Score perf | 76 | 83 | +7 ✅ |
| **CLS** | 0,006 | **0,124** | **+0,118** ⚠️ REGRESSÃO |
| SEO | 100 | 66 | artefato do `noindex` da preview, não do prerender |

**O ganho de LCP é real** — o inconclusivo de 22/07 era limitação da máquina
local, não ausência de efeito. Confirma a hipótese do benchmark Ladeira.

## Bloqueador antes do merge: CLS 0,006 → 0,124

CLS mede "pulo" de layout. 0,124 **estoura o limiar de bom do Core Web Vitals
(0,1)** e é 20x pior que a produção atual. Causa provável: o HTML pré-renderizado
pinta o texto imediatamente, e as imagens (sem `width`/`height` explícitos —
diagnóstico "Os elementos de imagem não têm width e height explícitas" aparece
nos DOIS relatórios) empurram o conteúdo quando chegam. Na SPA isso não aparecia
porque nada era pintado antes do JS terminar.

**Não mergear sem resolver.** Fix provável = `width`/`height` (ou `aspect-ratio`)
nas imagens acima da dobra. Barato e melhora as duas versões.

## Correção do CLS — 2026-07-23 (parcial, NÃO fechada)

**Causa real (Lighthouse `layout-shifts`):** não eram as imagens — era a **troca
de fonte**. Com `font-display: swap`, o `<h1>` pinta em system-ui e reflui quando
`inter-latin-*` chega. É a sombra do próprio ganho: na SPA não acontecia porque
nada pintava antes das fontes.

**Fix aplicado:** `@font-face` de fallback com métricas sobrescritas
(`src/index.css`) + registro no `tailwind.config.ts`. Métricas extraídas dos
`.woff` em `node_modules/@fontsource` (tabelas head/hhea), não estimadas:
Inter `96.88%/24.12%`, Playfair `108.20%/25.10%`. `size-adjust` deixado em 100%
de propósito (largura correta depende da fonte local do SO).

### ⚠️ A 1ª preview media uma MISTURA — resultado comprometido

`vite.config.ts` tinha `base` fixo em `/100-dias-sem-caos/`, então o HTML da
preview apontava JS/fontes para a **produção**. Media HTML novo + assets antigos.
Por isso o fix de fonte "não surtiu efeito" na 1ª tentativa.

**Correção:** `base` agora aceita `VITE_BASE`. Build da preview:
`$env:VITE_BASE='/100-dias-sem-caos-prerender1/'; npm run build` (PowerShell — no
Git Bash o path vira `/Program Files/Git/...`).

Nova pasta isolada: `/100-dias-sem-caos-prerender1/` (a `-prerender` é da Luiza,
não mexer). `.htaccess` com `X-Robots-Tag: noindex` — mais robusto que meta tag,
que o build sobrescreve.

### Resultado: melhorou, mas ainda não passa

6 medições de CLS na prerender1: `0.108 / 0.057 / 0.059 / 0.099 / 0.054 / 0.108`
→ mediana **0.079** (antes 0.099). LCP preservado (~2,3-2,6s).

**Ainda estoura 0.1 em 2 de 6 rodadas.** Melhor, não resolvido. Hipótese para
retomar: sobram 7 arquivos de fonte (Inter 400/500/600/700 + Playfair 400/600/700)
e o fallback só cobre o peso regular — os pesos bold do `<h1>` (`font-extrabold`)
podem ter métricas diferentes o bastante para reflow. Testar `ascent/descent`
por peso, ou `font-display: optional` no h1 (não troca depois de pintado).

**NÃO mergear enquanto o CLS não ficar consistentemente < 0.1.**

### Histórico completo das 4 tentativas de CLS (23/07) — todas registradas

Nenhuma resolveu. Registrado para não repetir:

| # | Tentativa | Resultado | Status |
| --- | --- | --- | --- |
| 1 | `@font-face` fallback com métricas sobrescritas (Inter/Playfair) | mediana 0,099 → 0,079 | **mantida** (ajuda, não fecha) |
| 2 | Carregar Inter **800** real (o `<h1>` é `font-extrabold`) | 0,099 → 0,091, instável | **revertida** (+24 KB sem ganho) |
| 3 | `font-display: optional` via `@font-face` sem `src` | **não funcionou** | **revertida** |
| 4 | Corrigir proporção do logo (360×144 → 360×240) | valia 0,004 de 0,098 | **mantida** (erro real no código) |

**Por que a nº 2 falhou:** métricas extraídas dos `.woff` mostram que Inter
400/700/800 têm **ascent/descent idênticos** (96,88% / 24,12%). A altura de linha
nunca foi o problema do H1 — a hipótese de "peso sintético mais largo" não se
sustentou na medição.

**Por que a nº 3 falhou:** um `@font-face` sem `src` **não sobrescreve** um
`@font-face` existente — cria uma declaração nova e inerte. Cada `@font-face` é
independente, não há herança. Confirmado no build: 7 blocos seguiram em `swap` e
2 blocos novos e inúteis em `optional`.

**Causa raiz real (medida, não suposta):** o Lighthouse lista o `<h1>` refluindo
a cada fonte que chega — `inter-400`, `inter-500`, `inter-800`... Não é um pulo
único: são **8 arquivos de fonte com `font-display: swap`**, cada um autorizado a
trocar a qualquer momento após a pintura. Na SPA isso não aparecia porque nada
era pintado antes das fontes carregarem.

**A única correção que resolveria:** substituir os imports do `@fontsource` por
`@font-face` próprios com `font-display: optional`. **Muda a aparência** — em
rede lenta a Hero fica na fonte de fallback. Decisão de produto, não técnica.

### Corte de pesos de fonte: investigado e DESCARTADO

Hipótese: reduzir os 7 pesos carregados para 5, diminuindo a fila que causa
reflow. **Verificado no código — todos os 7 estão em uso:**

| Peso | Uso real |
| --- | --- |
| Playfair 400 | **4× implícito** (`<th>` de ComparisonSection, AccordionTrigger do FAQ) |
| Playfair 600 | 5× `font-semibold` (títulos de seção) |
| Playfair 700 | 18× `font-bold` |
| Inter 400/500/600/700 | corpo, botões, destaques |

Cortar qualquer um **mudaria a aparência**. Descartado.

**Inconsistência pré-existente encontrada:** há **10 usos de `font-light`**
(peso 300) e o peso 300 **nunca foi carregado** — nem hoje em produção. O
navegador sintetiza. Não é regressão do prerender; é dívida anterior.

## 🛑 BLOQUEADOR DESCOBERTO EM 23/07 — CTA sem UTM antes da hidratação

**Este é o motivo pelo qual o prerender NÃO subiu para produção em 23/07**, mesmo
com o ganho de LCP confirmado.

### O que acontece

No HTML pré-renderizado, o CTA já é um `<a href>` **completo e clicável** na
primeira pintura:

```html
<a href="https://pay.hotmart.com/E104054938B?checkoutMode=10" target="_blank" ...>
```

Sem `utm_source`, sem `utm_campaign`, sem `fbclid`. Os parâmetros de campanha só
entram quando o bundle hidrata e `checkoutUrl.ts` lê `window.location.search`.

Verificado em produção com query real:

```bash
curl -s "https://maternologia.com.br/100-dias-sem-caos-prerender1/?utm_source=facebook&fbclid=ABC123" \
  | grep -oE 'href="https://pay\.hotmart[^"]*"'
# → href="https://pay.hotmart.com/E104054938B?checkoutMode=10"   (sem UTM)
```

### Tamanho da janela de risco

Bundle de ~236 KB → **~1,3 s só de download em 4G lenta**, mais parse e execução.
Durante essa janela o botão está clicável e leva ao checkout **sem atribuição**.

**A landing atual (SPA) não tem esse problema**: o CTA nem existe no HTML, só
aparece depois do JS, portanto já nasce com os parâmetros. O prerender *criou*
essa janela — e o ganho de LCP, ao pintar mais cedo, a torna mais exposta.

### Consequência de negócio

Clique nessa janela = venda na Hotmart sem saber de qual anúncio veio. Como o
objetivo do projeto é justamente atribuição de campanha Meta (LPV → checkout),
subir assim trocaria um problema de performance por um de rastreamento — o mesmo
tipo de erro do incidente de 13/07 (defer de GTM zerou InitiateCheckout).

### Correção necessária antes de qualquer merge

O primeiro render precisa ser determinístico E carregar os parâmetros. Opções:

1. **Script inline no `<head>`** (antes do bundle) que lê `location.search` e
   reescreve os `href` de `pay.hotmart.com`. Executa em ~1 ms, fecha a janela
   quase por completo. É o que o relatório da Luiza descreve como "UTMs antes da
   hidratação" — mas **essa parte não estava implementada no build dela**
   (verificado: só há 1 script inline, o do GTM; a lógica está no bundle).
2. Renderizar o CTA sem `href` e adicioná-lo na hidratação — pior: quebra o
   fallback sem-JS e muda comportamento.

Opção 1 é a recomendada.

## Pendências independentes

1. **Brotli no JS via Cloudflare** — NÃO feito. Conta é própria (NS
   `suzanne`/`sergi.ns.cloudflare.com`), painel em dash.cloudflare.com, não no
   cPanel. Caminho: **Rules → Compression Rules → Create rule → All incoming
   requests → Enable Brotli and Gzip compression**.

   **Confirmado em 23/07 que a regra é necessária:** pedindo só `br` a Cloudflare
   entrega Brotli; pedindo `br, gzip` (o que todo navegador real envia) ela
   entrega **gzip**. Ou seja, hoje 100% dos visitantes recebem gzip.
   Medido: 94.925 B (gzip) → 75.329 B (br) = **19,6 KB / 20,6% / ~105 ms em 4G**.

   ⚠️ Não ligar **Rocket Loader** nem **Auto Minify** — reprocessam o JS e podem
   quebrar hidratação e rastreamento.

2. **Sub-medição de pixel** vs abandono real — segue sem investigação. O relatório
   da Luiza mediu o beacon do Pixel em **2,07 s na prerender vs 1,91 s na atual**.
   Se confirmado, o prerender ganharia LCP e **perderia LPV** — o oposto do
   objetivo. Precisa ser medido antes de decidir o merge.

## Ver também
- `docs/20260712-plano-performance-lighthouse.md` — origem do defer de fontes/GTM
- `docs/20260713-lighthouse-fontes.md`
- `Einstein/Cemdias/Planos/20260715-diagnostico-tracking-meta-ads-hotmart.md` — o incidente do GTM/LPV

---

## Verificação da produção — 2026-07-23, 22:35 BRT

Executada **depois** de todo o trabalho do dia, para provar que a landing com
campanha ativa não foi tocada. Comandos e saídas reais:

| # | Verificação | Resultado |
| --- | --- | --- |
| 1 | `curl -sI` da produção | `HTTP/1.1 200 OK` ✅ |
| 2 | `<div id="root"></div>` presente | **1 ocorrência** → segue SPA, NÃO pré-renderizada ✅ |
| 3 | Container GTM | `GTM-5MLMK2BS`, `dataLayer` 2× ✅ |
| 4 | `X-Robots-Tag` | ausente → indexável, como deve ser ✅ |
| 5 | Bundle JS | `index-Cq5TkMCp.js` → `200 OK` ✅ |
| 6 | `Last-Modified` | **Wed, 22 Jul 2026 04:48:49 GMT** — anterior a hoje ✅ |

O item 6 é a prova objetiva: o arquivo em produção é o mesmo de 22/07. Nenhum
deploy de hoje o alcançou.

### O que foi publicado hoje (e onde)

| Pasta no cPanel | Conteúdo | Indexável |
| --- | --- | --- |
| `/100-dias-sem-caos/` | **produção, intocada** (SPA de 22/07) | sim |
| `/100-dias-sem-caos-prerender/` | preview da Luiza | `noindex` (meta) |
| `/100-dias-sem-caos-prerender1/` | preview desta sessão (prerender + logo + fallback) | `noindex` (`.htaccess`) |

⚠️ A pasta `-prerender` (da Luiza) foi sobrescrita às **21:28 de 23/07** por um
build desta sessão, antes de eu saber que era dela. O conteúdo segue sendo o
prerender e a página funciona, mas medições feitas nela após esse horário são de
outro build. O `.htaccess` dela também ganhou `X-Robots-Tag: noindex` (proteção
que faltava — a meta tag some a cada redeploy).

### Estado do repositório

- Branch: `perf/prerender-hero`
- Commit: `296cd79`
- Tag: `cemdias-prerender-20260723`
- `npm run build` → **SPA de produção** (comportamento restaurado nesta sessão;
  estava gerando prerender por engano, o que faria qualquer deploy futuro subir
  a versão bloqueada sem querer)
- `npm run build:prerender` → versão de teste
- `VITE_BASE=/pasta/` → sobrescreve a base para pastas de teste isoladas

---

## DESFECHO — 2026-07-23/24: build da Luiza vence; alterações do Claude revertidas

Medição final das TRÊS URLs, alternadas, medianas de 3 rodadas (Lighthouse
local — direção consistente entre rodadas):

| | LCP | FCP | CLS | TBT | Score |
| --- | --- | --- | --- | --- | --- |
| Produção (SPA) | 2,69s | 2,26s | 0,063 | 2103ms | 65 |
| **Prerender (Luiza, build original)** | **1,83s** | **1,56s** | 0,110 | 1674ms | **69** |
| Prerender1 (Claude: +fallback fonte, +logo 240) | 2,95s | 2,65s | 0,056 | 1681ms | 61 |

**Conclusão dura:** o build ORIGINAL da Luiza tem o melhor LCP/FCP — a métrica
que importa pro objetivo (abandono antes da página abrir). As alterações do
Claude (fallback de fonte + logo), feitas para melhorar CLS, **pioraram o LCP**
abaixo até da produção. Otimizou-se a métrica secundária às custas da principal.

**Decisões executadas:**
1. `/100-dias-sem-caos-prerender1/` **apagada** do cPanel.
2. Pasta `/100-dias-sem-caos-prerender/` **restaurada** com o build original da
   Luiza a partir de `D:\Dropbox\Marcelo\dist-prerender\` (cópia intacta;
   verificado bundle `index-vAd-sVqh.js`, logo 144, sem fallback, meta noindex).
3. Branch `perf/prerender-hero` **resetada** para `9e05887` (= main = produção);
   commits `296cd79`/`64a8ae5` e a tag `cemdias-prerender-20260723` descartados.
   Este doc é preservado e o build da Luiza entra versionado em
   `deploy/100-dias-sem-caos-prerender/` (o fonte dela está só na máquina dela;
   o artefato é a única cópia reproduzível do candidato vencedor).

**O que segue válido de tudo que foi aprendido:**
- Ganho de LCP do prerender: confirmado (PageSpeed oficial + Lighthouse local).
- 🛑 Bloqueador do CTA sem UTM (~1,3s): vale para QUALQUER build de prerender,
  incluindo o da Luiza — é propriedade da técnica, não do build. Fix = script
  inline no `<head>` reescrevendo os hrefs antes do bundle.
- CLS ~0,10-0,11 na versão da Luiza: real, mas secundário; não gastar de novo
  horas nele antes de resolver o UTM e medir LPV real.
- 4 tentativas de CLS documentadas acima: nenhuma funcionou; não repetir.

---

## Correção do CTA sem UTM — APLICADA e VALIDADA (2026-07-24)

Bloqueador nº 1 resolvido. `scripts/inject-utm-bootstrap.mjs` injeta, no fim do
`<body>` (depois dos `<a>`, antes do bundle deferido), um script inline síncrono
de **442 bytes** que replica `buildCheckoutUrl()` e reescreve os `href` de
`pay.hotmart.com` com os parâmetros da URL da visitante. Executa em ~1 ms, contra
os ~1,3 s que o bundle levava.

### Paridade com o React (7/7 casos)

O script produz **exatamente** a mesma URL que `src/lib/checkoutUrl.ts` — testado
caso a caso (url limpa, Meta completo, Google Ads, utm_content/term, parâmetro não
rastreado, só fbclid, todos os 7 juntos). Isso garante que a hidratação não gere
mismatch: o React recalcula e encontra o mesmo valor.

### Validação em navegador real (Chrome headless via CDP)

URL testada: `?utm_source=facebook&utm_medium=cpc&utm_campaign=jul26&fbclid=IwAR999`

| Verificação | Resultado |
| --- | --- |
| CTAs no DOM | 7 |
| Todos com `utm_source` + `fbclid` | ✅ |
| Link final | `...checkoutMode=10&utm_source=facebook&utm_medium=cpc&utm_campaign=jul26&fbclid=IwAR999` |
| `checkoutMode=10` preservado | ✅ |
| URL limpa → link idêntico ao original | ✅ |
| FAQ (Radix) hidratado | ✅ `data-state="closed"` nos 3 primeiros |
| Erros de hidratação | nenhum |

Publicado em `/100-dias-sem-caos-prerender/` (só o `index.html`; assets inalterados).

## ⚠️ ACHADO CRÍTICO: `/obrigado/` não sai do build

A produção tem `public_html/100-dias-sem-caos/obrigado/` — página de conversão,
com GTM próprio (`GTM-5MLMK2BS`), **deploy separado que não é gerado pelo build da
landing** e não está no repositório.

**Qualquer deploy que substitua a pasta `100-dias-sem-caos/` inteira APAGA a
página de obrigado.** O deploy precisa ser cirúrgico (só `index.html` + `assets/`)
ou refazer `obrigado/` depois.

Backup completo da produção (2,6 MB, incluindo `obrigado/`) versionado em
`deploy/100-dias-sem-caos-PRODUCAO-backup-20260724/`.

## Estado dos bloqueadores para produção

| # | Bloqueador | Status |
| --- | --- | --- |
| 1 | CTA sem UTM (~1,3 s) | ✅ **RESOLVIDO** e validado em browser |
| 2 | `/obrigado/` sumir no deploy | ⚠️ mapeado — exige deploy cirúrgico |
| 3 | CLS ~0,11 | 🟡 aberto (aceitável: limiar é 0,1; 4 tentativas falharam) |
| 4 | Beacon do Pixel 2,07s vs 1,91s | 🔴 **não medido** — decisivo para LPV |
| 5 | Brotli no JS (Cloudflare) | 🔴 pendente (painel, ~105 ms) |

O nº 4 é o único que ainda pode inverter a decisão: se o Pixel disparar mais tarde
no prerender, ganha-se LCP e perde-se LPV — o oposto do objetivo.

---

# 🚀 PRERENDER EM PRODUÇÃO — 2026-07-23, 23:50 BRT

**A landing `/100-dias-sem-caos/` agora é pré-renderizada.** Medição oficial
(PageSpeed, Moto G Power emulado, 4G lenta), antes às 23:28 e depois às 23:52:

| Métrica | Antes | Depois | Δ |
| --- | --- | --- | --- |
| **Desempenho** | 77 | **92** | +15 |
| **LCP** | 4,6 s | **2,3 s** | **−2,3 s (−50%)** |
| FCP | 2,6 s | 2,1 s | −0,5 s |
| Speed Index | 2,6 s | 2,1 s | −0,5 s |
| TBT | 200 ms | 110 ms | −90 ms |
| **CLS** | 0,004 | **0,112** | +0,108 ⚠️ |
| SEO | 100 | 100 | mantido |

O CLS é o custo aceito: o texto pinta cedo e as 7 fontes (`font-display: swap`)
reposicionam quando chegam. Trocar 2,3 s de tela branca por 0,108 de CLS foi
decisão consciente.

## Arquitetura final (a da Luiza, não a minha)

O build de produção sai de `scripts/build-prerender-prod.mjs`, que reusa o
pipeline dela (`build-prerender.mjs`) trocando três coisas:

| | Preview (Luiza) | Produção (este) |
| --- | --- | --- |
| base | `/100-dias-sem-caos-prerender/` | `/100-dias-sem-caos/` |
| outDir | `dist-prerender` | `dist-prerender-prod` |
| meta robots | injeta `noindex` | **remove** (senão sai do Google) |
| bootstrap UTM | — | injeta script inline |

Vite gera cliente + SSR, então SVG/WebP/fontes usam as MESMAS URLs versionadas
nos dois lados. `src/main.tsx` (SPA) segue intocado: `npm run build` continua
produzindo a versão antiga.

O script **aborta** se: root não encontrado, H1 ausente, texto da Hero ausente,
asset sem URL, base errada, sobra de caminho preview, `noindex` presente, GTM
ausente ou menos de 7 CTAs.

## Comandos

```bash
npm run build     # gera a produção  -> dist-prerender-prod/
npm run deploy    # publica no cPanel + valida o site no ar
```

São esses dois. `npm run build` gera exatamente o que vai para produção — não há
comando "especial" para o deploy real. Os demais são acessórios:

```bash
npm run build:preview  # pasta de teste /100-dias-sem-caos-prerender/
npm run build:spa      # SPA antiga, sem prerender (referência/rollback)
```

`npm run deploy` envia **apenas** `index.html` + `assets/` — nunca a pasta
inteira, porque `obrigado/` (página de conversão) tem deploy próprio e seria
apagada. O script confere `obrigado/` antes e depois, valida H1/GTM/CTAs/noindex
no build, e testa o site no ar (inclusive se o bundle voltou como JavaScript, para
pegar 404 cacheado na Cloudflare). Aborta em qualquer divergência.

## Rollback

```bash
scp -r deploy/100-dias-sem-caos-PRODUCAO-backup-20260724/* \
  mate6679@108.179.252.173:/home2/mate6679/public_html/100-dias-sem-caos/
```

---

# 🔴 ERROS COMETIDOS NESTA SESSÃO (registro honesto)

Sete erros, o que fizeram e como evitar. Escrito para não se repetirem.

## 1. Confiar no Lighthouse local — o erro que custou o dia

Rodei dezenas de medições locais. Elas **se contradiziam**: às 22h deram
prerender 1,83 s × produção 2,69 s; às 23h deram prerender 4,86 s × produção
2,40 s. Mesmas URLs, minutos de diferença.

A máquina roda VSCode, Dropbox, Chrome e o próprio Chrome do Lighthouse. Mede-se
a saturação da máquina, não o site. O PageSpeed do Google (servidor limpo) deu
o número real e estável.

**Regra:** nesta máquina, Lighthouse local **não decide nada**. Só PageSpeed.
Isso já estava escrito na medição de 22/07 e eu ignorei o dia inteiro.

## 2. Empilhar "correções" sem medir cada uma

Adicionei fallback de fonte, peso 800, `font-display: optional` e logo 240 —
todas para corrigir CLS. Medindo no fim: meu build ficou **pior que a produção**
(LCP 2,95 s × 2,69 s). Otimizei a métrica secundária degradando a principal.

**Regra:** uma mudança, uma medição. Se não melhora, reverte na hora.

## 3. Sobrescrever a pasta da Luiza

Às 21:28 publiquei meu build em `/100-dias-sem-caos-prerender/` sem verificar de
quem era. Restaurado depois a partir de `D:\Dropbox\Marcelo\dist-prerender`.

**Regra:** `ls -la` na pasta remota antes de escrever. Data recente = alguém
mexeu; perguntar antes.

## 4. Afirmar sobre React sem ver o package.json

Disse que `fetchpriority` minúsculo era regressão, citando regra do React 19. O
projeto usa **React 18**, onde o minúsculo é o correto. Quase reverti uma
correção legítima. → memória `cemdias-stack-react18-nao-19`.

## 5. Afirmar que o relatório da Luiza "exagerava" sobre UTM

Disse que o enriquecimento de UTM antes da hidratação "não estava implementado".
Estava — em `src/prerender-client.tsx`, linhas 27-31. Procurei no HTML e concluí
errado. Meu bootstrap inline complementa (fecha a janela pré-bundle), não conserta.

## 6. `npm run build` passou a gerar prerender

Deixei o `package.json` com prerender no script `build` padrão. Qualquer deploy
futuro subiria a versão bloqueada sem querer. Corrigido: `build` = SPA,
`build:prerender*` = prerender.

## 7. Envenenar o cache da Cloudflare no meio do deploy

Testei numa pasta `-VALIDACAO` cujo HTML apontava para `/100-dias-sem-caos/assets/`.
Os arquivos ainda não existiam lá → 404. A Cloudflare cacheou o 404 por 4 h
(`max-age=14400`). No deploy real, o JS voltava `Content-Type: text/html` com
2.305 bytes (página de erro) — **site quebrado**.

Plano Free não tem purge por API disponível aqui. Resolvido **renomeando** o
bundle (`index-Ga1-Pe-Q.js` → `-v2.js`): nome novo, cache limpo.

**Regra:** nunca criar pasta de teste cujo HTML aponte para caminhos de produção
inexistentes. Ou a pasta é autocontida, ou não se testa assim.

**Resíduo:** `assets/index-Ga1-Pe-Q.js` (órfão, 219 KB) pode ser removido depois.

---

# ✅ ACHADOS PRESERVADOS

## `/obrigado/` não sai do build

`public_html/100-dias-sem-caos/obrigado/` é **deploy separado**, com GTM próprio,
fora do repositório e do build. **Deploy que substitua a pasta inteira a apaga** —
é a página de conversão. Backup em `deploy/100-dias-sem-caos-PRODUCAO-backup-20260724/`.

## Brotli: indisponível no plano Free — ENCERRADO

Confirmado no painel (Speed → Content Optimization): não há controle de Brotli;
Compression Rules é recurso pago. Medido: valeria ~19,6 KB / ~105 ms. Contra os
2.300 ms do prerender, **não justifica upgrade**. Assunto fechado.

⚠️ **Nunca ligar, no mesmo painel:**
- **Rocket Loader** — reordena JS, quebraria hidratação e provavelmente GTM/Pixel.
- **Cloudflare Fonts** — reescreve carregamento de fontes, que é a origem do CLS.

## Causa do CLS (medida, não suposta)

Lighthouse `layout-shifts` aponta o `<h1>` refluindo **a cada fonte que chega**
(inter-400, 500, 800...). São 8 arquivos com `font-display: swap`, cada um podendo
trocar após a pintura. 4 tentativas de correção falharam (tabela acima). A única
que resolveria — `font-display: optional` com `@font-face` próprios — **muda a
aparência** em rede lenta. Decisão de produto.

## Pixel: não é possível medir em headless

O Meta Pixel detecta Chrome headless e recusa disparar PageView
(`[Meta pixel] Bot traffic` no log). A comparação de beacon 2,07 s × 1,91 s do
relatório anterior é, portanto, **inconclusiva** — não foi medida em tráfego real.
O timing de `fbevents.js` (o que dá para medir) melhorou no prerender.

# 📌 PRÓXIMO PASSO — o único que importa

**Medir LPV real no Meta em 2-3 dias.** É o objetivo do projeto e nenhum
Lighthouse ou PageSpeed responde. Se o LPV não subir com LCP na metade, o gargalo
está em outro lugar (ex.: sub-medição de pixel, hipótese nunca investigada).

---

## Limpeza pós-deploy — 2026-07-24

**Pastas de teste removidas do cPanel.** Sobrou apenas `/100-dias-sem-caos/`.

### Cache envenenado voltou — e agora o deploy se cura sozinho

Ao remover a gambiarra `-v2.js` (do incidente de ontem), o bundle voltou ao nome
original — que a Cloudflare ainda tinha cacheado como 404. O site quebrou de novo
para visitantes reais, **e minha validação não pegou**: ela testava com
`?cb=` (cache-buster), que ignora justamente o cache que estava envenenado.

Corrigido em `scripts/deploy.mjs`: a verificação agora usa a URL **exata** que o
visitante pede e, se detectar `text/html` no lugar do bundle, **renomeia o arquivo
no servidor, reescreve o HTML e republica automaticamente**. Testado: detectou e
se curou sozinho (`index-Ga1-Pe-Q-cm9j.js`).

Lição: validação com cache-buster não prova nada sobre cache. Sempre testar como
o visitante real pede.

### 404 para as URLs de teste removidas

Após apagar as pastas, as URLs ainda devolviam **200** — o fallback de SPA da raiz
(`RewriteRule . /index.html`) servia o site da Maternologia **sem noindex**:
conteúdo duplicado aos olhos do Google numa URL que não existe mais.

Adicionada regra em `public_html/.htaccess` (backup em `.htaccess.bak-20260724`),
acima do fallback:

```apache
RewriteRule ^100-dias-sem-caos-prerender - [R=404,L]
```

Verificado após aplicar: `-prerender` e `-prerender1` → 404; produção,
`/obrigado/`, site da Maternologia, redirect `/cemdiassemcaos` (301) e redirect
WhatsApp (302) → todos intactos.
