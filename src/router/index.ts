import {createRouter, createWebHistory} from 'vue-router';
import Index from "@/views/Index.vue";
import Login from "@/views/Login.vue";
import User from "@/views/User.vue";
import Restaurant from "@/views/Restaurant.vue";
import Restaurants from "@/views/Restaurants.vue";
import Post from "@/views/Post.vue";
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
    title: '登录',
    component: Login,
    props: (route: any) => ({ url: route.query.url })
}, {
    path: '/login/special',
    name: 'LoginSp',
    title: '登录',
    component: Login,
    props: (route: any) => ({ special: true, url: route.query.url })
}, {
    path: '/user',
    name: 'Myself',
    title: '用户中心',
    component: User
}, {
    path: '/user/:id',
    name: 'User',
    title: '用户中心',
    component: User,
    props: true
}, {
    path: '/restaurants',
    name: 'Restaurants',
    title: '餐馆筛选',
    component: Restaurants,
    props: (route: any) => route.query
}, {
    path: '/restaurant/:id',
    name: 'Restaurant',
    title: '餐馆详情',
    component: Restaurant,
    props: true
}, {
    path: '/post/:id',
    name: 'Post',
    title: '帖子详情',
    component: Post,
    props: true
}, {
    path: "/:pathMatch(.*)*",
    name: 'NotFound',
    title: '404',
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

router.afterEach((to, from) => {
    document.title = '航小炫今天吃什么'
    let title = routes.find(r => r.name === to.name)?.title;
    if (title) document.title += '│' + title;
});

export default router;
