import * as vscode from 'vscode';

import { CONFIG_SECTION } from '../constants';

/** Strongly-typed snapshot of this extension's settings. */
export interface BoilerplateConfig {
  readonly greeting: string;
  readonly enableStatusBar: boolean;
}

/**
 * Reads the current configuration. Centralising access here (instead of calling
 * `workspace.getConfiguration` ad hoc) keeps defaults and key names in one place.
 */
export function getConfig(scope?: vscode.ConfigurationScope): BoilerplateConfig {
  const config = vscode.workspace.getConfiguration(CONFIG_SECTION, scope ?? null);
  return {
    greeting: config.get<string>('greeting', 'Hello'),
    enableStatusBar: config.get<boolean>('enableStatusBar', true),
  };
}

/** Invokes `listener` whenever any setting in this extension's section changes. */
export function onConfigChange(listener: () => void): vscode.Disposable {
  return vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration(CONFIG_SECTION)) {
      listener();
    }
  });
}
