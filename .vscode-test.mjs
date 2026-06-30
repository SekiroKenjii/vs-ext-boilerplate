import { defineConfig } from '@vscode/test-cli';

// Runs the compiled integration tests (see tsconfig.integration.json) inside a
// real VS Code instance downloaded on demand.
export default defineConfig({
  files: 'out/**/*.test.js',
  version: 'stable',
  mocha: {
    ui: 'bdd',
    timeout: 20_000,
  },
});
