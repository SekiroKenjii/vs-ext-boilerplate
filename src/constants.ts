/**
 * Single source of truth for identifiers contributed in package.json.
 * Keeping them here avoids magic strings drifting out of sync with the manifest.
 */

/** Configuration section, e.g. `vsExtBoilerplate.greeting`. */
export const CONFIG_SECTION = 'vsExtBoilerplate';

/** Command IDs. Must match `contributes.commands` in package.json. */
export const Commands = {
  helloWorld: 'vsExtBoilerplate.helloWorld',
  openPanel: 'vsExtBoilerplate.openPanel',
  refreshExamples: 'vsExtBoilerplate.refreshExamples',
} as const;

/** View IDs. Must match `contributes.views` in package.json. */
export const Views = {
  examples: 'vsExtBoilerplate.examplesView',
} as const;
