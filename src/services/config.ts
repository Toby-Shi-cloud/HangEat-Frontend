import axios from "axios";
import {Snackbar} from "@varlet/ui";
import {useAuthStore} from "@/store/user";
import {doRefreshToken} from "./user";
import ErrorCode from "./errorcode";
import Mutex from "ts-mutex";

export interface ErrorData {
    code: number;
    detailed_error_code: number;
    error_msg: string;
}

// @ts-ignore
if (process.env.NODE_ENV === "production") {
    axios.defaults.baseURL = "/api/";
} else {
    const domain = window.location.host.split(':').slice(0, -1).join(':');
    axios.defaults.baseURL = "http://" + domain + ":8000";
}

// timeout: 5s
axios.defaults.timeout = 5000;

const contentType = 'application/x-www-form-urlencoded';
axios.defaults.headers.post['Content-Type'] = contentType;
axios.defaults.headers.put['Content-Type'] = contentType;

// loading...
let loading = false;

export const startLoading = () => {
    Snackbar.loading("加载中...");
    loading = true;
};

export const endLoading = () => {
    if (!loading) return;
    Snackbar.clear();
    loading = false;
};

// mutex
const refreshTokenMutex = new Mutex();

// before request
axios.interceptors.request.use(async function (config) {
    // 在发送请求前做些什么
    if (localStorage._token) {
        config.headers.Authorization = "Bearer " + localStorage._token;
    } else if (localStorage._refresh_token) {
        config.headers.Authorization = "Bearer " + localStorage._refresh_token;
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    Snackbar.error('网络连接异常，请稍后再试！')
    return Promise.reject(error);
});

// after response
axios.interceptors.response.use(function (response) {
    endLoading();
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data.hasOwnProperty('token')) {
        useAuthStore().login();
        localStorage.setItem('_token', response.data.token);
        delete response.data.token;
    }
    if (response.data.hasOwnProperty('refresh_token')) {
        localStorage.setItem('_refresh_token', response.data.refresh_token);
        delete response.data.refresh_token;
    }
    return response
}, async function (error) {
    Snackbar.info({content: "加载结束", duration: 0});
    const userStore = useAuthStore();
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (error?.response) {
        if (error.response.status >= 500 && error.response.status < 600) {
            Snackbar.error('系统错误，请稍后再试！');
            return Promise.reject(error);
        }
        const data = error.response.data as ErrorData;
        if (data.code != error.response.status || !data.detailed_error_code || !data.error_msg) {
            Snackbar.error('未知错误，请稍后再试！');
            return Promise.reject(error);
        }
        if (data.detailed_error_code !== ErrorCode.UNAUTHORIZED_ERROR) {
            const msg = data.error_msg.split(': ');
            Snackbar.error(msg[msg.length - 1]);
            return Promise.reject(error);
        }
        return await refreshTokenMutex.use(async () => {
            if (userStore.isAuthenticated) {
                userStore.logout();
                localStorage.removeItem('_token');
                if (localStorage._refresh_token) try {
                    await doRefreshToken();
                    if (!userStore.isAuthenticated) throw new Error('refresh token failed');
                    // 重新执行之前失败的请求
                    const originRequest = error.config
                    return axios(originRequest);
                } catch (e) {
                    Snackbar.error('登录已过期，请重新登录！');
                    localStorage.removeItem('_refresh_token');
                    window.location.href = '/login';
                } else {
                    Snackbar.error('登录已过期，请重新登录！');
                    window.location.href = '/login';
                }
            } else {
                Snackbar.error('未登录，请先登录！');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        });
    }
    Snackbar.error('请求超时，请稍后再试！');
    return Promise.reject(error);
});

export default axios;
