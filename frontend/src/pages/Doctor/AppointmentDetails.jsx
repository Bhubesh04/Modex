import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorApi } from '../../api/doctorApi';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import ErrorBox from '../../components/ErrorBox';

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await doctorApi.getAppointmentDetails(id);
        if (response.success) {
          setAppointment(response.appointment);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch appointment details');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="p-6">
        <ErrorBox message={error} />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="p-6">
        <Card>
          <p className="text-center text-gray-600">Appointment not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Appointment Details</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {appointment.patient?.user?.name || 'N/A'}</p>
            <p><strong>Email:</strong> {appointment.patient?.user?.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {appointment.patient?.user?.phone || 'N/A'}</p>
            <p><strong>Date of Birth:</strong> {appointment.patient?.user?.dateOfBirth ? new Date(appointment.patient.user.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Gender:</strong> {appointment.patient?.user?.gender || 'N/A'}</p>
            <p><strong>Address:</strong> {appointment.patient?.user?.address || 'N/A'}</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Appointment Information</h2>
          <div className="space-y-2">
            <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {appointment.slotTime?.startTime} - {appointment.slotTime?.endTime}</p>
            <p><strong>Status:</strong> <span className={`font-semibold ${
              appointment.status === 'COMPLETED' ? 'text-green-600' :
              appointment.status === 'CONFIRMED' ? 'text-blue-600' :
              appointment.status === 'PENDING' ? 'text-yellow-600' :
              'text-red-600'
            }`}>{appointment.status}</span></p>
            <p><strong>Reason:</strong> {appointment.reason}</p>
            {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
          </div>
        </Card>
      </div>

      {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
        <Card>
          <div className="text-center">
            <p className="text-gray-700 mb-4">Create a QR-based prescription for this appointment</p>
            <button
              onClick={() => navigate(`/doctor/prescription/${appointment._id}`)}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 text-lg font-semibold"
            >
              📋 Create QR Prescription
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Prescription will be emailed to patient with QR code
            </p>
          </div>
        </Card>
      )}
      
      {appointment.status === 'COMPLETED' && (
        <Card>
          <div className="text-center">
            <p className="text-green-600 font-semibold">Appointment completed. Prescription has been sent to patient.</p>
          </div>
        </Card>
      )}

      <div className="mt-6">
        <button
          onClick={() => navigate('/doctor/dashboard')}
          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AppointmentDetails;

