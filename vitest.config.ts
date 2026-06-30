import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/unit/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/ui/webview/client/**', 'src/**/*.d.ts'],
      reporter: ['text', 'html', 'lcov'],
    },
  },
  resolve: {
    alias: {
      // Unit tests run outside the VS Code host, so 'vscode' is mocked.
      vscode: fileURLToPath(new URL('./test/mocks/vscode.ts', import.meta.url)),
    },
  },
});
