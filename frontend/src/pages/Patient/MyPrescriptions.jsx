import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientApi } from '../../api/patientApi';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import ErrorBox from '../../components/ErrorBox';

const MyPrescriptions = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await patientApi.getPrescriptions();
        if (response.success) {
          setPrescriptions(response.prescriptions);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch prescriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Prescriptions</h1>
      {error && <ErrorBox message={error} onClose={() => setError('')} />}

      {prescriptions.length > 0 ? (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <Card key={prescription._id}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Dr. {prescription.doctor?.user?.name || 'N/A'}
                  </h3>
                  <p className="text-gray-600 mb-1">
                    <strong>Date:</strong> {new Date(prescription.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Diagnosis:</strong> {prescription.diagnosis}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Medicines:</strong> {prescription.medicines?.length || 0} prescribed
                  </p>
                  {prescription.followUpDate && (
                    <p className="text-gray-600 mb-1">
                      <strong>Follow-up:</strong> {new Date(prescription.followUpDate).toLocaleDateString()}
                    </p>
                  )}
                  {prescription.qrToken && (
                    <p className="text-green-600 text-sm font-semibold mt-2">
                      ✓ QR Code Available
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {prescription.qrToken ? (
                    <button
                      onClick={() => navigate(`/patient/prescriptions/qr/${prescription.qrToken}`)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      View Prescription
                    </button>
                  ) : (
                    <p className="text-red-600 text-sm">QR Code not available</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-center text-gray-600">No prescriptions found</p>
        </Card>
      )}
    </div>
  );
};

export default MyPrescriptions;

