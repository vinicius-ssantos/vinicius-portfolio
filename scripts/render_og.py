"""Render OG image HTML to 1200x630 PNG via Playwright."""
import asyncio
from playwright.async_api import async_playwright
from pathlib import Path

HTML = Path("/home/z/my-project/scripts/og-image.html").resolve()
OUT  = Path("/home/z/my-project/public/og-image.png").resolve()

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
        page = await context.new_page()
        await page.goto(f"file://{HTML}")
        await page.wait_for_load_state("networkidle")
        # Wait for fonts to load
        await page.evaluate("document.fonts.ready")
        await page.screenshot(path=str(OUT), clip={"x": 0, "y": 0, "width": 1200, "height": 630}, omit_background=False)
        await browser.close()
    print(f"✅ OG image: {OUT}")
    print(f"   Size: {OUT.stat().st_size / 1024:.1f} KB")

asyncio.run(main())
