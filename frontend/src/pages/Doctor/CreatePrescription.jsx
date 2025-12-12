import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorApi } from '../../api/doctorApi';
import Card from '../../components/Card';
import ErrorBox from '../../components/ErrorBox';
import Loader from '../../components/Loader';

const CreatePrescription = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    diagnosis: '',
    symptoms: '',
    notes: '',
    followUpDate: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
  });

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await doctorApi.getAppointmentDetails(appointmentId);
        if (response.success) {
          setAppointment(response.appointment);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch appointment');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...formData.medicines];
    newMedicines[index][field] = value;
    setFormData({ ...formData, medicines: newMedicines });
  };

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    });
  };

  const removeMedicine = (index) => {
    const newMedicines = formData.medicines.filter((_, i) => i !== index);
    setFormData({ ...formData, medicines: newMedicines });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const response = await doctorApi.createPrescription({
        appointmentId,
        ...formData,
        followUpDate: formData.followUpDate || null
      });

      if (response.success) {
        setSuccess('✅ Prescription created successfully! QR code generated and sent to patient via email.');
        setTimeout(() => {
          navigate('/doctor/dashboard');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create prescription');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create Prescription</h1>
      
      {appointment && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Patient: {appointment.patient?.user?.name}</h2>
          <p className="text-gray-600 mb-2">Date: {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
          <p className="text-blue-600 text-sm font-semibold">
            📧 Prescription will be sent via email with QR code
          </p>
        </Card>
      )}

      <Card>
        {error && <ErrorBox message={error} onClose={() => setError('')} />}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <p className="text-blue-800 text-sm">
              <strong>📋 QR Prescription:</strong> This prescription will include a QR code that patients can scan to view their digital prescription. The prescription will be automatically emailed to the patient.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis *</label>
            <textarea
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
            <textarea
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medications *</label>
            {formData.medicines.map((medicine, index) => (
              <div key={index} className="border p-4 rounded-md mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name *</label>
                    <input
                      type="text"
                      value={medicine.name}
                      onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
                    <input
                      type="text"
                      value={medicine.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency *</label>
                    <input
                      type="text"
                      value={medicine.frequency}
                      onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Twice daily"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                    <input
                      type="text"
                      value={medicine.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., 7 days"
                      required
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                  <input
                    type="text"
                    value={medicine.instructions}
                    onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                {formData.medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedicine(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Medicine
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addMedicine}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
            >
              Add Another Medicine
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
            <input
              type="date"
              value={formData.followUpDate}
              onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/doctor/dashboard')}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Prescription'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreatePrescription;

