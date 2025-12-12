const express = require('express');
const router = express.Router();
const { registerPatient, getDoctors, getAvailableSlots, bookAppointment } = require('../controllers/receptionist.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// All routes require receptionist role
router.use(authMiddleware);
router.use(roleMiddleware('RECEPTIONIST'));

router.post('/register-patient', registerPatient);
router.get('/doctors', getDoctors);
router.get('/slots/:doctorId/:date', getAvailableSlots);
router.post('/book-appointment', bookAppointment);

module.exports = router;


