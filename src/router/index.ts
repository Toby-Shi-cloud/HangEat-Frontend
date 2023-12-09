import {createRouter, createWebHistory} from 'vue-router';
import Index from "@/views/Index.vue";
import Login from "@/views/Login.vue";
import User from "@/views/User.vue";
import {useAuthStore} from "@/store/user";
import {Snackbar} from "@varlet/ui";

const routes = [{
    path: '/',
    name: 'Index',
    component: Index
}, {
    path: '/login',
    name: 'Login',
    component: Login
}, {
    path: '/user',
    name: 'User',
    component: User
}];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.path === "/login" && authStore.isAuthenticated) {
        // 若用户已登录且前往登录页，则跳转到首页
        Snackbar.info("您已登录，即将跳转到首页");
        next("/");
    } else if (to.path.startsWith('/user') && !authStore.isAuthenticated) { // 拦截
        next("/login");
    } else {
        next();
    }
});

export default router;
