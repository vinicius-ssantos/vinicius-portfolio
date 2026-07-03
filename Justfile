set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

# ──────────────────────────────────────────────────────────────
# Development
# ──────────────────────────────────────────────────────────────

# Bring up the local dev environment fresh — installs deps, cleans stale build, starts dev server.
up: check-env
	npm install
	just clean
	npm run dev

# Bring up a production-like local server — installs deps, rebuilds from scratch, serves the build.
up-prod: check-env
	npm install
	just clean
	npm run build
	npm run start

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

# ──────────────────────────────────────────────────────────────
# Quality gates
# ──────────────────────────────────────────────────────────────

lint:
	npm run lint

typecheck:
	npx tsc --noEmit

test:
	npm run test

test-watch:
	npm run test:watch

# Run all quality gates before pushing / deploying.
preflight: lint typecheck test
	@echo "✓ All checks passed — ready to deploy"

# ──────────────────────────────────────────────────────────────
# Dependencies
# ──────────────────────────────────────────────────────────────

install:
	npm install

update:
	npm update

outdated:
	npm outdated

audit:
	npm audit

audit-fix:
	npm audit fix

# ──────────────────────────────────────────────────────────────
# Clean
# ──────────────────────────────────────────────────────────────

clean:
	if (Test-Path .next) { Remove-Item -Recurse -Force .next }

clean-cache:
	if (Test-Path node_modules\.cache) { Remove-Item -Recurse -Force node_modules\.cache }

# Nuclear option — removes .next, cache and forces a fresh install.
clean-all: clean
	Remove-Item -Recurse -Force node_modules
	npm install

# ──────────────────────────────────────────────────────────────
# Deploy (Vercel)
# ──────────────────────────────────────────────────────────────

# Deploy a preview build (creates a unique preview URL).
deploy: preflight
	npx vercel

# Deploy to production. Runs all quality gates first.
deploy-prod: preflight
	npx vercel --prod

# ──────────────────────────────────────────────────────────────
# Environment
# ──────────────────────────────────────────────────────────────

# Verify required environment variables are present.
check-env:
	@if (-not (Test-Path .env)) { Write-Error ".env not found — copy .env.example and fill it in"; exit 1 }
	@if (-not (Select-String -Path .env -Pattern "^GITHUB_TOKEN=" -Quiet)) { Write-Warning "GITHUB_TOKEN not set — GitHub stats will fall back to hardcoded values" }

# Generate a sanitized .env.example from the current .env (strips values).
env-example:
	@if (Test-Path .env) { Get-Content .env | ForEach-Object { if ($_ -match "^([A-Z_]+)=") { "$($matches[1])=" } else { $_ } } | Set-Content .env.example; Write-Output "Created .env.example (values stripped)" } else { Write-Error ".env not found"; exit 1 }

# ──────────────────────────────────────────────────────────────
# Assets
# ──────────────────────────────────────────────────────────────

# Render the 1200x630 OG image from scripts/og-image.html (requires Playwright).
render-og:
	python scripts/render_og.py

# Crop raw GitHub screenshots to README area (requires Pillow).
crop-screenshots:
	python scripts/crop_screenshots.py

# ──────────────────────────────────────────────────────────────
# Diagnostics
# ──────────────────────────────────────────────────────────────

# Health check — verifies Node, npm and required tooling are available.
doctor:
	@echo "=== Node ==="     ; node --version
	@echo "=== npm ==="      ; npm --version
	@echo "=== .env ==="     ; if (Test-Path .env) { echo "found" } else { echo "MISSING" }
	@echo "=== .next ==="    ; if (Test-Path .next) { echo "build exists" } else { echo "no build (run: just build)" }

# Show the current routes and ISR revalidate windows from the last build.
build-info:
	@echo "Routes generated on last build:"
	@Get-ChildItem .next\server\app -Recurse -Filter "*.html" 2>$null | Measure-Object | ForEach-Object { echo "  $($_.Count) static HTML files" }
