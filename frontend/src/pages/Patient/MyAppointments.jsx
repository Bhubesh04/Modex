import React, { useEffect, useState } from 'react';
import { patientApi } from '../../api/patientApi';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import ErrorBox from '../../components/ErrorBox';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await patientApi.getAppointments();
        if (response.success) {
          setAppointments(response.appointments);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>
      {error && <ErrorBox message={error} onClose={() => setError('')} />}

      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment._id}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Dr. {appointment.doctor?.user?.name || 'N/A'}
                  </h3>
                  <p className="text-gray-600 mb-1">
                    <strong>Specialization:</strong> {appointment.doctor?.specialization || 'N/A'}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Time:</strong> {appointment.slotTime?.startTime} - {appointment.slotTime?.endTime}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Reason:</strong> {appointment.reason}
                  </p>
                  <p className="text-gray-600">
                    <strong>Status:</strong>{' '}
                    <span className={`font-semibold ${
                      appointment.status === 'COMPLETED' ? 'text-green-600' :
                      appointment.status === 'CONFIRMED' ? 'text-blue-600' :
                      appointment.status === 'CANCELLED' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {appointment.status}
                    </span>
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-center text-gray-600">No appointments found</p>
        </Card>
      )}
    </div>
  );
};

export default MyAppointments;


