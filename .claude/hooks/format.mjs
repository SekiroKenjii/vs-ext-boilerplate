#!/usr/bin/env node
// PostToolUse hook: after Claude edits a TypeScript file, format it with
// Prettier and auto-fix with ESLint. Best-effort and non-blocking — any
// failure is swallowed so it never interrupts the edit flow.
import { execFileSync } from 'node:child_process';

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  raw += chunk;
});
process.stdin.on('end', () => {
  try {
    const payload = JSON.parse(raw || '{}');
    const file = payload?.tool_input?.file_path;
    if (typeof file !== 'string' || !/\.[mc]?ts$/.test(file)) {
      process.exit(0);
    }
    const run = (args) =>
      execFileSync('pnpm', ['exec', ...args, file], { stdio: 'ignore', shell: true });
    run(['prettier', '--write']);
    run(['eslint', '--fix']);
  } catch {
    // Formatting is advisory; never block the edit.
  }
  process.exit(0);
});
