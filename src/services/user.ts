import axios from "./config";
import {startLoading} from "./config";

export const doLogin = (username: string, password: string) => {
    startLoading();
    return axios.post('user/login', {
        username: username,
        password: password,
    });
}

export const doRegister = (email: string, captcha: string, username: string, password: string) => {
    startLoading();
    return axios.post('user/signup', {
        email: email,
        captcha: captcha,
        username: username,
        password: password,
    });
}

export const doLogout = () => {
    return axios.get('user/logout');
}

export const doDelete = () => {
    return axios.delete('user/delete');
}

export const doUpdateInfo = (username: string | null, motto: string) => {
    startLoading();
    return axios.put('user/update-info', {
        username: username,
        motto: motto,
    });
}

export const doUpdateAvatar = (avatar: File) => {
    startLoading();
    let formData = new FormData();
    formData.append('avatar', avatar);
    return axios.post('user/update-avatar', formData);
}

export const doChangePassword = (old_password: string, new_password: string) => {
    startLoading();
    return axios.post('user/change-password', {
        old_password: old_password,
        new_password: new_password,
    });
}

export const doForgetPassword = (email: string, captcha: string, password: string) => {
    startLoading();
    return axios.post('user/forget-password', {
        email: email,
        captcha: captcha,
        password: password,
    });
}

export const doGetUserInfo = (timestamp: number | null = null) => {
    const suffix = timestamp ? '?timestamp=' + timestamp : '';
    return axios.get('user/get-user-info' + suffix);
}

export const doRefreshToken = () => {
    console.log('refresh token');
    return axios.get('user/refresh-token?timestamp=' + Date.now());
}

export const doSendCaptcha = (email: string) => {
    startLoading();
    return axios.post('user/send-captcha', {email: email});
}

export const doChangeEmail = (email: string, captcha: string) => {
    startLoading();
    return axios.post('user/change-email', {
        email: email,
        captcha: captcha,
    });
}

export const doSubscribe = (target_id: number) => {
    return axios.post('user/subscribe', {target_id: target_id});
}

export const doUnsubscribe = (target_id: number) => {
    return axios.post('user/unsubscribe', {target_id: target_id});
}
