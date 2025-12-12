const express = require('express');
const router = express.Router();
const { getAppointments, getPrescriptions, getAllDoctors, getAvailableSlots, bookAppointment } = require('../controllers/patient.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// All routes require patient role
router.use(authMiddleware);
router.use(roleMiddleware('PATIENT'));

router.get('/appointments', getAppointments);
router.get('/prescriptions', getPrescriptions);
router.get('/doctors', getAllDoctors);
router.get('/slots/:doctorId/:date', getAvailableSlots);
router.post('/book-appointment', bookAppointment);

module.exports = router;

