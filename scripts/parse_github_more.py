"""Extract more details from GitHub profile HTML."""
import json
import re
from pathlib import Path
from html import unescape

src = Path("/home/z/my-project/github_profile.json")
data = json.loads(src.read_text(encoding="utf-8"))
html = data.get("data", {}).get("html", "") or ""

# Find all links that look like repos owned by this user
# Pinned repos usually appear with class "repo" on an <a> or with href="/vinicius-ssantos/REPO"
print("=== Todos os links internos /vinicius-ssantos/REPO ===")
repo_links = re.findall(r'href="/vinicius-ssantos/([A-Za-z0-9_.\-]+)"', html)
unique = []
seen = set()
for r in repo_links:
    if r in seen:
        continue
    seen.add(r)
    unique.append(r)

# Filter out things that aren't repo names
ignore = {"followers", "following", "stars", "repositories", "projects",
          "packages", "overview", "activity", "subscriptions", "tab"}
repos = [r for r in unique if r.lower() not in ignore]
for r in repos[:30]:
    print(" -", r)

print()
print("=== Idiomas (linguagens) mencionados ===")
# Language stats may appear as <h2 class="h4 mb-2">Languages</h2> followed by list
m = re.search(r'Languages(.*?)(</section>|</div>\s*</div>)', html, flags=re.S | re.I)
if m:
    block = m.group(1)
    langs = re.findall(r'>([A-Za-z0-9+#\-]+)<', block)
    seen = set()
    for l in langs:
        if l and l not in seen and len(l) < 30 and l.lower() not in {"span", "div", "li", "ul", "ol", "a", "h2", "h3"}:
            seen.add(l)
            print(" -", l)

print()
print("=== Seguidores / Seguindo ===")
# followers count from text
text = re.sub(r"<script[^>]*>.*?</script>", " ", html, flags=re.S | re.I)
text = re.sub(r"<style[^>]*>.*?</style>", " ", text, flags=re.S | re.I)
text = re.sub(r"<[^>]+>", " ", text)
text = unescape(text)
text = re.sub(r"\s+", " ", text).strip()
for label in ["followers", "following"]:
    m = re.search(r'(\d[\d,]*)\s+' + label, text, flags=re.I)
    if m:
        print(f"{label.capitalize()}:", m.group(1))

print()
print("=== Local / Empresa / Site (se houver) ===")
for label in ["location", "company", "blog", "email", "twitter"]:
    m = re.search(r'class="[^"]*user-profile-link[^"]*"[^>]*>\s*<svg[^>]*>.*?</svg>\s*<span>([^<]+)</span>', html, flags=re.S | re.I)
    # fallback: search by aria-label or by itemtype
    if not m:
        m = re.search(r'itemprop="' + label + r'"[^>]*>([^<]+)<', html, flags=re.I)
    if m:
        print(f"{label.capitalize()}:", m.group(1).strip())

# Search for any URL like https:// on the profile (website)
print()
print("=== Website (se houver) ===")
urls = re.findall(r'class="[^"]*Link--primary[^"]*"[^>]*href="(https?://[^"]+)"', html)
for u in set(urls):
    print(" -", u)
