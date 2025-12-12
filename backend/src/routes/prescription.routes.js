const express = require('express');
const router = express.Router();
const { getPrescriptionByToken } = require('../controllers/prescription.controller');

// Public route - accessible via QR token
router.get('/by-token/:token', getPrescriptionByToken);

module.exports = router;



