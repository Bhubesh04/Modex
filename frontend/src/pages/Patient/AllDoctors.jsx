import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientApi } from '../../api/patientApi';
import Card from '../../components/Card';
import ErrorBox from '../../components/ErrorBox';
import Loader from '../../components/Loader';

const AllDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    reason: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await patientApi.getAllDoctors();
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
    if (selectedDoctor && selectedDate && showBookingForm) {
      fetchSlots();
    } else {
      setSlots([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDoctor, selectedDate, showBookingForm]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    setError('');
    try {
      const response = await patientApi.getAvailableSlots(selectedDoctor._id, selectedDate);
      if (response.success) {
        setSlots(response.slots || []);
        if (!response.slots || response.slots.length === 0) {
          setError('No available slots for this date. Please try a different date (Monday-Saturday).');
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch slots';
      setError(errorMsg);
      console.error('Error fetching slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingForm(true);
    setError('');
    setSuccess('');
    setSelectedSlot(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Ensure date is in correct format
      const dateToSend = selectedDate; // YYYY-MM-DD format from input
      
      const response = await patientApi.bookAppointment({
        doctorId: selectedDoctor._id,
        appointmentDate: dateToSend,
        slotTime: selectedSlot,
        reason: formData.reason,
        notes: formData.notes
      });

      if (response.success) {
        setSuccess('Appointment booked successfully!');
        setTimeout(() => {
          setShowBookingForm(false);
          setSelectedDoctor(null);
          setSelectedDate('');
          setSelectedSlot(null);
          setFormData({ reason: '', notes: '' });
          navigate('/patient/appointments');
        }, 2000);
      } else {
        setError(response.message || 'Failed to book appointment');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to book appointment';
      setError(errorMessage);
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Doctors</h1>
      {error && <ErrorBox message={error} onClose={() => setError('')} />}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {!showBookingForm ? (
        <div>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📅 Available Time Slots</h3>
            <div className="text-sm text-blue-800">
              <p className="mb-1"><strong>All Days:</strong> 6 slots per day</p>
              <ul className="list-disc list-inside ml-2 mb-2">
                <li>Morning: 09:00-10:00, 10:00-11:00, 11:00-12:00</li>
                <li>Afternoon: 14:00-15:00, 15:00-16:00, 16:00-17:00</li>
              </ul>
              <p className="mt-2 text-xs text-blue-700">💡 You can book appointments for any date - no restrictions!</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor._id}>
                <h3 className="text-xl font-semibold mb-2">Dr. {doctor.user?.name || 'N/A'}</h3>
                <p className="text-gray-600 mb-1"><strong>Email:</strong> {doctor.user?.email || 'N/A'}</p>
                <p className="text-gray-600 mb-1"><strong>Phone:</strong> {doctor.user?.phone || 'N/A'}</p>
                <p className="text-gray-600 mb-1"><strong>Specialization:</strong> {doctor.specialization || 'N/A'}</p>
                <p className="text-gray-600 mb-1"><strong>Qualification:</strong> {doctor.qualification || 'N/A'}</p>
                <p className="text-gray-600 mb-1"><strong>Experience:</strong> {doctor.experience || 0} years</p>
                <p className="text-gray-600 mb-3"><strong>Consultation Fee:</strong> ₹{doctor.consultationFee || 500}</p>
                <button
                  onClick={() => handleBookAppointment(doctor)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold"
                >
                  Book Appointment
                </button>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <div className="mb-4">
            <button
              onClick={() => {
                setShowBookingForm(false);
                setSelectedDoctor(null);
                setSelectedDate('');
                setSlots([]);
                setSelectedSlot(null);
              }}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back to Doctors
            </button>
            <h2 className="text-2xl font-semibold mb-2">Book Appointment with Dr. {selectedDoctor?.user?.name}</h2>
            <p className="text-gray-600 mb-4">Specialization: {selectedDoctor?.specialization}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date *</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null); // Reset selected slot when date changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Select any date to book an appointment
              </p>
            </div>

            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </label>
                {loadingSlots ? (
                  <Loader />
                ) : slots.length > 0 ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">Click on a time slot to select it:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {slots.map((slot, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-4 py-3 border-2 rounded-lg font-semibold transition-all ${
                            selectedSlot?.startTime === slot.startTime
                              ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
                              : 'bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-lg">{slot.startTime}</div>
                            <div className="text-xs text-gray-500">to</div>
                            <div className="text-lg">{slot.endTime}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {selectedSlot && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-blue-800 font-semibold">
                          ✓ Selected: {selectedSlot.startTime} - {selectedSlot.endTime}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-800 font-semibold mb-2">No available slots for this date</p>
                    <p className="text-sm text-yellow-700">
                      • All slots for this date may already be booked
                    </p>
                    <p className="text-sm text-yellow-700">
                      • Please try selecting a different date
                    </p>
                  </div>
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
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </Card>
      )}

      {doctors.length === 0 && !loading && (
        <Card>
          <p className="text-center text-gray-600">No doctors found</p>
        </Card>
      )}
    </div>
  );
};

export default AllDoctors;

