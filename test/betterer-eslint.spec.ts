import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should report the status of a new eslint rule', async () => {
    const { logs, paths, readFile, cleanup, resolve, writeFile } = await createFixture('test-betterer-eslint', {
      '.betterer.js': `
const { eslint } = require('@betterer/eslint');

module.exports = {
  'eslint enable new rule': eslint({ 'no-debugger': 'error' }).include('./src/**/*.ts')
};      
      `,
      '.eslintrc.js': `
const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    project: path.resolve(__dirname, './tsconfig.json'),
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  rules: {
    'no-debugger': 1
  }
};
      `,
      'tsconfig.json': `
{
  "extends": "../../tsconfig.json",
  "include": ["./src/**/*", "./.betterer.js", "./.eslintrc.js"]
}
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `debugger;`);

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(newTestRun.new).toEqual(['eslint enable new rule']);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(sameTestRun.same).toEqual(['eslint enable new rule']);

    await writeFile(indexPath, `debugger;\ndebugger;`);

    const worseTestRun = await betterer({ configPaths, resultsPath });

    expect(worseTestRun.worse).toEqual(['eslint enable new rule']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, '');

    const betterTestRun = await betterer({ configPaths, resultsPath });

    expect(betterTestRun.better).toEqual(['eslint enable new rule']);

    const completedTestRun = await betterer({ configPaths, resultsPath });

    expect(completedTestRun.completed).toEqual(['eslint enable new rule']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should throw if there are no rules', async () => {
    const { paths, logs, cleanup } = await createFixture('test-betterer-eslint-no-rule', {
      '.betterer.js': `
const { eslint } = require('@betterer/eslint');

module.exports = {
  'eslint enable complex rule': eslint().include('./src/**/*.ts')
};      
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  describe('eslintBetterer (deprecated)', () => {
    it('should report the status of a new eslint rule', async () => {
      const { logs, paths, readFile, cleanup, resolve, writeFile } = await createFixture(
        'test-betterer-eslint-deprecated',
        {
          '.betterer.js': `
  const { eslint } = require('@betterer/eslint');
  
  module.exports = {
    'eslint enable new rule': eslint({ 'no-debugger': 'error' }).include('./src/**/*.ts')
  };      
        `,
          '.eslintrc.js': `
  const path = require('path');
  
  module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2018,
      project: path.resolve(__dirname, './tsconfig.json'),
      sourceType: 'module'
    },
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ],
    rules: {
      'no-debugger': 1
    }
  };
        `,
          'tsconfig.json': `
  {
    "extends": "../../tsconfig.json",
    "include": ["./src/**/*", "./.betterer.js", "./.eslintrc.js"]
  }
        `
        }
      );

      const configPaths = [paths.config];
      const resultsPath = paths.results;
      const indexPath = resolve('./src/index.ts');

      await writeFile(indexPath, `debugger;`);

      const newTestRun = await betterer({ configPaths, resultsPath });

      expect(newTestRun.new).toEqual(['eslint enable new rule']);

      const sameTestRun = await betterer({ configPaths, resultsPath });

      expect(sameTestRun.same).toEqual(['eslint enable new rule']);

      await writeFile(indexPath, `debugger;\ndebugger;`);

      const worseTestRun = await betterer({ configPaths, resultsPath });

      expect(worseTestRun.worse).toEqual(['eslint enable new rule']);

      const result = await readFile(resultsPath);

      expect(result).toMatchSnapshot();

      await writeFile(indexPath, '');

      const betterTestRun = await betterer({ configPaths, resultsPath });

      expect(betterTestRun.better).toEqual(['eslint enable new rule']);

      const completedTestRun = await betterer({ configPaths, resultsPath });

      expect(completedTestRun.completed).toEqual(['eslint enable new rule']);

      expect(logs).toMatchSnapshot();

      await cleanup();
    });

    it('should throw if there is no globs', async () => {
      const { paths, logs, cleanup } = await createFixture('test-betterer-eslint-no-globs-deprecated', {
        '.betterer.js': `
const { eslintBetterer } = require('@betterer/eslint');

module.exports = {
  'eslint': eslintBetterer()
};
        `
      });

      const configPaths = [paths.config];
      const resultsPath = paths.results;

      await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();

      expect(logs).toMatchSnapshot();

      await cleanup();
    });

    it('should throw if there is no rule', async () => {
      const { paths, logs, cleanup } = await createFixture('test-betterer-eslint-no-rule-deprecated', {
        '.betterer.js': `
const { eslintBetterer } = require('@betterer/eslint');

module.exports = {
  'eslint': eslintBetterer('./src/**/*.ts')
};      
        `
      });

      const configPaths = [paths.config];
      const resultsPath = paths.results;

      await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();

      expect(logs).toMatchSnapshot();

      await cleanup();
    });
  });
});
