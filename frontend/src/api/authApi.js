import axiosInstance from './axiosInstance';

export const authApi = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  },
  registerPatient: async (patientData) => {
    const response = await axiosInstance.post('/auth/register-patient', patientData);
    return response.data;
  },
  registerAdmin: async (adminData) => {
    const response = await axiosInstance.post('/auth/register-admin', adminData);
    return response.data;
  },
  registerDoctor: async (doctorData) => {
    const response = await axiosInstance.post('/auth/register-doctor', doctorData);
    return response.data;
  },
  registerReceptionist: async (receptionistData) => {
    const response = await axiosInstance.post('/auth/register-receptionist', receptionistData);
    return response.data;
  }
};

