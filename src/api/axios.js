import axios from 'axios';

console.log('API Base URL from .env:', process.env.REACT_APP_API_URL);

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api; 