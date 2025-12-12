const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

const doctorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  consultationFee: {
    type: Number,
    required: true,
    default: 500
  },
  schedule: {
    monday: [slotSchema],
    tuesday: [slotSchema],
    wednesday: [slotSchema],
    thursday: [slotSchema],
    friday: [slotSchema],
    saturday: [slotSchema],
    sunday: [slotSchema]
  },
  bio: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);


