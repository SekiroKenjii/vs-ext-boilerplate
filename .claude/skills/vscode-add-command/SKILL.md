---
name: vscode-add-command
description: Add a new command to this VS Code extension following the repo's conventions. Use when the user wants a new command, palette entry, keybinding, or menu action.
---

# Add a VS Code command

Follow these steps in order. Every command touches the manifest, constants, a
handler, and registration. Verify with a test.

## Steps

1. **Declare the ID** in `src/constants.ts` under `Commands`
   (e.g. `doThing: 'vsExtBoilerplate.doThing'`). Never hard-code the string elsewhere.

2. **Contribute it** in `package.json` → `contributes.commands` with `title` and
   `category: "Boilerplate"`. Add an `icon` only if it appears in a menu.

3. **Write the handler** in `src/commands/<name>.ts`. Keep `vscode`-specific glue
   thin and put real logic in a `vscode`-free module under `src/core/` so it can be
   unit-tested. Accept `Services` for the logger/context.

4. **Register it** in `src/commands/index.ts` inside `registerCommands`, pushing to
   `services.context.subscriptions`.

5. **Optional UI:** add a `keybindings` entry and/or a `menus` contribution in
   `package.json` (gate with a `when` clause).

6. **Test:**
   - Unit-test the pure logic (no `vscode`) in `test/unit/`.
   - The integration test in `test/integration/extension.test.ts` already asserts
     every contributed command is registered — add the new ID to its `COMMAND_IDS`.

## Verify

```bash
pnpm run typecheck && pnpm run lint && pnpm test
```

Then press F5 and run the command from the Command Palette.

## Reference

Use context7 (`/websites/code_visualstudio_api`) for `commands.registerCommand`,
`commands.executeCommand`, and menu/`when`-clause details.
