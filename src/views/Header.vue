<script setup lang="ts">
import {getCurrentTheme, getSystemTheme, isLight} from "@/components/themes";
import {setTheme, Theme, toggleTheme} from "@/components/themes";
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

const changeTheme = () => {
  if (getCurrentTheme.value === Theme.System) return toggleTheme();
  if (getCurrentTheme.value === getSystemTheme.value) return setTheme(Theme.System);
  return toggleTheme();
};
</script>

<template>
  <header id="app-header">
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
        <var-tooltip :content="(isLight ? '白昼模式' : '暗夜模式') + (getCurrentTheme === Theme.System ? '（跟随系统）' : '')">
          <var-button round class="switch-btn" @click="changeTheme">
            <var-badge position="right-bottom" style="color: inherit" :hidden="getCurrentTheme !== Theme.System">
              <font-awesome-icon :icon="['fas', isLight ? 'sun' : 'moon']" size="xl"/>
              <template #value>
                <font-awesome-icon :icon="['fas', 'a']"/>
              </template>
            </var-badge>
          </var-button>
        </var-tooltip>
        <var-skeleton v-if="authStore.isAuthenticated"
                      avatar :rows="0" class="user-avatar"
                      :loading="authStore.getUserInfo.avatar === undefined">
          <var-menu placement="bottom-start" popover-class="user-menu">
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

.switch-btn {
  width: var(--avatar-small-size);
  height: var(--avatar-small-size);
  background: rgba(0, 0, 0, 0);
}

.user-avatar {
  margin: 0 10px;
  width: var(--avatar-normal-size);
  height: var(--avatar-normal-size);
  --avatar-normal-size: calc(var(--header-bar-height) * 0.7);
  --skeleton-avatar-size: var(--avatar-normal-size);
  --skeleton-content-padding: 0;
}

*, *::before, *::after {
  font-weight: bold;
}
</style>