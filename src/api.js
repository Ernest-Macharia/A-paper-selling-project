import axios from 'axios';
import store from '@/store';
import { useAuth0 } from '@auth0/auth0-vue';

// Determine the base URL
const isLocalhost =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const api = axios.create({
    baseURL: isLocalhost
        ? 'http://localhost:8000/api'
        : import.meta.env.VITE_API_BASE_URL ||
          'https://gradesworld.com/api' ||
          'https://gradesworld-backend.onrender.com/api',
});

let auth0;

try {
    auth0 = useAuth0();
} catch (error) {
    console.warn('Auth0 not initialized yet');
}

// Attach token automatically from localStorage
api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('access');

        // For traditional auth
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // For Auth0 authenticated requests
        if (auth0?.isAuthenticated.value && !token) {
            try {
                const auth0Token = await auth0.getAccessTokenSilently();
                config.headers.Authorization = `Bearer ${auth0Token}`;
            } catch (error) {
                console.error('Failed to get Auth0 token:', error);
            }
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
