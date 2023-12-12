import {defineStore} from "pinia";
import {doGetFansNum, doGetSubscribesNum, doGetUserInfo, doRefreshToken} from "@/services/user";

export interface UserInfo {
    id?: number;
    username?: string;
    email?: string;
    avatar?: string;
    motto?: string;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authenticated: false,
        userInfo: {} as UserInfo,
        followers: 0,
        following: 0,
        timestamp: Date.now(),
    }),

    getters: {
        isAuthenticated: (state) => state.authenticated,
        getUserInfo: (state) => state.userInfo,
        needRefreshInfo: (state) => state.authenticated && state.userInfo.id === undefined,
        getFollowersCount: (state) => state.followers,
        getFollowingCount: (state) => state.following,
    },

    actions: {
        async setup() {
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
            }
        },
        async refreshUserInfo(force: boolean = false) {
            if (!this.authenticated) return;
            if (force) this.timestamp = Date.now();
            const {data} = await doGetUserInfo(this.timestamp);
            this.setUserInfo(data);
        },
        async updateFollowersNum() {
            if (!this.authenticated) return;
            const {data} = await doGetFansNum();
            this.followers = data.fans_num;
        },
        async updateFollowingNum() {
            if (!this.authenticated) return;
            const {data} = await doGetSubscribesNum();
            this.following = data.follower_num;
        },
    }
});
