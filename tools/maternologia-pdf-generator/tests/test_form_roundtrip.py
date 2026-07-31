import json
from pathlib import Path

from pypdf import PdfReader, PdfWriter


ROOT = Path(__file__).resolve().parents[1]


def test_form_values_survive_roundtrip() -> None:
    source = ROOT / "outputs" / "100-dias-sem-caos-passo-a-passo-preenchivel.pdf"
    if not source.exists():
        return
    fixture = json.loads(
        (ROOT / "tests" / "fixtures" / "filled-values.json").read_text(encoding="utf-8")
    )
    reader = PdfReader(source)
    fields = reader.get_fields() or {}
    text_fields = [
        name for name, field in fields.items() if field.get("/FT") == "/Tx"
    ]
    assert len(text_fields) >= 4
    values = {
        text_fields[0]: fixture["signature"],
        text_fields[1]: fixture["date"],
        text_fields[2]: fixture["textarea"],
        text_fields[3]: fixture["telephone"],
    }

    destination = ROOT / "work" / "filled-roundtrip.pdf"
    destination.parent.mkdir(parents=True, exist_ok=True)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    writer.update_page_form_field_values(
        None, values, auto_regenerate=False
    )
    with destination.open("wb") as stream:
        writer.write(stream)

    reopened = PdfReader(destination)
    reopened_fields = reopened.get_fields() or {}
    for name, value in values.items():
        assert reopened_fields[name].get("/V") == value
