// Load environment variables FIRST before anything else
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`MedConnect+ Server running on port ${PORT}`);
});

