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

// Auth0 setup
const redirectUri = window.location.origin;

app.use(
    createAuth0({
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        authorizationParams: {
            redirect_uri: redirectUri, // dynamically use current origin
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
    }),
);

const accessToken = localStorage.getItem('access');
if (accessToken) {
    app.config.globalProperties.$axios = api; // optional
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

store.dispatch('authentication/fetchCurrentUserDetails').catch(() => {
    store.commit('authentication/LOGOUT');
});

function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
}

const token = localStorage.getItem('access');
if (token && isTokenExpired(token)) {
    store.commit('authentication/LOGOUT');
}

// Register plugins
app.use(router);
app.use(store);
app.use(Toastify, { autoClose: 3000 });

// Mount app
app.mount('#app');
