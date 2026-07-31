from pathlib import Path

import pytest

from maternologia_pdf.validate import validate_pair


ROOT = Path(__file__).resolve().parents[1]


def test_generated_pdfs() -> None:
    fillable = ROOT / "outputs" / "100-dias-sem-caos-passo-a-passo-preenchivel.pdf"
    printable = ROOT / "outputs" / "100-dias-sem-caos-passo-a-passo-impressao.pdf"
    if not fillable.exists() or not printable.exists():
        pytest.skip("PDFs ainda não gerados")
    report = validate_pair(fillable, printable, ROOT)
    assert report["fields"] > 0
    assert report["print_fields"] == 0

