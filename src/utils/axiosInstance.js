import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://spotify-backend-zeta.vercel.app/api";

const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
