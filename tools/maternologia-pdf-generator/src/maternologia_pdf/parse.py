from __future__ import annotations

import hashlib
import re
import unicodedata
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Tag
from markdown_it import MarkdownIt
from mdit_py_plugins.tasklists import tasklists_plugin

from .models import DocumentData, FieldData

DOCUMENT_ID = "maternologia.100-dias-sem-caos.passo-a-passo"
OUTPUT_BASENAME = "100-dias-sem-caos-passo-a-passo"
EXPECTED_TITLE = "100 Dias Sem Caos - O Passo a Passo"

PROMOTED_HEADINGS = {
    "Fundamento número 1: Não tenha medo de recalcular a rota",
    "Fundamento número 2: Autoconhecimento",
    "Fundamento número 3: Saúde",
    "Saúde física",
    "Saúde mental",
    "Saúde espiritual",
    "Saúde financeira",
    "Ajustando expectativas do casal",
    "Do que eu realmente vou precisar?",
    "Definindo meus limites",
    "Quem pode oferecer esse apoio?",
    "Existe a possibilidade de contratar ajuda?",
    "Comunicação",
    "Casa preparada",
    "Conhecimento",
    "Logística",
    "Mala maternidade",
    "Documentos",
    "Primeiros cuidados",
}

OPEN_QUESTION_TEXTS = {
    "Como eu costumo reagir ao estresse?",
    "O que costuma me sobrecarregar?",
    "O que eu gosto de fazer para me sentir melhor?",
    "Como imagino os primeiros dias após o nascimento?",
    "Em quais situações acho que vou precisar de mais ajuda?",
    "Quando é o melhor momento para conversar?",
    "Como eu espero me sentir depois dessa conversa e o que eu quero que mude?",
    "Avisar antes que eu quero conversar ajudaria?",
    "O que posso fazer para facilitar essa conversa?",
    "Eu estou aberta a ouvir o outro lado, mesmo que seja diferente do meu?",
}

EXCLUSIVE_PAIRS = [
    (
        "Quero receber visitas na maternidade.",
        "Prefiro não receber visitas na maternidade.",
    ),
    (
        "Quero receber visitas logo nos primeiros dias em casa.",
        "Prefiro esperar alguns dias antes de receber visitas.",
    ),
    (
        "Quero que todas as visitas sejam combinadas previamente.",
        "Não me importo com visitas surpresa.",
    ),
    (
        "Prefiro poucas visitas por dia.",
        "Não me incomodo em receber várias pessoas no mesmo dia.",
    ),
    (
        "Prefiro privacidade no momento da mamada e do sono do bebê, mesmo durante a visita.",
        "Não me importo que a rotina seja interrompida durante uma visita.",
    ),
    (
        "Só queremos que peguem o bebê quando nós oferecermos.",
        "Não nos importamos que peçam para segurá-lo.",
    ),
    (
        "Se o bebê estiver dormindo ou mamando, preferimos não interromper.",
        "Não nos incomodamos em interromper a rotina quando necessário.",
    ),
]

ESCAPED_UNDERSCORES = r"(?:(?:\\_){2,})"
INLINE_DATE_RE = re.compile(
    rf"{ESCAPED_UNDERSCORES}\s*/\s*{ESCAPED_UNDERSCORES}\s*/\s*{ESCAPED_UNDERSCORES}"
)
INLINE_UNDERSCORE_RE = re.compile(r"(?:\\_){4,}")


def _slug(value: str) -> str:
    ascii_value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_value.lower()).strip("-")
    return slug[:64] or "field"


def _placeholder(kind: str, index: int) -> str:
    return f"MATERN_{kind}_{index:03d}"


def _preprocess(source: str) -> tuple[str, dict[str, dict[str, object]]]:
    placeholders: dict[str, dict[str, object]] = {}
    area_index = 0
    inline_index = 0
    output: list[str] = []

    for raw_line in source.splitlines():
        line = raw_line.replace(r"\*\*", "**")
        line = re.sub(
            r"(?<!\*)\*(?!\*)([^*\n]+)\*(?!\*)",
            r"\1",
            line,
        )
        checkbox_match = re.match(r"^(\s*)\*\s+\\\[\s*\]\s*(.*)$", line)
        if checkbox_match:
            line = f"{checkbox_match.group(1)}- [ ] {checkbox_match.group(2)}"

        stripped = line.strip()
        plain_heading = re.sub(r"^\*\s+", "", stripped)
        if plain_heading in PROMOTED_HEADINGS:
            level = "###" if raw_line.startswith("*") else "####"
            line = f"{level} {plain_heading}"
            stripped = line.strip()

        if stripped == r"\---":
            area_index += 1
            token = _placeholder("AREA", area_index)
            placeholders[token] = {
                "kind": "textarea",
                "label": f"Área de resposta {area_index}",
                "maxlength": 420,
                "lines": 4,
            }
            line = token
        else:
            date_match = INLINE_DATE_RE.search(line)
            if date_match:
                inline_index += 1
                token = _placeholder("INLINE", inline_index)
                placeholders[token] = {
                    "kind": "date",
                    "label": "Data",
                    "maxlength": 10,
                }
                line = line[: date_match.start()] + token + line[date_match.end() :]

            while True:
                match = INLINE_UNDERSCORE_RE.search(line)
                if not match:
                    break
                inline_index += 1
                token = _placeholder("INLINE", inline_index)
                before = line[: match.start()]
                label = re.sub(r"[*:#-]", "", before).strip() or f"Resposta {inline_index}"
                kind = "text"
                maxlength = 80
                lower = label.lower()
                if "assinatura" in lower:
                    kind, maxlength = "signature", 120
                elif any(word in lower for word in ("maternidade", "obstetra", "pediatra", "telefone")):
                    kind, maxlength = "tel", 30
                elif "minutos" in line.lower():
                    maxlength = 4
                placeholders[token] = {
                    "kind": kind,
                    "label": label,
                    "maxlength": maxlength,
                }
                line = line[: match.start()] + token + line[match.end() :]

        output.append(line)

        visible = re.sub(r"^[\s*#\d.\-\[\]]+", "", stripped)
        visible = visible.replace("**", "").strip()
        if visible == "Se eu precisar descansar, posso contar com essas pessoas para ficarem com o bebê:":
            inline_index += 1
            token = _placeholder("INLINE", inline_index)
            placeholders[token] = {
                "kind": "text",
                "label": "Pessoas que podem ficar com o bebê",
                "maxlength": 160,
            }
            output[-1] = f"{line} {token}"
        elif visible in OPEN_QUESTION_TEXTS:
            area_index += 1
            token = _placeholder("AREA", area_index)
            placeholders[token] = {
                "kind": "textarea",
                "label": visible,
                "maxlength": 360,
                "lines": 3,
            }
            output.append(token)
        elif "como você pretende cultivá-la durante o puerpério?" in visible.lower():
            area_index += 1
            token = _placeholder("AREA", area_index)
            placeholders[token] = {
                "kind": "textarea",
                "label": visible,
                "maxlength": 360,
                "lines": 4,
            }
            output.append(token)
        elif visible == "Hoje eu me sinto:":
            area_index += 1
            token = _placeholder("AREA", area_index)
            placeholders[token] = {
                "kind": "textarea",
                "label": visible,
                "maxlength": 420,
                "lines": 5,
            }
            output.append(token)

    return "\n".join(output) + "\n", placeholders


def _control_html(
    soup: BeautifulSoup,
    field: FieldData,
    variant: str,
    *,
    lines: int = 1,
) -> Tag:
    wrapper = soup.new_tag("span" if lines == 1 else "div")
    wrapper["class"] = ["form-control", f"form-control--{field.kind}"]
    if variant == "print":
        static = soup.new_tag("span" if lines == 1 else "div")
        static["class"] = ["print-control", f"print-control--{field.kind}"]
        static["aria-label"] = field.label
        wrapper.append(static)
        return wrapper

    if field.kind == "textarea":
        control = soup.new_tag("textarea")
        control["rows"] = str(lines)
    else:
        control = soup.new_tag("input")
        control["type"] = "text"
        if field.kind == "tel":
            control["inputmode"] = "tel"
        if field.kind == "date":
            control["placeholder"] = "DD / MM / AAAA"
    control["name"] = field.name
    control["aria-label"] = field.label
    control["title"] = field.label
    if field.maxlength:
        control["maxlength"] = str(field.maxlength)
    wrapper.append(control)
    return wrapper


def parse_content(path: Path, variant: str) -> DocumentData:
    source_bytes = path.read_bytes()
    source = source_bytes.decode("utf-8")
    if not source.startswith(f"# {EXPECTED_TITLE}"):
        raise ValueError("Título canônico ausente ou alterado")

    prepared, placeholders = _preprocess(source)
    markdown = MarkdownIt("commonmark", {"html": False}).enable("table")
    markdown.use(tasklists_plugin, enabled=True, label=True)
    soup = BeautifulSoup(markdown.render(prepared), "html.parser")
    fields: list[FieldData] = []
    used_names: set[str] = set()

    def unique_name(label: str, prefix: str) -> str:
        base = f"{DOCUMENT_ID}.{prefix}.{_slug(label)}"
        name = base
        suffix = 2
        while name in used_names:
            name = f"{base}-{suffix:02d}"
            suffix += 1
        used_names.add(name)
        return name

    label_to_input: dict[str, Tag] = {}
    for index, checkbox in enumerate(soup.select('input[type="checkbox"]'), start=1):
        label = checkbox.parent.get_text(" ", strip=True)
        name = unique_name(label, "checklist")
        field = FieldData(name=name, kind="checkbox", label=label, export_value="Yes")
        fields.append(field)
        label_to_input[label] = checkbox
        if variant == "fillable":
            checkbox.attrs.pop("disabled", None)
            checkbox["name"] = name
            checkbox["value"] = "Yes"
            checkbox["title"] = label
            checkbox["aria-label"] = label
        else:
            replacement = soup.new_tag("span")
            replacement["class"] = ["print-checkbox"]
            replacement["aria-label"] = label
            checkbox.replace_with(replacement)

    if variant == "fillable":
        for group_index, pair in enumerate(EXCLUSIVE_PAIRS, start=1):
            if not all(label in label_to_input for label in pair):
                continue
            group_name = f"{DOCUMENT_ID}.choice.group-{group_index:02d}"
            for option_index, label in enumerate(pair, start=1):
                checkbox = label_to_input[label]
                old_name = checkbox.get("name", "")
                checkbox["type"] = "radio"
                checkbox["name"] = group_name
                checkbox["value"] = f"option-{option_index:02d}"
                for item in fields:
                    if item.name == old_name:
                        item.name = group_name
                        item.kind = "choice-one"
                        item.export_value = f"option-{option_index:02d}"
                        break

    for token, config in placeholders.items():
        node = soup.find(string=lambda text: isinstance(text, str) and token in text)
        if not isinstance(node, NavigableString):
            raise ValueError(f"Placeholder não renderizado: {token}")
        label = str(config["label"])
        kind = str(config["kind"])
        name = unique_name(label, "response")
        field = FieldData(
            name=name,
            kind=kind,  # type: ignore[arg-type]
            label=label,
            maxlength=int(config["maxlength"]),
        )
        fields.append(field)
        replacement = _control_html(
            soup, field, variant, lines=int(config.get("lines", 1))
        )
        before, _, after = str(node).partition(token)
        parts: list[object] = []
        if before:
            parts.append(NavigableString(before))
        parts.append(replacement)
        if after:
            parts.append(NavigableString(after))
        node.replace_with(*parts)

    table = soup.find("table")
    if isinstance(table, Tag):
        rows = table.find_all("tr")[1:]
        headers = [th.get_text(" ", strip=True) for th in table.find_all("th")]
        for row_index, row in enumerate(rows, start=1):
            cells = row.find_all("td")
            for col_index, cell in enumerate(cells, start=1):
                label = f"{headers[col_index - 1]} - linha {row_index}"
                kind = "checkbox" if col_index == 4 else ("textarea" if col_index == 2 else "text")
                name = f"{DOCUMENT_ID}.support-network.row-{row_index:02d}.column-{col_index:02d}"
                field = FieldData(
                    name=name,
                    kind=kind,  # type: ignore[arg-type]
                    label=label,
                    maxlength=None if kind == "checkbox" else (160 if kind == "textarea" else 80),
                )
                fields.append(field)
                cell.clear()
                if variant == "fillable":
                    control = soup.new_tag("input" if kind != "textarea" else "textarea")
                    if kind == "checkbox":
                        control["type"] = "checkbox"
                        control["value"] = "Yes"
                    elif kind == "textarea":
                        control["rows"] = "2"
                    else:
                        control["type"] = "text"
                    control["name"] = name
                    control["title"] = label
                    control["aria-label"] = label
                    if field.maxlength:
                        control["maxlength"] = str(field.maxlength)
                    cell.append(control)
                else:
                    static = soup.new_tag("span")
                    static["class"] = ["print-checkbox" if kind == "checkbox" else "print-table-field"]
                    cell.append(static)

    for h1 in soup.find_all("h1"):
        h1["id"] = "document-title"
        h1["class"] = ["cover-title"]
    for index, h2 in enumerate(soup.find_all("h2"), start=1):
        h2["id"] = f"section-{index:02d}"
        h2["class"] = ["section-opening"]
    for index, heading in enumerate(soup.find_all(["h3", "h4"]), start=1):
        heading["id"] = f"heading-{index:02d}-{_slug(heading.get_text(' ', strip=True))}"

    return DocumentData(
        document_id=DOCUMENT_ID,
        locale="pt-BR",
        output_basename=OUTPUT_BASENAME,
        title=EXPECTED_TITLE,
        source_sha256=hashlib.sha256(source_bytes).hexdigest().upper(),
        html_body=str(soup),
        fields=fields,
    )
