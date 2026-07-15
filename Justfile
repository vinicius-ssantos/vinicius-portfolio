# Thin convenience wrapper around the canonical npm scripts.
# Nothing here is required — `npm run <script>` always works standalone,
# in dev, CI, and deploy. Just recipes only call npm/node, so they run the
# same way on Windows, Linux and macOS (no PowerShell dependency).

# ──────────────────────────────────────────────────────────────
# Development
# ──────────────────────────────────────────────────────────────

# Bring up the local dev environment fresh — installs deps, cleans stale build, starts dev server.
up: check-env
	npm install
	npm run clean
	npm run dev

# Bring up a production-like local server — installs deps, rebuilds from scratch, serves the build.
up-prod: check-env
	npm install
	npm run clean
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
	npm run typecheck

format:
	npm run format

format-check:
	npm run format:check

test:
	npm run test

test-watch:
	npm run test:watch

# Run all quality gates before pushing / deploying — same script CI runs.
preflight:
	npm run preflight

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
	npm run clean

clean-cache:
	npm run clean:cache

# Nuclear option — removes .next, cache, node_modules and forces a fresh install.
clean-all:
	npm run clean:all

# ──────────────────────────────────────────────────────────────
# Deploy (Vercel)
# ──────────────────────────────────────────────────────────────

# Deploy a preview build (creates a unique preview URL).
deploy:
	npm run deploy

# Deploy to production. Runs all quality gates first.
deploy-prod:
	npm run deploy:prod

# ──────────────────────────────────────────────────────────────
# Environment
# ──────────────────────────────────────────────────────────────

# Verify env vars are present — warns on missing optional ones, fails only on missing required ones.
check-env:
	npm run check-env

# Append any env var used by the app that's missing from .env.example.
# Never overwrites existing lines, so committed comments are preserved.
env-example:
	npm run env:sync

# ──────────────────────────────────────────────────────────────
# Diagnostics
# ──────────────────────────────────────────────────────────────

# Health check — verifies Node, npm and required tooling are available.
doctor:
	npm run doctor
