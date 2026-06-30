import * as vscode from 'vscode';

/**
 * Thin wrapper over a {@link vscode.LogOutputChannel}. Using the log-channel
 * variant gives users a log level selector and timestamps for free, and routes
 * to VS Code's standard logging infrastructure.
 */
export interface Logger extends vscode.Disposable {
  trace(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  /** Logs an error (and an optional contextual message). */
  error(error: unknown, message?: string): void;
  /** Reveals the output channel in the panel. */
  show(): void;
}

export function createLogger(name: string): Logger {
  const channel = vscode.window.createOutputChannel(name, { log: true });

  return {
    trace: (message, ...args) => channel.trace(message, ...args),
    debug: (message, ...args) => channel.debug(message, ...args),
    info: (message, ...args) => channel.info(message, ...args),
    warn: (message, ...args) => channel.warn(message, ...args),
    error: (error, message) => {
      const detail = error instanceof Error ? error : String(error);
      if (message) {
        channel.error(message, detail);
      } else {
        channel.error(detail);
      }
    },
    show: () => channel.show(true),
    dispose: () => channel.dispose(),
  };
}
