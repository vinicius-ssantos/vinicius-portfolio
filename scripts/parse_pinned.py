"""Extract pinned items from the profile page (proper selectors)."""
import json
import re
from pathlib import Path
from html import unescape

data = json.loads(Path("/home/z/my-project/github_repos.json").read_text(encoding="utf-8"))
html = data.get("data", {}).get("html", "") or ""

# Each pinned repo is in <li class="...pinned-item-list-item...">
blocks = re.findall(r'<li[^>]*pinned-item-list-item[^>]*>(.*?)</li>', html, flags=re.S | re.I)
print(f"Pinned items: {len(blocks)}\n")

pinned = []
for b in blocks:
    name_m = re.search(r'href="/vinicius-ssantos/([^"]+)"[^>]*>\s*<span class="repo">([^<]+)</span>', b)
    if not name_m:
        continue
    repo_path = name_m.group(1)
    repo_name = name_m.group(2)
    desc_m = re.search(r'<p class="pinned-item-desc[^"]*"[^>]*>\s*(.*?)\s*</p>', b, flags=re.S | re.I)
    desc = ""
    if desc_m:
        desc = unescape(re.sub(r"<[^>]+>", "", desc_m.group(1)).strip())
    lang_m = re.search(r'itemprop="programmingLanguage">([^<]+)<', b)
    lang = lang_m.group(1).strip() if lang_m else ""
    pinned.append({"name": repo_name, "desc": desc, "lang": lang})
    print(f"• {repo_name}")
    print(f"  Linguagem: {lang}")
    print(f"  Descrição: {desc}")
    print()

print("\n=== Salvo em /home/z/my-project/pinned_repos.json ===")
Path("/home/z/my-project/pinned_repos.json").write_text(
    json.dumps(pinned, ensure_ascii=False, indent=2), encoding="utf-8"
)
