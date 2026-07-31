from pathlib import Path
import re

from bs4 import BeautifulSoup
from maternologia_pdf.parse import EXPECTED_TITLE, parse_content


ROOT = Path(__file__).resolve().parents[1]


def test_source_is_preserved() -> None:
    assert (ROOT / "content" / "content.md").read_bytes() == (
        ROOT / "references" / "source-audit.md"
    ).read_bytes()


def test_content_parses_for_both_variants() -> None:
    fillable = parse_content(ROOT / "content" / "content.md", "fillable")
    printable = parse_content(ROOT / "content" / "content.md", "print")
    assert fillable.title == EXPECTED_TITLE
    assert fillable.source_sha256 == printable.source_sha256
    assert len(fillable.fields) >= 180


def test_visible_text_is_kept_in_order() -> None:
    source = (ROOT / "content" / "content.md").read_text(encoding="utf-8")
    document = parse_content(ROOT / "content" / "content.md", "fillable")
    rendered = BeautifulSoup(document.html_body, "html.parser").get_text(" ", strip=True)
    rendered = re.sub(r"\s+", " ", rendered)
    rendered = re.sub(r"\s+([.,;:?!])", r"\1", rendered)
    cursor = 0

    for raw_line in source.splitlines():
        line = raw_line.strip()
        if not line or line == r"\---" or re.fullmatch(r"\|[-|]+\|", line):
            continue
        if re.fullmatch(r"\|+\s*", line):
            continue
        line = re.sub(r"^#{1,4}\s+", "", line)
        line = re.sub(r"^[>*]\s*", "", line)
        line = re.sub(r"^\d+\.\s*", "", line)
        line = re.sub(r"^\\?\[\s*\]\s*", "", line)
        line = re.sub(r"(?:\\_){2,}", "", line)
        line = re.sub(r"\s*/\s*/\s*$", "", line)
        line = line.replace(r"\*", "*").replace("*", "")
        if line.startswith("|") and line.endswith("|"):
            parts = [part.strip() for part in line.strip("|").split("|") if part.strip()]
        else:
            parts = [line.strip()]
        for part in parts:
            part = re.sub(r"\s+", " ", part).strip()
            if not part:
                continue
            found = rendered.find(part, cursor)
            assert found >= 0, f"Texto ausente ou fora de ordem: {part!r}"
            cursor = found + len(part)
