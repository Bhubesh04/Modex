import axiosInstance from './axiosInstance';

export const doctorApi = {
  getAppointments: async (status) => {
    const url = status ? `/doctor/appointments?status=${status}` : '/doctor/appointments';
    const response = await axiosInstance.get(url);
    return response.data;
  },
  getAppointmentDetails: async (appointmentId) => {
    const response = await axiosInstance.get(`/doctor/appointment/${appointmentId}`);
    return response.data;
  },
  getAllPatients: async () => {
    const response = await axiosInstance.get('/doctor/patients');
    return response.data;
  },
  createPrescription: async (prescriptionData) => {
    const response = await axiosInstance.post('/doctor/prescription', prescriptionData);
    return response.data;
  }
};

