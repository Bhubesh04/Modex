const express = require('express');
const router = express.Router();
const { getAppointments, getAppointmentDetails, getAllPatients, createPrescription } = require('../controllers/doctor.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// All routes require doctor role
router.use(authMiddleware);
router.use(roleMiddleware('DOCTOR'));

router.get('/appointments', getAppointments);
router.get('/appointment/:id', getAppointmentDetails);
router.get('/patients', getAllPatients);
router.post('/prescription', createPrescription);

module.exports = router;
