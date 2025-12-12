const QRCode = require('qrcode');
const { FRONTEND_URL } = require('../config/env');

const generateQRCode = async (prescriptionToken) => {
  if (!prescriptionToken) {
    throw new Error('Prescription token is required to generate QR code');
  }

  const qrData = `${FRONTEND_URL}/patient/prescriptions/qr/${prescriptionToken}`;
  console.log('   QR Data URL:', qrData);
  
  try {
    console.log('   Generating QR code image...');
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    if (!qrCodeDataURL || qrCodeDataURL.length === 0) {
      throw new Error('QR code generation returned empty result');
    }

    console.log('   ✅ QR code image generated');
    return qrCodeDataURL;
  } catch (error) {
    console.error('   ❌ QR code generation error:', error.message);
    console.error('   Error details:', error);
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
};

module.exports = {
  generateQRCode
};

