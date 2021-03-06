module.exports = {
  setupFilesAfterEnv: ['./test/setup.ts'],
  globals: {
    tsConfig: 'tsconfig.json'
  },
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/packages/**/dist/**/*.js',
    '!<rootDir>/packages/**/dist/**/types.js',
    '!<rootDir>/packages/**/dist/**/public.js',
    '!<rootDir>/packages/extension/dist/**/*.js'
  ],
  coverageDirectory: '<rootDir>/reports/coverage',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '\\.(ts)$': 'ts-jest'
  }
};
