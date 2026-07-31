from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


FieldKind = Literal[
    "checkbox", "choice-one", "text", "textarea", "date", "tel", "signature"
]


class FieldData(BaseModel):
    model_config = ConfigDict(strict=True)

    name: str
    kind: FieldKind
    label: str
    maxlength: int | None = None
    widgets: int = Field(default=1, ge=1)
    export_value: str | None = None


class DocumentData(BaseModel):
    model_config = ConfigDict(strict=True)

    document_id: str
    locale: str
    output_basename: str
    title: str
    source_sha256: str
    html_body: str
    fields: list[FieldData]

