# FAQ e objeções da página — mudanças pendentes de aplicar

## Contexto

Decidido numa conversa Cowork (revisão de copy/UX da página de vendas), consolidado
aqui em 01/09/2026. Nada foi aplicado no código ainda — fica para quem for
implementar.

## 1. Análise de objeções/gaps da página (framework Kevones)

Confirmado como problema real: falta de menção ao uso em computador/desktop na copy
persuasiva da página (confirmado via grep dos componentes reais — containers
`max-w-3xl`/`max-w-md`/`max-w-sm`, o app é web app responsivo de verdade, funciona em
desktop).

Descartado (Luiza corrigiu — não são objeções reais pro público): confiança na
Hotmart, dúvida sobre "acesso por 1 ano", estatísticas sem fonte.

Adiado de propósito: Política de Privacidade do site (existe uma no app; versão do
site fica pra depois, não agora).

Sem material disponível ainda: prova social nova (depoimentos de quem usa o app em
si, não o guia antigo).

Arquivos lidos nessa análise: `FAQSection.tsx`, `ObjectionsSection.tsx`,
`OfferSection.tsx`, `ComparisonSection.tsx`, `AuthorSection.tsx`,
`FinalCTASection.tsx`, `TestimonialsSection.tsx`, `StatsSection.tsx`.

Detalhes conferidos: preço R$127→R$47; garantia "7 dias, devolvemos seu dinheiro sem
perguntas"; selos (Garantia incondicional 7 dias, Acesso imediato 100% online,
Hotmart Compra Segura, Suporte direto com Luiza Pinheiro); link de Política de
Privacidade no rodapé está quebrado (`href="#"`).

## 2. Mudanças de conteúdo no FAQ da página — decididas, não aplicadas

Arquivo real: `src/components/sections/FAQSection.tsx`, array `faqs`.

Remover: "Vou precisar de muito tempo para ler?" e "Ainda tem o guia em texto, ou
agora é só o app?".

Manter as demais 5 perguntas já existentes.

Adicionar (depois de "Ajuda também no emocional?"): pergunta reforçando que o
material não substitui acompanhamento médico.

Adicionar (depois de "Preciso baixar em alguma loja de aplicativo?"): pergunta
confirmando que funciona também no computador, com o mesmo login — resolve o gap
identificado na seção 1.

Um prompt de edição já foi entregue à Luiza pra rodar num agente do VS Code (branch
nova, edição do array, atualizar JSDoc, `npm run build` + `vitest run`, sem push pra
main).

**Pendência:** confirmar se a edição foi de fato aplicada — não foi feita por Claude,
sem confirmação ainda.

## 3. Fato técnico registrado — mecânica de deploy do site

Não existe CI/CD (sem `.github/workflows/`, sem `vercel.json`/`netlify.toml`).
`npm run build` roda `scripts/build-prerender-prod.mjs`; publicar de verdade exige
rodar manualmente `scripts/deploy.mjs`. Editar arquivo local não publica sozinho —
registrado aqui pra não ser esquecido por quem só olhar o código.

## 4. Pendência de verificação separada

Confirmar se as 8 perguntas do FAQ atual da página vieram mesmo de tickets reais de
suporte, como pede o framework Kevones (bloco 9) — ainda não confirmado.
