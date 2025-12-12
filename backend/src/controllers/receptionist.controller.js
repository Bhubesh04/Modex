const authService = require('../services/auth.service');
const appointmentService = require('../services/appointment.service');
const DoctorProfile = require('../models/DoctorProfile');
const Patient = require('../models/Patient');

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
      message: 'Patient registered successfully',
      ...result
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

const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    if (!doctorId || !date) {
      return res.status(400).json({ message: 'Doctor ID and date are required' });
    }

    const slots = await appointmentService.getAvailableSlots(doctorId, date);

    res.json({
      success: true,
      slots
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, slotTime, reason, notes } = req.body;

    if (!patientId || !doctorId || !appointmentDate || !slotTime || !reason) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const appointmentData = {
      patient: patientId,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      slotTime,
      reason,
      notes,
      bookedBy: req.user._id
    };

    const appointment = await appointmentService.bookAppointment(appointmentData);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  registerPatient,
  getDoctors,
  getAvailableSlots,
  bookAppointment
};



