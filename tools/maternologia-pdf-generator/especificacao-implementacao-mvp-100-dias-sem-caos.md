# Especificação de Implementação do MVP — 100 Dias Sem Caos - O Passo a Passo

**Status:** pronta para implementação no VS Code  
**Data:** 30 de julho de 2026  
**Projeto:** Maternologia  
**Escopo:** implementação exclusiva do primeiro produto, sem infraestrutura para outros materiais  
**Documento de evolução futura:** `especificacao-tecnica-gerador-pdf-maternologia.md`

---

## 1. Resultado esperado

O MVP deve transformar um único Markdown semântico nos dois arquivos finais:

- `100-dias-sem-caos-passo-a-passo-preenchivel.pdf`;
- `100-dias-sem-caos-passo-a-passo-impressao.pdf`.

O primeiro arquivo deve permitir:

- marcar e desmarcar caixas;
- escolher uma opção em grupos exclusivos;
- digitar respostas curtas;
- escrever reflexões multilinha;
- preencher datas, telefones e assinatura textual;
- preencher a tabela da rede de apoio;
- salvar, fechar e reabrir mantendo os valores;
- imprimir o documento completo ou páginas selecionadas.

O segundo arquivo deve:

- conter o mesmo texto e a mesma identidade visual;
- substituir controles digitais por caixas, linhas e áreas pautadas;
- conter zero campo PDF e zero widget interativo;
- ser adequado para impressão doméstica A4 em tamanho real.

O build será local, offline e executado por um único comando:

```text
uv run python -m maternologia_pdf build
```

Não haverá seleção de material, seleção de tema ou descoberta de plugins. O comando sempre constrói este produto e sempre usa os caminhos definidos nesta especificação.

---

## 2. Limite do MVP

### 2.1. Incluído

O MVP inclui somente:

- uma fonte de conteúdo canônica;
- uma referência visual somente leitura;
- um conjunto fixo de fontes;
- um conjunto fixo de estilos da Maternologia;
- a gramática Markdown necessária ao conteúdo existente;
- um modelo intermediário pequeno;
- um template HTML comum;
- duas variantes de controles, preenchível e impressão;
- geração com WeasyPrint;
- normalização AcroForm com pypdf;
- validações estruturais indispensáveis;
- testes automatizados do conteúdo real;
- homologação manual nos leitores definidos;
- prova física A4.

### 2.2. Restrições deliberadas

- O código pode conhecer o nome e os arquivos deste produto.
- Os nomes de saída podem ser fixos.
- Os estilos podem ser específicos deste produto.
- Somente componentes efetivamente usados no conteúdo serão implementados.
- Não existe API pública interna a estabilizar.
- Não existe compatibilidade prometida com outro Markdown.
- Não existe configuração para trocar de material ou identidade visual.
- Não existe suporte a imagens.
- Não existe mecanismo de extensão.

Essas restrições são intencionais. A especificação técnica original permanece como referência para uma eventual generalização posterior.

---

## 3. Entradas e fonte de verdade

### 3.1. Arquivos auditados

| Arquivo | Função | Evidência em 30/07/2026 |
|---|---|---|
| `100 dias sem caos passo a passo.md` | única fonte de verdade editorial | UTF-8; 19.925 bytes; 471 linhas; SHA-256 `633886D1CF93124631CD546B79A72582BE0050BECEF322EE00C32D5015A738F4` |
| `100 Dias Sem Caos.pdf` | referência exclusivamente visual | 74 páginas A4; 25.312.512 bytes; SHA-256 `66929C14C37835ECA2BC8AE332213EDFCC25CFA5B3912C76BB475A691F2E7B05` |

O nome visível canônico é:

`100 Dias Sem Caos - O Passo a Passo`

O PDF visual não fornece conteúdo editorial, imagens, logo nem fontes. Ele serve apenas para orientar paleta, tipografia, hierarquia, margens, caixas, linhas, tabelas, aberturas e ritmo visual.

### 3.2. Regras de preservação editorial

Todo texto visível vem do Markdown canônico.

O gerador pode acrescentar somente:

- números de página;
- bookmarks derivados dos títulos;
- metadados técnicos do PDF;
- aparência dos campos;
- fundos, linhas, molduras e formas construídas em CSS.

O gerador não pode:

- copiar texto do PDF visual;
- reescrever frases;
- corrigir ortografia ou concordância;
- inventar instruções;
- omitir conteúdo;
- duplicar conteúdo;
- transformar perguntas em campos por heurística;
- transformar listas comuns em checklists por heurística;
- usar imagens.

### 3.3. Inventário confirmado da fonte atual

O Markdown auditado contém:

- um H1 com o nome aprovado;
- seis H2: cinco fases e o encerramento;
- 17 títulos H3 aninhados;
- 168 marcadores de checkbox ainda escapados como `* \[ ]`;
- 12 marcadores de área de resposta escritos como `\---`;
- dez campos lógicos representados por sublinhados;
- duas datas explícitas;
- uma assinatura;
- quatro contatos telefônicos;
- uma tabela com quatro colunas e cinco linhas preenchíveis;
- perguntas abertas que precisam de marcação semântica;
- referências textuais ao Guia Principal, à planilha do enxoval e ao checklist da mala;
- zero imagem.

### 3.4. Preparação única do conteúdo canônico

Não será criado um migrador de Notion.

Antes do desenvolvimento do renderer completo, o Codex deve:

1. copiar o Markdown auditado para `content/content.md`;
2. verificar o SHA-256 da cópia;
3. manter uma cópia somente leitura em `references/source-audit.md`;
4. normalizar manualmente apenas a sintaxe;
5. acrescentar IDs e marcação semântica;
6. gerar uma comparação do texto visível antes e depois;
7. interromper o trabalho se qualquer redação visível tiver mudado;
8. solicitar aprovação do `content/content.md` antes de congelar o inventário de campos.

Normalizações autorizadas:

- `* \[ ]` para task list GFM `- [ ]`;
- `\---` para campo ou pergunta explicitamente declarada;
- sublinhados escapados para campos declarados;
- negritos escapados para negrito Markdown válido;
- títulos representados como itens de lista para headings identificados;
- remoção de blockquotes vazios sem conteúdo editorial.

Nenhuma normalização pode corrigir o texto.

A comparação editorial deve extrair dos dois arquivos a sequência ordenada de textos visíveis, decodificar apenas escapes Markdown e remover somente marcadores, atributos técnicos e indentação estrutural. Ela não pode normalizar palavras, pontuação, acentos, maiúsculas ou espaços internos. O SHA-256 da sequência aprovada fica em `tests/fixtures/approved-visible-text.sha256`.

### 3.5. Decisões semânticas obrigatórias

Na preparação do `content.md`:

1. As cinco perguntas de autoconhecimento recebem uma área de resposta cada.
2. As cinco perguntas de “Ajustando expectativas do casal” recebem uma área de resposta cada.
3. Os 12 tópicos seguintes da conversa do casal permanecem texto estático.
4. As perguntas financeiras permanecem checkboxes de tarefa concluída.
5. Todo par de respostas incompatíveis é marcado explicitamente como escolha exclusiva.
6. Todo grupo exclusivo possui uma instrução visível aprovada para a versão impressa; o renderer não inventa essa instrução.
7. As cinco células de “Já conversei?” viram checkboxes na tabela.
8. “Vacinas do recém-nascido” é rótulo de grupo; Hepatite B e BCG são os campos-filhos.
9. Assinatura é campo textual, sem validade jurídica.
10. Datas são campos textuais `DD/MM/AAAA`, sem calendário e sem JavaScript.
11. Telefones são campos textuais para preservar `+`, espaços, parênteses e zeros.
12. A pergunta sobre espiritualidade e “Hoje eu me sinto” recebem áreas multilinha.
13. “Gostaria de receber…” e “Prefiro esperar…” recebem campos separados.
14. As referências ao Guia Principal, à planilha do enxoval e ao checklist da mala permanecem texto sem link enquanto não houver URL editorialmente aprovada.
15. Nenhum elemento de imagem é criado.

Devem receber decisão editorial antes de sua marcação final:

- o item “Se eu precisar descansar, posso contar com essas pessoas para ficarem com o bebê:”;
- o item “Outros documentos ou cadastros importantes.”;
- qualquer pergunta cuja intenção de resposta escrita não esteja explícita.

O Codex não decide essas intenções a partir da redação.

Pendências gramaticais registradas na especificação original permanecem responsabilidade editorial. Elas não bloqueiam o parser se a usuária aprovar o texto como está, mas nunca podem ser corrigidas silenciosamente pelo código.

---

## 4. Decisões técnicas preservadas

### 4.1. Stack

- Python 3.13, com patch fixado em `.python-version`;
- `uv`, `pyproject.toml` e `uv.lock`;
- `markdown-it-py`;
- `mdit-py-plugins` somente com `front_matter`, `tasklists`, `attrs_block` e `container`;
- scanner local fixo para a diretiva inline `field` e para os containers usados neste documento;
- PyYAML com carregamento seguro;
- Pydantic 2 em modo estrito;
- Jinja 3 com `StrictUndefined` e autoescape;
- WeasyPrint 69.0;
- pypdf 6;
- pytest;
- QPDF;
- Poppler;
- veraPDF.

Não haverá framework de CLI, registro de plugins, registro de componentes, injeção de dependências ou carregamento dinâmico de módulos.

### 4.2. Custo

A implementação não exige licença comercial, assinatura, chave de ativação nem pagamento por documento.

O custo obrigatório de licença de software é `US$ 0`.

Devem ser preservados:

- `THIRD_PARTY_NOTICES.md`;
- arquivos OFL das fontes;
- origem, versão e SHA-256 do executável do WeasyPrint;
- versões exatas no `uv.lock`.

### 4.3. Responsabilidade de cada ferramenta

`markdown-it-py` interpreta a estrutura Markdown.

Pydantic valida o modelo intermediário e o inventário de campos.

Jinja produz os dois HTMLs a partir do mesmo documento validado.

WeasyPrint:

- pagina;
- desenha o conteúdo;
- incorpora as fontes;
- cria os campos AcroForm a partir dos controles HTML;
- gera a versão de impressão sem formulários.

pypdf atua somente depois do WeasyPrint e somente no PDF preenchível. Ele:

- confere a árvore de campos;
- acrescenta tooltip quando necessário;
- garante a flag de impressão;
- ajusta ordem de tabulação;
- preserva a política de aparência;
- nunca cria, move ou redimensiona campos.

QPDF, Poppler e veraPDF validam os PDFs gerados.

---

## 5. Estrutura mínima de pastas

```text
maternologia-pdf-generator/
  AGENTS.md
  README.md
  THIRD_PARTY_NOTICES.md
  pyproject.toml
  uv.lock
  .python-version

  content/
    content.md

  references/
    source-audit.md
    visual-reference.pdf

  src/
    maternologia_pdf/
      __init__.py
      __main__.py
      build.py
      parse.py
      models.py
      render.py
      forms.py
      validate.py

  templates/
    document.html.j2

  styles/
    design.css
    fillable.css
    print.css

  fonts/
    cormorant-garamond/
    mulish/
    noto-serif-display/
    licenses/

  tests/
    fixtures/
      approved-visible-text.sha256
      expected-fields.json
      filled-values.json
    test_content.py
    test_build.py
    test_pdf_structure.py

  toolchain/
    weasyprint.sha256
    versions.txt

  .tools/
    weasyprint-69.0/

  work/
    document-fillable.html
    document-print.html
    fillable-preliminary.pdf
    fillable-normalized.pdf
    print.pdf
    validation-report.json
    renders/

  outputs/
    100-dias-sem-caos-passo-a-passo-preenchivel.pdf
    100-dias-sem-caos-passo-a-passo-impressao.pdf
```

Regras:

- `content/content.md` é a única fonte editorial editável.
- `references/source-audit.md` e `visual-reference.pdf` são somente leitura.
- `work/` e `.tools/` são ignorados pelo Git.
- `outputs/` contém somente PDFs que passaram por todas as validações.
- Um build com falha não substitui os últimos PDFs aprovados.
- Não existe pasta `materials/`.
- Não existe pasta `themes/`.
- Não existem schemas JSON genéricos.
- Não existem subpastas por componente.
- Não existe pasta de imagens.

---

## 6. Contrato fixo do Markdown

### 6.1. Front matter

O `content.md` começa com:

```yaml
---
document_id: maternologia.100-dias-sem-caos.passo-a-passo
locale: pt-BR
output_basename: 100-dias-sem-caos-passo-a-passo
---
```

O H1 seguinte fornece o título visível. O título não é repetido no front matter.

Não haverá:

- versão editorial;
- seleção de tema;
- lista de features;
- caminho de assets;
- configuração para outros produtos.

### 6.2. Formas aceitas

O parser aceita somente:

- headings H1 a H4;
- parágrafos;
- negrito e itálico;
- listas comuns;
- blockquotes;
- links;
- tabelas GFM;
- task lists GFM;
- atributos de bloco;
- containers listados nesta seção;
- diretiva inline `field`.

HTML bruto é proibido.

### 6.3. IDs

Precisam de ID explícito:

- headings estruturais;
- checklists;
- callouts;
- perguntas;
- listas de perguntas;
- campos;
- grupos exclusivos;
- tabela preenchível;
- quebras manuais.

IDs usam ASCII e `kebab-case`.

Itens comuns recebem IDs derivados:

- checklist: `<group-id>.item-01`;
- question-list: `<group-id>.question-01`;
- choice-group: `<group-id>.option-01`;
- tabela: `<table-id>.row-01.<column-key>`.

O nome final do campo AcroForm usa:

`maternologia.100-dias-sem-caos.passo-a-passo.<component-id>.<member-id>`

IDs ausentes ou duplicados interrompem o build.

### 6.4. Sintaxe usada

| Necessidade | Sintaxe |
|---|---|
| Abertura de fase | atributos com `layout=section-opening` na linha anterior ao H2 |
| Encerramento | atributos com `layout=closing` na linha anterior ao H2 |
| Checklist | atributos com ID na linha anterior à task list |
| Pergunta aberta | container `question` |
| Lista de perguntas abertas | container `question-list` |
| Campo curto | diretiva inline `field` |
| Escolha exclusiva | container `choice-group` com `selection=one` |
| Tabela preenchível | container `form-table` |
| Callout | blockquote precedido por atributos `role=callout` e `kind` |
| Quebra manual | container vazio `page-break` |

Exemplo de abertura:

```markdown
{#phase-1 layout=section-opening}
## Fase 1 — Prepare você
```

Exemplo de checklist:

```markdown
{#health-habits}
- [ ] Manter o pré-natal em dia.
- [ ] Tomar corretamente as vitaminas prescritas.
```

Exemplo de pergunta:

```markdown
:::question{#spirituality type=textarea lines=4 maxlength=360}
Se a espiritualidade faz parte da sua vida, como você pretende cultivá-la durante o puerpério?
:::
```

Exemplo de lista de perguntas:

```markdown
:::question-list{#self-knowledge type=textarea lines=3 maxlength=280}
- Como eu costumo reagir ao estresse?
- O que costuma me sobrecarregar?
- O que eu gosto de fazer para me sentir melhor?
:::
```

Exemplo de campo curto:

```markdown
:field[Maternidade]{#maternity-phone type=tel size=medium maxlength=30}
```

Exemplo de escolha exclusiva:

```markdown
:::choice-group{#maternity-visits selection=one}
- [ ] Quero receber visitas na maternidade.
- [ ] Prefiro não receber visitas na maternidade.
:::
```

### 6.5. Tabela da rede de apoio

Existe uma única tabela preenchível:

```markdown
:::form-table{#support-network rows=5}
:column[Pessoa]{key=person type=text size=medium maxlength=80}
:column[Como pode ajudar?]{key=help type=textarea lines=2 maxlength=160}
:column[Com que frequência?]{key=frequency type=text size=short maxlength=40}
:column[Já conversei?]{key=contacted type=checkbox}

|Pessoa|Como pode ajudar?|Com que frequência?|Já conversei?|
|-|-|-|-|
|||||
|||||
|||||
|||||
|||||
:::
```

O parser valida:

- exatamente quatro colunas;
- exatamente cinco linhas;
- ordem e chaves iguais às declaradas;
- `maxlength` nos campos textuais;
- checkbox na quarta coluna;
- IDs derivados de linha e coluna.

### 6.6. Tipos de campo

Somente estes tipos serão implementados:

| Tipo | Preenchível | Impressão |
|---|---|---|
| `text` | campo de uma linha | linha |
| `textarea` | campo multilinha | área pautada |
| `date` | texto com dez caracteres | `DD / MM / AAAA` |
| `tel` | texto de uma linha | linha |
| `number` | texto numérico sem script | linha e unidade visível |
| `signature` | nome/assinatura digitada | linha de assinatura |
| `checkbox` | botão independente | quadrado vazio |
| `choice-one` | radio group | quadrados com instrução de escolha única |

Todos os campos são opcionais.

Todo campo textual declara `maxlength`.

`size` aceita somente:

- `short`;
- `medium`;
- `full`.

### 6.7. Rejeições obrigatórias

O build falha se encontrar:

- `* \[ ]` ainda escapado;
- marcador `\---`;
- sublinhado usado como campo;
- negrito escapado;
- HTML bruto;
- imagem Markdown;
- tag `img`;
- SVG, PNG ou JPEG;
- container desconhecido;
- diretiva desconhecida;
- campo sem label;
- campo sem ID;
- campo textual sem `maxlength`;
- task list sem ID;
- tabela comum marcada implicitamente como formulário;
- pergunta transformada implicitamente em campo;
- medida física, cor ou fonte declarada no Markdown.

---

## 7. Modelo de dados mínimo

Não haverá `LayoutIR`, registro de componentes ou modelo de tema.

O parser produz somente três estruturas validadas.

### 7.1. `DocumentData`

Contém:

- `document_id`;
- `locale`;
- `output_basename`;
- título H1;
- blocos em ordem;
- inventário plano de campos;
- hash do Markdown.

### 7.2. `BlockData`

Cada bloco contém:

- `kind`;
- `id`, quando exigido;
- conteúdo textual ou filhos;
- layout estrutural, quando aplicável;
- linha de origem no Markdown.

Os valores de `kind` ficam limitados ao conteúdo real:

- `heading`;
- `paragraph`;
- `list`;
- `blockquote`;
- `callout`;
- `checklist`;
- `choice_group`;
- `question`;
- `question_list`;
- `field`;
- `form_table`;
- `page_break`.

### 7.3. `FieldData`

Cada campo contém:

- nome AcroForm completo;
- tipo;
- label;
- tooltip;
- `maxlength`, quando textual;
- `size`, quando aplicável;
- `lines`, quando multilinha;
- opções e valores de exportação, quando escolha exclusiva;
- ordem de tabulação;
- linha de origem.

O aspecto visual não pertence ao modelo. Ele é fixado no CSS.

### 7.4. Inventário esperado

Depois da aprovação semântica do `content.md`, o Codex cria manualmente:

`tests/fixtures/expected-fields.json`

Esse arquivo lista, para cada campo:

- nome completo;
- tipo;
- `maxlength`;
- quantidade de widgets esperada;
- valor de exportação, quando aplicável.

Ele é específico deste produto e funciona como contrato de teste. O build falha se o PDF possuir campo ausente, inesperado ou diferente desse inventário.

---

## 8. Pipeline de geração

### 8.1. Preflight

Antes de cada build:

1. confirmar Python e uv;
2. confirmar o `uv.lock`;
3. localizar o executável oficial do WeasyPrint 69.0;
4. conferir versão e SHA-256;
5. confirmar QPDF, Poppler e veraPDF;
6. conferir presença e licença das fontes;
7. garantir que o build está offline.

Falha de preflight interrompe o processo antes de escrever qualquer PDF.

### 8.2. Ingestão

1. Ler `content/content.md` em UTF-8 estrito.
2. Calcular SHA-256.
3. Ler o front matter mínimo.
4. Conferir o SHA-256 de `references/source-audit.md`.
5. Bloquear caminhos fora do repositório.
6. Rejeitar qualquer referência remota.

### 8.3. Parsing e validação

1. Gerar tokens com `markdown-it-py`.
2. Interpretar apenas a sintaxe da seção 6.
3. Preservar texto, ordem e linha de origem.
4. Construir `DocumentData`.
5. Validar com Pydantic.
6. Comparar o inventário de campos com `expected-fields.json`.

O parser não corrige texto e não infere intenção.

### 8.4. Renderização HTML

O mesmo `DocumentData` é enviado duas vezes a `document.html.j2`:

- `variant=fillable`;
- `variant=print`.

O template contém macros somente para os blocos listados em `BlockData`.

O HTML preenchível usa:

- `input`;
- `textarea`;
- `input type="checkbox"`;
- `input type="radio"`;
- labels associados;
- nomes de campo explícitos.

O HTML de impressão não contém controles de formulário. Ele usa elementos estáticos com as mesmas dimensões externas.

`StrictUndefined` e autoescape são obrigatórios.

### 8.5. Geração com WeasyPrint

Configuração comum:

- papel A4;
- `zoom=1`;
- idioma `pt-BR`;
- fontes locais;
- `--pdf-tags`;
- `--pdf-variant pdf/ua-1` como conformidade-alvo;
- `--output-intent srgb`;
- `--full-fonts`;
- somente protocolos `file` e `data`;
- sem JavaScript;
- sem XFA;
- sem criptografia;
- sem ações de envio.

Para o preenchível:

- ativar `--pdf-forms`;
- usar `appearance: auto`;
- salvar primeiro em `work/fillable-preliminary.pdf`.

Para impressão:

- não ativar `--pdf-forms`;
- renderizar HTML sem elementos de formulário;
- salvar em `work/print.pdf`.

### 8.6. Normalização AcroForm

`forms.py` abre o PDF preliminar e cria um novo arquivo:

`work/fillable-normalized.pdf`

O normalizador:

1. compara `expected-fields.json`, `/Fields` e widgets de página;
2. falha em campo ausente, duplicado, órfão ou inesperado;
3. acrescenta `/TU` com o tooltip validado, se necessário;
4. garante a flag `Print`;
5. ordena widgets conforme a ordem de leitura;
6. preserva `/NeedAppearances true`;
7. preserva `/AP /N` dos checkboxes e radio buttons;
8. compara todos os `/Rect` antes e depois;
9. falha se qualquer coordenada mudar;
10. reabre o arquivo gravado e repete a inspeção.

O normalizador não pode:

- criar campo;
- reanexar campo;
- mover widget;
- redimensionar widget;
- renomear campo;
- alterar o conteúdo visual;
- definir `/NeedAppearances false`;
- inserir JavaScript.

### 8.7. Pós-validação e publicação

Nos dois PDFs:

- executar QPDF;
- executar `pdfinfo`;
- executar `pdffonts`;
- executar `pdftotext`;
- executar veraPDF e arquivar o relatório;
- renderizar todas as páginas com Poppler;
- verificar página A4, fontes, texto e contagem.

No preenchível:

- inspecionar AcroForm com pypdf;
- preencher uma cópia fictícia;
- salvar, reabrir e renderizar;
- conferir valores e estados;
- conferir impressão dos valores.

No impresso:

- comprovar ausência de `/AcroForm`;
- comprovar ausência de `/Widget`.

Somente depois de todas as verificações:

- copiar `fillable-normalized.pdf` para o nome final preenchível;
- copiar `print.pdf` para o nome final de impressão;
- substituir os arquivos em `outputs/` de forma atômica.

---

## 9. Regras visuais fixas

Não haverá tema, override ou carregamento de tokens. Todos os valores ficam centralizados como variáveis CSS no início de `styles/design.css`.

### 9.1. Paleta usada

| Variável CSS | Valor | Uso |
|---|---|---|
| `--color-paper` | `#F8F2ED` | aberturas e fundos quentes |
| `--color-white` | `#FFFFFF` | páginas de exercício |
| `--color-cream` | `#F5E8D5` | cards e perguntas |
| `--color-blush` | `#F2E4D9` | caixas de acolhimento |
| `--color-group` | `#F8F5F2` | cabeçalhos de checklist |
| `--color-ink` | `#222222` | corpo |
| `--color-brown` | `#4B3B31` | títulos |
| `--color-copper` | `#AD6639` | números e linhas |
| `--color-coral` | `#AD5E50` | destaque com contraste suficiente |
| `--color-terracotta` | `#A65F3F` | callout com texto branco |
| `--color-terracotta-soft` | `#BF825E` | fundo decorativo com texto escuro |
| `--color-highlight` | `#FFD4D4` | linha ou célula destacada |
| `--color-warning` | `#E3AD46` | avisos |
| `--color-muted` | `#767676` | rodapé |
| `--color-rule` | `#D9D4CF` | linhas e campos |

Nenhuma informação depende somente de cor.

### 9.2. Fontes

Usar arquivos locais:

- Cormorant Garamond Regular, SemiBold e Italic;
- Mulish Light, Regular e Bold;
- Noto Serif Display ExtraCondensed Light Italic.

Uso:

- Cormorant Garamond: capa e headings;
- Mulish: corpo, listas, labels e campos;
- Noto Serif Display ExtraCondensed Light Italic: aberturas e encerramento.

Cada família deve incluir seu `OFL.txt`.

### 9.3. Escala tipográfica

| Papel | Tamanho / entrelinha |
|---|---|
| Capa | 42 pt / 0,95 |
| Número da fase | 68 pt / 0,85 |
| Título de abertura | 34 pt / 1,05 |
| H2 | 28 pt / 1,10 |
| H3 | 20 pt / 1,20 |
| H4/faixa | 12 pt / 1,30 |
| Corpo | 12,5 pt / 18 pt |
| Checklist | 11,5 pt / 16 pt |
| Campo digitado | 10,5 pt; mínimo absoluto de 9 pt |
| Rodapé | 8,5 pt / 11 pt |

Listas, labels e exercícios ficam alinhados à esquerda.

Texto corrido só pode ser justificado quando a hifenização `pt-BR` estiver ativa e a revisão visual não identificar rios.

### 9.4. Página e margens

- página: 210 × 297 mm;
- margem esquerda e direita: 20 mm;
- margem superior: 20 mm;
- margem inferior de conteúdo: 20 mm;
- área segura mínima: 15 mm;
- rodapé: baseline a 10 mm da base;
- moldura da capa: 21 mm das bordas;
- largura máxima de texto corrido: 75 caracteres;
- escala de espaçamento: 1,5 / 2,5 / 4 / 6 / 8 / 12 / 16 / 24 mm;
- padding da tabela: 2,5 mm;
- linha de campo impresso: mínimo 0,5 pt.

### 9.5. Componentes deste produto

| Componente | Regra |
|---|---|
| Capa | página própria, sem número, composição tipográfica, moldura e card creme |
| Abertura de fase | página própria, número derivado da ordem, título, linha cobre e texto introdutório |
| Heading | serifado, linha curta de acento e primeiro conteúdo junto |
| Compromisso | caixa creme ou blush, borda cobre e texto escuro |
| Callout informativo | fundo terracota e texto branco acessível |
| Aviso | marcador circular feito em CSS e texto escuro |
| Checklist | cabeçalho claro, caixa de 5 mm e label |
| Escolha exclusiva | aparência quadrada, comportamento de radio group |
| Campo curto | label e campo de 8 mm |
| Reflexão | label e linhas de 7,5 mm |
| Data | campo de dez caracteres e indicação `DD / MM / AAAA` |
| Assinatura | campo textual; linha manual de 90 mm |
| Telefone | campo textual de uma linha |
| Tabela | header repetível e campos por célula |
| Rodapé | número central e linha geométrica |
| Encerramento | composição tipográfica e ornamento linear |

Não usar:

- fotografia;
- logo em arquivo;
- ícone;
- SVG;
- emoji;
- icon font;
- imagem de fundo.

---

## 10. Paginação

1. A capa ocupa uma página.
2. Cada H2 com `layout=section-opening` começa em página nova.
3. A abertura de fase não divide.
4. Heading permanece com o primeiro parágrafo ou com os dois primeiros itens curtos.
5. Parágrafos usam no mínimo três órfãs e três viúvas.
6. Pergunta e área de resposta são atômicas.
7. Campo não atravessa página.
8. Checklist divide somente entre itens.
9. Um fragmento de checklist contém pelo menos dois itens, salvo fim natural.
10. Título de grupo permanece com pelo menos dois itens.
11. Item-pai permanece com o primeiro filho.
12. Callout, data, assinatura e telefone são atômicos.
13. Cabeçalho de tabela se repete.
14. Linha de tabela não divide.
15. A tabela divide somente entre linhas.
16. Componente maior que a área útil gera erro.
17. Quebra manual só ocorre quando marcada no Markdown.
18. Não usar grid ou flex em conteúdo fragmentável.
19. Não pode haver heading isolado no rodapé.
20. Não pode haver página branca inesperada.

As versões preenchível e impressa devem ter:

- a mesma quantidade de páginas;
- as cinco aberturas e o encerramento nas mesmas páginas;
- as mesmas dimensões externas para cada exercício.

Se a paridade não for atingida, o build falha. O MVP não implementará sistema de exceções de paginação.

---

## 11. PDF preenchível

### 11.1. Estrutura

O arquivo final deve conter:

- `/AcroForm`;
- árvore `/Fields` válida;
- widgets `/Widget`;
- relação válida entre campo-pai e widgets-filhos;
- nomes únicos;
- tooltips `/TU`;
- tab order coerente;
- flag `Print` em todos os campos;
- `/NeedAppearances true`;
- `/AP /N` em checkboxes e radio buttons;
- fontes necessárias ao texto digitado.

### 11.2. Comportamento

- Todos os campos começam vazios ou desmarcados.
- Todos os campos são opcionais.
- O PDF continua editável após salvar.
- Valores persistem após fechar e reabrir.
- Valores aparecem na tela e na impressão.
- É possível imprimir o documento completo ou um intervalo.
- Não existe envio de respostas.
- Não existe ação externa.
- Não existe conexão de rede.
- Não existe JavaScript, cálculo ou máscara.
- Não existe assinatura certificada.
- Não existe senha.

### 11.3. Dimensões

- checkbox: 5 × 5 mm;
- altura mínima da linha interativa: 8 mm;
- campo de uma linha: 8 mm;
- padding interno: 2 mm;
- textarea: 7,5 mm por linha declarada;
- linha de tabela: mínimo de 14 mm;
- fonte digitada: 10,5 pt, podendo chegar a 9 pt apenas nas células da tabela.

### 11.4. Limites de texto

Todo campo textual declara `maxlength`.

Campos multilinha:

- usam altura fixa;
- usam fonte fixa;
- não reduzem fonte automaticamente;
- são testados com o limite completo;
- são reprovados se o texto aceito ficar oculto ou for impresso cortado.

### 11.5. Acessibilidade mínima

- idioma `pt-BR`;
- texto pesquisável;
- headings, listas e tabela etiquetados;
- label e tooltip em todos os campos;
- ordem de tabulação coerente;
- contraste mínimo de 4,5:1 para texto normal;
- contraste mínimo de 3:1 para texto grande e interface;
- PDF/UA-1 tratado apenas como alvo de geração;
- nenhuma declaração pública de conformidade PDF/UA sem veraPDF e auditoria manual aprovados.

---

## 12. PDF para impressão

O template de impressão substitui:

- checkbox por quadrado vazio;
- escolha exclusiva por quadrados vazios;
- texto por linha;
- textarea por área pautada;
- data por `DD / MM / AAAA`;
- assinatura por linha;
- células interativas por células vazias.

Requisitos:

- zero `/AcroForm`;
- zero `/Widget`;
- mesma quantidade de páginas do preenchível;
- mesmos inícios de fase;
- A4;
- sRGB;
- fontes incorporadas;
- legibilidade em escala de cinza;
- área segura de 15 mm;
- sem sangria;
- sem marcas de corte;
- impressão em “Tamanho real/100%”.

---

## 13. Segurança e execução local

- O build é totalmente local.
- A rede permanece desabilitada.
- Somente caminhos dentro do repositório são aceitos.
- Somente protocolos `file` e `data` são aceitos.
- HTML bruto é proibido.
- Não existem segredos no projeto.
- Não existe analytics.
- As dependências usam versões fixas.
- As fontes são locais.
- O executável do WeasyPrint tem versão e hash conferidos.
- Logs e fixtures usam somente dados fictícios.
- Nenhuma resposta real de usuária participa dos testes.

---

## 14. Validações e testes mínimos

### 14.1. Prova técnica obrigatória

Antes de implementar todas as páginas, produzir uma prova A4 de duas páginas contendo:

- corpo com acentos;
- um campo curto;
- um telefone;
- uma data;
- um textarea no limite;
- três checkboxes;
- um grupo exclusivo;
- três células de tabela;
- uma assinatura textual.

A prova só passa quando:

1. o preenchimento funciona;
2. o PDF pode ser salvo;
3. os valores persistem após reabrir;
4. checkboxes e escolha exclusiva preservam estado;
5. os valores aparecem na impressão;
6. a normalização pypdf não altera `/Rect`;
7. o PDF impresso contém zero campo.

Essa prova valida a decisão WeasyPrint + pypdf antes da implementação do material completo.

### 14.2. Testes automatizados de conteúdo

`test_content.py` deve comprovar:

- UTF-8 válido;
- um único H1;
- título exato;
- H1 como primeiro conteúdo visível depois do front matter;
- seis H2;
- identificação editorial removida do Notion ausente;
- nenhuma imagem;
- nenhum HTML bruto;
- nenhum escape de exportação remanescente;
- IDs obrigatórios presentes e únicos;
- 168 itens de origem contabilizados na preparação semântica;
- 12 marcadores de resposta e dez campos lógicos de sublinhado contabilizados;
- duas datas, uma assinatura e quatro telefones no inventário aprovado;
- tabela com quatro colunas e cinco linhas;
- todos os campos textuais com `maxlength`;
- inventário igual a `expected-fields.json`;
- texto visível equivalente à fonte auditada;
- nenhuma frase editorial proveniente do PDF visual.

### 14.3. Teste integrado do build

`test_build.py` executa o pipeline completo em diretório temporário e comprova:

- geração dos dois HTMLs;
- geração dos dois PDFs preliminares;
- normalização do preenchível;
- publicação dos dois nomes finais;
- mesma quantidade de páginas;
- todas as páginas A4;
- cinco aberturas e encerramento nas mesmas páginas;
- ausência de página branca inesperada.

### 14.4. Testes estruturais do PDF

`test_pdf_structure.py` comprova:

Nos dois PDFs:

- QPDF sem erro estrutural;
- fontes incorporadas;
- texto extraível;
- idioma correto;
- metadados básicos corretos;
- bookmarks derivados do H1 e dos H2, na ordem;
- PDF etiquetado;
- ausência de criptografia, JavaScript, XFA e ação de rede;
- ausência de objeto PDF com `/Subtype /Image`.

No preenchível:

- AcroForm presente;
- inventário igual ao esperado;
- nomes únicos;
- tipos corretos;
- `/NeedAppearances true`;
- `/AP /N` nos botões;
- `/TU`;
- flag `Print`;
- `/Rect` inalterado pela normalização.

No impresso:

- nenhum AcroForm;
- nenhum widget.

### 14.5. Fixture de preenchimento

`filled-values.json` usa dados fictícios e preenche pelo menos:

- nome com acentos e apóstrofo;
- telefone `+55 (31) 99999-0000`;
- data `29/02/2028`;
- checkbox independente;
- escolha exclusiva;
- todas as células da tabela;
- textarea no limite;
- assinatura textual.

Depois de salvar a cópia:

- reabrir;
- comparar valores;
- comparar estados;
- renderizar;
- conferir ausência de clipping;
- conferir valores na impressão.

### 14.6. Inspeção visual

Renderizar todas as páginas dos dois PDFs em PNG a 150 dpi.

Revisar manualmente:

- texto cortado;
- sobreposição;
- elemento fora da área útil;
- heading isolado;
- quebra incorreta de checklist;
- quebra de tabela;
- campo separado do label;
- página branca;
- diferença de paginação entre versões;
- caracteres ausentes;
- contraste;
- alinhamento dos campos.

A primeira versão aprovada serve apenas como evidência visual deste release. O MVP não implementa comparação automática de pixels.

### 14.7. Homologação manual

Executar o fluxo completo em:

| Ambiente | Fluxo |
|---|---|
| Adobe Acrobat Reader no Windows 11 | abrir, tabular, preencher, marcar, salvar, fechar, reabrir, imprimir tudo e intervalo |
| Adobe Acrobat Reader no macOS | mesmo fluxo |
| Adobe Acrobat Reader no Android | preencher campos reais, salvar cópia, reabrir, compartilhar e imprimir |
| Adobe Acrobat Reader no iOS | mesmo fluxo |
| Chrome no Windows | abrir, preencher, baixar ou salvar cópia e imprimir; registrar limitações |
| Edge no Windows | mesmo fluxo |
| Firefox/PDF.js | mesmo fluxo |

O Acrobat Reader é a referência de comportamento.

Não usar “Fill & Sign” para simular campos.

Limitação de navegador não reprova o PDF quando:

- os quatro ambientes do Acrobat passam;
- a limitação é registrada;
- qualquer orientação à leitora foi aprovada e inserida no Markdown.

### 14.8. Prova física

Antes do release:

1. imprimir uma linha de calibração de 100 mm;
2. usar A4 e tamanho real;
3. aceitar tolerância máxima de ±1 mm;
4. imprimir capa, abertura, checklist denso, textarea, tabela, assinatura/data e encerramento;
5. escrever manualmente com caneta comum;
6. conferir margens;
7. conferir escala de cinza;
8. imprimir o documento completo uma vez;
9. imprimir um intervalo de páginas isolado.

---

## 15. Critérios objetivos de aceite

O MVP está aprovado somente quando:

1. Existem exatamente os dois PDFs finais esperados.
2. O título visível é exatamente `100 Dias Sem Caos - O Passo a Passo`.
3. O SHA-256 do Markdown canônico está registrado no relatório de validação.
4. Todo o conteúdo aprovado aparece uma vez, na ordem correta.
5. Nenhuma correção editorial silenciosa foi feita.
6. Nenhum texto editorial veio do PDF visual.
7. Os 168 itens, os 12 marcadores de resposta, os dez campos lógicos de sublinhado, as duas datas, a assinatura, os quatro telefones e a tabela 4 × 5 da fonte auditada foram contabilizados na preparação semântica.
8. Todo campo esperado existe.
9. Nenhum campo inesperado existe.
10. Todos os nomes de campo são únicos.
11. Todos os campos têm tooltip e ordem de tabulação.
12. Todos os campos textuais respeitam `maxlength`.
13. Checkboxes podem ser marcados e desmarcados.
14. Grupos exclusivos permitem somente uma opção.
15. A tabela inteira pode ser preenchida.
16. Valores persistem após salvar, fechar e reabrir no Acrobat.
17. Valores aparecem ao imprimir o documento e um intervalo.
18. A versão impressa possui zero AcroForm e zero widget.
19. As duas versões possuem a mesma quantidade de páginas.
20. As cinco fases e o encerramento começam nas mesmas páginas.
21. Todas as páginas são A4.
22. Não existe texto cortado, sobreposto ou fora da área segura.
23. Não existe página branca inesperada.
24. Textareas preenchidos até o limite permanecem legíveis e imprimíveis.
25. Todas as fontes estão incorporadas.
26. Todos os glifos do português aparecem.
27. Não existe imagem, logo em arquivo ou ícone em arquivo.
28. Não existe XFA, JavaScript, criptografia ou ação de rede.
29. QPDF e Poppler passam; metadados e bookmarks estão corretos.
30. O relatório veraPDF é arquivado sem alegação indevida de conformidade.
31. O Acrobat Accessibility Checker não aponta bloqueador de uso.
32. A inspeção visual de todas as páginas foi aprovada.
33. Acrobat Reader em Windows, macOS, Android e iOS passa pelo fluxo completo.
34. Chrome, Edge e Firefox foram testados e suas limitações registradas.
35. A prova física A4 foi aprovada.
36. Os `/Rect` dos widgets são idênticos antes e depois da normalização.
37. O build completo funciona offline por um único comando.
38. O custo obrigatório de licenças de software é zero.
39. A identificação editorial removida do Notion não aparece no conteúdo canônico, nos metadados, nos PDFs nem no relatório de validação.

---

## 16. Ordem de implementação

### Etapa 0 — Preparação

1. Confirmar o caminho do novo repositório antes de criar arquivos ou Git.
2. Copiar as duas referências.
3. Instalar a toolchain gratuita.
4. Conferir versões e hashes.
5. Obter as fontes autorizadas e respectivas licenças.
6. Executar a prova técnica de duas páginas.

### Etapa 1 — Conteúdo canônico

1. Copiar e conferir o Markdown.
2. Normalizar sintaxe manualmente.
3. Adicionar IDs e componentes.
4. Resolver as decisões semânticas pendentes.
5. Comparar o texto visível.
6. Aprovar `content.md`.
7. Congelar `expected-fields.json`.

### Etapa 2 — Núcleo mínimo

1. Implementar `models.py`.
2. Implementar `parse.py`.
3. Implementar os testes de conteúdo.
4. Não gerar PDF até esses testes passarem.

### Etapa 3 — HTML e CSS

1. Implementar o template único.
2. Implementar `design.css`.
3. Implementar `fillable.css`.
4. Implementar `print.css`.
5. Renderizar e revisar amostras de cada componente.

### Etapa 4 — PDFs

1. Implementar `build.py`.
2. Invocar WeasyPrint para as duas variantes.
3. Implementar `forms.py`.
4. Normalizar o preenchível.
5. Comparar inventário e `/Rect`.

### Etapa 5 — Validação

1. Implementar `validate.py`.
2. Executar testes estruturais.
3. Executar a fixture preenchida.
4. Renderizar todas as páginas.
5. Corrigir clipping e paginação sem mudar o texto.

### Etapa 6 — Homologação

1. Executar a matriz manual.
2. Executar o teste de acessibilidade.
3. Executar a prova física.
4. Registrar as limitações reais.
5. Publicar os dois PDFs somente depois de todos os critérios passarem.

---

## 17. Riscos bloqueadores

| Risco | Tratamento no MVP |
|---|---|
| WeasyPrint e leitores divergem na aparência de formulários | prova técnica antes do documento completo; Acrobat como referência |
| pypdf desloca ou corrompe widgets | proibir criação e reposicionamento; comparar todo `/Rect` |
| intenção editorial ambígua | marcação manual e aprovação; nenhuma heurística |
| texto excede o campo | altura fixa, `maxlength`, fixture no limite e inspeção impressa |
| fonte não pode ser redistribuída | usar somente as três famílias OFL obtidas da origem oficial |
| impressão doméstica corta bordas | área segura de 15 mm e prova física em tamanho real |
| PDF/UA não é automaticamente garantido | tratar como alvo; não declarar conformidade sem validação integral |
| navegador não salva corretamente | Acrobat normativo; registrar limitações dos navegadores |
| build com falha sobrescreve release aprovado | publicar de forma atômica somente após o postflight |

---

## 18. Definição de pronto

O trabalho de implementação termina quando:

- o conteúdo canônico foi aprovado;
- a prova técnica passou;
- o comando único gera os dois PDFs;
- o preenchível salva, reabre e imprime os valores;
- o impresso contém zero formulário;
- todas as páginas foram inspecionadas;
- a matriz manual passou;
- a prova física passou;
- todos os 39 critérios de aceite são verdadeiros;
- a especificação técnica original permanece intacta.

---

## 19. Referências técnicas para implementação

- [WeasyPrint 69.0 — documentação](https://doc.courtbouillon.org/weasyprint/stable/)
- [WeasyPrint — formulários PDF](https://doc.courtbouillon.org/weasyprint/stable/common_use_cases.html#include-pdf-forms)
- [WeasyPrint — instalação no Windows](https://doc.courtbouillon.org/weasyprint/stable/first_steps.html#windows)
- [pypdf — formulários](https://pypdf.readthedocs.io/en/latest/user/forms.html)
- [markdown-it-py — documentação](https://markdown-it-py.readthedocs.io/)
- [Pydantic — validação](https://docs.pydantic.dev/latest/)
- [Jinja — `StrictUndefined` e autoescape](https://jinja.palletsprojects.com/en/stable/api/)
- [uv — documentação](https://docs.astral.sh/uv/)
- [Adobe — salvar PDFs preenchidos](https://helpx.adobe.com/acrobat/using/saving-pdfs.html)
- [Adobe — imprimir formulários](https://helpx.adobe.com/acrobat/desktop/work-with-pdf-forms/share-forms/print-forms.html)
- [QPDF — documentação](https://qpdf.readthedocs.io/)
- [veraPDF — validação](https://docs.verapdf.org/validation/)

---

## 20. Itens deliberadamente adiados

Os itens abaixo não devem ser implementados no MVP. Eles só serão reconsiderados depois que os dois PDFs deste produto estiverem aprovados.

### 20.1. Múltiplos materiais

- pasta `materials/`;
- descoberta de materiais;
- seleção de material na CLI;
- nomes de saída genéricos;
- cadastro ou registry de produtos;
- teste com um segundo produto;
- importação de respostas entre versões;
- IDs individuais estáveis para reordenação futura de todos os itens.

### 20.2. Sistema de temas

- pasta `themes/`;
- tema `maternologia/v1` carregável;
- `tokens.yaml`;
- `theme-overrides.yaml`;
- schema de tema;
- herança de tema;
- múltiplas identidades visuais;
- troca de paleta ou tipografia por configuração.

No MVP, os valores visuais ficam diretamente centralizados em `design.css`.

### 20.3. Extensibilidade

- arquitetura de plugins;
- registro dinâmico de diretivas;
- registro de componentes;
- carregamento dinâmico de renderers;
- API interna pública;
- sistema genérico de capacidades ou `features`;
- containers que não aparecem neste produto.

### 20.4. Imagens e assets editoriais

- imagem Markdown;
- fotografia;
- ilustração;
- logo em arquivo;
- ícone em arquivo;
- SVG;
- focal point;
- crop;
- validação de resolução;
- inventário genérico de assets;
- alt text de imagem.

### 20.5. Migração automatizada

- comando de importação do Notion;
- reconhecimento automático de escapes;
- promoção heurística de listas a headings;
- conversão automática de sublinhados em campos;
- relatório genérico de migração.

A normalização deste único Markdown será manual e auditada.

### 20.6. Modelos e manifests genéricos

- `LayoutIR`;
- modelo de tema;
- modelo genérico de asset;
- `layout-manifest.json`;
- `build-manifest.json` extensível;
- schemas JSON de conteúdo, tema e manifest;
- inventário de bounding boxes de componentes;
- sistema de exceções de paridade;
- compatibilidade de schema entre versões.

O MVP mantém apenas `validation-report.json` no diretório de trabalho e fixtures específicas do produto.

### 20.7. Infraestrutura de qualidade não indispensável

- baselines visuais versionados;
- máscaras de comparação;
- comparação automática por pixels;
- Pillow e NumPy no pipeline;
- limites rígidos de tamanho de arquivo antes de existir medição real;
- meta de tempo de abertura antes de existir aparelho de referência;
- testes de performance;
- cache incremental;
- builds paralelos;
- matriz automatizada em múltiplos sistemas operacionais;
- certificação formal PDF/UA.

Toda página continuará sendo renderizada e inspecionada manualmente no MVP.

### 20.8. Distribuição e operação

- CI/CD;
- geração em nuvem;
- serviço web;
- editor visual;
- API;
- banco de dados;
- analytics;
- telemetria;
- upload de respostas;
- integração com Notion;
- pacote instalável para terceiros;
- atualização automática da toolchain;
- Docker.

### 20.9. Compatibilidade secundária

- Safari;
- Preview do macOS/iOS;
- visualizador nativo do Android;
- leitores PDF alternativos;
- correções específicas para leitores que não sejam Acrobat, Chrome, Edge ou Firefox.

Esses leitores poderão ser observados informalmente, mas não receberão código específico no MVP.

XFA, JavaScript no PDF, cálculos, máscaras, seletor de data, assinatura certificada, criptografia, senha, envio de formulário, PDF/X, CMYK, sangria, marcas de corte e fechamento offset **não são itens adiados**. Eles continuam fora do escopo por decisão técnica e de segurança e não devem ser implementados depois do MVP sem uma nova decisão explícita.
