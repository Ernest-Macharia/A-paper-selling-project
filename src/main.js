import { createApp } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import 'aos/dist/aos.css';
import AOS from 'aos';

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

// Initialize AOS
AOS.init({
  duration: 800,
  once: false,
});

// Refresh AOS on route change
router.afterEach(() => {
  setTimeout(() => {
    AOS.refresh();
  }, 500);
});

// Toast options
const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  draggable: true,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
};

const app = createApp(App);

// Register plugins
app.use(router);
app.use(store);
app.use(Toast, toastOptions);
app.use(Toastify, {
  autoClose: 3000,
});

// Mount app
app.mount('#app');
