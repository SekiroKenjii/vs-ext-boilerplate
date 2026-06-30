# Contributing

Thanks for contributing! This guide covers local setup and our conventions.

## Prerequisites

- Node.js >= 22.13 (required by pnpm 11; the repo pins 24 in `.nvmrc`).
- pnpm via Corepack — no manual install needed:
  ```bash
  corepack enable
  ```

## Setup

```bash
pnpm install
```

This also installs the Git hooks (husky): pre-commit runs lint-staged
(Prettier + ESLint on staged files); commit-msg enforces Conventional Commits.

## Day-to-day

| Task            | Command                      |
| --------------- | ---------------------------- |
| Run/debug       | Press **F5** in VS Code      |
| Build           | `pnpm run build`             |
| Watch           | `pnpm run watch`             |
| Type-check      | `pnpm run typecheck`         |
| Lint / fix      | `pnpm run lint` / `lint:fix` |
| Format          | `pnpm run format`            |
| Unit tests      | `pnpm run test:unit`         |
| Integration     | `pnpm run test:integration`  |
| All tests       | `pnpm test`                  |
| Package `.vsix` | `pnpm run package`           |

## Conventions

- Follow `CLAUDE.md` (architecture + conventions) and the four
  [Karpathy guidelines](.claude/skills/karpathy-guidelines/SKILL.md).
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:` …).
- Keep PRs small and focused; fill in the PR template checklist.
- Add tests for new behavior; keep logic in `vscode`-free modules where possible.

## CI

Every PR runs lint, type-check, unit + integration tests, and packaging. Keep it green.
