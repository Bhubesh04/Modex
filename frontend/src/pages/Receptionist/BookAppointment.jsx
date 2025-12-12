import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { receptionistApi } from '../../api/receptionistApi';
import Card from '../../components/Card';
import ErrorBox from '../../components/ErrorBox';
import Loader from '../../components/Loader';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    reason: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await receptionistApi.getDoctors();
        if (response.success) {
          setDoctors(response.doctors);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch doctors');
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchSlots();
    } else {
      setSlots([]);
    }
  }, [selectedDoctor, selectedDate]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const response = await receptionistApi.getAvailableSlots(selectedDoctor, selectedDate);
      if (response.success) {
        setSlots(response.slots);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await receptionistApi.bookAppointment({
        patientId: formData.patientId,
        doctorId: selectedDoctor,
        appointmentDate: selectedDate,
        slotTime: selectedSlot,
        reason: formData.reason,
        notes: formData.notes
      });

      if (response.success) {
        navigate('/receptionist/appointment-success', {
          state: { appointment: response.appointment }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Book Appointment</h1>
      <Card>
        {error && <ErrorBox message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID *</label>
            <input
              type="text"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter Patient ID"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor *</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.user.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date *</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min={minDate}
              required
            />
          </div>

          {selectedDoctor && selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Time Slots</label>
              {loadingSlots ? (
                <Loader />
              ) : slots.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {slots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-4 py-2 border rounded-md ${
                        selectedSlot?.startTime === slot.startTime
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No available slots for this date</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit *</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="2"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedSlot}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default BookAppointment;



