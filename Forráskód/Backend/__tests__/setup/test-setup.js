// Pre-test setup file to ensure environment variables are set
const dotenv = require('dotenv');
const path = require('path');

// Ensure we're using test environment
process.env.NODE_ENV = 'test';

// Load test-specific environment variables
const envPath = path.resolve(__dirname, '../../.env.test');
console.log('Loading test environment from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading test environment variables:', result.error);
  process.exit(1);
}

// Log important environment variables (without sensitive values)
console.log('Test environment setup:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('- MONGODB_URI:', process.env.MONGODB_URI);

// Verify required environment variables
const requiredVars = ['JWT_SECRET', 'MONGODB_URI'];
const missing = requiredVars.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('Missing required environment variables:', missing.join(', '));
  process.exit(1);
} 