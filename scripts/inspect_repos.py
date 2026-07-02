"""Inspect HTML structure of repos page to find the right selectors."""
import json
from pathlib import Path

data = json.loads(Path("/home/z/my-project/github_repos.json").read_text(encoding="utf-8"))
html = data.get("data", {}).get("html", "") or ""

print("HTML length:", len(html))
print()

# Look for the repo list - GitHub uses different markup. Print a sample.
# Find a known repo name
import re
idx = html.lower().find("api_rest_aplicativo_cars")
if idx == -1:
    idx = html.lower().find("springcloud")
if idx == -1:
    idx = html.lower().find("autentica")
print("First repo mention at index:", idx)
if idx > 0:
    print()
    print("=== Sample around a repo ===")
    print(html[max(0,idx-500):idx+1500])
