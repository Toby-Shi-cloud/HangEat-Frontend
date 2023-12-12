<script setup lang="ts">
import {useHeaderStore} from "@/store/header";
import {useAuthStore} from "@/store/user";
import {doLogout} from "@/services/user";
import {Snackbar} from "@varlet/ui";

const headerStore = useHeaderStore();
const authStore = useAuthStore();

const toUser = () => {
  window.location.href = `/user/${authStore.getUserInfo.id}`;
};

const logout = () => {
  doLogout().then(() => {
    localStorage.removeItem('_token');
    localStorage.removeItem('_refresh_token');
    authStore.logout();
    Snackbar.success('登出成功');
    window.location.href = "/";
  }).catch();
};
</script>

<template>
  <header id="app-bar">
    <var-app-bar class="container" elevation="false" title-position="center" color="rgba(0,0,0,0)">
      <template #left>
        <div class="image-container">
          <var-icon :name="headerStore.getLogo" size="100%"></var-icon>
        </div>
        <var-link id="app-title" class="bar-link" underline="hover" to="/">{{ headerStore.getTitle }}</var-link>
      </template>

      <!-- TODO: implement search -->

      <div class="tab-container">
        <var-link v-for="tab in headerStore.getTabs"
                  underline="hover" :to="tab.path"
                  class="bar-link" :key="tab.name">
          {{ tab.name }}
        </var-link>
      </div>

      <template #right v-if="headerStore.showUser">
        <var-skeleton v-if="authStore.isAuthenticated"
                      avatar :rows="0" class="user-avatar"
                      :loading="authStore.getUserInfo.avatar === undefined">
          <var-menu placement="bottom-start" offset-y="5px" popover-class="user-menu">
            <var-avatar :src="authStore.getUserInfo.avatar" :hoverable="true"/>
            <template #menu>
              <var-button-group vertical size="large">
                <var-button ripple class="menu-btn" @click="toUser()">查看主页</var-button>
                <var-button ripple class="menu-btn" @click="logout()">退出登录</var-button>
              </var-button-group>
            </template>
          </var-menu>
        </var-skeleton>
        <var-link v-else class="bar-link" underline="none" to="/login">登录</var-link>
      </template>
    </var-app-bar>
    <var-divider class="app-bar-divider"/>
  </header>
</template>

<style scoped>
.container {
  max-width: 1280px;
  margin: 0 auto;
  height: 100%;

  --app-bar-color: rgba(0, 0, 0, 0);
  --app-bar-text-color: var(--color-heading);
  --app-bar-height: 100%;
  --app-bar-title-font-size: 22px;
}

.image-container {
  height: 80%;
  width: auto;
  position: relative;
}

#app-title {
  padding: 0 20px;
}

.bar-link {
  padding: 0 10px;

  --link-font-size: var(--app-bar-title-font-size);
}

.app-bar-divider {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  place-items: center;

  --divider-text-margin: 0;
  --divider-text-padding: 0;
  --divider-color: var(--color-border);
}

.user-avatar {
  --skeleton-avatar-size: calc(var(--header-bar-height) * 0.8);
}

*, *::before, *::after {
  font-weight: bold;
}
</style>