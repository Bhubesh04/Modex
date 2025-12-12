const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const verifyDatabase = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    console.log('📋 Checking MongoDB Configuration...\n');
    console.log('Current MONGODB_URI:', MONGODB_URI ? MONGODB_URI.replace(/\/\/.*@/, '//***:***@') : 'NOT SET');
    
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI is not set in .env file');
      process.exit(1);
    }
    
    // Check if database name is in URI
    const dbNameMatch = MONGODB_URI.match(/\/([^?]+)(\?|$)/);
    const dbNameInUri = dbNameMatch ? dbNameMatch[1] : null;
    
    if (!dbNameInUri || dbNameInUri === '') {
      console.warn('⚠️  WARNING: No database name found in MONGODB_URI');
      console.warn('   MongoDB will default to "test" database');
      console.warn('   Fix: Add database name to URI: mongodb+srv://.../medconnect?retryWrites=true&w=majority');
    } else {
      console.log(`✅ Database name in URI: ${dbNameInUri}`);
    }
    
    console.log('\n🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const dbName = mongoose.connection.name;
    console.log(`✅ Connected to database: ${dbName}`);
    
    if (dbName === 'test') {
      console.warn('\n⚠️  WARNING: Connected to "test" database instead of "medconnect"');
      console.warn('   This means your MONGODB_URI is missing the database name.');
      console.warn('   Update your .env file:');
      console.warn('   MONGODB_URI=mongodb+srv://bhubesh:bhubesh123@cluster0.arodjaf.mongodb.net/medconnect?retryWrites=true&w=majority');
    } else if (dbName === 'medconnect') {
      console.log('\n✅ Correctly connected to "medconnect" database');
    }
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📦 Collections in database (${collections.length}):`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

verifyDatabase();

