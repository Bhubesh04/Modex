const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const generateToken = require('../utils/generateToken');

const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, specialization, qualification, experience, consultationFee, schedule, bio } = req.body;

    if (!name || !email || !password || !specialization || !qualification || !experience) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      phone,
      role: 'DOCTOR'
    });
    await user.save();

    // Create doctor profile
    const doctorProfile = new DoctorProfile({
      user: user._id,
      specialization,
      qualification,
      experience,
      consultationFee: consultationFee || 500,
      schedule: schedule || {},
      bio
    });
    await doctorProfile.save();

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      doctor: {
        id: user._id,
        name: user.name,
        email: user.email,
        specialization: doctorProfile.specialization
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const registerReceptionist = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      phone,
      role: 'RECEPTIONIST'
    });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Receptionist registered successfully',
      receptionist: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getDoctors = async (req, res) => {
  try {
    const doctors = await DoctorProfile.find()
      .populate('user', 'name email phone')
      .select('-schedule');

    res.json({
      success: true,
      doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getReceptionists = async (req, res) => {
  try {
    const receptionists = await User.find({ role: 'RECEPTIONIST' })
      .select('-password');

    res.json({
      success: true,
      receptionists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  registerDoctor,
  registerReceptionist,
  getDoctors,
  getReceptionists
};


