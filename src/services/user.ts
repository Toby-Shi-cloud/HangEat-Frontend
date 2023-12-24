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
    return axios.get(`user/logout?timestamp=${Date.now()}`);
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

export const doGetUserInfo = (timestamp?: number) => {
    const suffix = timestamp ? '?timestamp=' + timestamp : '';
    return axios.get('user/get-user-info' + suffix);
}

export const doGetUserById = (id: number) => {
    return axios.get(`user/get-user-info/${id}?timestamp=${Date.now()}`);
}

export const doRefreshToken = () => {
    return axios.get(`user/refresh-token?timestamp=${Date.now()}`);
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

export const doGetSubscriptionsNum = () => {
    return axios.get(`user/get-subscriptions-num?timestamp=${Date.now()}`);
}

export const doGetSubscriptionsList = (from: number, to: number) => {
    return axios.get(`user/get-subscriptions-list?from=${from}&to=${to}&timestamp=${Date.now()}`);
}

export const doGetSubscribersNum = () => {
    return axios.get(`user/get-subscribers-num?timestamp=${Date.now()}`);
}

export const doGetSubscribersList = (from: number, to: number) => {
    return axios.get(`user/get-subscribers-list?from=${from}&to=${to}&timestamp=${Date.now()}`);
}

export const doGetRelationBetween = (user1: number, user2: number) => {
    return axios.get(`user/get-relation-between?user1=${user1}&user2=${user2}&timestamp=${Date.now()}`);
}

export const doFavoriteRestaurant = (target_id: number) => {
    return axios.post('user/collect', {target_id: target_id});
}

export const doUnfavoriteRestaurant = (target_id: number) => {
    return axios.post('user/uncollect', {target_id: target_id});
}

export const doGetFavorableRestaurantsNum = () => {
    return axios.get(`user/get-collections-num?timestamp=${Date.now()}`);
}

export const doGetFavorableRestaurantsList = (from: number, to: number) => {
    return axios.get(`user/get-collections-list?from=${from}&to=${to}&timestamp=${Date.now()}`);
}
