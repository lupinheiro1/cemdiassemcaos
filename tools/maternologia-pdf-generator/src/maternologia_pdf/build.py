from __future__ import annotations

import json
import os
import shutil
import subprocess
from pathlib import Path

from .forms import normalize_form
from .parse import parse_content
from .render import render_html
from .validate import _tool, tool_environment, validate_pair


def _run_weasyprint(
    executable: Path,
    html: Path,
    pdf: Path,
    *,
    forms: bool,
    environment: dict[str, str],
) -> None:
    command = [
        str(executable),
        "--pdf-tags",
        "--pdf-variant",
        "pdf/ua-1",
        "--output-intent",
        "srgb",
        "--full-fonts",
        "--media-type",
        "print",
    ]
    if forms:
        command.append("--pdf-forms")
    command.extend([str(html), str(pdf)])
    subprocess.run(
        command,
        cwd=html.parent,
        env=environment,
        check=True,
        capture_output=True,
        text=True,
    )


def build() -> dict[str, object]:
    root = Path(__file__).resolve().parents[2]
    content = root / "content" / "content.md"
    source_audit = root / "references" / "source-audit.md"
    if content.read_bytes() != source_audit.read_bytes():
        raise ValueError("A fonte canônica diverge da cópia de auditoria")

    work = root / "work"
    outputs = root / "outputs"
    work.mkdir(exist_ok=True)
    outputs.mkdir(exist_ok=True)
    environment = tool_environment(root)
    weasyprint = _tool(root, "weasyprint.exe")

    fill_document = parse_content(content, "fillable")
    print_document = parse_content(content, "print")
    if fill_document.source_sha256 != print_document.source_sha256:
        raise ValueError("As variantes não partiram da mesma fonte")

    fill_html = work / "document-fillable.html"
    print_html = work / "document-print.html"
    fill_html.write_text(
        render_html(root, fill_document, "fillable"), encoding="utf-8"
    )
    print_html.write_text(
        render_html(root, print_document, "print"), encoding="utf-8"
    )

    preliminary = work / "fillable-preliminary.pdf"
    normalized = work / "fillable-normalized.pdf"
    print_pdf = work / "print.pdf"
    _run_weasyprint(
        weasyprint, fill_html, preliminary, forms=True, environment=environment
    )
    form_report = normalize_form(preliminary, normalized)
    _run_weasyprint(
        weasyprint, print_html, print_pdf, forms=False, environment=environment
    )

    validation = validate_pair(normalized, print_pdf, root)
    report = {
        "source_sha256": fill_document.source_sha256,
        "declared_fields": len(fill_document.fields),
        "form_normalization": form_report,
        "validation": validation,
    }
    (work / "validation-report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (root / "tests" / "fixtures" / "expected-fields.json").write_text(
        json.dumps(
            [field.model_dump() for field in fill_document.fields],
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    destinations = (
        outputs / "100-dias-sem-caos-passo-a-passo-preenchivel.pdf",
        outputs / "100-dias-sem-caos-passo-a-passo-impressao.pdf",
    )
    temporary_destinations = tuple(path.with_suffix(".tmp.pdf") for path in destinations)
    shutil.copy2(normalized, temporary_destinations[0])
    shutil.copy2(print_pdf, temporary_destinations[1])
    os.replace(temporary_destinations[0], destinations[0])
    os.replace(temporary_destinations[1], destinations[1])
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return report
