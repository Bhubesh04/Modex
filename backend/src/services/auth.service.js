const User = require('../models/User');
const Patient = require('../models/Patient');
const DoctorProfile = require('../models/DoctorProfile');
const generateToken = require('../utils/generateToken');

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('Account is inactive');
  }

  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    }
  };
};

const registerPatient = async (userData, patientData) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Create user
  const user = new User({
    ...userData,
    role: 'PATIENT'
  });
  await user.save();

  // Create patient profile
  const patient = new Patient({
    user: user._id,
    ...patientData
  });
  await patient.save();

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    patient: patient._id
  };
};

module.exports = {
  loginUser,
  registerPatient
};



