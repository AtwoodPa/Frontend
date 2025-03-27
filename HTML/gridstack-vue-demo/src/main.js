import { createApp } from 'vue'
import App from './App.vue'

import gridLayout from "vue-grid-layout";
const app = createApp(App);

app.use(gridLayout);

app.mount('#app')
