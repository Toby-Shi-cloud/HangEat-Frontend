import './assets/main.css';
import {createApp} from 'vue';
import App from './App.vue';
import router from "@/router";
import Varlet from "@varlet/ui";
import '@varlet/ui/es/style';
import {createPinia} from "pinia";
import FontAwesomeIcon from './assets/fortawesome';
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

createApp(App)
    .use(Varlet)
    .use(router)
    .use(createPinia())
    .component('font-awesome-icon', FontAwesomeIcon)
    .component('quill-editor', QuillEditor)
    .mount('#app');
