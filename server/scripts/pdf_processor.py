#!/usr/bin/env python3
"""
DocMaster PDF Processor — Pipeline avançado de extração de layout PDF
=====================================================================
Fluxo: Upload PDF → OCR + pdfplumber + pdftohtml → Extração de campos →
       Geração de template JSON → Pronto para renderização no frontend

Capacidades:
  - Extração de texto via pdfplumber (texto nativo)
  - OCR via Tesseract (para PDFs escaneados/imagem)
  - Extração de tabelas via pdfplumber
  - Extração de imagens embutidas
  - Conversão PDF→HTML via pdftohtml (poppler)
  - Detecção automática de campos editáveis
  - Geração de template JSON com posições, fontes, tamanhos
  - Geração de preview em imagem (PNG)

Uso:
  python3 pdf_processor.py <input.pdf> <output_dir> [--ocr] [--lang por]
"""

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any

import pdfplumber
from pdf2image import convert_from_path
from PIL import Image

try:
    import pytesseract
except ImportError:
    pytesseract = None


def extract_pdf_metadata(pdf_path: str) -> dict:
    """Extrai metadados básicos do PDF via pdfinfo."""
    result = subprocess.run(
        ["pdfinfo", pdf_path], capture_output=True, text=True
    )
    meta = {}
    for line in result.stdout.strip().split("\n"):
        if ":" in line:
            key, val = line.split(":", 1)
            meta[key.strip()] = val.strip()
    return meta


def extract_images_from_pdf(pdf_path: str, output_dir: str) -> list[str]:
    """Extrai imagens embutidas do PDF via pdfimages."""
    img_dir = os.path.join(output_dir, "images")
    os.makedirs(img_dir, exist_ok=True)
    prefix = os.path.join(img_dir, "img")
    subprocess.run(
        ["pdfimages", "-all", pdf_path, prefix],
        capture_output=True,
    )
    images = sorted(Path(img_dir).glob("img-*"))
    return [str(p) for p in images]


def pdf_to_html(pdf_path: str, output_dir: str) -> str:
    """Converte PDF para HTML via pdftohtml (poppler)."""
    html_dir = os.path.join(output_dir, "html")
    os.makedirs(html_dir, exist_ok=True)
    output_file = os.path.join(html_dir, "output")
    subprocess.run(
        [
            "pdftohtml",
            "-c",           # complex output (CSS positioning)
            "-noframes",    # single HTML file
            "-zoom", "1.5", # higher resolution
            "-enc", "UTF-8",
            pdf_path,
            output_file,
        ],
        capture_output=True,
    )
    html_file = output_file + ".html"
    if os.path.exists(html_file):
        return html_file
    # fallback: try with -s (single page)
    html_files = list(Path(html_dir).glob("*.html"))
    return str(html_files[0]) if html_files else ""


def generate_preview(pdf_path: str, output_dir: str, dpi: int = 150) -> list[str]:
    """Gera imagens PNG de preview para cada página."""
    preview_dir = os.path.join(output_dir, "previews")
    os.makedirs(preview_dir, exist_ok=True)
    images = convert_from_path(pdf_path, dpi=dpi)
    paths = []
    for i, img in enumerate(images):
        path = os.path.join(preview_dir, f"page_{i + 1}.png")
        img.save(path, "PNG")
        paths.append(path)
    return paths


def extract_text_native(pdf_path: str) -> list[dict]:
    """Extrai texto nativo do PDF com posições via pdfplumber."""
    pages_data = []
    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages):
            words = page.extract_words(
                keep_blank_chars=True,
                x_tolerance=3,
                y_tolerance=3,
                extra_attrs=["fontname", "size"],
            )
            chars = page.chars
            text = page.extract_text() or ""
            tables = page.extract_tables() or []

            page_data = {
                "page": page_num + 1,
                "width": float(page.width),
                "height": float(page.height),
                "text": text,
                "words": [
                    {
                        "text": w["text"],
                        "x0": round(float(w["x0"]), 2),
                        "y0": round(float(w["top"]), 2),
                        "x1": round(float(w["x1"]), 2),
                        "y1": round(float(w["bottom"]), 2),
                        "font": w.get("fontname", ""),
                        "size": round(float(w.get("size", 0)), 1),
                    }
                    for w in words
                ],
                "tables": tables,
                "num_chars": len(chars),
            }
            pages_data.append(page_data)
    return pages_data


def extract_text_ocr(pdf_path: str, lang: str = "por") -> list[dict]:
    """Extrai texto via OCR (Tesseract) para PDFs escaneados."""
    if pytesseract is None:
        return [{"error": "pytesseract not installed"}]

    images = convert_from_path(pdf_path, dpi=300)
    pages_data = []
    for i, img in enumerate(images):
        # OCR com dados de posição
        ocr_data = pytesseract.image_to_data(
            img, lang=lang, output_type=pytesseract.Output.DICT
        )
        text = pytesseract.image_to_string(img, lang=lang)

        words = []
        for j in range(len(ocr_data["text"])):
            word = ocr_data["text"][j].strip()
            if word:
                words.append({
                    "text": word,
                    "x0": ocr_data["left"][j],
                    "y0": ocr_data["top"][j],
                    "x1": ocr_data["left"][j] + ocr_data["width"][j],
                    "y1": ocr_data["top"][j] + ocr_data["height"][j],
                    "confidence": ocr_data["conf"][j],
                    "block": ocr_data["block_num"][j],
                    "line": ocr_data["line_num"][j],
                })

        pages_data.append({
            "page": i + 1,
            "width": img.width,
            "height": img.height,
            "text": text,
            "words": words,
            "ocr": True,
        })
    return pages_data


def detect_editable_fields(pages_data: list[dict]) -> list[dict]:
    """Detecta campos editáveis automaticamente baseado em padrões."""
    fields = []
    field_id = 0

    # Padrões comuns em documentos acadêmicos brasileiros
    patterns = [
        (r"Nome\s*(?:do\s*)?Alun[oa]?\s*:?\s*(.+)", "nome_aluno", "Dados do Aluno"),
        (r"R\.?G\.?\s*:?\s*([\d./-]+)", "rg", "Dados do Aluno"),
        (r"R\.?A\.?\s*:?\s*([\d./-]+)", "ra", "Dados do Aluno"),
        (r"Data\s*(?:de\s*)?Nascimento\s*:?\s*([\d/]+)", "data_nascimento", "Dados do Aluno"),
        (r"Município\s*:?\s*(.+?)(?:\s*Estado|\s*$)", "municipio", "Dados do Aluno"),
        (r"Estado\s*:?\s*([A-Z]{2})", "estado", "Dados do Aluno"),
        (r"País\s*:?\s*(.+?)(?:\s|$)", "pais", "Dados do Aluno"),
        (r"Escola\s*:?\s*(.+)", "escola", "Instituição"),
        (r"CEP\s*:?\s*([\d.-]+)", "cep", "Instituição"),
        (r"Tel\.?\s*:?\s*\(?\d{2}\)?\s*[\d.-]+", "telefone", "Instituição"),
        (r"Endereço\s*:?\s*(.+?)(?:\s*N[ºo°]|\s*$)", "endereco", "Instituição"),
        (r"N[ºo°]\s*:?\s*(\d+)", "numero", "Instituição"),
        (r"Bairro\s*:?\s*(.+?)(?:\s*Município|\s*$)", "bairro", "Instituição"),
    ]

    for page in pages_data:
        full_text = page.get("text", "")
        for pattern, field_name, category in patterns:
            match = re.search(pattern, full_text, re.IGNORECASE)
            if match:
                value = match.group(1).strip() if match.lastindex else match.group(0).strip()
                # Evitar duplicatas
                if not any(f["id"] == field_name for f in fields):
                    fields.append({
                        "id": field_name,
                        "label": field_name.replace("_", " ").title(),
                        "category": category,
                        "originalValue": value,
                        "currentValue": value,
                        "page": page["page"],
                    })
                    field_id += 1

    # Detectar campos de notas/tabelas
    for page in pages_data:
        for table in page.get("tables", []):
            if table and len(table) > 1:
                # Verificar se parece tabela de notas
                header = table[0] if table[0] else []
                header_text = " ".join(str(h) for h in header if h).lower()
                if any(kw in header_text for kw in ["nota", "série", "ano", "componente", "disciplina", "carga"]):
                    fields.append({
                        "id": f"table_page_{page['page']}",
                        "label": f"Tabela de Notas (Página {page['page']})",
                        "category": "Acadêmico",
                        "type": "table",
                        "headers": [str(h) for h in header if h],
                        "rows": [[str(c) if c else "" for c in row] for row in table[1:]],
                        "page": page["page"],
                    })

    return fields


def process_pdf(
    pdf_path: str,
    output_dir: str,
    use_ocr: bool = False,
    ocr_lang: str = "por",
) -> dict:
    """Pipeline completo de processamento de PDF."""
    os.makedirs(output_dir, exist_ok=True)

    result: dict[str, Any] = {
        "source": os.path.basename(pdf_path),
        "output_dir": output_dir,
    }

    # 1. Metadados
    print("[1/6] Extraindo metadados...")
    result["metadata"] = extract_pdf_metadata(pdf_path)

    # 2. Imagens embutidas
    print("[2/6] Extraindo imagens embutidas...")
    result["embedded_images"] = extract_images_from_pdf(pdf_path, output_dir)

    # 3. Preview PNG
    print("[3/6] Gerando previews...")
    result["previews"] = generate_preview(pdf_path, output_dir)

    # 4. Texto nativo
    print("[4/6] Extraindo texto nativo...")
    result["pages"] = extract_text_native(pdf_path)

    # 5. OCR (se solicitado ou se texto nativo é escasso)
    total_chars = sum(p.get("num_chars", 0) for p in result["pages"])
    if use_ocr or total_chars < 50:
        print("[5/6] Executando OCR...")
        result["ocr_pages"] = extract_text_ocr(pdf_path, ocr_lang)
    else:
        print("[5/6] OCR não necessário (texto nativo suficiente)")
        result["ocr_pages"] = []

    # 6. Detecção de campos
    print("[6/6] Detectando campos editáveis...")
    source_pages = result["ocr_pages"] if result["ocr_pages"] else result["pages"]
    result["fields"] = detect_editable_fields(source_pages)

    # 7. Conversão PDF→HTML
    print("[BONUS] Convertendo PDF para HTML...")
    html_path = pdf_to_html(pdf_path, output_dir)
    result["html_path"] = html_path

    # Salvar resultado JSON
    json_path = os.path.join(output_dir, "extraction_result.json")
    # Converter para JSON-serializable
    serializable = json.loads(json.dumps(result, default=str))
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(serializable, f, ensure_ascii=False, indent=2)

    print(f"\nProcessamento concluído! Resultado salvo em: {json_path}")
    print(f"  - {len(result['embedded_images'])} imagens extraídas")
    print(f"  - {len(result['previews'])} previews gerados")
    print(f"  - {len(result['pages'])} páginas processadas")
    print(f"  - {len(result['fields'])} campos detectados")
    if html_path:
        print(f"  - HTML gerado: {html_path}")

    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="DocMaster PDF Processor")
    parser.add_argument("pdf", help="Caminho do arquivo PDF")
    parser.add_argument("output", help="Diretório de saída")
    parser.add_argument("--ocr", action="store_true", help="Forçar OCR")
    parser.add_argument("--lang", default="por", help="Idioma OCR (default: por)")
    args = parser.parse_args()

    if not os.path.exists(args.pdf):
        print(f"Erro: arquivo não encontrado: {args.pdf}")
        sys.exit(1)

    process_pdf(args.pdf, args.output, args.ocr, args.lang)
