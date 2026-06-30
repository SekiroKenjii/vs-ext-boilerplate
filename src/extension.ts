import * as vscode from 'vscode';

import { registerCommands } from './commands';
import { Views } from './constants';
import { createLogger } from './core/logger';
import type { Services } from './core/services';
import { createStatusBar } from './ui/statusBar';
import { ExampleTreeProvider } from './ui/tree/exampleTreeProvider';

/** Public API returned from {@link activate}, consumed by other extensions and tests. */
export interface ExtensionApi {
  readonly version: string;
}

/**
 * Composition root. This function stays deliberately thin: it builds shared
 * services, wires up features, and registers every disposable on
 * `context.subscriptions`. Feature logic lives in the modules it calls.
 */
export function activate(context: vscode.ExtensionContext): ExtensionApi {
  const logger = createLogger('Boilerplate');
  context.subscriptions.push(logger);
  logger.info('Activating extension');

  const services: Services = { context, logger };

  const treeProvider = new ExampleTreeProvider();
  context.subscriptions.push(
    treeProvider,
    vscode.window.registerTreeDataProvider(Views.examples, treeProvider),
    createStatusBar(),
  );

  registerCommands(services, treeProvider);

  const version = (context.extension.packageJSON as { version?: string }).version ?? '0.0.0';
  logger.info(`Extension activated (v${version})`);

  return { version };
}

export function deactivate(): void {
  // Everything registered on context.subscriptions is disposed automatically.
}
