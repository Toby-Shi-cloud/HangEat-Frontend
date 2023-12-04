import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Varlet from "@varlet/ui";
import '@varlet/ui/es/style'

createApp(App).use(Varlet).mount('#app')
