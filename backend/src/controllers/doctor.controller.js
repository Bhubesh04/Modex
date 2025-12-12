const appointmentService = require('../services/appointment.service');
const prescriptionService = require('../services/prescription.service');
const DoctorProfile = require('../models/DoctorProfile');
const Patient = require('../models/Patient');

const getAppointments = async (req, res) => {
  try {
    const doctorProfile = await DoctorProfile.findOne({ user: req.user._id });
    
    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    // Get all appointments, not just CONFIRMED
    const appointments = await appointmentService.getAppointmentsByDoctor(doctorProfile._id, null);

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

const getAppointmentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.getAppointmentById(id);

    // Verify appointment belongs to this doctor
    const doctorProfile = await DoctorProfile.findOne({ user: req.user._id });
    if (appointment.doctor._id.toString() !== doctorProfile._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate({
        path: 'user',
        select: 'name email phone role isActive createdAt'
      })
      .select('dateOfBirth gender address emergencyContact bloodGroup medicalHistory createdAt')
      .sort({ createdAt: -1 });

    // Format response to include all patient and user details
    const formattedPatients = patients.map(patient => ({
      _id: patient._id,
      user: patient.user ? {
        _id: patient.user._id,
        name: patient.user.name,
        email: patient.user.email,
        phone: patient.user.phone,
        role: patient.user.role,
        isActive: patient.user.isActive,
        createdAt: patient.user.createdAt
      } : null,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      address: patient.address,
      emergencyContact: patient.emergencyContact,
      bloodGroup: patient.bloodGroup,
      medicalHistory: patient.medicalHistory,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt
    }));

    res.json({
      success: true,
      patients: formattedPatients,
      count: formattedPatients.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, diagnosis, symptoms, notes, followUpDate } = req.body;

    if (!appointmentId || !medicines || !diagnosis) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Verify appointment belongs to this doctor
    const appointment = await appointmentService.getAppointmentById(appointmentId);
    const doctorProfile = await DoctorProfile.findOne({ user: req.user._id });
    
    if (appointment.doctor._id.toString() !== doctorProfile._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const prescriptionData = {
      appointmentId,
      medicines,
      diagnosis,
      symptoms,
      notes,
      followUpDate: followUpDate ? new Date(followUpDate) : null
    };

    const prescription = await prescriptionService.createPrescription(prescriptionData);

    res.status(201).json({
      success: true,
      message: 'Prescription created and emailed successfully. Patient will receive the email in their inbox.',
      emailSent: true,
      prescription
    });
  } catch (error) {
    // Check if it's an email error
    const isEmailError = error.message && (
      error.message.includes('email') || 
      error.message.includes('SMTP') || 
      error.message.includes('Gmail')
    );

    if (isEmailError) {
      res.status(500).json({
        success: false,
        message: 'Prescription created but email sending failed. Please check Gmail configuration.',
        emailSent: false,
        error: error.message
      });
    } else {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create prescription',
        emailSent: false
      });
    }
  }
};

module.exports = {
  getAppointments,
  getAppointmentDetails,
  getAllPatients,
  createPrescription
};
