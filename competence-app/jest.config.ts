// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom', // This should work after installation
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
      '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Optional setup file
    modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
  };
  