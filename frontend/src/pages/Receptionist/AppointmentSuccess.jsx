import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';

const AppointmentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointment = location.state?.appointment;

  if (!appointment) {
    return (
      <div className="p-6">
        <Card>
          <p className="text-center text-gray-600">No appointment data found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Appointment Booked Successfully!</h1>
      <Card>
        <div className="text-center mb-6">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-semibold mb-4">Appointment Confirmed</h2>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="font-semibold">Patient:</span>
            <span>{appointment.patient?.user?.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Doctor:</span>
            <span>{appointment.doctor?.user?.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Date:</span>
            <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Time:</span>
            <span>{appointment.slotTime?.startTime} - {appointment.slotTime?.endTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Status:</span>
            <span className="text-green-600">{appointment.status}</span>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/receptionist/book-appointment')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Book Another Appointment
          </button>
          <button
            onClick={() => navigate('/receptionist/dashboard')}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AppointmentSuccess;



