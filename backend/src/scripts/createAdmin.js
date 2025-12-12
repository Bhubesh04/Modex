const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://bhubesh:bhubesh123@cluster0.arodjaf.mongodb.net/medconnect');
    console.log('Connected to MongoDB');

    // Admin credentials
    const adminData = {
      name: 'Admin User',
      email: 'admin@medconnect.com',
      password: 'admin123', // Will be hashed automatically by the model
      role: 'ADMIN',
      phone: '1234567890',
      isActive: true
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    // Create admin user (password will be hashed by the model's pre-save hook)
    const admin = new User(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('Role:', adminData.role);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();



