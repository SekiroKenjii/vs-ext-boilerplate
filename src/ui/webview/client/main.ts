import type { HostToWebview, WebviewToHost } from '../protocol';

/** Subset of the API surface exposed by `acquireVsCodeApi()` inside a webview. */
interface VsCodeApi {
  postMessage(message: WebviewToHost): void;
  getState<T>(): T | undefined;
  setState<T>(state: T): void;
}

declare function acquireVsCodeApi(): VsCodeApi;

const vscode = acquireVsCodeApi();

function post(message: WebviewToHost): void {
  vscode.postMessage(message);
}

window.addEventListener('message', (event: MessageEvent<HostToWebview>) => {
  const message = event.data;
  if (message.type === 'init') {
    const heading = document.getElementById('greeting');
    if (heading) {
      heading.textContent = `${message.payload.greeting} from the webview!`;
    }
  }
});

document.getElementById('ping')?.addEventListener('click', () => {
  post({ type: 'ping', payload: { at: Date.now() } });
  const status = document.getElementById('status');
  if (status) {
    status.textContent = 'Ping sent to the extension host.';
  }
});

// Tell the host we are ready to receive the initial state.
post({ type: 'ready' });
