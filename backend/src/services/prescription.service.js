const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');
const { generateQRCode } = require('./qr.service');
const { sendPrescriptionEmail } = require('./email.service');

const createPrescription = async (prescriptionData) => {
  const appointment = await Appointment.findById(prescriptionData.appointmentId)
    .populate({
      path: 'patient',
      populate: {
        path: 'user',
        select: 'name email phone dateOfBirth gender'
      }
    })
    .populate({
      path: 'doctor',
      populate: {
        path: 'user',
        select: 'name email'
      }
    });

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  // Debug: Log appointment structure
  console.log('🔍 Debugging appointment data:');
  console.log('   Appointment ID:', appointment._id);
  console.log('   Patient:', appointment.patient ? 'Found' : 'Missing');
  console.log('   Patient ID:', appointment.patient?._id);
  console.log('   Patient User:', appointment.patient?.user ? 'Found' : 'Missing');
  console.log('   Patient User Email:', appointment.patient?.user?.email || 'UNDEFINED');

  // Verify patient and user data exists
  if (!appointment.patient) {
    throw new Error('Patient information not found in appointment');
  }

  if (!appointment.patient.user) {
    // Try to manually populate if not populated
    const Patient = require('../models/Patient');
    const populatedPatient = await Patient.findById(appointment.patient._id || appointment.patient)
      .populate('user', 'name email phone');
    
    if (populatedPatient && populatedPatient.user) {
      appointment.patient.user = populatedPatient.user;
      console.log('   ✅ Manually populated patient user');
    } else {
      throw new Error('Patient user information not found. Please ensure patient is properly linked to a user account.');
    }
  }

  if (!appointment.patient.user.email) {
    console.error('   ❌ Patient user email is missing');
    console.error('   Patient user data:', JSON.stringify(appointment.patient.user, null, 2));
    throw new Error('Patient email not found. Please ensure patient has a valid email address in their user account.');
  }

  // Check if prescription already exists for this appointment
  const existingPrescription = await Prescription.findOne({ appointment: appointment._id });
  if (existingPrescription) {
    throw new Error('Prescription already exists for this appointment');
  }

  // Generate unique token for QR code
  const qrToken = uuidv4();
  console.log('🔑 Generated QR Token:', qrToken);

  // Generate QR code
  console.log('📱 Generating QR code...');
  let qrCodeDataURL;
  try {
    qrCodeDataURL = await generateQRCode(qrToken);
    console.log('✅ QR code generated successfully');
    console.log('   QR Code length:', qrCodeDataURL ? qrCodeDataURL.length : 0);
    console.log('   QR Code preview:', qrCodeDataURL ? qrCodeDataURL.substring(0, 50) + '...' : 'NULL');
  } catch (error) {
    console.error('❌ QR code generation failed:', error.message);
    throw new Error('Failed to generate QR code: ' + error.message);
  }

  if (!qrCodeDataURL) {
    throw new Error('QR code generation returned empty result');
  }

  // Create prescription
  console.log('💾 Creating prescription...');
  const prescription = new Prescription({
    appointment: appointment._id,
    patient: appointment.patient._id,
    doctor: appointment.doctor._id,
    medicines: prescriptionData.medicines,
    diagnosis: prescriptionData.diagnosis,
    symptoms: prescriptionData.symptoms,
    notes: prescriptionData.notes,
    followUpDate: prescriptionData.followUpDate,
    qrToken,
    qrCode: qrCodeDataURL
  });

  await prescription.save();
  console.log('✅ Prescription saved');
  
  // Verify QR code was saved
  const verifyPrescription = await Prescription.findById(prescription._id);
  if (verifyPrescription.qrCode) {
    console.log('✅ QR code confirmed in database');
    console.log('   QR Code length:', verifyPrescription.qrCode.length);
  } else {
    console.error('❌ QR code NOT found in saved prescription! Re-saving...');
    // Try to save QR code again
    verifyPrescription.qrCode = qrCodeDataURL;
    await verifyPrescription.save();
    console.log('✅ QR code re-saved to prescription');
    prescription.qrCode = qrCodeDataURL; // Update local object too
  }

  // Generate PDF
  console.log('📄 Generating PDF...');
  const pdfBuffer = await generatePrescriptionPDF(prescription, appointment);
  console.log('✅ PDF generated');

  // Update prescription with PDF path (optional, for storage)
  prescription.pdfPath = `prescriptions/${qrToken}.pdf`;
  await prescription.save();

  // Update appointment status
  appointment.status = 'COMPLETED';
  await appointment.save();

  // Verify patient email before sending (double check)
  const patientEmail = appointment.patient?.user?.email;
  const patientName = appointment.patient?.user?.name || 'Patient';

  if (!patientEmail) {
    console.error('❌ Cannot send email: Patient email is missing');
    console.error('   Appointment ID:', appointment._id);
    console.error('   Patient ID:', appointment.patient?._id);
    console.error('   Patient Object:', JSON.stringify(appointment.patient, null, 2));
    throw new Error('Patient email is required to send prescription. Please ensure patient has a valid email address.');
  }

  // Convert QR code data URL to buffer for email attachment
  let qrImageBuffer;
  try {
    if (prescription.qrCode && prescription.qrCode.startsWith('data:image')) {
      const base64Data = prescription.qrCode.replace(/^data:image\/png;base64,/, '');
      qrImageBuffer = Buffer.from(base64Data, 'base64');
      console.log('✅ QR code image buffer created for email');
    } else {
      throw new Error('QR code not available for email attachment');
    }
  } catch (error) {
    console.error('❌ Failed to create QR code buffer:', error.message);
    throw new Error('Failed to prepare QR code for email');
  }

  // Send email with PDF and QR code via Gmail SMTP (REAL EMAIL TO PATIENT)
  console.log('\n📧 Preparing to send prescription email to patient...');
  console.log('   Patient Email:', patientEmail);
  console.log('   Patient Name:', patientName);
  console.log('   Prescription Token:', qrToken);
  
  try {
    const emailResult = await sendPrescriptionEmail(
      patientEmail,
      patientName,
      qrToken,
      pdfBuffer,
      qrImageBuffer
    );
    
    if (emailResult.success) {
      console.log('✅ Prescription email successfully delivered to patient!');
      console.log('   The patient will receive the email in their inbox');
    }
  } catch (error) {
    console.error('❌ CRITICAL: Email sending failed!');
    console.error('   Error:', error.message);
    console.error('   The prescription was created but email was not sent');
    console.error('   Patient will not receive email notification');
    throw error; // Re-throw to be handled by controller
  }

  // Populate prescription with patient and doctor details
  await prescription.populate({
    path: 'patient',
    populate: {
      path: 'user',
      select: 'name email phone dateOfBirth gender'
    }
  });
  
  await prescription.populate({
    path: 'doctor',
    populate: {
      path: 'user',
      select: 'name email'
    }
  });

  // Final verification - ensure QR code is in the returned prescription
  const finalPrescription = await Prescription.findById(prescription._id);
  if (!finalPrescription.qrCode) {
    console.error('⚠️ WARNING: QR code missing in final prescription!');
    // Force save QR code one more time
    finalPrescription.qrCode = qrCodeDataURL;
    await finalPrescription.save();
    prescription.qrCode = qrCodeDataURL;
    console.log('✅ QR code force-saved to prescription');
  } else {
    console.log('✅ QR code verified in final prescription');
    prescription.qrCode = finalPrescription.qrCode; // Ensure it's in the returned object
  }

  return prescription;
};

const generatePrescriptionPDF = async (prescription, appointment) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(20).text('MedConnect+', { align: 'center' });
    doc.fontSize(16).text('PRESCRIPTION', { align: 'center' });
    doc.moveDown();

    // Patient Info
    doc.fontSize(14).text('Patient Information:', { underline: true });
    doc.fontSize(12);
    doc.text(`Name: ${appointment.patient.user.name}`);
    doc.text(`Email: ${appointment.patient.user.email}`);
    if (appointment.patient.user.phone) {
      doc.text(`Phone: ${appointment.patient.user.phone}`);
    }
    doc.moveDown();

    // Doctor Info
    doc.fontSize(14).text('Doctor Information:', { underline: true });
    doc.fontSize(12);
    doc.text(`Name: ${appointment.doctor.user.name}`);
    doc.text(`Email: ${appointment.doctor.user.email}`);
    doc.moveDown();

    // Appointment Date
    doc.fontSize(14).text('Appointment Date:', { underline: true });
    doc.fontSize(12);
    doc.text(`Date: ${appointment.appointmentDate.toLocaleDateString()}`);
    doc.moveDown();

    // Diagnosis
    doc.fontSize(14).text('Diagnosis:', { underline: true });
    doc.fontSize(12).text(prescription.diagnosis);
    doc.moveDown();

    // Symptoms
    if (prescription.symptoms) {
      doc.fontSize(14).text('Symptoms:', { underline: true });
      doc.fontSize(12).text(prescription.symptoms);
      doc.moveDown();
    }

    // Medicines
    doc.fontSize(14).text('Medications:', { underline: true });
    doc.moveDown();
    prescription.medicines.forEach((medicine, index) => {
      doc.fontSize(12);
      doc.text(`${index + 1}. ${medicine.name}`, { continued: false });
      doc.fontSize(10);
      doc.text(`   Dosage: ${medicine.dosage}`);
      doc.text(`   Frequency: ${medicine.frequency}`);
      doc.text(`   Duration: ${medicine.duration}`);
      if (medicine.instructions) {
        doc.text(`   Instructions: ${medicine.instructions}`);
      }
      doc.moveDown();
    });

    // Notes
    if (prescription.notes) {
      doc.fontSize(14).text('Additional Notes:', { underline: true });
      doc.fontSize(12).text(prescription.notes);
      doc.moveDown();
    }

    // Follow-up
    if (prescription.followUpDate) {
      doc.fontSize(14).text('Follow-up Date:', { underline: true });
      doc.fontSize(12);
      doc.text(prescription.followUpDate.toLocaleDateString());
      doc.moveDown();
    }

    // QR Code - convert data URL to buffer if needed
    doc.moveDown();
    doc.fontSize(10).text('Scan QR code to view digital prescription:', { align: 'center' });
    
    try {
      if (prescription.qrCode && prescription.qrCode.startsWith('data:image')) {
        // QR code is stored as data URL, need to convert to buffer
        const base64Data = prescription.qrCode.replace(/^data:image\/png;base64,/, '');
        const qrBuffer = Buffer.from(base64Data, 'base64');
        doc.image(qrBuffer, {
          fit: [150, 150],
          align: 'center'
        });
        console.log('✅ QR code added to PDF');
      } else {
        console.warn('⚠️ QR code format invalid or missing in PDF generation');
        doc.text('QR Code unavailable', { align: 'center' });
      }
    } catch (error) {
      console.error('❌ Error adding QR code to PDF:', error.message);
      doc.text('QR Code unavailable', { align: 'center' });
    }

    doc.end();
  });
};

const getPrescriptionByToken = async (token) => {
  const prescription = await Prescription.findOne({ qrToken: token })
    .populate({
      path: 'patient',
      select: 'dateOfBirth gender address emergencyContact bloodGroup medicalHistory',
      populate: {
        path: 'user',
        select: 'name email phone'
      }
    })
    .populate({
      path: 'doctor',
      select: 'specialization qualification experience consultationFee bio',
      populate: {
        path: 'user',
        select: 'name email phone'
      }
    })
    .populate({
      path: 'appointment',
      populate: [
        {
          path: 'patient',
          populate: {
            path: 'user',
            select: 'name email phone'
          }
        },
        {
          path: 'doctor',
          populate: {
            path: 'user',
            select: 'name email phone'
          }
        }
      ]
    });

  if (!prescription) {
    throw new Error('Prescription not found');
  }

  // Verify QR code exists
  if (!prescription.qrCode) {
    console.warn('⚠️ Prescription found but QR code is missing. Token:', token);
  }

  return prescription;
};

const getPrescriptionsByPatient = async (patientId) => {
  const prescriptions = await Prescription.find({ patient: patientId })
    .populate({
      path: 'doctor',
      select: 'specialization qualification experience consultationFee bio',
      populate: {
        path: 'user',
        select: 'name email phone'
      }
    })
    .populate({
      path: 'appointment',
      populate: [
        {
          path: 'patient',
          populate: {
            path: 'user',
            select: 'name email phone'
          }
        },
        {
          path: 'doctor',
          populate: {
            path: 'user',
            select: 'name email phone'
          }
        }
      ]
    })
    .populate({
      path: 'patient',
      populate: {
        path: 'user',
        select: 'name email phone'
      }
    })
    .sort({ createdAt: -1 });

  return prescriptions;
};

module.exports = {
  createPrescription,
  getPrescriptionByToken,
  getPrescriptionsByPatient
};

