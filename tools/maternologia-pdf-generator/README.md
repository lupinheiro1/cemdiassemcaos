# Maternologia PDF Generator

Gerador local e específico do produto **100 Dias Sem Caos - O Passo a Passo**.

## Uso

```powershell
$env:UV_CACHE_DIR = "$PWD\.uv-cache"
$env:UV_PYTHON_INSTALL_DIR = "$PWD\.tools\python"
uv sync
uv run python -m maternologia_pdf build
```

Os arquivos aprovados são publicados em `outputs/`:

- `100-dias-sem-caos-passo-a-passo-preenchivel.pdf`
- `100-dias-sem-caos-passo-a-passo-impressao.pdf`

O build não altera o texto de `content/content.md`. A sintaxe escapada da
exportação original é interpretada somente em memória.

## Validação

```powershell
uv run pytest
uv run python -m maternologia_pdf validate
```

Artefatos intermediários e renderizações ficam em `work/`.

## Toolchain

Todas as ferramentas ficam isoladas em `.tools/`; o projeto não exige mudança
no PATH do Windows. Versões e hashes estão em `toolchain/`.

O estado da primeira versão, incluindo verificações e pendências de homologação,
está documentado em `STATUS.md`.

