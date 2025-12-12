const appointmentService = require('../services/appointment.service');
const prescriptionService = require('../services/prescription.service');
const Patient = require('../models/Patient');
const DoctorProfile = require('../models/DoctorProfile');

const getAppointments = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const appointments = await appointmentService.getAppointmentsByPatient(patient._id);

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getPrescriptions = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const prescriptions = await prescriptionService.getPrescriptionsByPatient(patient._id);

    res.json({
      success: true,
      prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await DoctorProfile.find()
      .populate({
        path: 'user',
        select: 'name email phone role isActive createdAt'
      })
      .select('specialization qualification experience consultationFee bio schedule createdAt');

    // Format response to include all doctor and user details
    const formattedDoctors = doctors.map(doctor => ({
      _id: doctor._id,
      user: doctor.user ? {
        _id: doctor.user._id,
        name: doctor.user.name,
        email: doctor.user.email,
        phone: doctor.user.phone,
        role: doctor.user.role,
        isActive: doctor.user.isActive,
        createdAt: doctor.user.createdAt
      } : null,
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      bio: doctor.bio,
      schedule: doctor.schedule,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt
    }));

    res.json({
      success: true,
      doctors: formattedDoctors,
      count: formattedDoctors.length
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
      return res.status(400).json({
        success: false,
        message: 'Doctor ID and date are required'
      });
    }

    const slots = await appointmentService.getAvailableSlots(doctorId, date);

    res.json({
      success: true,
      slots: slots || []
    });
  } catch (error) {
    console.error('Error getting available slots:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to get available slots'
    });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, slotTime, reason, notes } = req.body;

    if (!doctorId || !appointmentDate || !slotTime || !reason) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Get patient
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    // Parse date properly - ensure it's set to start of day
    const dateObj = new Date(appointmentDate);
    dateObj.setHours(0, 0, 0, 0);

    const appointmentData = {
      patient: patient._id,
      doctor: doctorId,
      appointmentDate: dateObj,
      slotTime,
      reason,
      notes
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
  getAppointments,
  getPrescriptions,
  getAllDoctors,
  getAvailableSlots,
  bookAppointment
};
