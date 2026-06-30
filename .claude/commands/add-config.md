---
description: Add a new configuration setting to the extension (manifest + typed accessor + test).
argument-hint: <settingKey> <type> <default>
---

Use the `vscode-add-configuration` skill to add a setting to this extension.

Setting to add: $ARGUMENTS

Contribute the property under `vsExtBoilerplate.` in `package.json`, extend
`BoilerplateConfig` and `getConfig()` in `src/config/configuration.ts` with a
matching default, wire any reaction through `onConfigChange`, and add coverage in
`test/unit/configuration.test.ts`.

Finish by running `pnpm run typecheck && pnpm run lint && pnpm run test:unit`.
