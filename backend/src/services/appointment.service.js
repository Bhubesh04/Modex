const Appointment = require('../models/Appointment');
const DoctorProfile = require('../models/DoctorProfile');
const Patient = require('../models/Patient');

const getAvailableSlots = async (doctorId, date) => {
  const doctor = await DoctorProfile.findById(doctorId);
  if (!doctor) {
    throw new Error('Doctor not found');
  }

  // Parse date string properly - handle both date strings and Date objects
  let appointmentDate;
  if (typeof date === 'string') {
    // Handle YYYY-MM-DD format (from HTML date input)
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Parse as local date to avoid timezone issues
      const [year, month, day] = date.split('-').map(Number);
      appointmentDate = new Date(year, month - 1, day, 12, 0, 0); // Set to noon local time
    } else if (date.includes('T')) {
      appointmentDate = new Date(date);
    } else {
      appointmentDate = new Date(date);
    }
  } else {
    appointmentDate = new Date(date);
  }
  
  if (isNaN(appointmentDate.getTime())) {
    throw new Error('Invalid date format');
  }
  
  // Get day name in lowercase (e.g., 'monday', 'tuesday')
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = appointmentDate.getDay();
  const dayName = days[dayIndex];
  
  // If doctor has no schedule for this day, provide default slots
  let daySchedule = [];
  
  // Check if schedule exists and has valid slots for this day
  if (doctor.schedule && typeof doctor.schedule === 'object' && doctor.schedule !== null) {
    const daySlots = doctor.schedule[dayName];
    if (Array.isArray(daySlots) && daySlots.length > 0) {
      // Filter out invalid slots
      daySchedule = daySlots.filter(slot => 
        slot && 
        slot.startTime && 
        slot.endTime && 
        (slot.isAvailable !== false) // Default to true if not specified
      );
    }
  }
  
  // ALWAYS provide default slots for ANY day (including Sunday)
  // No restrictions - allow booking for any date
  if (daySchedule.length === 0) {
    // Default slots for all days (Monday-Saturday get 6 slots, Sunday gets 6 slots too)
    if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'sunday'].includes(dayName)) {
      daySchedule = [
        { startTime: '09:00', endTime: '10:00', isAvailable: true },
        { startTime: '10:00', endTime: '11:00', isAvailable: true },
        { startTime: '11:00', endTime: '12:00', isAvailable: true },
        { startTime: '14:00', endTime: '15:00', isAvailable: true },
        { startTime: '15:00', endTime: '16:00', isAvailable: true },
        { startTime: '16:00', endTime: '17:00', isAvailable: true }
      ];
    } else if (dayName === 'saturday') {
      // Saturday has only morning slots
      daySchedule = [
        { startTime: '09:00', endTime: '10:00', isAvailable: true },
        { startTime: '10:00', endTime: '11:00', isAvailable: true },
        { startTime: '11:00', endTime: '12:00', isAvailable: true }
      ];
    }
  }

  // Get existing appointments for this date
  const startOfDay = new Date(appointmentDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(appointmentDate);
  endOfDay.setHours(23, 59, 59, 999);

  const existingAppointments = await Appointment.find({
    doctor: doctorId,
    appointmentDate: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    status: { $in: ['PENDING', 'CONFIRMED'] }
  });

  const bookedSlots = existingAppointments.map(apt => {
    if (apt.slotTime && apt.slotTime.startTime) {
      return apt.slotTime.startTime;
    }
    return null;
  }).filter(Boolean);

  // Filter available slots - ensure we have slots to return
  const availableSlots = daySchedule
    .filter(slot => {
      // Check if slot exists and is available
      if (!slot || !slot.startTime) return false;
      if (slot.isAvailable === false) return false;
      // Check if slot is not booked
      return !bookedSlots.includes(slot.startTime);
    })
    .map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime
    }));

  // Debug logging
  console.log('Slot availability:', {
    doctorId: doctorId.toString(),
    date: date,
    dayName,
    dayScheduleLength: daySchedule.length,
    bookedSlotsCount: bookedSlots.length,
    availableSlotsCount: availableSlots.length
  });

  return availableSlots;
};

const bookAppointment = async (appointmentData) => {
  // Normalize appointment date to start of day for comparison
  let appointmentDate;
  if (appointmentData.appointmentDate instanceof Date) {
    appointmentDate = new Date(appointmentData.appointmentDate);
  } else {
    appointmentDate = new Date(appointmentData.appointmentDate);
  }
  
  if (isNaN(appointmentDate.getTime())) {
    throw new Error('Invalid appointment date');
  }
  
  appointmentDate.setHours(0, 0, 0, 0);
  
  // Check if slot is still available (concurrency check)
  const startOfDay = new Date(appointmentDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(appointmentDate);
  endOfDay.setHours(23, 59, 59, 999);

  const existingAppointment = await Appointment.findOne({
    doctor: appointmentData.doctor,
    appointmentDate: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    'slotTime.startTime': appointmentData.slotTime.startTime,
    status: { $in: ['PENDING', 'CONFIRMED'] }
  });

  if (existingAppointment) {
    throw new Error('This slot is already booked');
  }

  // Set appointment date properly
  appointmentData.appointmentDate = appointmentDate;
  const appointment = new Appointment(appointmentData);
  await appointment.save();

  // Properly populate patient and doctor with user details
  await appointment.populate({
    path: 'patient',
    populate: {
      path: 'user',
      select: 'name email phone dateOfBirth gender address'
    }
  });
  
  await appointment.populate({
    path: 'doctor',
    populate: {
      path: 'user',
      select: 'name email phone'
    }
  });

  return appointment;
};

const getAppointmentsByDoctor = async (doctorId, status) => {
  const query = { doctor: doctorId };
  if (status) {
    query.status = status;
  }

  const appointments = await Appointment.find(query)
    .populate({
      path: 'patient',
      populate: {
        path: 'user',
        select: 'name email phone dateOfBirth gender address'
      }
    })
    .populate({
      path: 'doctor',
      populate: {
        path: 'user',
        select: 'name email phone'
      }
    })
    .sort({ appointmentDate: -1, 'slotTime.startTime': 1 }); // Sort by date descending (newest first)

  return appointments;
};

const getAppointmentsByPatient = async (patientId) => {
  const appointments = await Appointment.find({ patient: patientId })
    .populate({
      path: 'patient',
      select: 'dateOfBirth gender address emergencyContact bloodGroup',
      populate: {
        path: 'user',
        select: 'name email phone'
      }
    })
    .populate({
      path: 'doctor',
      select: 'specialization qualification experience consultationFee',
      populate: {
        path: 'user',
        select: 'name email phone'
      }
    })
    .sort({ appointmentDate: -1 });

  return appointments;
};

const getAppointmentById = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate({
      path: 'patient',
      populate: {
        path: 'user',
        select: 'name email phone dateOfBirth gender address'
      }
    })
    .populate({
      path: 'doctor',
      populate: {
        path: 'user',
        select: 'name email phone'
      }
    });

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  return appointment;
};

module.exports = {
  getAvailableSlots,
  bookAppointment,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  getAppointmentById
};

