import axiosInstance from './axiosInstance';

export const patientApi = {
  getAppointments: async () => {
    const response = await axiosInstance.get('/patient/appointments');
    return response.data;
  },
  getPrescriptions: async () => {
    const response = await axiosInstance.get('/patient/prescriptions');
    return response.data;
  },
  getAllDoctors: async () => {
    const response = await axiosInstance.get('/patient/doctors');
    return response.data;
  },
  getAvailableSlots: async (doctorId, date) => {
    const response = await axiosInstance.get(`/patient/slots/${doctorId}/${date}`);
    return response.data;
  },
  bookAppointment: async (appointmentData) => {
    const response = await axiosInstance.post('/patient/book-appointment', appointmentData);
    return response.data;
  }
};

