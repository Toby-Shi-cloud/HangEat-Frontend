import axios from "./config";

export const doLogin = (username: string, password: string) => {
    return axios.post('user/login', {
        username: username,
        password: password,
    });
}

export const doRegister = (email: string, captcha: string, username: string, password: string) => {
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
    return axios.get('user/delete');
}

export const doUpdateInfo = (username: string, motto: string) => {
    return axios.post('user/update-info', {
        username: username,
        motto: motto,
    });
}

// TODO: doUpdateAvatar;

export const doChangePassword = (old_password: string, new_password: string) => {
    return axios.post('user/change-password', {
        old_password: old_password,
        new_password: new_password,
    });
}

export const doForgetPassword = (email: string, captcha: string, new_password: string) => {
    return axios.post('user/forget-password', {
        email: email,
        captcha: captcha,
        new_password: new_password,
    });
}

export const doGetUserInfo = () => {
    return axios.get('user/get-user-info');
}

export const doRefreshToken = () => {
    return axios.get('user/refresh-token');
}

export const doSendCaptcha = (email: string) => {
    return axios.post('user/send-captcha', {email: email});
}

export const doChangeEmail = (email: string, captcha: string) => {
    return axios.post('user/change-email', {
        email: email,
        captcha: captcha,
    });
}
