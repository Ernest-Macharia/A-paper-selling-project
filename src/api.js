import axios from 'axios';
import store from '@/store'; // ✅ This was missing

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
});

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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refresh = localStorage.getItem('refresh');
                if (refresh) {
                    const response = await axios.post(`${api.defaults.baseURL}/token/refresh/`, {
                        refresh,
                    });
                    localStorage.setItem('access', response.data.access);
                    store.commit('authentication/SET_TOKEN', response.data.access); // ✅ Ensure token is stored

                    originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                } else {
                    console.error('Refresh token missing.');
                }
            } catch (e) {
                console.error('Refresh token expired or invalid.');
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                store.commit('authentication/LOGOUT');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    },
);

export default api;
