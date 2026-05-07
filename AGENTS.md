# AGENTS.md

## Project Intent
BioLoom is a Next.js app for generating polished platform-specific bios. Priorities are reliable generation, truthful copy, and a smooth public-facing user experience.

## Preferred Agent Workflow
1. Planner: inspect the touched route, component, store, and README sections first.
2. Builder: keep changes scoped, readable, and easy to review.
3. Reviewer: confirm lint, type checks, and critical flows still pass.

## Setup
```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Validation
```bash
npm run lint
npm run type-check
npm test
npm run build
```
Run `npm run test:e2e` when changing critical generation, navigation, or sharing flows.

## Guardrails
- Never commit secrets or populated env files.
- Keep provider, pricing, and rate-limit claims accurate and date-stable.
- Prefer incremental UX improvements over sweeping rewrites unless requested.
- Update README and user-facing copy when product behavior changes.

## Release Hygiene
- Ship user-facing changes with docs updates.
- Cut releases only after lint, type-check, tests, and build pass.
- Recheck live-demo links and deployment instructions before release.