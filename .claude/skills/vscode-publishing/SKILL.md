---
name: vscode-publishing
description: Version, package, and publish this VS Code extension to the VS Marketplace and Open VSX. Use for release prep, packaging a .vsix, or debugging publishing.
---

# Packaging & publishing

## Before releasing

1. Set real values in `package.json`: `publisher`, `repository`, and a 128×128
   `icon` (PNG). The marketplace requires a registered `publisher`.
2. Bump `version` (SemVer) and update `CHANGELOG.md`.
3. Ensure green: `pnpm run lint && pnpm run typecheck && pnpm test`.

## Package locally

```bash
pnpm run package   # vsce package --no-dependencies  ->  *.vsix
```

`--no-dependencies` is required: the runtime code is already bundled into
`dist/` by esbuild, so vsce must not try to include `node_modules`. Confirm the
`.vsix` contents are minimal (the `.vscodeignore` excludes sources/tests/config).

## Publish

Preferred: push a tag and let `.github/workflows/release.yml` do it.

```bash
git tag v0.1.0 && git push origin v0.1.0
```

The workflow packages the `.vsix`, publishes to the VS Marketplace (if `VSCE_PAT`
secret is set) and Open VSX (if `OVSX_PAT` is set), and attaches the `.vsix` to a
GitHub Release. Set the secrets in repo Settings → Secrets → Actions.

Manual fallback:

```bash
pnpm exec vsce publish --no-dependencies -p "$VSCE_PAT"
pnpm exec ovsx publish --no-dependencies -p "$OVSX_PAT"
```

## Notes

- `engines.vscode` is the minimum supported VS Code version; keep `@types/vscode`
  at the same baseline so you don't accidentally use newer APIs.
- Get tokens: VS Marketplace PAT (Azure DevOps) and an Open VSX access token.
