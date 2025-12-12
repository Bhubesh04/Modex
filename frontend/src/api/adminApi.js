import axiosInstance from './axiosInstance';

export const adminApi = {
  registerDoctor: async (doctorData) => {
    const response = await axiosInstance.post('/admin/register-doctor', doctorData);
    return response.data;
  },
  registerReceptionist: async (receptionistData) => {
    const response = await axiosInstance.post('/admin/register-receptionist', receptionistData);
    return response.data;
  },
  getDoctors: async () => {
    const response = await axiosInstance.get('/admin/doctors');
    return response.data;
  },
  getReceptionists: async () => {
    const response = await axiosInstance.get('/admin/receptionists');
    return response.data;
  }
};



