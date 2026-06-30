import type * as vscode from 'vscode';

import type { Logger } from './logger';

/**
 * Shared services injected into feature modules. This is intentionally a plain
 * interface rather than a DI framework: it keeps wiring explicit and makes
 * features trivial to unit test by passing fakes.
 */
export interface Services {
  readonly context: vscode.ExtensionContext;
  readonly logger: Logger;
}
