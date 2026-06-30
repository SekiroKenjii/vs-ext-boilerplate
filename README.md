# VS Code Extension Boilerplate

A production-grade, batteries-included starter for building **VS Code extensions**
in native TypeScript — with a professional source structure, fast bundling, a real
test pyramid, CI/CD, and a fully wired **Claude Agent** setup.

> Replace `your-publisher-id` / `your-org` / `your-name` placeholders before publishing.

## Features

- **TypeScript, strict.** ES2022, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and more.
- **esbuild bundling.** Fast builds to `dist/extension.js` (Node/CJS) and `dist/webview.js` (browser).
- **Sample surface:** command, settings, status bar, output-channel logger, a sidebar
  **TreeView**, and a CSP-hardened **Webview** with a typed message protocol.
- **Tests:** Vitest unit tests (mocked `vscode`) + `@vscode/test-cli` integration tests.
- **Quality:** ESLint flat config (type-checked), Prettier, husky + lint-staged, commitlint.
- **CI/CD:** GitHub Actions for verification and a tag-based GitHub Release with the `.vsix` (Marketplace/Open VSX publishing is ready to switch on when you want it).
- **Claude-ready:** `CLAUDE.md`, skills, subagents, slash commands, a formatting hook,
  context7 MCP, and an installable plugin/marketplace manifest.

## Quick start

```bash
corepack enable          # provides pnpm (bundled with Node)
pnpm install
```

Press **F5** to launch the Extension Development Host, then try:

- `Ctrl/Cmd+Shift+P` → **Boilerplate: Hello World** (or `Ctrl/Cmd+Alt+H`)
- **Boilerplate: Open Panel** → the webview
- the **Boilerplate** view in the Activity Bar → the TreeView (with a refresh button)

## Scripts

| Script                      | Description                                        |
| --------------------------- | -------------------------------------------------- |
| `pnpm run build`            | Bundle extension + webview                         |
| `pnpm run watch`            | Rebuild on change (used by F5)                     |
| `pnpm run typecheck`        | `tsc --noEmit` across all tsconfigs                |
| `pnpm run lint`             | ESLint                                             |
| `pnpm run format`           | Prettier write                                     |
| `pnpm run test:unit`        | Vitest unit tests                                  |
| `pnpm run test:integration` | Build + compile tests + run in a real VS Code host |
| `pnpm test`                 | Unit + integration                                 |
| `pnpm run package`          | Produce a `.vsix` (`vsce --no-dependencies`)       |

## Project structure

```
src/
  extension.ts          Composition root (activate/deactivate)
  constants.ts          Command/view/config IDs (match package.json)
  core/                 logger, services (DI), pure logic (greeting)
  config/               typed configuration accessor
  commands/             one handler per command + registration
  ui/
    statusBar.ts
    tree/               TreeDataProvider
    webview/            panel.ts (host) · protocol.ts (shared) · client/ (browser)
test/
  unit/                 Vitest (vscode mocked via test/mocks/vscode.ts)
  integration/          @vscode/test-cli (real host)
.github/                CI, release, templates, dependabot
.claude/                skills, agents, commands, hook, settings
.claude-plugin/         installable plugin + marketplace manifest
```

See [`CLAUDE.md`](CLAUDE.md) for the architecture and conventions in detail.

## Architecture in one paragraph

`activate()` is a thin composition root: it builds shared `Services` (logger +
context), wires features, and registers every `Disposable` on
`context.subscriptions`. Business logic lives in `vscode`-free modules (e.g.
`src/core/greeting.ts`) so it's trivially unit-testable; files that touch the
`vscode` API stay thin. IDs live once in `src/constants.ts` and must match
`package.json` `contributes`.

## Testing

- **Unit (Vitest):** for pure logic and `vscode`-light code; the `vscode` import is
  aliased to `test/mocks/vscode.ts`. Fast, no editor.
- **Integration (`@vscode/test-cli`):** activation, command registration, real API.
  Bundled to CommonJS `.js` in `out/` and run in a downloaded VS Code instance.

## Claude Agent tooling

- **`CLAUDE.md`** — project guide loaded into context.
- **Skills** (`.claude/skills/`) — `karpathy-guidelines` plus stack playbooks:
  `vscode-add-command`, `vscode-add-configuration`, `vscode-webview`,
  `vscode-testing`, `vscode-publishing`.
- **Subagents** (`.claude/agents/`) — `code-reviewer`, `test-writer`.
- **Commands** (`.claude/commands/`) — `/new-command`, `/add-config`, `/release`.
- **Hook** (`.claude/settings.json` + `.claude/hooks/format.mjs`) — formats TS files
  with Prettier + ESLint after edits (non-blocking; delete to disable).
- **MCP** (`.mcp.json`) — [context7](https://github.com/upstash/context7) for live
  docs. Optionally set `CONTEXT7_API_KEY` for higher limits.
- **Plugin** (`.claude-plugin/`) — install these skills into other repos via a
  Claude Code marketplace.

## Publishing

Set `publisher`, `repository`, and a 128×128 PNG `icon` in `package.json`, then push a
tag:

```bash
git tag v0.1.0 && git push origin v0.1.0
```

`release.yml` builds, packages the `.vsix`, and attaches it to a **GitHub Release**.
Marketplace/Open VSX publishing is intentionally not enabled yet — see
[`.github/REPO_SETUP.md`](.github/REPO_SETUP.md) and
[`.claude/skills/vscode-publishing/SKILL.md`](.claude/skills/vscode-publishing/SKILL.md)
to turn it on (add the `VSCE_PAT` / `OVSX_PAT` secrets, or publish manually with
`pnpm run publish:vsce` / `pnpm run publish:ovsx`).

## Notes

- The extension runs as **CommonJS**, so `package.json` intentionally has no
  `"type": "module"`; build configs are `.mjs`.
- `pnpm-workspace.yaml` records pnpm's build-script approvals (esbuild) and any
  supply-chain age exclusions generated on first install.

## License

[MIT](LICENSE). The `karpathy-guidelines` skill is vendored from
[multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) (MIT).
