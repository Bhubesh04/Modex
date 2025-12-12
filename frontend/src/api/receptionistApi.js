import axiosInstance from './axiosInstance';

export const receptionistApi = {
  registerPatient: async (patientData) => {
    const response = await axiosInstance.post('/receptionist/register-patient', patientData);
    return response.data;
  },
  getDoctors: async () => {
    const response = await axiosInstance.get('/receptionist/doctors');
    return response.data;
  },
  getAvailableSlots: async (doctorId, date) => {
    const response = await axiosInstance.get(`/receptionist/slots/${doctorId}/${date}`);
    return response.data;
  },
  bookAppointment: async (appointmentData) => {
    const response = await axiosInstance.post('/receptionist/book-appointment', appointmentData);
    return response.data;
  }
};


