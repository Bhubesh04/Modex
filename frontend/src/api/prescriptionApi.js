import axiosInstance from './axiosInstance';

export const prescriptionApi = {
  getPrescriptionByToken: async (token) => {
    const response = await axiosInstance.get(`/prescriptions/by-token/${token}`);
    return response.data;
  }
};



