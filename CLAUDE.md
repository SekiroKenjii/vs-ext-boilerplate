# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

## What this is

A production-grade boilerplate for building **VS Code extensions** in native
TypeScript. Bundled with esbuild, tested with Vitest + `@vscode/test-cli`, and
shipped with a full Claude Agent setup (skills, subagents, commands, hooks).

## Tech stack

- **Language:** TypeScript (strict), authored as ES modules.
- **Bundler:** esbuild → `dist/extension.js` (CommonJS, Node) and `dist/webview.js`
  (IIFE, browser). The extension host loads CommonJS, so `package.json` does **not**
  set `"type": "module"`; build configs are `.mjs` (ESM by extension).
- **Package manager:** pnpm (via Corepack; pinned in `packageManager`).
- **Testing:** Vitest for unit tests (with a mocked `vscode`), `@vscode/test-cli`
  for integration tests in a real host.
- **Lint/format:** ESLint flat config (type-checked) + Prettier.

## Commands

```bash
pnpm install            # install deps (Corepack provides pnpm)
pnpm run build          # bundle extension + webview
pnpm run watch          # rebuild on change (used by F5)
pnpm run typecheck      # tsc --noEmit across all tsconfigs
pnpm run lint           # eslint
pnpm run test:unit      # vitest
pnpm run test:integration # build + compile tests + run in VS Code host
pnpm test               # unit + integration
pnpm run package        # produce a .vsix (vsce --no-dependencies)
```

Press **F5** in VS Code to launch the Extension Development Host.

## Architecture

- `src/extension.ts` — composition root. Keep it thin: build services, wire
  features, push every disposable to `context.subscriptions`. **No business logic here.**
- `src/core/` — cross-cutting services: `logger.ts` (LogOutputChannel),
  `services.ts` (the injected `Services` interface), `greeting.ts` (example of
  pure logic kept free of `vscode`).
- `src/config/configuration.ts` — the **only** place that reads settings. Exposes
  a typed `getConfig()` and `onConfigChange()`.
- `src/commands/` — one file per command handler + `index.ts` to register them.
- `src/ui/` — `statusBar.ts`, `tree/` (TreeDataProvider), `webview/`
  (host `panel.ts`, shared `protocol.ts`, browser `client/main.ts`).
- `src/constants.ts` — command/view/config IDs. **Never hard-code these strings**
  elsewhere; they must match `package.json` `contributes`.

## Conventions

- Put business logic in files that do **not** import `vscode`, so it is unit-testable.
- Everything that subscribes or creates UI is a `Disposable` and is disposed.
- Use `import type` for type-only imports (enforced by lint).
- Webviews: strict CSP with a per-load nonce, `localResourceRoots` scoped to `dist`,
  and the typed `postMessage` protocol in `src/ui/webview/protocol.ts`.
- Integration tests compile to **CommonJS `.js`** in `out/` (see `scripts/build-tests.mjs`);
  they are loaded by Node via `require`, so they must stay CJS.

## Working principles

Follow the four [Karpathy guidelines](.claude/skills/karpathy-guidelines/SKILL.md):
think before coding, simplicity first, surgical changes, goal-driven execution.

## Up-to-date docs

Use the **context7 MCP** (`resolve-library-id` → `query-docs`) for current VS Code
extension API, esbuild, Vitest, and ESLint docs rather than relying on memory.

## Task-specific skills

When the task matches, use the project skills in `.claude/skills/`:
`vscode-add-command`, `vscode-add-configuration`, `vscode-webview`,
`vscode-testing`, `vscode-publishing`.
