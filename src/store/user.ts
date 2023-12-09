import {defineStore} from "pinia";
import {doGetFans, doGetSubscribes, doGetUserInfo} from "@/services/user";

export interface UserInfo {
    id?: number;
    username?: string;
    email?: string;
    avatar?: string;
    motto?: string;
}

export interface UserList {
    count: number;
    list: Map<string, UserInfo>;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authenticated: false,
        userInfo: {} as UserInfo,
        followers: {count: 0, list: new Map<string, UserInfo>()} as UserList,
        following: {count: 0, list: new Map<string, UserInfo>()} as UserList,
    }),

    getters: {
        isAuthenticated: (state) => state.authenticated,
        getUserInfo: (state) => state.userInfo,
        needRefreshInfo: (state) => state.userInfo == {} as UserInfo,
        getFollowersCount: (state) => state.followers.count,
        getFollowingCount: (state) => state.following.count,
    },

    actions: {
        async setup() {
            if (localStorage._refresh_token) try {
                this.login();
                await this.refreshUserInfo();
            } catch (e) {
                console.error(e);
            }
        },
        login() {
            this.authenticated = true;
        },
        logout() {
            this.authenticated = false;
            this.userInfo = {};
        },
        setUserInfo(userInfo: UserInfo) {
            for (const key in userInfo) {
                // @ts-ignore
                this.userInfo[key] = userInfo[key] || this.userInfo[key];
            }
        },
        async refreshUserInfo() {
            const {data} = await doGetUserInfo();
            this.setUserInfo(data);
        },
        async updateFollowers() {
            const {data} = await doGetFans();
            for (const key in data) {
                if (key === '粉丝人数') {
                    this.followers.count = data[key];
                } else {
                    this.followers.list.set(key, data[key]);
                }
            }
        },
        async updateFollowing() {
            const {data} = await doGetSubscribes();
            for (const key in data) {
                if (key === '关注人数') {
                    this.following.count = data[key];
                } else {
                    this.following.list.set(key, data[key]);
                }
            }
        },
    }
});
