"""Crop GitHub screenshots to just the README area."""
from PIL import Image
from pathlib import Path

projects = [
    ("personal-platform-infra.png", "personal-platform-infra.png"),
    ("springcloud.png", "springcloud.png"),
    ("api-rest-cars.png", "api-rest-cars.png"),
]

src_dir = Path("/home/z/my-project/public/projects")

for src_name, dst_name in projects:
    src = src_dir / src_name
    img = Image.open(src)
    w, h = img.size
    print(f"\n{src_name}: {w}x{h}")

    # GitHub layout: README content starts after sidebar/header
    # Typically README article is at ~25% from left, 15% from top, extends to right margin
    # We'll crop: left=24% (skip sidebar), right=97%, top=12%, bottom=85%
    left = int(w * 0.24)
    right = int(w * 0.97)
    top = int(h * 0.12)
    bottom = int(h * 0.85)

    cropped = img.crop((left, top, right, bottom))
    print(f"  Cropped to: {cropped.size}")

    # Save with optimization
    cropped.save(src, "PNG", optimize=True)
    print(f"  Saved: {src}")

print("\n✅ All screenshots cropped")
