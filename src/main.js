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

// Initialize AOS
AOS.init({ duration: 800, once: false });
router.afterEach(() => setTimeout(() => AOS.refresh(), 500));

const app = createApp(App);

// Load access token before anything
const access = localStorage.getItem('access');
if (access) {
    store.commit('authentication/SET_TOKEN', access);
    store.dispatch('authentication/fetchCurrentUserDetails').catch(() => {
        store.commit('authentication/LOGOUT');
    });
}

// Restore user session if token exists and is valid
function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
}

const token = localStorage.getItem('access');
if (token && !isTokenExpired(token)) {
    store.dispatch('authentication/fetchCurrentUserDetails').catch(() => {
        store.commit('authentication/LOGOUT');
    });
} else {
    store.commit('authentication/LOGOUT');
}

// Auth0 Setup (if needed)
app.use(
    createAuth0({
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        authorizationParams: {
            redirect_uri: window.location.origin,
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
    }),
);

// Use plugins
app.use(router);
app.use(store);
app.use(Toastify, { autoClose: 3000 });

// Mount app
app.mount('#app');
