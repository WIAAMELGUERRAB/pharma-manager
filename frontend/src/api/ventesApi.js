import axiosInstance from './axiosConfig';

export const fetchVentes = async (params = {}) => {
  const res = await axiosInstance.get('/ventes/', { params });
  return res.data;
};

export const createVente = async (data) => {
  const res = await axiosInstance.post('/ventes/', data);
  return res.data;
};

export const fetchVente = async (id) => {
  const res = await axiosInstance.get(`/ventes/${id}/`);
  return res.data;
};

export const annulerVente = async (id) => {
  const res = await axiosInstance.post(`/ventes/${id}/annuler/`);
  return res.data;
};