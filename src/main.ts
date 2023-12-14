import './assets/main.css'
import {createApp} from 'vue'
import App from './App.vue'
import router from "@/router";
import Varlet from "@varlet/ui";
import '@varlet/ui/es/style'
import '@varlet/touch-emulator'
import {createPinia} from "pinia";

/* import the fontawesome core */
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {faA, faSun, faMoon} from '@fortawesome/free-solid-svg-icons';

library.add(faA, faSun, faMoon);

createApp(App)
    .use(Varlet)
    .use(router)
    .use(createPinia())
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app');
