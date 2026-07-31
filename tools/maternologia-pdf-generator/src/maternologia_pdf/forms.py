from __future__ import annotations

from pathlib import Path

from pypdf import PdfReader, PdfWriter
from pypdf.generic import (
    ArrayObject,
    BooleanObject,
    DictionaryObject,
    NameObject,
    NumberObject,
    TextStringObject,
)


def _widget_rects(reader: PdfReader) -> list[tuple[float, ...]]:
    rects: list[tuple[float, ...]] = []
    for page in reader.pages:
        for annotation_ref in page.get("/Annots", []):
            annotation = annotation_ref.get_object()
            if annotation.get("/Subtype") == "/Widget":
                rects.append(tuple(float(value) for value in annotation.get("/Rect", [])))
    return rects


def normalize_form(source: Path, destination: Path) -> dict[str, object]:
    reader = PdfReader(source)
    before_rects = _widget_rects(reader)
    fields = reader.get_fields() or {}
    if not fields:
        raise ValueError("O PDF preenchível não contém campos AcroForm")

    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    acroform = writer.root_object.get("/AcroForm")
    if acroform:
        acroform = acroform.get_object()
        acroform[NameObject("/NeedAppearances")] = BooleanObject(True)
        helvetica = DictionaryObject(
            {
                NameObject("/Type"): NameObject("/Font"),
                NameObject("/Subtype"): NameObject("/Type1"),
                NameObject("/BaseFont"): NameObject("/Helvetica"),
                NameObject("/Encoding"): NameObject("/WinAnsiEncoding"),
            }
        )
        helvetica_ref = writer._add_object(helvetica)
        acroform[NameObject("/DR")] = DictionaryObject(
            {
                NameObject("/Font"): DictionaryObject(
                    {NameObject("/Helv"): helvetica_ref}
                )
            }
        )
        acroform[NameObject("/DA")] = TextStringObject("/Helv 10 Tf 0 g")
        top_level_fields = acroform.get("/Fields", [])
        acroform[NameObject("/Fields")] = ArrayObject(
            field_ref
            for field_ref in top_level_fields
            if not field_ref.get_object().get("/Parent")
        )

    widget_count = 0
    for page in writer.pages:
        page[NameObject("/Tabs")] = NameObject("/S")
        for annotation_ref in page.get("/Annots", []):
            annotation = annotation_ref.get_object()
            if annotation.get("/Subtype") != "/Widget":
                continue
            widget_count += 1
            annotation[NameObject("/F")] = NumberObject(int(annotation.get("/F", 0)) | 4)
            if annotation.get("/FT") == "/Tx":
                annotation[NameObject("/DA")] = TextStringObject("/Helv 10 Tf 0 g")
            target = annotation
            if annotation.get("/Parent"):
                target = annotation["/Parent"].get_object()
                if annotation.get("/T") == target.get("/T"):
                    annotation.pop(NameObject("/T"), None)
            if target.get("/FT") == "/Tx":
                target[NameObject("/DA")] = TextStringObject("/Helv 10 Tf 0 g")
            label = target.get("/TU") or target.get("/T")
            if label and not target.get("/TU"):
                target[NameObject("/TU")] = TextStringObject(str(label))

    with destination.open("wb") as stream:
        writer.write(stream)

    reopened = PdfReader(destination)
    after_rects = _widget_rects(reopened)
    if before_rects != after_rects:
        raise ValueError("A normalização alterou coordenadas de widgets")
    if not (reopened.get_fields() or {}):
        raise ValueError("A normalização removeu a árvore de campos")
    return {
        "fields": len(fields),
        "widgets": widget_count,
        "rects_preserved": True,
    }
