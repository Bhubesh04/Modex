const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
  appointmentDate: {
    type: Date,
    required: true
  },
  slotTime: {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
    default: 'CONFIRMED'
  },
  reason: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index to prevent double booking
appointmentSchema.index({ doctor: 1, appointmentDate: 1, 'slotTime.startTime': 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);


