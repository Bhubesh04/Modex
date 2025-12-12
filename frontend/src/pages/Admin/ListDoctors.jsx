import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import ErrorBox from '../../components/ErrorBox';

const ListDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await adminApi.getDoctors();
        if (response.success) {
          setDoctors(response.doctors);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">List of Doctors</h1>
      {error && <ErrorBox message={error} onClose={() => setError('')} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor._id}>
            <h3 className="text-xl font-semibold mb-2">{doctor.user.name}</h3>
            <p className="text-gray-600 mb-1"><strong>Email:</strong> {doctor.user.email}</p>
            <p className="text-gray-600 mb-1"><strong>Phone:</strong> {doctor.user.phone || 'N/A'}</p>
            <p className="text-gray-600 mb-1"><strong>Specialization:</strong> {doctor.specialization}</p>
            <p className="text-gray-600 mb-1"><strong>Qualification:</strong> {doctor.qualification}</p>
            <p className="text-gray-600"><strong>Experience:</strong> {doctor.experience} years</p>
          </Card>
        ))}
      </div>

      {doctors.length === 0 && !loading && (
        <Card>
          <p className="text-center text-gray-600">No doctors found</p>
        </Card>
      )}
    </div>
  );
};

export default ListDoctors;



