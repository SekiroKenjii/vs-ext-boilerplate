import * as vscode from 'vscode';

import { getConfig, onConfigChange } from '../config/configuration';
import { Commands } from '../constants';

/**
 * Creates the status bar item and keeps its visibility in sync with the
 * `vsExtBoilerplate.enableStatusBar` setting. Returns a disposable that tears
 * down both the item and its configuration listener.
 */
export function createStatusBar(): vscode.Disposable {
  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  item.command = Commands.helloWorld;
  item.text = '$(rocket) Boilerplate';
  item.tooltip = 'Run the Boilerplate “Hello World” command';

  const applyVisibility = (): void => {
    if (getConfig().enableStatusBar) {
      item.show();
    } else {
      item.hide();
    }
  };

  applyVisibility();
  const configListener = onConfigChange(applyVisibility);

  return vscode.Disposable.from(item, configListener);
}
