import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import Varlet from "@varlet/ui";
import '@varlet/ui/es/style'
import { createPinia } from "pinia";

createApp(App).use(Varlet).use(router).use(createPinia()).mount('#app')
