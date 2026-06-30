import * as vscode from 'vscode';

import { getConfig } from '../../config/configuration';
import type { Services } from '../../core/services';

import type { HostToWebview, WebviewToHost } from './protocol';

/**
 * A singleton webview panel demonstrating VS Code's recommended security model:
 * a strict Content-Security-Policy with a per-load nonce, `localResourceRoots`
 * scoped to `dist/`, and a typed `postMessage` protocol.
 */
export class ExamplePanel {
  public static readonly viewType = 'vsExtBoilerplate.examplePanel';
  private static current: ExamplePanel | undefined;

  private readonly disposables: vscode.Disposable[] = [];

  public static show(services: Services): void {
    const column = vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One;

    if (ExamplePanel.current) {
      ExamplePanel.current.panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      ExamplePanel.viewType,
      'Boilerplate Panel',
      column,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(services.context.extensionUri, 'dist')],
      },
    );

    ExamplePanel.current = new ExamplePanel(panel, services);
  }

  private constructor(
    private readonly panel: vscode.WebviewPanel,
    private readonly services: Services,
  ) {
    this.panel.webview.html = this.render(this.panel.webview);

    this.panel.onDidDispose(
      () => {
        this.dispose();
      },
      null,
      this.disposables,
    );

    this.panel.webview.onDidReceiveMessage(
      (message: WebviewToHost) => {
        this.onMessage(message);
      },
      null,
      this.disposables,
    );
  }

  public dispose(): void {
    ExamplePanel.current = undefined;
    this.panel.dispose();
    while (this.disposables.length) {
      this.disposables.pop()?.dispose();
    }
  }

  private post(message: HostToWebview): void {
    void this.panel.webview.postMessage(message);
  }

  private onMessage(message: WebviewToHost): void {
    switch (message.type) {
      case 'ready':
        this.post({ type: 'init', payload: { greeting: getConfig().greeting } });
        break;
      case 'ping':
        this.services.logger.debug(`Webview ping received at ${String(message.payload.at)}`);
        break;
    }
  }

  private render(webview: vscode.Webview): string {
    const nonce = createNonce();
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.services.context.extensionUri, 'dist', 'webview.js'),
    );
    const csp = [
      `default-src 'none'`,
      `style-src ${webview.cspSource} 'unsafe-inline'`,
      `script-src 'nonce-${nonce}'`,
    ].join('; ');

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="${csp}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Boilerplate Panel</title>
    <style>
      body { font-family: var(--vscode-font-family); padding: 1rem; }
      button { cursor: pointer; }
    </style>
  </head>
  <body>
    <h1 id="greeting">Loading…</h1>
    <button id="ping">Send ping to extension</button>
    <p id="status"></p>
    <script nonce="${nonce}" src="${scriptUri.toString()}"></script>
  </body>
</html>`;
  }
}

function createNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';
  for (let i = 0; i < 32; i += 1) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}
