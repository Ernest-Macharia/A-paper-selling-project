import { createApp } from 'vue';
import { createAuth0 } from '@auth0/auth0-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import 'aos/dist/aos.css';
import AOS from 'aos';

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import api from '@/api';
import { toast } from 'vue3-toastify';

// Initialize AOS
AOS.init({ duration: 800, once: false });
router.afterEach(() => setTimeout(() => AOS.refresh(), 500));

// Create Vue App
const app = createApp(App);

// Validate environment variables
const requiredEnvVars = ['VITE_AUTH0_DOMAIN', 'VITE_AUTH0_CLIENT_ID', 'VITE_AUTH0_AUDIENCE'];

if (import.meta.env.DEV) {
    localStorage.removeItem('auth0.is.authenticated');
    localStorage.removeItem('auth0.cache');
}

for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
        console.error(`Missing required environment variable: ${envVar}`);
    }
}

// Initialize Auth0
const auth0 = createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        redirect_uri: window.location.origin,
        scope: 'openid profile email offline_access',
    },
    cacheLocation: 'localstorage',
    useRefreshTokens: true,
    useCookiesForTransactions: true,
    cookieDomain: window.location.hostname,
});

app.config.globalProperties.$auth0 = auth0;
app.use(auth0);

// Handle existing token
const token = localStorage.getItem('access');
function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
}

if (token && !isTokenExpired(token)) {
    store.commit('authentication/SET_TOKEN', token);
    store.dispatch('authentication/fetchCurrentUserDetails').catch(() => {
        store.commit('authentication/LOGOUT');
    });
} else {
    store.commit('authentication/LOGOUT');
}

// Handle Auth0 callback
if (window.location.search.includes('code=')) {
    // Clear existing auth state
    localStorage.removeItem('auth0.is.authenticated');

    auth0
        .handleRedirectCallback()
        .then(({ appState }) => {
            const returnTo = appState?.target || localStorage.getItem('returnTo') || '/';
            localStorage.removeItem('returnTo');

            // Force token refresh
            return auth0.getAccessTokenSilently().then(() => {
                router.push(returnTo);
            });
        })
        .catch((error) => {
            console.error('Auth0 callback error:', error);

            if (error.error === 'invalid_state') {
                // Clear auth state and restart flow
                localStorage.removeItem('auth0.is.authenticated');
                auth0.loginWithRedirect({
                    authorizationParams: {
                        prompt: 'login', // Force fresh login
                    },
                });
            } else {
                router.push('/login?error=auth_failed');
            }
        });
}

// Set base API URL
api.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://gradesworld.com/api';

// Use plugins
app.use(router);
app.use(store);
app.use(Toastify, { autoClose: 3000 });

// Mount app
app.mount('#app');
