import {defineStore} from "pinia";
import type {UserInfo} from "@/store";
import {
    doGetSubscribersNum,
    doGetSubscriptionsNum,
    doGetUserById,
    doGetUserInfo,
    doRefreshToken
} from "@/services/user";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authenticated: false,
        userInfo: {} as UserInfo,
        timestamp: Date.now(),
    }),

    getters: {
        isAuthenticated: (state) => state.authenticated,
        getUserInfo: (state) => state.userInfo,
        needRefreshInfo: (state) => state.authenticated && state.userInfo.id === undefined,
    },

    actions: {
        async setup() {
            if (this.isAuthenticated && !this.needRefreshInfo) return;
            if (localStorage._token) {
                this.login();
                await this.refreshUserInfo();
            } else if (localStorage._refresh_token) try {
                await doRefreshToken().catch(() => localStorage.removeItem('_refresh_token'));
                await this.refreshUserInfo();
            } catch (e) {
                console.error(e);
            }
        },
        login() {
            if (this.authenticated) return;
            this.authenticated = true;
        },
        logout() {
            if (!this.authenticated) return;
            this.authenticated = false;
            this.userInfo = {};
        },
        setUserInfo(userInfo: UserInfo) {
            this.userInfo = {
                ...this.userInfo,
                ...userInfo
            };
        },
        refreshTimestamp() {
            this.timestamp = Date.now();
        },
        async refreshUserInfo() {
            if (!this.authenticated) return;
            const {data} = await doGetUserInfo(this.timestamp);
            this.setUserInfo(data);
        },
        async updateSubscribersNum() {
            if (!this.authenticated) return;
            const {data} = await doGetSubscribersNum();
            this.userInfo.subscribers_num = data.subscribers_num;
        },
        async updateSubscriptionsNum() {
            if (!this.authenticated) return;
            const {data} = await doGetSubscriptionsNum();
            this.userInfo.subscriptions_num = data.subscriptions_num;
        },
    }
});

export const useUsersStore = defineStore('users', {
    state: () => ({
        userInfoMap: {} as Record<number, UserInfo>,
        inFetching: {} as Record<number, boolean>,
    }),
    actions: {
        async fetchUserInfo(id: number, forceRefresh = false) {
            if (this.inFetching[id]) while (this.inFetching[id]) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            if (forceRefresh) delete this.userInfoMap[id];
            if (this.userInfoMap[id]) return this.userInfoMap[id];
            this.inFetching[id] = true;
            const {data} = await doGetUserById(id);
            this.userInfoMap[id] = data;
            this.inFetching[id] = false;
            return data as UserInfo;
        },
        getUserInfo(id?: number) {
            if (!id) return null;
            if (this.userInfoMap[id]) return this.userInfoMap[id];
            return null;
        },
    }
});
