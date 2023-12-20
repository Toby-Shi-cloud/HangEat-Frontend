import './assets/main.css'
import {createApp} from 'vue'
import App from './App.vue'
import router from "@/router";
import Varlet from "@varlet/ui";
import '@varlet/ui/es/style'
import '@varlet/touch-emulator'
import {createPinia} from "pinia";
import FontAwesomeIcon from './assets/fortawesome';

createApp(App)
    .use(Varlet)
    .use(router)
    .use(createPinia())
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app');
