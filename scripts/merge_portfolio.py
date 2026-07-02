"""Merge cover PDF + body PDF into the final deliverable."""
import sys
from pathlib import Path
from pypdf import PdfWriter, PdfReader

COVER = "/home/z/my-project/scripts/portfolio_cover.pdf"
BODY  = "/home/z/my-project/scripts/portfolio_body.pdf"
OUT   = "/home/z/my-project/download/Vinicius-Santos-Portfolio-2026.pdf"

Path(OUT).parent.mkdir(parents=True, exist_ok=True)

writer = PdfWriter()

cover_reader = PdfReader(COVER)
for page in cover_reader.pages:
    writer.add_page(page)

body_reader = PdfReader(BODY)
for page in body_reader.pages:
    writer.add_page(page)

# Set metadata
writer.add_metadata({
    "/Title": "Vinicius Santos — Backend Engineer Portfolio",
    "/Author": "Vinicius de Oliveira Santos",
    "/Subject": "Portfolio of selected backend & infrastructure projects (2024–2026)",
    "/Creator": "Vinicius Santos",
    "/Producer": "ReportLab + Playwright",
    "/Keywords": "Backend, Software Engineer, Kotlin, Spring, Java, Kubernetes, Docker, Microservices, Portfolio",
})

with open(OUT, "wb") as f:
    writer.write(f)

import os
size_kb = os.path.getsize(OUT) / 1024
print(f"✅ Final portfolio PDF: {OUT}")
print(f"   Size: {size_kb:.1f} KB")
print(f"   Pages: {len(cover_reader.pages) + len(body_reader.pages)}")
