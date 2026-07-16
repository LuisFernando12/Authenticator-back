import type { Config } from 'jest';

const config: Config = {
  maxWorkers: '50%',
  moduleFileExtensions: ['ts', 'js'],
  roots: ['.', 'test', '<rootDir>/src'],
  testRegex: String.raw`.*\.spec\.ts$`,
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/node_modules'],
  coveragePathIgnorePatterns: [
    '/infrastructure/',
    '<rootDir>/src/entity',
    '<rootDir>/src/config',
    '<rootDir>/src/module',
    '<rootDir>/src/repository',
    '<rootDir>/src/main.ts',
    '<rootDir>/jest.config.ts',
    '<rootDir>/test/e2e',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/dist',
    '<rootDir>/node_modules',
    '<rootDir>/test/e2e',
  ],
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
