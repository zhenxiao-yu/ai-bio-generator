# Contributing to BioLoom

Thanks for contributing. BioLoom is a public-facing AI product, so contributions should prioritize truthful product copy, smooth UX, and reliable generation flows.

## Before You Start

- Read [README.md](README.md), [AGENTS.md](AGENTS.md), and the affected route or component area.
- For product or UX changes, prefer discussing the direction in an issue first.
- Keep PRs focused. Avoid mixing product copy, API behavior, and visual redesign in one change unless the work truly belongs together.

## Local Setup

```bash
git clone https://github.com/zhenxiao-yu/ai-bio-generator.git
cd ai-bio-generator
npm install
cp .env.local.example .env.local
npm run dev
```

## Validation

Run this before opening a PR:

```bash
npm run lint
npm run type-check
npm test
npm run build
```

Run `npm run test:e2e` for changes that affect generation, sharing, navigation, or critical UI flows.

## Contribution Rules

- Never commit secrets or filled environment files.
- Keep pricing, provider, and free-tier claims accurate.
- Preserve good failure states when providers are unavailable or rate-limited.
- Update docs and changelog entries when user-facing behavior changes.

## Commit Style

Use conventional-style commit messages where possible:

```text
feat: add better share-card metadata
fix(api): handle model fallback timeout
docs: clarify env setup
```

## Pull Requests

Please include:
- what changed
- why it changed
- how you validated it
- screenshots or short recordings for visible UI changes

## Release Notes

Add notable user-facing changes to [CHANGELOG.md](CHANGELOG.md) before release tags are cut.
