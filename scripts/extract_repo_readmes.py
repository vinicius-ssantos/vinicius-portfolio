"""Extract README and key info from each repo page."""
import json
import re
from pathlib import Path
from html import unescape

repos = [
    "api_rest_aplicativo_cars",
    "AutenticaoFirebase",
    "formulario_web_emprestimos_final",
    "SpringCloud",
    "personal-platform-infra",
]

result = {}
for repo in repos:
    src = Path(f"/home/z/my-project/repo_{repo}.json")
    if not src.exists():
        continue
    data = json.loads(src.read_text(encoding="utf-8"))
    html = data.get("data", {}).get("html", "") or ""
    desc = data.get("data", {}).get("description", "") or ""

    # README is in <article class="markdown-body...">
    readme_m = re.search(r'<article[^>]*markdown-body[^>]*>(.*?)</article>', html, flags=re.S | re.I)
    readme_html = readme_m.group(1) if readme_m else ""
    # Strip tags
    readme_text = re.sub(r"<script[^>]*>.*?</script>", " ", readme_html, flags=re.S | re.I)
    readme_text = re.sub(r"<style[^>]*>.*?</style>", " ", readme_text, flags=re.S | re.I)
    readme_text = re.sub(r"<[^>]+>", " ", readme_text)
    readme_text = unescape(readme_text)
    readme_text = re.sub(r"\s+", " ", readme_text).strip()
    # Limit
    readme_text = readme_text[:3500]

    # Languages section
    langs = re.findall(r'itemprop="programmingLanguage"[^>]*>([^<]+)<', html)
    langs = list(dict.fromkeys([l.strip() for l in langs if l.strip()]))

    # Stars / forks / watchers
    stars_m = re.search(r'/stargazers[^"]*"[^>]*>\s*<span[^>]*>([\d,]+)\s*</span>', html, flags=re.S)
    stars = stars_m.group(1) if stars_m else "0"
    forks_m = re.search(r'/forks[^"]*"[^>]*>\s*<span[^>]*>([\d,]+)\s*</span>', html, flags=re.S)
    forks = forks_m.group(1) if forks_m else "0"

    # Topics
    topics = re.findall(r'data-octo-dimensions="topic:"[^>]*>([^<]+)</a>', html)
    topics = [t.strip() for t in topics if t.strip()]

    # Last commit / updated
    upd_m = re.search(r'data-testid="latest-commit-details".*?datetime="([^"]+)"', html, flags=re.S)
    if not upd_m:
        upd_m = re.search(r'relative-time[^>]*datetime="([^"]+)"', html, flags=re.I)
    updated = upd_m.group(1)[:10] if upd_m else ""

    # File count or commit count? hard to get without API
    # Try to get repo created/updated via relative-time tags
    result[repo] = {
        "description": desc,
        "languages": langs,
        "stars": stars,
        "forks": forks,
        "topics": topics,
        "updated": updated,
        "readme_excerpt": readme_text,
    }

out = Path("/home/z/my-project/repos_summary.json")
out.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")

for repo, info in result.items():
    print(f"\n{'='*70}")
    print(f"REPO: {repo}")
    print(f"{'='*70}")
    print(f"Descrição: {info['description']}")
    print(f"Linguagens: {', '.join(info['languages']) or '(nenhuma)'}")
    print(f"⭐ {info['stars']}  🍴 {info['forks']}  📅 {info['updated']}")
    if info['topics']:
        print(f"Tópicos: {', '.join(info['topics'])}")
    print(f"README (primeiros 800 chars):")
    print(info['readme_excerpt'][:800])
    print("...")
