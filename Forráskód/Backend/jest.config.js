module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  
  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>'],
  
  // The test environment that will be used for testing
  testEnvironment: 'node',
  
  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  
  // An array of regexp pattern strings that are matched against all test paths
  // matched tests are skipped
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/helpers/',
    '/__tests__/setup/'
  ],
  
  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  // Test timeout in milliseconds
  testTimeout: 30000,

  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/jest.setup.js'],
  
  // Setup files to run before the environment is setup
  setupFiles: ['<rootDir>/__tests__/setup/test-setup.js'],

  // Indicates whether each individual test should be reported during the run
  verbose: true,
}; 