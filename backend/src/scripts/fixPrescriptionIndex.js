const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://bhubesh:bhubesh123@cluster0.arodjaf.mongodb.net/medconnect?retryWrites=true&w=majority';

const fixPrescriptionIndex = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const db = mongoose.connection.db;
    const dbName = mongoose.connection.name;
    console.log(`✅ Connected to database: ${dbName}`);
    
    // Get the prescriptions collection
    const prescriptionsCollection = db.collection('prescriptions');
    
    // List all indexes
    console.log('\n📋 Current indexes on prescriptions collection:');
    const indexes = await prescriptionsCollection.indexes();
    indexes.forEach(index => {
      console.log(`   - ${index.name}:`, JSON.stringify(index.key));
    });
    
    // Check if prescriptionId_1 index exists
    const prescriptionIdIndex = indexes.find(idx => idx.name === 'prescriptionId_1');
    
    if (prescriptionIdIndex) {
      console.log('\n🗑️  Found old prescriptionId_1 index. Dropping it...');
      await prescriptionsCollection.dropIndex('prescriptionId_1');
      console.log('✅ Successfully dropped prescriptionId_1 index');
    } else {
      console.log('\n✅ No prescriptionId_1 index found. Nothing to fix.');
    }
    
    // List indexes again to confirm
    console.log('\n📋 Updated indexes:');
    const updatedIndexes = await prescriptionsCollection.indexes();
    updatedIndexes.forEach(index => {
      console.log(`   - ${index.name}:`, JSON.stringify(index.key));
    });
    
    console.log('\n✅ Index fix completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing index:', error.message);
    if (error.code === 27) {
      console.error('   Index not found - this is okay, it may have already been removed.');
    } else {
      console.error('   Full error:', error);
    }
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

fixPrescriptionIndex();

