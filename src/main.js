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

// --- Initialize AOS ---
AOS.init({ duration: 800, once: false });
router.afterEach(() => setTimeout(() => AOS.refresh(), 500));

// --- Create Vue App ---
const app = createApp(App);

// --- Load access token and fetch user ---
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

// --- Add Tawk.to live chat widget ---
// const tawkSrc = import.meta.env.VITE_TAWKTO_SRC;
// if (tawkSrc) {
//     const s1 = document.createElement('script');
//     s1.async = true;
//     s1.src = tawkSrc;
//     s1.charset = 'UTF-8';
//     s1.setAttribute('crossorigin', '*');

//     const s0 = document.getElementsByTagName('script')[0];
//     s0.parentNode.insertBefore(s1, s0);
// }

// --- Axios base URL ---
api.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://gradesworld.com/api';

// --- Auth0 (Optional) ---
app.use(
    createAuth0({
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        cacheLocation: 'localstorage',
        useRefreshTokens: true,
    }),
);

// --- Use plugins ---
app.use(router);
app.use(store);
app.use(Toastify, { autoClose: 3000 });

// --- Mount App ---
app.mount('#app');
