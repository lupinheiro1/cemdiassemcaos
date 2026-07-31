from __future__ import annotations

import json
import os
import subprocess
from pathlib import Path

from pypdf import PdfReader

OUTPUT_NAMES = (
    "100-dias-sem-caos-passo-a-passo-preenchivel.pdf",
    "100-dias-sem-caos-passo-a-passo-impressao.pdf",
)


def _tool(root: Path, pattern: str) -> Path:
    matches = list((root / ".tools").rglob(pattern))
    if not matches:
        raise FileNotFoundError(f"Ferramenta ausente: {pattern}")
    return matches[0]


def _widgets(reader: PdfReader) -> int:
    return sum(
        1
        for page in reader.pages
        for ref in page.get("/Annots", [])
        if ref.get_object().get("/Subtype") == "/Widget"
    )


def validate_pair(fillable: Path, printable: Path, root: Path) -> dict[str, object]:
    fill_reader = PdfReader(fillable)
    print_reader = PdfReader(printable)
    fill_fields = fill_reader.get_fields() or {}
    print_fields = print_reader.get_fields() or {}
    fill_widgets = _widgets(fill_reader)
    print_widgets = _widgets(print_reader)

    if not fill_fields or not fill_widgets:
        raise ValueError("PDF preenchível sem formulário funcional")
    if print_fields or print_widgets or print_reader.trailer["/Root"].get("/AcroForm"):
        raise ValueError("PDF de impressão contém formulário")
    if len(fill_reader.pages) != len(print_reader.pages):
        raise ValueError("As variantes possuem quantidades de páginas diferentes")

    for reader in (fill_reader, print_reader):
        for page in reader.pages:
            width = float(page.mediabox.width)
            height = float(page.mediabox.height)
            if abs(width - 595.28) > 2 or abs(height - 841.89) > 2:
                raise ValueError("Página fora do formato A4")

    qpdf = _tool(root, "qpdf.exe")
    for pdf in (fillable, printable):
        subprocess.run(
            [str(qpdf), "--check", str(pdf)],
            check=True,
            capture_output=True,
            text=True,
        )

    return {
        "fillable_pages": len(fill_reader.pages),
        "print_pages": len(print_reader.pages),
        "fields": len(fill_fields),
        "widgets": fill_widgets,
        "print_fields": len(print_fields),
        "print_widgets": print_widgets,
        "a4": True,
        "qpdf": "passed",
    }


def validate_outputs() -> dict[str, object]:
    root = Path(__file__).resolve().parents[2]
    report = validate_pair(
        root / "outputs" / OUTPUT_NAMES[0],
        root / "outputs" / OUTPUT_NAMES[1],
        root,
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return report


def tool_environment(root: Path) -> dict[str, str]:
    environment = os.environ.copy()
    java = _tool(root, "java.exe")
    java_home = java.parents[1]
    environment["JAVA_HOME"] = str(java_home)
    environment["PATH"] = f"{java.parent};{environment.get('PATH', '')}"
    cache = root / "work" / "fontconfig-cache"
    cache.mkdir(parents=True, exist_ok=True)
    environment["XDG_CACHE_HOME"] = str(root / "work")
    environment["LOCALAPPDATA"] = str(root / "work" / "localappdata")
    return environment

