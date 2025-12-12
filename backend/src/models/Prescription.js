const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  instructions: {
    type: String
  }
});

const prescriptionSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DoctorProfile',
    required: true
  },
  medicines: [medicineSchema],
  diagnosis: {
    type: String,
    required: true
  },
  symptoms: {
    type: String
  },
  notes: {
    type: String
  },
  followUpDate: {
    type: Date
  },
  qrToken: {
    type: String,
    unique: true,
    required: true
  },
  qrCode: {
    type: String
  },
  pdfPath: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prescription', prescriptionSchema);



