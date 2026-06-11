// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  projects: [
    {
      // React component tests
      displayName: 'components',
      testEnvironment: 'jsdom',
      testMatch: ['**/*.test.tsx'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {
          tsconfig: { jsx: 'react-jsx' }
        }]
      },
    },
    {
      // API route tests
      displayName: 'api',
      testEnvironment: 'node',
      testMatch: ['**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {
          tsconfig: { jsx: 'react-jsx' }
        }]
      },
    }
  ]
};

export default config;