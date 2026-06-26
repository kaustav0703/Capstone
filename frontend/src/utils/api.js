import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api', // Pointing to your active AirPlay-safe port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Structural Interceptor checking for local active tokens before pushing operations
API.interceptors.request.use(
  (config) => {
    const profile = localStorage.getItem('ytUserInfo'); // <-- MUST match the key name from Step 1!
    if (profile) {
      const { token } = JSON.parse(profile);
      // Append modern Authorization Bearer scheme payload strings
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
