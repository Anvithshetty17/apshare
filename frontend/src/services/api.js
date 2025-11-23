import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const shareText = async (text) => {
  const response = await api.post('/share-text', { text });
  return response.data;
};

export const getShareInfo = async (code) => {
  const response = await api.get(`/info/${code}`);
  return response.data;
};

export const getText = async (code) => {
  const response = await api.get(`/text/${code}`);
  return response.data;
};

export const getDownloadUrl = (code) => {
  return `${API_URL}/download/${code}`;
};

export default api;
