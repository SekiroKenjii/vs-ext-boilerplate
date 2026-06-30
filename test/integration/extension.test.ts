import * as assert from 'node:assert';

import * as vscode from 'vscode';

interface ExtensionApi {
  version: string;
}

const EXTENSION_NAME = 'vs-ext-boilerplate';
const COMMAND_IDS = [
  'vsExtBoilerplate.helloWorld',
  'vsExtBoilerplate.openPanel',
  'vsExtBoilerplate.refreshExamples',
];

describe('Extension integration', () => {
  it('activates and returns its public API', async () => {
    const extension = vscode.extensions.all.find(
      (candidate) => (candidate.packageJSON as { name?: string }).name === EXTENSION_NAME,
    );
    assert.ok(extension, 'extension should be installed in the test host');

    const api = (await extension.activate()) as ExtensionApi;
    assert.strictEqual(typeof api.version, 'string');
  });

  it('registers all contributed commands', async () => {
    const commands = await vscode.commands.getCommands(true);
    for (const id of COMMAND_IDS) {
      assert.ok(commands.includes(id), `command not registered: ${id}`);
    }
  });

  it('runs the refreshExamples command without throwing', async () => {
    await vscode.commands.executeCommand('vsExtBoilerplate.refreshExamples');
  });
});
