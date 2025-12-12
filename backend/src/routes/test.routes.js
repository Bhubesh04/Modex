const express = require('express');
const router = express.Router();
const { sendPrescriptionEmail } = require('../services/email.service');

// Test endpoint to verify email service in production
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    // Create a dummy PDF buffer
    const dummyPDF = Buffer.from('Test PDF Content');
    
    // Create a dummy QR code buffer
    const dummyQR = Buffer.from('Test QR Code');

    console.log('🧪 Testing email service...');
    console.log('   To:', email);

    const result = await sendPrescriptionEmail(
      email,
      'Test Patient',
      'test-token-123',
      dummyPDF,
      dummyQR
    );

    res.json({
      success: true,
      message: 'Test email sent successfully!',
      emailSent: true,
      result
    });
  } catch (error) {
    console.error('❌ Test email failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
});

module.exports = router;



