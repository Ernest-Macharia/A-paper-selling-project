import { createApp } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import 'aos/dist/aos.css';
import AOS from 'aos';

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

AOS.init({
  duration: 800,
  once: false,
});

router.afterEach(() => {
  setTimeout(() => {
    AOS.refresh();
  }, 500);
});

const app = createApp(App);

app.use(router);
app.use(store);
app.mount('#app');
