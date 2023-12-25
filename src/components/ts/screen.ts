import {ref} from 'vue';

const width = ref(window.innerWidth);
const height = ref(window.innerHeight);
window.onresize = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
};

export default {
    width,
    height,
};