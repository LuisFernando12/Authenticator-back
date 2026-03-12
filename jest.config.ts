import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['ts', 'js'],
  roots: ['.', 'test', '<rootDir>/src'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/node_modules'],
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
