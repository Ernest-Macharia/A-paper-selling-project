import axios from 'axios';
import store from '@/store';

// Determine the base URL
const isLocalhost =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const api = axios.create({
    baseURL: isLocalhost
        ? 'http://localhost:8000/api'
        : import.meta.env.VITE_API_BASE_URL || 'https://gradesworld.com/api',
});

// Attach token automatically from localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Handle 401 errors and auto-refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/token/refresh/')
        ) {
            originalRequest._retry = true;

            try {
                const refresh = localStorage.getItem('refresh');
                if (refresh) {
                    const response = await axios.post(
                        `${api.defaults.baseURL}/users/token/refresh/`,
                        { refresh },
                    );
                    const newAccessToken = response.data.access;

                    localStorage.setItem('access', newAccessToken);
                    store.commit('authentication/SET_TOKEN', newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    return api(originalRequest);
                }
            } catch (err) {
                console.error('Refresh failed:', err);
                store.commit('authentication/LOGOUT');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    },
);

export default api;
