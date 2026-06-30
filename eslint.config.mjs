// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // Global ignores. Tooling/config files are intentionally not type-checked.
    ignores: [
      'dist/**',
      'out/**',
      'coverage/**',
      '.vscode-test/**',
      'node_modules/**',
      'scripts/**',
      '.claude/**',
      '**/*.config.{js,mjs,cjs,ts}',
      'esbuild.mjs',
      '.vscode-test.mjs',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        // Explicit project list so every file (including the browser webview
        // client and the test configs) is matched to a type-aware program.
        project: [
          './tsconfig.json',
          './tsconfig.webview.json',
          './tsconfig.test.json',
          './tsconfig.integration.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'all'],
      'no-throw-literal': 'error',
      // The webview protocol models messages as discriminated unions, which
      // must be `type` aliases rather than interfaces.
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['camelCase'] },
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'PascalCase'] },
        { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'enumMember', format: ['PascalCase'] },
        {
          selector: 'objectLiteralProperty',
          format: null, // VS Code contribution keys aren't camelCase (e.g. "when").
        },
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase'],
        },
      ],
    },
  },
);
