# Backend Testing Suite

This directory contains the tests for our backend application, organized into different categories.

## Test Structure

- `unit/`: Unit tests for individual components
  - `models/`: Tests for database models
  - `middleware/`: Tests for middleware functions
  - `services/`: Tests for service functions
  - `utils/`: Tests for utility functions
- `integration/`: Integration tests across components
  - `routes/`: Tests for API routes
  - `middleware/`: Tests for middleware chains
  - `database/`: Tests for database interactions
- `e2e/`: End-to-end tests for complete flows
  - `flows/`: Tests for user workflows
- `helpers/`: Helper functions for tests
- `fixtures/`: Test data
- `setup/`: Test environment setup

## Running Tests

To run all tests:

```bash
npm test
```

To run specific test categories:

```bash
# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run e2e tests only
npm run test:e2e

# Run tests with coverage report
npm run test:coverage
```

## Test Environment

The tests use:
- Jest as the test runner
- MongoDB Memory Server for database testing
- Supertest for HTTP testing
- Faker.js for generating test data

The test environment is isolated from development and production environments, using `.env.test` for configuration.

## Writing New Tests

### Unit Tests

Unit tests should test individual components in isolation, with dependencies mocked.

Example:

```javascript
// Test a model
describe('User Model', () => {
  test('should validate when all required fields are provided', () => {
    // Test code here
  });
});
```

### Integration Tests

Integration tests should test how components work together.

Example:

```javascript
// Test an API route
describe('Auth Routes', () => {
  test('should register a new user', async () => {
    // Test code here
  });
});
```

### End-to-End Tests

E2E tests should test complete user workflows.

Example:

```javascript
// Test a complete workflow
describe('User Registration and Login Flow', () => {
  test('should allow a user to register and then login', async () => {
    // Test code here
  });
});
```

## Helpers

Use helper functions from `helpers/testDataFactory.js` to generate test data and `helpers/testRequest.js` for making HTTP requests.

## Best Practices

1. Each test should be independent
2. Clean up after tests to avoid affecting other tests
3. Use descriptive test names
4. Test both success and failure cases
5. Use realistic test data
6. Avoid testing implementation details
