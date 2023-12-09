import {defineStore} from "pinia";
import {doGetUserInfo} from "@/services/user";

export interface UserInfo {
    username?: string;
    email?: string;
    avatar?: string;
    motto?: string;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authenticated: false,
        userInfo: {} as UserInfo,
    }),

    getters: {
        isAuthenticated: (state) => state.authenticated,
        getUserInfo: (state) => state.userInfo,
        needRefreshInfo: (state) => state.userInfo === {} as UserInfo,
    },

    actions: {
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
        }
    }
});
