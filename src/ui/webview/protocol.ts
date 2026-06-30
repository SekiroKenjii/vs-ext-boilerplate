/**
 * Typed message protocol shared by the extension host ({@link ./panel.ts}) and
 * the webview client ({@link ./client/main.ts}). Sharing these discriminated
 * unions makes `postMessage` traffic type-safe on both ends.
 */

/** Messages sent from the extension host to the webview. */
export type HostToWebview = { type: 'init'; payload: { greeting: string } };

/** Messages sent from the webview back to the extension host. */
export type WebviewToHost = { type: 'ready' } | { type: 'ping'; payload: { at: number } };
