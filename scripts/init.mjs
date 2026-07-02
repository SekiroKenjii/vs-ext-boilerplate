// One-time template initializer: turns this boilerplate into your own extension.
// Rewrites every identity string (ids, names, placeholders) across the repo,
// resets the version and changelog, then removes itself.
//
//   pnpm run init                                    # interactive
//   pnpm run init -- --name my-ext --publisher me --yes
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { parseArgs } from 'node:util';

const ROOT = path.resolve(import.meta.dirname, '..');
const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'out',
  'tmp',
  'coverage',
  '.vscode-test',
]);
const SKIP_FILES = new Set(['scripts/init.mjs', 'pnpm-lock.yaml']);

const HELP = `Initialize your own extension from this template.

Options (any omitted value is prompted for, or defaulted with --yes):
  --name          Extension id: lowercase kebab-case, e.g. "my-extension"
  --display-name  Human-readable name shown in the Marketplace and UI
  --description   One-line description (package.json + README)
  --publisher     VS Marketplace publisher id
  --owner         GitHub user/org owning the new repository
  --author        Author name (LICENSE, plugin manifests)
  --yes           Skip prompts and confirmation; use defaults for omitted values
  --help          Show this help`;

function git(args) {
  try {
    return execSync(`git ${args}`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

function originRepo() {
  const match = /[/:]([^/:]+)\/([^/]+?)(?:\.git)?$/.exec(git('remote get-url origin'));
  return match ? { owner: match[1], repo: match[2] } : undefined;
}

const kebab = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const camel = (name) => name.replace(/-+([a-z0-9])/g, (_, ch) => ch.toUpperCase());
const pascal = (name) => camel(name).replace(/^./, (ch) => ch.toUpperCase());
const titleCase = (name) =>
  name
    .split('-')
    .map((word) => word.replace(/^./, (ch) => ch.toUpperCase()))
    .join(' ');

const validators = {
  name: (v) =>
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(v)
      ? undefined
      : 'must be lowercase kebab-case (letters, digits, hyphens)',
  displayName: (v) => (v.length > 0 ? undefined : 'must not be empty'),
  description: (v) => (v.length > 0 ? undefined : 'must not be empty'),
  publisher: (v) =>
    /^[a-zA-Z0-9][a-zA-Z0-9-]*$/.test(v) ? undefined : 'letters, digits, and hyphens only',
  owner: (v) => (/^[A-Za-z0-9-]+$/.test(v) ? undefined : 'letters, digits, and hyphens only'),
  author: (v) => (v.length > 0 ? undefined : 'must not be empty'),
};

async function collectAnswers(flags) {
  const origin = originRepo();
  const defaults = {
    name: kebab(origin?.repo ?? path.basename(ROOT)) || 'my-extension',
    publisher: 'your-publisher-id',
    owner: origin?.owner ?? 'your-org',
    author: git('config user.name') || 'your-name',
  };

  let rl = null;
  if (!flags.yes) {
    if (!process.stdin.isTTY) {
      throw new Error('stdin is not a TTY; pass values as flags together with --yes');
    }
    rl = readline.createInterface(process.stdin, process.stdout);
  }

  const ask = async (key, label, fallback) => {
    const flagValue = flags[key === 'displayName' ? 'display-name' : key];
    if (flagValue !== undefined) {
      const error = validators[key](flagValue);
      if (error) throw new Error(`--${key === 'displayName' ? 'display-name' : key}: ${error}`);
      return flagValue;
    }
    if (flags.yes) return fallback;
    for (;;) {
      const raw = (await rl.question(`${label} [${fallback}]: `)).trim();
      const value = raw || fallback;
      const error = validators[key](value);
      if (!error) return value;
      console.log(`  ✖ ${error}`);
    }
  };

  const answers = {};
  answers.name = await ask('name', 'Extension id (kebab-case)', defaults.name);
  answers.displayName = await ask('displayName', 'Display name', titleCase(answers.name));
  answers.description = await ask('description', 'Description', 'A VS Code extension.');
  answers.publisher = await ask('publisher', 'Marketplace publisher id', defaults.publisher);
  answers.owner = await ask('owner', 'GitHub owner (user/org)', defaults.owner);
  answers.author = await ask('author', 'Author name', defaults.author);

  if (!flags.yes) {
    console.log(
      [
        '',
        'About to rewrite this repository:',
        `  id            ${answers.name}`,
        `  display name  ${answers.displayName}`,
        `  description   ${answers.description}`,
        `  publisher     ${answers.publisher}`,
        `  repository    ${answers.owner}/${answers.name}`,
        `  author        ${answers.author}`,
        '',
      ].join('\n'),
    );
    const confirm = (await rl.question('Proceed? (y/N): ')).trim().toLowerCase();
    if (confirm !== 'y' && confirm !== 'yes') {
      console.log('Aborted; nothing was changed.');
      process.exit(1);
    }
  }
  rl?.close();
  return answers;
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(path.join(dir, entry.name));
    } else if (entry.isFile()) {
      yield path.join(dir, entry.name);
    }
  }
}

function replaceEverywhere(answers) {
  // Ordered so longer tokens win (the regex alternation tries them first),
  // and applied in a single pass so replaced text is never re-matched.
  const tokens = [
    ['VS Code Extension Boilerplate', answers.displayName],
    ['vscode-ext-boilerplate', answers.name],
    ['vs-ext-boilerplate', answers.name],
    ['vsExtBoilerplate', camel(answers.name)],
    ['BoilerplateConfig', `${pascal(answers.name)}Config`],
    ['Boilerplate', answers.displayName],
    ['the boilerplate status bar item', `the ${answers.displayName} status bar item`],
    ['your-publisher-id', answers.publisher],
    ['your-org', answers.owner],
    ['SekiroKenjii', answers.owner],
    ['your-name', answers.author],
  ];
  const map = new Map(tokens);
  const pattern = new RegExp(
    tokens.map(([token]) => token.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)).join('|'),
    'g',
  );

  const changed = [];
  for (const file of walk(ROOT)) {
    const rel = path.relative(ROOT, file).replaceAll('\\', '/');
    if (SKIP_FILES.has(rel)) continue;
    const buf = fs.readFileSync(file);
    if (buf.includes(0)) continue; // binary
    const text = buf.toString('utf8');
    let next = text.replace(pattern, (token) => map.get(token));
    // Template-only doc blocks make no sense in an initialized project; the
    // README's block is replaced with the description in resetProjectFiles.
    if (rel !== 'README.md') {
      next = next.replace(
        /\n*<!-- template-only:start -->[\s\S]*?<!-- template-only:end -->\n*/g,
        '\n\n',
      );
    }
    if (next !== text) {
      fs.writeFileSync(file, next);
      changed.push(rel);
    }
  }
  return changed;
}

function resetProjectFiles(answers) {
  const pkgPath = path.join(ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.version = '0.0.1';
  pkg.description = answers.description;
  pkg.keywords = [];
  delete pkg.scripts.init;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  fs.writeFileSync(
    path.join(ROOT, 'CHANGELOG.md'),
    [
      '# Changelog',
      '',
      'All notable changes to this project are documented here. The format is based on',
      '[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres',
      'to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).',
      '',
      '## [Unreleased]',
      '',
    ].join('\n'),
  );

  const readmePath = path.join(ROOT, 'README.md');
  const readme = fs.readFileSync(readmePath, 'utf8');
  fs.writeFileSync(
    readmePath,
    readme.replace(
      /<!-- template-only:start -->[\s\S]*?<!-- template-only:end -->/,
      answers.description,
    ),
  );

  fs.rmSync(path.join(ROOT, 'scripts', 'init.mjs'));
}

const { values: flags } = parseArgs({
  options: {
    name: { type: 'string' },
    'display-name': { type: 'string' },
    description: { type: 'string' },
    publisher: { type: 'string' },
    owner: { type: 'string' },
    author: { type: 'string' },
    yes: { type: 'boolean', default: false },
    help: { type: 'boolean', default: false },
  },
});
if (flags.help) {
  console.log(HELP);
  process.exit(0);
}

const answers = await collectAnswers(flags);
const changed = replaceEverywhere(answers);
resetProjectFiles(answers);

console.log(
  `\n✔ Initialized "${answers.displayName}" (${answers.name}) — ${changed.length} files rewritten.`,
);
const notes = [];
if (!fs.existsSync(path.join(ROOT, '.git')))
  notes.push('git init   # this copy has no git history yet');
notes.push(
  'review the changes (git diff), then commit',
  'press F5 to try the extension in a Development Host',
  'replace media/icon.svg and set a 128×128 PNG icon before publishing (see README → Publishing)',
);
if (answers.publisher === 'your-publisher-id') {
  notes.push('set a real Marketplace publisher id in package.json before publishing');
}
const numbered = notes.map((note, i) => `  ${i + 1}. ${note}`).join('\n');
console.log(`\nNext steps:\n${numbered}`);
