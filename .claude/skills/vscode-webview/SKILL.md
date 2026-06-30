---
name: vscode-webview
description: Build or modify a VS Code webview (panel or view) with a secure CSP and a typed message protocol. Use for any webview UI work in this extension.
---

# Webview patterns

This repo's webview (`src/ui/webview/`) demonstrates the secure, type-safe setup.
Reuse it; don't reinvent.

## Layout

- `panel.ts` — the extension-host side (`WebviewPanel`). Owns HTML, CSP, lifecycle.
- `protocol.ts` — discriminated-union message types shared by both sides.
- `client/main.ts` — the browser side, bundled by esbuild to `dist/webview.js`.

## Rules

1. **Security (non-negotiable):**
   - `enableScripts: true` only with a strict CSP: `default-src 'none'`,
     `script-src 'nonce-<nonce>'`, `style-src ${webview.cspSource}`.
   - Generate a fresh nonce per render (see `createNonce`).
   - Set `localResourceRoots` to `dist` only.
   - Load scripts via `webview.asWebviewUri(...)`, never inline `<script>` bodies.

2. **Messaging:** add new message kinds to `HostToWebview` / `WebviewToHost` in
   `protocol.ts`. Both `panel.ts` and `client/main.ts` import these, so the compiler
   keeps the two ends in sync. Handle every case in the `switch`.

3. **Lifecycle:** register all listeners on `this.disposables`; dispose them in
   `dispose()`. The panel is a singleton — reveal the existing one instead of
   creating duplicates.

4. **Client code is browser-only:** it lives under `client/` and is type-checked
   against `tsconfig.webview.json` (DOM libs, no Node types).

## Verify

```bash
pnpm run typecheck && pnpm run build
```

Press F5, run **Boilerplate: Open Panel**, confirm the greeting renders and the
ping round-trips (check the "Boilerplate" output channel).

## Reference

Use context7 for `Webview`, `WebviewPanel`, `asWebviewUri`, and CSP guidance.
