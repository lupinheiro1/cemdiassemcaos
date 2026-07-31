# Decisões de implementação

Este arquivo registra interpretações conservadoras que não alteram o texto
editorial aprovado.

## D-001 - Fonte canônica preservada byte a byte

`content/content.md` é uma cópia exata do Markdown aprovado. A sintaxe escapada
da exportação (`* \[ ]`, `\---`, sublinhados e negrito escapado) é traduzida
somente em memória. Isso permite comprovar o SHA-256 original e evita mudanças
editoriais acidentais.

## D-002 - Ambiguidades viram controles menos restritivos

Quando a redação não prova que opções são mutuamente exclusivas, a primeira
versão usa checkboxes independentes. Somente pares claramente incompatíveis são
convertidos em grupos exclusivos.

## D-003 - Itens com dois propósitos

“Se eu precisar descansar, posso contar com essas pessoas para ficarem com o
bebê:” permanece checkbox e recebe também um campo curto para nomes.

“Outros documentos ou cadastros importantes.” permanece checkbox, sem campo de
texto adicional, porque a redação está dentro de uma lista de providências.

## D-004 - Perguntas introdutórias

Perguntas seguidas imediatamente por um checklist são tratadas como introdução,
sem área adicional. Perguntas de autoconhecimento, expectativas do casal,
espiritualidade e “Hoje eu me sinto” recebem áreas de resposta conforme a
especificação.

## D-005 - Referências externas

Guia Principal, planilha do enxoval e checklist da mala permanecem texto simples,
sem links, pois não há URLs editoriais aprovadas.

## D-006 - Primeira versão visual

A referência contém fotografias e elementos de marca em arquivo, mas o produto
usa somente composição tipográfica, cores, linhas, caixas e espaçamento em CSS.

## D-007 - Fonte de preenchimento normalizada

Os controles usam Helvetica padrão do PDF para a aparência digitada. As fontes
editoriais permanecem Cormorant Garamond, Mulish e Noto Serif Display. A escolha
evita falha do pypdf ao regenerar aparência de campos com uma fonte CID variável
e permite testar valores com acentos.

## D-008 - Paridade de paginação

As duas variantes usam as mesmas dimensões externas. Nenhuma página vazia foi
acrescentada para forçar paridade; o resultado atual possui 28 páginas em ambas.

