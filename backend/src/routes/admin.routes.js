const express = require('express');
const router = express.Router();
const { registerDoctor, registerReceptionist, getDoctors, getReceptionists } = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// All routes require admin role
router.use(authMiddleware);
router.use(roleMiddleware('ADMIN'));

router.post('/register-doctor', registerDoctor);
router.post('/register-receptionist', registerReceptionist);
router.get('/doctors', getDoctors);
router.get('/receptionists', getReceptionists);

module.exports = router;



