// jest.config.ts
import nextJest from 'next/jest';

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest', // Transform TypeScript and JavaScript
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Support for "@/..." imports
    '^.+\\.(css|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
  },
};

export default createJestConfig(customJestConfig);
