import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { prescriptionApi } from '../../api/prescriptionApi';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import ErrorBox from '../../components/ErrorBox';
import { QRCodeSVG } from 'qrcode.react';

const QRPrescriptionView = () => {
  const { token } = useParams();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await prescriptionApi.getPrescriptionByToken(token);
        if (response.success) {
          setPrescription(response.prescription);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Prescription not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [token]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card>
          <ErrorBox message={error} />
        </Card>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card>
          <p className="text-center text-gray-600">Prescription not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">MedConnect+</h1>
            <h2 className="text-2xl font-semibold">PRESCRIPTION</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">Patient Information</h3>
              <div className="space-y-2">
                <p><strong>Name:</strong> {prescription.patient?.user?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {prescription.patient?.user?.email || 'N/A'}</p>
                {prescription.patient?.user?.phone && (
                  <p><strong>Phone:</strong> {prescription.patient.user.phone}</p>
                )}
                {prescription.patient?.user?.dateOfBirth && (
                  <p><strong>Date of Birth:</strong> {new Date(prescription.patient.user.dateOfBirth).toLocaleDateString()}</p>
                )}
                {prescription.patient?.user?.gender && (
                  <p><strong>Gender:</strong> {prescription.patient.user.gender}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">Doctor Information</h3>
              <div className="space-y-2">
                <p><strong>Name:</strong> Dr. {prescription.doctor?.user?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {prescription.doctor?.user?.email || 'N/A'}</p>
                {prescription.appointment?.appointmentDate && (
                  <p><strong>Appointment Date:</strong> {new Date(prescription.appointment.appointmentDate).toLocaleDateString()}</p>
                )}
                <p><strong>Prescription Date:</strong> {new Date(prescription.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 border-b pb-2">Diagnosis</h3>
            <p className="text-gray-700">{prescription.diagnosis}</p>
          </div>

          {prescription.symptoms && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">Symptoms</h3>
              <p className="text-gray-700">{prescription.symptoms}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 border-b pb-2">Medications</h3>
            <div className="space-y-4">
              {prescription.medicines?.map((medicine, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold text-lg">{index + 1}. {medicine.name}</p>
                  <div className="ml-4 mt-2 space-y-1">
                    <p><strong>Dosage:</strong> {medicine.dosage}</p>
                    <p><strong>Frequency:</strong> {medicine.frequency}</p>
                    <p><strong>Duration:</strong> {medicine.duration}</p>
                    {medicine.instructions && (
                      <p><strong>Instructions:</strong> {medicine.instructions}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {prescription.notes && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">Additional Notes</h3>
              <p className="text-gray-700">{prescription.notes}</p>
            </div>
          )}

          {prescription.followUpDate && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">Follow-up Date</h3>
              <p className="text-gray-700">{new Date(prescription.followUpDate).toLocaleDateString()}</p>
            </div>
          )}

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 mb-4">Scan QR code to verify prescription</p>
            <div className="flex justify-center">
              {prescription.qrCode ? (
                <img 
                  src={prescription.qrCode} 
                  alt="Prescription QR Code" 
                  className="border-4 border-gray-300 rounded-lg p-2"
                  style={{ width: '200px', height: '200px' }}
                />
              ) : prescription.qrToken ? (
                <QRCodeSVG 
                  value={`${window.location.origin}/patient/prescriptions/qr/${prescription.qrToken}`} 
                  size={200} 
                />
              ) : (
                <p className="text-red-600">QR code not available</p>
              )}
            </div>
            {prescription.qrToken && (
              <p className="text-xs text-gray-500 mt-2">
                Token: {prescription.qrToken}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QRPrescriptionView;

