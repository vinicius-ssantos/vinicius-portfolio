"""Parse GitHub profile HTML extracted by the web reader."""
import json
import re
from pathlib import Path
from html import unescape

src = Path("/home/z/my-project/github_profile.json")
data = json.loads(src.read_text(encoding="utf-8"))

html = data.get("data", {}).get("html", "") or ""
description = data.get("data", {}).get("description", "") or ""
title = data.get("data", {}).get("title", "") or ""

print("=== Metadados básicos ===")
print("Título da página:", title)
print("Descrição:", description)
print()

# Strip tags to plain text
text = re.sub(r"<script[^>]*>.*?</script>", " ", html, flags=re.S | re.I)
text = re.sub(r"<style[^>]*>.*?</style>", " ", text, flags=re.S | re.I)
text = re.sub(r"<[^>]+>", " ", text)
text = unescape(text)
text = re.sub(r"\s+", " ", text).strip()

# Try to find the name + bio block
print("=== Busca por trechos relevantes ===")

# Profile name (h1 in vcard-names)
m = re.search(r"vcard-names[^>]*>(.*?)</div>", html, flags=re.S | re.I)
if m:
    block = re.sub(r"<[^>]+>", " ", m.group(1))
    block = unescape(re.sub(r"\s+", " ", block)).strip()
    print("Nome no perfil:", block)

# Bio
m = re.search(r'data-bio-text="([^"]*)"', html)
if m:
    print("Bio:", unescape(m.group(1)))

# Followers / Following
for label in ["followers", "following"]:
    m = re.search(r'tabcount="(\d+)"[^>]*href="[^"]*tab=' + label, html, flags=re.I)
    if not m:
        m = re.search(r'href="[^"]*tab=' + label + r'[^"]*"[^>]*>\s*<span[^>]*>(\d+)\s*</span>\s*<span[^>]*>' + label, html, flags=re.I | re.S)
    if m:
        print(f"{label.capitalize()}:", m.group(1))

# Repo count from description
m = re.search(r"has (\d+) repositories available", description)
if m:
    print("Repositórios públicos:", m.group(1))

# Pinned / popular repos
print()
print("=== Repositórios em destaque (pinned) ===")
pins = re.findall(r'<h2 class="[^"]*wb-break-all[^"]*">\s*<a href="(/[^"]+)"[^>]*>([^<]+)</a>', html, flags=re.I)
seen = set()
for href, name in pins:
    if href in seen:
        continue
    seen.add(href)
    print(f"- {href.strip()}  ({name.strip()})")

# Try to find repo language stats
print()
print("=== Busca por linguagens ===")
langs = re.findall(r'<span class="color-fg-default text-bold mr-1">([^<]+)</span>', html)
for lang in set(langs):
    print("-", lang.strip())

# Try to find any contribution count
print()
print("=== Contribuições ===")
m = re.search(r'(\d[\d,]*)\s*contributions?\s*(in the last year|in \d{4})', text, flags=re.I)
if m:
    print("Contribuições:", m.group(0))

# Locate the "Repositories" tab count more robustly
m = re.search(r'href="/vinicius-ssantos\?tab=repositories"[^>]*>\s*<span[^>]*>(\d+)\s*</span>', html, flags=re.S | re.I)
if m:
    print("Total de repositórios (tab):", m.group(1))

# Stars
m = re.search(r'href="/vinicius-ssantos\?tab=stars"[^>]*>\s*<span[^>]*>(\d+)\s*</span>', html, flags=re.S | re.I)
if m:
    print("Stars:", m.group(1))
