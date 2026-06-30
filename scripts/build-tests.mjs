// Bundles the integration tests to CommonJS in ./out so @vscode/test-cli can
// load them inside the VS Code host. Uses esbuild to keep one toolchain.
import { readdir } from 'node:fs/promises';

import * as esbuild from 'esbuild';

const testDir = 'test/integration';
const entryPoints = (await readdir(testDir))
  .filter((file) => file.endsWith('.test.ts'))
  .map((file) => `${testDir}/${file}`);

await esbuild.build({
  entryPoints,
  outdir: 'out',
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  sourcemap: true,
  // Provided by the VS Code host / Node at runtime.
  external: ['vscode'],
});
