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
      redirect_uri: redirectUri,  // dynamically use current origin
      audience: import.meta.env.VITE_AUTH0_AUDIENCE
    }
  })
);

// Register plugins
app.use(router);
app.use(store);
app.use(Toastify, { autoClose: 3000 });

// Mount app
app.mount('#app');
