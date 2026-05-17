import axios from 'axios';
import { auth } from '../config/firebase';

// TODO: Replace with your machine's local IP address (e.g., 192.168.1.5)
// Mobile devices on the same Wi-Fi cannot reach 'localhost'.
const BASE_URL = 'http://192.168.1.2:3000/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
