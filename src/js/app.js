/**
 * Load our bootstrap file
 */
require('./bootstrap');

import { createApp, h, nextTick } from 'vue';
import App from './pages/App.vue';

const app = createApp(App);

app.mount('#app');
