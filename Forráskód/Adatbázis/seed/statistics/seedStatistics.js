const mongoose = require('../../../Backend/node_modules/mongoose');
const dotenv = require('../../../Backend/node_modules/dotenv');
const path = require('path');

// Load environment variables from the backend .env file
dotenv.config({ path: path.resolve(__dirname, '../../../Backend/.env') });

const connectDB = require('../../../Backend/config/db'); // Adjust path as needed
const statisticsController = require('../../../Backend/controllers/statisticsController'); // Adjust path as needed
const Statistics = require('../../../Backend/models/Statistics'); // Adjust path as needed

const seedStatistics = async () => {
  try {
    // Connect to Database
    await connectDB();
    console.log('MongoDB Connected for seeding statistics...');

    // Optional: Clear existing statistics document for a fresh calculation
    // console.log('Clearing existing statistics data...');
    // await Statistics.deleteMany({});

    console.log('Calculating and seeding statistics data...');
    // Call the updateStatistics function programmatically
    // Pass null or undefined for req and res as they are not needed here
    const updatedStats = await statisticsController.updateStatistics(null, null);

    if (updatedStats) {
      console.log('Statistics data seeded successfully:');
      // console.log(JSON.stringify(updatedStats, null, 2)); // Uncomment to see the seeded data
    } else {
      console.log('Statistics update function did not return data, but may have completed.');
    }

  } catch (error) {
    console.error('Error seeding statistics data:', error);
    process.exit(1); // Exit with failure code
  } finally {
    // Disconnect from Database
    await mongoose.disconnect();
    console.log('MongoDB Disconnected after seeding statistics.');
  }
};

// Run the seeder function
seedStatistics();
