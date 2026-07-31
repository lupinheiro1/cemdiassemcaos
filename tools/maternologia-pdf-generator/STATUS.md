# Estado da primeira versão funcional

## Entregáveis

- `outputs/100-dias-sem-caos-passo-a-passo-preenchivel.pdf`
- `outputs/100-dias-sem-caos-passo-a-passo-impressao.pdf`

Ambos possuem 28 páginas A4 e foram gerados a partir do SHA-256 editorial:

`633886D1CF93124631CD546B79A72582BE0050BECEF322EE00C32D5015A738F4`

## Verificações aprovadas

- 5 testes automatizados.
- Texto visível da fonte encontrado na mesma ordem no HTML.
- 179 campos lógicos e 186 widgets no PDF preenchível.
- Valores fictícios persistem após salvar e reabrir.
- Acentos aparecem na aparência preenchida.
- `/Rect` preservado durante a normalização.
- Zero AcroForm e zero Widget no PDF de impressão.
- Mesma quantidade de páginas e mesmos inícios de seção.
- QPDF aprovado nas duas variantes.
- Todas as fontes editoriais incorporadas.
- Todas as páginas renderizadas e inspecionadas em PNG.

## Pendências antes de um release final

1. Homologar preenchimento, tabulação, salvamento e impressão no Acrobat Reader
   para Windows, macOS, Android e iOS.
2. Testar Chrome, Edge e Firefox/PDF.js e registrar limitações.
3. Confirmar no Acrobat o wrap automático de textareas no limite de caracteres.
   O campo possui flag multiline, mas a aparência criada pelo pypdf para a
   fixture longa não quebrou a linha automaticamente.
4. Corrigir as regras PDF/UA-1 ainda apontadas pelo veraPDF:
   - preenchível: `7.18.4-1`, `7.21.4.1-1`, `7.21.7-1`;
   - impressão: `7.21.7-1`.
5. Executar Acrobat Accessibility Checker e auditoria manual.
6. Executar calibração de 100 mm e prova física A4 em tamanho real.
7. Revisar os avisos de color space `srgb` emitidos pelo Poppler durante a
   rasterização, embora todas as páginas tenham sido renderizadas.
8. Fazer uma segunda rodada de refinamento visual e de uso de espaço.

Não há alegação de conformidade PDF/UA nesta versão.

