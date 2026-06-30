import * as vscode from 'vscode';

import { getConfig } from '../config/configuration';
import { formatGreeting } from '../core/greeting';
import type { Services } from '../core/services';

/** Shows a greeting using the configured `vsExtBoilerplate.greeting` value. */
export async function helloWorld({ logger }: Services): Promise<void> {
  const { greeting } = getConfig();
  logger.info('Executing helloWorld command');
  await vscode.window.showInformationMessage(formatGreeting(greeting, 'World'));
}
