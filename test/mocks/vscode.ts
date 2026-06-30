/**
 * Hand-written mock of the small slice of the `vscode` API that unit tests need.
 * Vitest aliases the `vscode` import to this file (see vitest.config.ts), so the
 * code under test and the test share this exact module instance.
 *
 * Extend this as your unit tests grow to cover more of the API.
 */

const configStore = new Map<string, unknown>();

/** Test helper: seed configuration values for a section. */
export function seedConfig(section: string, values: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(values)) {
    configStore.set(`${section}.${key}`, value);
  }
}

/** Test helper: clear all seeded configuration. */
export function resetConfig(): void {
  configStore.clear();
}

export const workspace = {
  getConfiguration(section?: string) {
    return {
      get<T>(key: string, defaultValue: T): T {
        const fullKey = section ? `${section}.${key}` : key;
        return configStore.has(fullKey) ? (configStore.get(fullKey) as T) : defaultValue;
      },
    };
  },
  onDidChangeConfiguration(): { dispose(): void } {
    return {
      dispose() {
        /* no-op for unit tests */
      },
    };
  },
};
