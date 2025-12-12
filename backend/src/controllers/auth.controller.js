const authService = require('../services/auth.service');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const result = await authService.loginUser(email, password);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

const registerPatient = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender, address, emergencyContact, bloodGroup } = req.body;

    if (!name || !email || !password || !dateOfBirth || !gender || !address) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userData = { name, email, password, phone };
    const patientData = { dateOfBirth, gender, address, emergencyContact, bloodGroup };

    const result = await authService.registerPatient(userData, patientData);

    res.status(201).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const User = require('../models/User');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      phone,
      role: 'ADMIN'
    });
    await user.save();

    const generateToken = require('../utils/generateToken');
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, specialization, qualification, experience, consultationFee, bio } = req.body;

    if (!name || !email || !password || !specialization || !qualification || !experience) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const User = require('../models/User');
    const DoctorProfile = require('../models/DoctorProfile');

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      phone,
      role: 'DOCTOR'
    });
    await user.save();

    // Default schedule with common time slots
    const defaultSchedule = {
      monday: [
        { startTime: '09:00', endTime: '10:00', isAvailable: true },
        { startTime: '10:00', endTime: '11:00', isAvailable: true },
        { startTime: '11:00', endTime: '12:00', isAvailable: true },
        { startTime: '14:00', endTime: '15:00', isAvailable: true },
        { startTime: '15:00', endTime: '16:00', isAvailable: true },
        { startTime: '16:00', endTime: '17:00', isAvailable: true }
      ],
      tuesday: [
        { startTime: '09:00', endTime: '10:00', isAvailable: true },
        { startTime: '10:00', endTime: '11:00', isAvailable: true },
        { startTime: '11:00', endTime: '12:00', isAvailable: true },
        { startTime: '14:00', endTime: '15:00', isAvailable: true },
        { startTime: '15:00', endTime: '16:00', isAvailable: true },
        { startTime: '16:00', endTime: '17:00', isAvailable: true }
      ],
      wednesday: [
        { startTime: '09:00', endTime: '10:00', isAvailable: true },
        { startTime: '10:00', endTime: '11:00', isAvailable: true },
        { startTime: '11:00', endTime: '12:00', isAvailable: true },
        { startTime: '14:00', endTime: '15:00', isAvailable: true },
        { startTime: '15:00', endTime: '16:00', isAvailable: true },
        { startTime: '16:00', endTime: '17:00', isAvailable: true }
      ],
      thursday: [
        { startTime: '09:00', endTime: '10:00', isAvailable: true },
        { startTime: '10:00', endTime: '11:00', isAvailable: true },
        { startTime: '11:00', endTime: '12:00', isAvailable: true },
        { startTime: '14:00', endTime: '15:00', isAvailable: true },
        { startTime: '15:00', endTime: '16:00', isAvailable: true },
        { startTime: '16:00', endTime: '17:00', isAvailable: true }
      ],
      friday: [
        { startTime: '09:00', endTime: '10:00', isAvailable: true },
        { startTime: '10:00', endTime: '11:00', isAvailable: true },
        { startTime: '11:00', endTime: '12:00', isAvailable: true },
        { startTime: '14:00', endTime: '15:00', isAvailable: true },
        { startTime: '15:00', endTime: '16:00', isAvailable: true },
        { startTime: '16:00', endTime: '17:00', isAvailable: true }
      ],
      saturday: [
        { startTime: '09:00', endTime: '10:00', isAvailable: true },
        { startTime: '10:00', endTime: '11:00', isAvailable: true },
        { startTime: '11:00', endTime: '12:00', isAvailable: true }
      ],
      sunday: []
    };

    const doctorProfile = new DoctorProfile({
      user: user._id,
      specialization,
      qualification,
      experience,
      consultationFee: consultationFee || 500,
      schedule: defaultSchedule,
      bio
    });
    await doctorProfile.save();

    const generateToken = require('../utils/generateToken');
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
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

    const User = require('../models/User');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      phone,
      role: 'RECEPTIONIST'
    });
    await user.save();

    const generateToken = require('../utils/generateToken');
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  login,
  registerPatient,
  registerAdmin,
  registerDoctor,
  registerReceptionist
};

