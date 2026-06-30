---
name: vscode-add-configuration
description: Add or change a user/workspace setting for this VS Code extension. Use when the user wants a new configurable option or to react to a setting change.
---

# Add a configuration setting

Settings are declared once in the manifest and accessed only through the typed
accessor. Do not call `workspace.getConfiguration` outside `configuration.ts`.

## Steps

1. **Contribute the property** in `package.json` →
   `contributes.configuration.properties` under the `vsExtBoilerplate.` prefix.
   Provide `type`, `default`, and a `markdownDescription`. Use `scope` (e.g.
   `resource`, `machine`) when relevant.

2. **Extend the typed snapshot** in `src/config/configuration.ts`:
   - Add the field to `BoilerplateConfig`.
   - Read it in `getConfig()` with the matching default:
     `config.get<T>('yourKey', defaultValue)`.

3. **React to changes** where needed via `onConfigChange(() => { ... })`
   (it already filters to this extension's section). See `src/ui/statusBar.ts`
   for the pattern.

4. **Test** in `test/unit/configuration.test.ts`: use `seedConfig(...)` from the
   `vscode` mock to assert defaults and overrides.

## Verify

```bash
pnpm run typecheck && pnpm run lint && pnpm run test:unit
```

## Notes

Keep defaults in exactly two places that must agree: `package.json` and
`getConfig()`. A mismatch is a common bug — double-check both.
