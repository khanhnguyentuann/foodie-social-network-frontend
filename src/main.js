import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import App from './App.vue';
import router from './router';
import { useUserStore } from './store/userStore';

createApp(App).use(createPinia());

const storedToken = localStorage.getItem('authToken');
const storedUser = localStorage.getItem('user');

if (storedToken && storedUser) {
    const userStore = useUserStore();
    userStore.setToken(storedToken);
    userStore.setUser(JSON.parse(storedUser));
}

createApp(App).use(router).mount('#app');
