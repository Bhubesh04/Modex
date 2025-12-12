const prescriptionService = require('../services/prescription.service');

const getPrescriptionByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const prescription = await prescriptionService.getPrescriptionByToken(token);

    res.json({
      success: true,
      prescription
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getPrescriptionByToken
};



