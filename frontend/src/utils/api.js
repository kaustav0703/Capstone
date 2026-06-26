import axios from 'axios';

// Instantiate localized axios tracking profile
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Structural Interceptor checking for local active tokens before pushing operations
API.interceptors.request.use(
  (config) => {
    const profile = localStorage.getItem('ytUserInfo');
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
