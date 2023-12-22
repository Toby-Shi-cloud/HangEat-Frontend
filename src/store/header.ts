import {defineStore} from "pinia";

export interface TabItem {
    name: string,
    path: string,
}

export const useHeaderStore = defineStore('header', {
    state: () => ({
        logo: "/favicon.png",
        title: "航小炫",
        search: false,
        tabs: [{
            name: "首页",
            path: "/"
        }, {
            name: "餐馆",
            path: "/restaurants"
        }] as TabItem[],
        user: true,
    }),

    getters: {
        getLogo: (state) => state.logo,
        getTitle: (state) => state.title,
        needSearch: (state) => state.search,
        getTabs: (state) => state.tabs,
        showUser: (state) => state.user,
    },

    actions: {
        setLogo(logo: string) {
            this.logo = logo;
        },
        setTitle(title: string) {
            this.title = title;
        },
        setSearch(search: boolean) {
            this.search = search;
        },
        setTabs(tabs: TabItem[]) {
            this.tabs = tabs;
        },
        setUser(user: boolean) {
            this.user = user;
        }
    }
});
