const nodemailer = require('nodemailer');
const { SMTP_EMAIL, SMTP_PASSWORD, FRONTEND_URL } = require('../config/env');
const { getPrescriptionEmailTemplate } = require('../utils/emailTemplates');

// Create Gmail transporter function - creates fresh transporter each time
const createGmailTransporter = () => {
  // Validate credentials first
  if (!SMTP_EMAIL || !SMTP_PASSWORD) {
    throw new Error('Gmail SMTP credentials not configured. Please set SMTP_EMAIL and SMTP_PASSWORD in .env file');
  }

  if (!SMTP_EMAIL.includes('@gmail.com')) {
    console.warn('⚠️ Warning: SMTP_EMAIL does not appear to be a Gmail address');
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL.trim(),
      pass: SMTP_PASSWORD.trim().replace(/\s+/g, ''), // Remove all spaces for Gmail App Password
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Verify Gmail connection on startup
console.log('📧 Initializing Gmail SMTP service...');
console.log('   SMTP_EMAIL:', SMTP_EMAIL ? `${SMTP_EMAIL.substring(0, 5)}***` : 'NOT SET');
console.log('   SMTP_PASSWORD:', SMTP_PASSWORD ? 'SET (' + SMTP_PASSWORD.length + ' chars)' : 'NOT SET');
console.log('   Checking env vars - EMAIL_USER:', process.env.EMAIL_USER ? 'FOUND' : 'NOT FOUND');
console.log('   Checking env vars - EMAIL_PASS:', process.env.EMAIL_PASS ? 'FOUND' : 'NOT FOUND');
if (SMTP_EMAIL && SMTP_PASSWORD) {
  try {
    const testTransporter = createGmailTransporter();
    testTransporter.verify()
      .then(() => {
        console.log('✅ Gmail SMTP connection verified successfully!');
        console.log(`   Email: ${SMTP_EMAIL}`);
        console.log('   Ready to send real emails via Gmail');
      })
      .catch((error) => {
        console.error('❌ Gmail SMTP connection failed:', error.message);
        console.error('   Please check your SMTP_EMAIL and SMTP_PASSWORD in .env file');
        console.error('   Make sure you are using a Gmail App Password (not your regular password)');
        console.error('   Get App Password: https://myaccount.google.com/apppasswords');
      });
  } catch (error) {
    console.error('❌ Failed to initialize Gmail transporter:', error.message);
  }
} else {
  console.error('❌ Gmail SMTP credentials not found in .env file!');
  console.error('   Please add SMTP_EMAIL and SMTP_PASSWORD to your .env file');
  console.error('   See GMAIL_SETUP.md for instructions');
}

/**
 * Send prescription email to patient via Gmail SMTP
 * This function sends REAL emails that patients will receive
 * @param {string} patientEmail - Patient's email address
 * @param {string} patientName - Patient's name
 * @param {string} prescriptionToken - Unique prescription token
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {Buffer} qrImageBuffer - QR code image buffer (PNG)
 * @returns {Promise<{success: boolean}>}
 */
const sendPrescriptionEmail = async (patientEmail, patientName, prescriptionToken, pdfBuffer, qrImageBuffer) => {
  // Validate patient email
  if (!patientEmail || typeof patientEmail !== 'string' || !patientEmail.includes('@')) {
    throw new Error(`Invalid patient email address: ${patientEmail}`);
  }

  // Validate credentials
  if (!SMTP_EMAIL || !SMTP_PASSWORD) {
    const errorMsg = 'Gmail SMTP credentials not configured. Please set SMTP_EMAIL and SMTP_PASSWORD in .env file';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

  // Validate required parameters
  if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
    throw new Error('PDF buffer is required for email attachment');
  }

  if (!qrImageBuffer || !Buffer.isBuffer(qrImageBuffer)) {
    throw new Error('QR code image buffer is required for email attachment');
  }

  try {
    // Create fresh transporter
    const transporter = createGmailTransporter();

    // Prepare email content
    const mailOptions = {
      from: `"MedConnect+" <${SMTP_EMAIL.trim()}>`,
      to: patientEmail.trim(),
      subject: "Your Medical Prescription - MedConnect+",
      html: getPrescriptionEmailTemplate(patientName || 'Patient', prescriptionToken, FRONTEND_URL),
      attachments: [
        {
          filename: `prescription-${prescriptionToken}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        },
        {
          filename: `qrcode-${prescriptionToken}.png`,
          content: qrImageBuffer,
          cid: "qrCode",
          contentType: 'image/png'
        }
      ]
    };

    console.log('\n📧 ========================================');
    console.log('📤 SENDING PRESCRIPTION EMAIL VIA GMAIL');
    console.log('========================================');
    console.log('   From:', SMTP_EMAIL);
    console.log('   To:', patientEmail);
    console.log('   Patient Name:', patientName || 'Patient');
    console.log('   Subject: Your Medical Prescription - MedConnect+');
    console.log('   PDF Size:', (pdfBuffer.length / 1024).toFixed(2), 'KB');
    console.log('   QR Code Size:', (qrImageBuffer.length / 1024).toFixed(2), 'KB');
    console.log('========================================\n');

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ ========================================');
    console.log('✅ EMAIL SENT SUCCESSFULLY VIA GMAIL!');
    console.log('========================================');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    console.log('   Delivered to:', patientEmail);
    console.log('   The patient will receive this email in their inbox');
    console.log('========================================\n');
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('\n❌ ========================================');
    console.error('❌ EMAIL SENDING FAILED');
    console.error('========================================');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    console.error('   Command:', error.command);
    console.error('   To:', patientEmail);
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      console.error('\n   🔧 SOLUTION:');
      console.error('   - Check that SMTP_EMAIL and SMTP_PASSWORD are correct');
      console.error('   - Make sure you are using a Gmail App Password (not regular password)');
      console.error('   - Get App Password: https://myaccount.google.com/apppasswords');
      console.error('   - Ensure 2-Factor Authentication is enabled on your Google Account');
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.error('\n   🔧 SOLUTION:');
      console.error('   - Check your internet connection');
      console.error('   - Verify firewall is not blocking Gmail SMTP');
      console.error('   - Try again in a few moments');
    } else if (error.code === 'EENVELOPE') {
      console.error('\n   🔧 SOLUTION:');
      console.error('   - Check that patient email address is valid');
      console.error('   - Verify patient email format is correct');
    }
    
    console.error('========================================\n');
    throw new Error(`Failed to send prescription email: ${error.message}`);
  }
};

module.exports = {
  sendPrescriptionEmail
};
