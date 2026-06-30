import * as vscode from 'vscode';

import { Commands } from '../constants';
import type { Services } from '../core/services';
import type { ExampleTreeProvider } from '../ui/tree/exampleTreeProvider';
import { ExamplePanel } from '../ui/webview/panel';

import { helloWorld } from './helloWorld';

/**
 * Registers every command contributed by the extension and ties each to its
 * handler. All registrations are added to `context.subscriptions` so they are
 * disposed automatically on deactivation.
 */
export function registerCommands(services: Services, tree: ExampleTreeProvider): void {
  services.context.subscriptions.push(
    vscode.commands.registerCommand(Commands.helloWorld, () => helloWorld(services)),
    vscode.commands.registerCommand(Commands.openPanel, () => {
      ExamplePanel.show(services);
    }),
    vscode.commands.registerCommand(Commands.refreshExamples, () => {
      tree.refresh();
    }),
  );
}
