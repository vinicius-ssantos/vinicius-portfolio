"""Try multiple selectors to find repo list on the repositories tab."""
import json
import re
from pathlib import Path
from html import unescape

data = json.loads(Path("/home/z/my-project/github_repos_source.json").read_text(encoding="utf-8"))
html = data.get("data", {}).get("html", "") or ""

# Find all <a> tags with href pattern /vinicius-ssantos/REPO that look like repo links
# Repo links typically have class containing "Link--primary" or itemprop="name codeRepository"
all_links = re.findall(r'href="/vinicius-ssantos/([A-Za-z0-9_.\-]+)"', html)
ignore = {"followers", "following", "stars", "repositories", "projects",
          "packages", "overview", "activity", "subscriptions", "tab", "settings",
          "achievements", "contribution", "pulse", "graphs", "issues", "pulls",
          "actions", "wiki", "security", "insights", "sponsors", "stash"}
repos = []
seen = set()
for r in all_links:
    if r.lower() in ignore:
        continue
    if r in seen:
        continue
    seen.add(r)
    repos.append(r)

print(f"Total de repos únicos: {len(repos)}")
print()
for r in repos:
    print(" -", r)

# Now find descriptions for each
print()
print("=== Detalhes por repo ===")
for r in repos:
    # find block: starting at /vinicius-ssantos/REPO up to next /vinicius-ssantos/
    pat = re.compile(r'/vinicius-ssantos/' + re.escape(r) + r'"(.*?)(?=/vinicius-ssantos/[^"]+"|\Z)', re.S | re.I)
    m = pat.search(html)
    if not m:
        continue
    block = m.group(0)
    # Description appears in <p> ... </p>
    desc_m = re.search(r'<p[^>]*>([^<]{5,300})</p>', block, flags=re.S)
    desc = ""
    if desc_m:
        candidate = unescape(re.sub(r"<[^>]+>", "", desc_m.group(1)).strip())
        if candidate and len(candidate) > 5 and "aria" not in candidate.lower():
            desc = candidate
    lang_m = re.search(r'itemprop="programmingLanguage">([^<]+)<', block)
    lang = lang_m.group(1).strip() if lang_m else ""
    # Find updated datetime
    upd_m = re.search(r'datetime="([^"]+)"', block)
    updated = upd_m.group(1)[:10] if upd_m else ""
    if desc or lang or updated:
        print(f"\n• {r}")
        if lang:
            print(f"  Lang: {lang}")
        if updated:
            print(f"  Atualizado: {updated}")
        if desc:
            print(f"  Descrição: {desc[:200]}")

# Save list
Path("/home/z/my-project/all_repos.json").write_text(
    json.dumps(repos, ensure_ascii=False, indent=2), encoding="utf-8"
)
