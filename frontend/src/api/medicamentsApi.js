import axiosInstance from './axiosConfig';

export const fetchMedicaments = async (params = {}) => {
  const res = await axiosInstance.get('/medicaments/', { params });
  return res.data;
};

export const fetchMedicament = async (id) => {
  const res = await axiosInstance.get(`/medicaments/${id}/`);
  return res.data;
};

export const createMedicament = async (data) => {
  const res = await axiosInstance.post('/medicaments/', data);
  return res.data;
};

export const updateMedicament = async (id, data) => {
  const res = await axiosInstance.patch(`/medicaments/${id}/`, data);
  return res.data;
};

export const deleteMedicament = async (id) => {
  const res = await axiosInstance.delete(`/medicaments/${id}/`);
  return res.data;
};

export const fetchAlertes = async () => {
  const res = await axiosInstance.get('/medicaments/alertes/');
  return res.data;
};