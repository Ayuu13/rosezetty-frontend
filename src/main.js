import 'vuetify/styles';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import App from './App.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import router from './router';
import store from './store';

const vuetify = createVuetify({
	components,
	directives,
});

const app = createApp(App);

createApp(App).use(createPinia()).use(router).use(vuetify).use(store).mount('#app');
