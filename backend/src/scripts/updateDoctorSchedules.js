const mongoose = require('mongoose');
const DoctorProfile = require('../models/DoctorProfile');
require('dotenv').config();

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

const updateDoctorSchedules = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://bhubesh:bhubesh123@cluster0.arodjaf.mongodb.net/medconnect');
    console.log('Connected to MongoDB');

    const doctors = await DoctorProfile.find();
    let updated = 0;

    for (const doctor of doctors) {
      // Check if schedule is empty, missing, or has no slots
      let needsUpdate = false;
      
      if (!doctor.schedule || typeof doctor.schedule !== 'object') {
        needsUpdate = true;
      } else {
        // Check if any day has slots
        const hasAnySlots = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].some(day => {
          return doctor.schedule[day] && Array.isArray(doctor.schedule[day]) && doctor.schedule[day].length > 0;
        });
        
        if (!hasAnySlots) {
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        doctor.schedule = defaultSchedule;
        await doctor.save();
        updated++;
        console.log(`Updated schedule for doctor: ${doctor._id} (${doctor.user?.name || 'Unknown'})`);
      }
    }

    console.log(`✅ Updated ${updated} doctor(s) with default schedules`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating schedules:', error);
    process.exit(1);
  }
};

updateDoctorSchedules();

