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
    name: 'Myself',
    component: User,
}, {
    path: '/user/:id',
    name: 'User',
    component: User,
    props: (route: any) => ({ userId: parseInt(route.params.id) })
}];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    await authStore.setup();
    if (to.name === 'Login' && authStore.isAuthenticated) {
        // 若用户已登录且前往登录页，则跳转到首页
        Snackbar.info("您已登录！" + from.path);
        next(from.path === "/login" ? "/" : from);
    } else if (to.name === 'Myself') {
        if (authStore.isAuthenticated) {
            next("/user/" + authStore.getUserInfo.id);
        } else {
            Snackbar.error("请先登录后访问！");
            next("/login");
        }
    } else {
        next();
    }
});

export default router;
