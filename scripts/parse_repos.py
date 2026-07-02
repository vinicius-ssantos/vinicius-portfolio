"""Extract repository list from GitHub repositories tab HTML."""
import json
import re
from pathlib import Path
from html import unescape

src = Path("/home/z/my-project/github_repos.json")
data = json.loads(src.read_text(encoding="utf-8"))
html = data.get("data", {}).get("html", "") or ""

# Each repo lives in a <li> with class containing "source" or "public"
# Repo name in <a itemprop="name codeRepository" href="/vinicius-ssantos/REPO">
items = re.findall(r'itemprop="name codeRepository"[^>]*href="(/vinicius-ssantos/([^"]+))"[^>]*>([^<]*)</a>', html)
print(f"Total de repositórios encontrados: {len(items)}")
print()

# Repo descriptions and language from the same <li> blocks
# Try to extract each li block
li_blocks = re.findall(r'<li[^>]*itemprop="owns"[^>]*>(.*?)</li>', html, flags=re.S | re.I)
if not li_blocks:
    li_blocks = re.findall(r'<div[^>]*class="[^"]*Box-row[^"]*"[^>]*>(.*?)</div>\s*</div>', html, flags=re.S | re.I)

print(f"Blocos <li>: {len(li_blocks)}")
print()

# Try a different approach: parse by anchors
all_repos = re.findall(r'href="/vinicius-ssantos/([A-Za-z0-9_.\-]+)"[^>]*itemprop="name', html)
unique_repos = []
seen = set()
for r in all_repos:
    if r not in seen:
        seen.add(r)
        unique_repos.append(r)
print("Repositórios (por itemprop name):")
for r in unique_repos:
    print(" -", r)

# Look for descriptions near each repo
print()
print("=== Detalhes (descrição + linguagem) ===")
# Pattern: <h3 ...>name</h3> ... <p>description</p> ... <span>Language</span>
# Use a more permissive search around each repo link
for r in unique_repos[:60]:
    # Find the block around this repo
    pat = re.compile(r'/vinicius-ssantos/' + re.escape(r) + r'"[^>]*>(.*?)</li>', re.S | re.I)
    m = pat.search(html)
    if not m:
        # fallback
        pat = re.compile(r'/vinicius-ssantos/' + re.escape(r) + r'"(.*?)(?=/vinicius-ssantos/|\Z)', re.S | re.I)
        m = pat.search(html)
    if not m:
        continue
    block = m.group(0)
    # Description
    desc_m = re.search(r'itemprop="description"[^>]*>([^<]*)</p>', block, flags=re.I)
    desc = unescape(desc_m.group(1).strip()) if desc_m else ""
    # Language
    lang_m = re.search(r'itemprop="programmingLanguage"[^>]*>([^<]+)<', block, flags=re.I)
    lang = lang_m.group(1).strip() if lang_m else ""
    # Stars / forks
    stars_m = re.search(r'/stargazers"[^>]*>.*?(\d+)\s*</a>', block, flags=re.S | re.I)
    stars = stars_m.group(1) if stars_m else "0"
    forks_m = re.search(r'/forks"[^>]*>.*?(\d+)\s*</a>', block, flags=re.S | re.I)
    forks = forks_m.group(1) if forks_m else "0"
    # Updated
    upd_m = re.search(r'updated="([^"]+)"', block)
    updated = upd_m.group(1) if upd_m else ""
    print(f"\n• {r}")
    if desc:
        print(f"  Descrição: {desc}")
    if lang:
        print(f"  Linguagem: {lang}")
    print(f"  ⭐ {stars}  🍴 {forks}  📅 {updated[:10] if updated else 'n/a'}")
