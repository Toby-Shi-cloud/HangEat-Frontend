import {defineStore} from "pinia";
import {doGetUserInfo} from "@/services/user";

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
    }),

    getters: {
        isAuthenticated: (state) => state.authenticated,
        getUserInfo: (state) => state.userInfo,
        needRefreshInfo: (state) => state.userInfo.id === undefined,
        getFollowersCount: (state) => state.followers,
        getFollowingCount: (state) => state.following,
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
            console.log(data);
            this.setUserInfo(data);
        },
        async updateFollowers() {
            // TODO: update followers
        },
        async updateFollowing() {
            // TODO: update following
        },
    }
});
