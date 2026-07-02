# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `pnpm run init` — one-time template initializer that rebrands the boilerplate into
  your own extension (interactive, or flag-driven with `--yes`) and removes itself.

## [0.1.0] - 2026-06-30

### Added

- Initial boilerplate: TypeScript VS Code extension bundled with esbuild.
- Sample features: command, configuration, status bar item, output-channel logger,
  sidebar TreeView, and a CSP-hardened Webview panel with a typed message protocol.
- Testing: Vitest unit tests (mocked `vscode`) and `@vscode/test-cli` integration
  tests in a real host.
- Tooling: ESLint (flat, type-checked), Prettier, husky + lint-staged, commitlint.
- CI/CD: GitHub Actions for verify (lint/typecheck/test/package) and tag-based
  release that attaches the `.vsix` to a GitHub Release (Marketplace/Open VSX ready to enable later).
- Claude Agent setup: `CLAUDE.md`, skills, subagents, slash commands, a formatting
  hook, context7 MCP config, and a plugin/marketplace manifest.

[Unreleased]: https://github.com/your-org/vs-ext-boilerplate/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/vs-ext-boilerplate/releases/tag/v0.1.0
