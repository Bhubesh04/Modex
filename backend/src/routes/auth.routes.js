const express = require('express');
const router = express.Router();
const { login, registerPatient, registerAdmin, registerDoctor, registerReceptionist } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Public routes
router.post('/login', login);
router.post('/register-patient', registerPatient);
router.post('/register-admin', registerAdmin);
router.post('/register-doctor', registerDoctor);
router.post('/register-receptionist', registerReceptionist);

module.exports = router;

