// Build script for the extension host bundle and the webview client bundle.
// Usage: node esbuild.mjs [--production] [--watch]
import * as esbuild from 'esbuild';

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * Emits VS Code "problem matcher" friendly output so the build task surfaces
 * errors in the Problems panel during watch.
 * @type {import('esbuild').Plugin}
 */
const problemMatcherPlugin = {
  name: 'problem-matcher',
  setup(build) {
    build.onStart(() => console.log('[watch] build started'));
    build.onEnd((result) => {
      for (const { text, location } of result.errors) {
        console.error(`✘ [ERROR] ${text}`);
        if (location) {
          console.error(`    ${location.file}:${location.line}:${location.column}`);
        }
      }
      console.log('[watch] build finished');
    });
  },
};

/** @type {import('esbuild').BuildOptions} */
const shared = {
  bundle: true,
  minify: production,
  sourcemap: !production,
  logLevel: 'silent',
  plugins: [problemMatcherPlugin],
};

/** @type {import('esbuild').BuildOptions} */
const extensionConfig = {
  ...shared,
  entryPoints: ['src/extension.ts'],
  outfile: 'dist/extension.js',
  format: 'cjs',
  platform: 'node',
  target: 'node20',
  // 'vscode' is provided by the extension host at runtime, never bundle it.
  external: ['vscode'],
};

/** @type {import('esbuild').BuildOptions} */
const webviewConfig = {
  ...shared,
  entryPoints: ['src/ui/webview/client/main.ts'],
  outfile: 'dist/webview.js',
  format: 'iife',
  platform: 'browser',
  target: 'es2022',
};

async function main() {
  const contexts = await Promise.all([
    esbuild.context(extensionConfig),
    esbuild.context(webviewConfig),
  ]);

  if (watch) {
    await Promise.all(contexts.map((ctx) => ctx.watch()));
  } else {
    await Promise.all(contexts.map((ctx) => ctx.rebuild()));
    await Promise.all(contexts.map((ctx) => ctx.dispose()));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
