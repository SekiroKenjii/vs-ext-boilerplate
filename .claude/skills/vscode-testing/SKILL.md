---
name: vscode-testing
description: Write or run tests for this VS Code extension (Vitest unit tests and @vscode/test-cli integration tests). Use when adding tests or debugging the test setup.
---

# Testing

Two layers. Choose the cheapest one that proves the behavior.

## Unit tests (Vitest) — prefer these

For logic that doesn't need a live editor.

- Location: `test/unit/**/*.test.ts`.
- The `vscode` module is aliased to a hand-written mock at `test/mocks/vscode.ts`
  (see `vitest.config.ts`). Extend the mock as needed; use `seedConfig`/`resetConfig`
  for settings.
- Best practice: keep logic in `vscode`-free modules (e.g. `src/core/greeting.ts`)
  so you can test it directly with no mock at all.
- Run: `pnpm run test:unit` (or `pnpm run test:unit:watch`).

## Integration tests (@vscode/test-cli) — for real API behavior

For activation, command registration, and anything needing the real `vscode` API.

- Location: `test/integration/**/*.test.ts`, Mocha BDD (`describe`/`it`).
- They are bundled to **CommonJS `.js`** in `out/` by `scripts/build-tests.mjs`,
  then run in a downloaded VS Code instance (config: `.vscode-test.mjs`).
- Keep them black-box: drive the extension through `vscode.commands` /
  `vscode.extensions`, and avoid commands that block on UI (e.g. modal messages).
- Run: `pnpm run test:integration` (runs build + compile + host).

## Gotchas

- Integration output must stay CommonJS; `package.json` has no `"type": "module"`.
- The "Extension Test Runner" extension gives a Testing-UI + debugger for these.

## Verify

```bash
pnpm test   # unit + integration
```
