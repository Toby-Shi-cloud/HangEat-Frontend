<script setup lang="ts">
import {computed, watch, onMounted} from 'vue'
import {useHeaderStore} from "@/store/header";
import {useAuthStore} from "@/store/user";
import {doLogout} from "@/services/user";
import {Snackbar} from "@varlet/ui";

const headerStore = useHeaderStore();
const title = computed(() => headerStore.getTitle);

const authStore = useAuthStore();

const logout = () => {
  doLogout().then(() => {
    localStorage.removeItem('_token');
    localStorage.removeItem('_refresh_token');
    authStore.logout();
    Snackbar.success('登出成功');
    window.location.href = "/";
  }).catch();
};

watch(
    () => [authStore.isAuthenticated, authStore.needRefreshInfo],
    ([isAuthenticated, needRefreshInfo]) => {
      if (isAuthenticated && needRefreshInfo) {
        authStore.refreshUserInfo().catch(authStore.logout);
      }
    },
    {immediate: true}
);

onMounted(() => {
  authStore.setup();
});
</script>

<template>
  <header id="app-bar">
    <var-app-bar class="container" elevation="false" title-position="center" color="rgba(0,0,0,0)">
      <template #left>
        <div class="image-container">
          <var-icon :name="headerStore.getLogo" size="100%"></var-icon>
        </div>
        <var-link id="app-title" class="bar-link" underline="hover" to="/">{{ title }}</var-link>
      </template>

      <!-- TODO: implement search -->

      <div class="tab-container">
        <var-link v-for="tab in headerStore.getTabs"
                  underline="hover" :to="tab.path"
                  class="bar-link" :key="tab.name">
          {{ tab.name }}
        </var-link>
      </div>

      <template #right>
        <var-link v-if="authStore.isAuthenticated" class="bar-link"
                  underline="hover" @click="logout()">登出
        </var-link>
        <var-link v-if="headerStore.showUser" class="bar-link" underline="none"
                  :to="authStore.isAuthenticated ? '/user' : '/login'">
          <var-avatar v-if="authStore.isAuthenticated" :src="authStore.getUserInfo.avatar"></var-avatar>
          <p v-else>登录</p>
        </var-link>
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

*, *::before, *::after {
  font-weight: bold;
}
</style>