---
description: Scaffold a new VS Code command end to end (manifest, constants, handler, registration, test).
argument-hint: <commandName> "<Command Title>"
---

Use the `vscode-add-command` skill to add a new command to this extension.

Command to add: $ARGUMENTS

Work through every step in the skill: declare the ID in `src/constants.ts`,
contribute it in `package.json`, write the handler in `src/commands/`, register it
in `src/commands/index.ts`, add the ID to the integration test's `COMMAND_IDS`, and
keep any real logic in a `vscode`-free, unit-tested module.

Finish by running `pnpm run typecheck && pnpm run lint && pnpm test` and report the
result.
