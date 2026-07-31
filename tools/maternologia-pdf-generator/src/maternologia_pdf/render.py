from __future__ import annotations

from pathlib import Path

from jinja2 import Environment, FileSystemLoader, StrictUndefined, select_autoescape
from markupsafe import Markup

from .models import DocumentData


def render_html(root: Path, document: DocumentData, variant: str) -> str:
    environment = Environment(
        loader=FileSystemLoader(root / "templates"),
        undefined=StrictUndefined,
        autoescape=select_autoescape(("html", "j2")),
    )
    template = environment.get_template("document.html.j2")
    common_css = (root / "styles" / "design.css").read_text(encoding="utf-8")
    variant_css = (root / "styles" / f"{variant}.css").read_text(encoding="utf-8")
    fonts_uri = (root / "fonts").resolve().as_uri()
    common_css = common_css.replace("__FONTS_URI__", fonts_uri)
    return template.render(
        document=document,
        variant=variant,
        body=Markup(document.html_body),
        css=Markup(common_css + "\n" + variant_css),
    )

