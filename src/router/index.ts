import {createRouter, createWebHistory} from 'vue-router';
import Index from "@/views/Index.vue";
import Login from "@/views/Login.vue";
import User from "@/views/User.vue";
import Restaurant from "@/views/Restaurant.vue";
import Restaurants from "@/views/Restaurants.vue";
import NotFound from "@/views/404.vue";
import {useAuthStore} from "@/store/user";
import {Snackbar} from "@varlet/ui";

const routes = [{
    path: '/',
    name: 'Index',
    component: Index
}, {
    path: '/login',
    name: 'Login',
    component: Login,
    props: (route: any) => ({ url: route.query.url })
}, {
    path: '/login/special',
    name: 'LoginSp',
    component: Login,
    props: (route: any) => ({ special: true, url: route.query.url })
}, {
    path: '/user',
    name: 'Myself',
    component: User
}, {
    path: '/user/:id',
    name: 'User',
    component: User,
    props: true
}, {
    path: '/restaurants',
    name: 'Restaurants',
    component: Restaurants,
    props: (route: any) => ({ tag: route.query.tag })
}, {
    path: '/restaurant/:id',
    name: 'Restaurant',
    component: Restaurant,
    props: true
}, {
    path: "/:pathMatch(.*)*",
    name: 'NotFound',
    component: NotFound
}];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    try { await authStore.setup(); }
    catch (e) {}
    if (to.name === 'Login' && authStore.isAuthenticated) {
        // 若用户已登录且前往登录页，则跳转到首页
        Snackbar.info("您已登录！");
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
