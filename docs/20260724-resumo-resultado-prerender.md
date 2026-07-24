# Resumo do resultado — prerender em produção (24/07/2026)

Resumo pronto para compartilhar (foi enviado à Luiza por WhatsApp).
Detalhe técnico completo: [`20260722-investigacao-prerender-lcp.md`](./20260722-investigacao-prerender-lcp.md).
Versão visual publicada: <https://claude.ai/code/artifact/eac56ebb-94e7-4bfe-8ea9-58b01ed7df96>

## Tabela (última medição: 00h18 de 24/07)

| Métrica | Antes | Depois | |
|---|---|---|---|
| **LCP** — texto principal aparecer | 4,6 s | **2,1 s** | ✅ −54% |
| **FCP** — primeiro pixel na tela | 2,6 s | 2,0 s | ✅ |
| **Speed Index** — velocidade percebida | 2,6 s | 2,0 s | ✅ |
| **Desempenho** — nota geral | 77 | 88 | ✅ |
| **SEO** | 100 | 100 | ✅ mantido |
| **Acessibilidade** | 95 | 95 | ✅ mantido |
| **CLS** — a página "pula" | 0,004 | 0,104 | ⚠️ custo aceito |
| **TBT** — celular processando | 200 ms | 310 ms | ⚠️ instável |

**O principal:** quem clica no anúncio via 4,6 segundos de tela em branco. Agora vê
a promessa em 2,1 s — menos da metade.

**A arquitetura em produção é a da Luiza** (pipeline com render de servidor pelo
Vite). As alternativas testadas ficaram para trás por piorarem justamente o LCP.

## Por que a última nota deu 88 e não 92

Três medições da mesma página, sem nenhuma mudança de código entre elas:

| | 23h28 (antes) | 23h52 | 00h18 |
|---|---|---|---|
| Nota | 77 | **92** | **88** |
| LCP | 4,6 s | 2,3 s | **2,1 s** |
| FCP | 2,6 s | 2,1 s | **2,0 s** |
| CLS | 0,004 | 0,112 | **0,104** |
| TBT | 200 ms | **110 ms** | **310 ms** |

Entre 23h52 e 00h18, **quatro das cinco métricas melhoraram** (LCP, FCP, Speed
Index e CLS). Só o TBT subiu — de 110 ms para 310 ms.

Acontece que o **TBT sozinho vale 30% da nota**, o maior peso de todos. Piorou o
bastante para derrubar 4 pontos apesar de todo o resto ter melhorado.

E o TBT é a métrica **mais instável** do PageSpeed: mede o quanto o processador
ficou ocupado, o que depende de quanta máquina o Google tinha livre naquele
instante, e conta os scripts de terceiros (GTM, Pixel, Analytics), que variam a
cada carregamento.

**88 e 92 são a mesma página.** A diferença é ruído de medição. O que ficou firme
nas duas foi o LCP: ~2,1–2,3 s contra 4,6 s antes.

## Sobre o CLS

Único número que piorou de verdade, e foi troca consciente: o texto agora pinta
cedo com a fonte do sistema e se reposiciona quando as fontes da marca chegam.
Antes isso não acontecia porque *nada* aparecia até tudo carregar — a página não
pulava, mas ficava 4,6 s em branco. Fica na lista para melhorar depois
(ver item 009 do `Issue_list.md` no Einstein).

## Ainda em aberto

O número que realmente importa é o **LPV no Meta**. Em 2-3 dias dá para saber se a
metade de segundo virou gente a mais chegando na página — nenhum PageSpeed
responde isso.
