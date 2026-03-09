import axiosInstance from './axiosConfig';

export const fetchCategories = async () => {
  const res = await axiosInstance.get('/categories/');
  return res.data;
};

export const createCategorie = async (data) => {
  const res = await axiosInstance.post('/categories/', data);
  return res.data;
};