import React, { useEffect, useState } from 'react';
import { doctorApi } from '../../api/doctorApi';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import ErrorBox from '../../components/ErrorBox';

const AllPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await doctorApi.getAllPatients();
        if (response.success) {
          setPatients(response.patients);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Patients</h1>
      {error && <ErrorBox message={error} onClose={() => setError('')} />}

      {patients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <Card key={patient._id}>
              <h3 className="text-xl font-semibold mb-2">{patient.user?.name || 'N/A'}</h3>
              <p className="text-gray-600 mb-1"><strong>Email:</strong> {patient.user?.email || 'N/A'}</p>
              <p className="text-gray-600 mb-1"><strong>Phone:</strong> {patient.user?.phone || 'N/A'}</p>
              <p className="text-gray-600 mb-1"><strong>Gender:</strong> {patient.gender || 'N/A'}</p>
              <p className="text-gray-600 mb-1"><strong>Date of Birth:</strong> {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
              <p className="text-gray-600 mb-1"><strong>Blood Group:</strong> {patient.bloodGroup || 'N/A'}</p>
              <p className="text-gray-600 mb-1"><strong>Address:</strong> {patient.address || 'N/A'}</p>
              {patient.emergencyContact?.name && (
                <p className="text-gray-600">
                  <strong>Emergency Contact:</strong> {patient.emergencyContact.name} ({patient.emergencyContact.relation})
                </p>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-center text-gray-600">No patients found</p>
        </Card>
      )}
    </div>
  );
};

export default AllPatients;



