<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useAuthStore} from "@/store/user";

defineProps<{
  userId: number
}>();

const authStore = useAuthStore();
const active = ref(0);

const returnToIndex = () => {
  window.location.href = "/";
};

onMounted(() => {
  authStore.updateFollowers().catch();
  authStore.updateFollowing().catch();
});
</script>

<template>
  <main>
    <div v-if="authStore.needRefreshInfo || userId === authStore.getUserInfo.id" id="main-container">
      <var-paper style="grid-column-start: span 3;" :elevation="2" :radius="8">
        <var-skeleton avatar title :rows="5" :avatar-size="120"
                      :loading="authStore.needRefreshInfo">
          <div id="user-profile-header">
            <div style="display: flex">
              <div id="user-profile-main">
                <var-avatar id="user-profile-avatar" :src="authStore.getUserInfo.avatar" :size="120"></var-avatar>
                <var-cell id="user-profile-username" :title="authStore.getUserInfo.username"></var-cell>
                <var-row :gutter="[10, 10]">
                  <var-col :span="8">
                    <var-cell class="user-info-cell" title="贡献" description="0"></var-cell>
                  </var-col>
                  <var-col :span="8">
                    <var-cell class="user-info-cell" title="粉丝"
                              :description="authStore.getFollowersCount.toString()"></var-cell>
                  </var-col>
                  <var-col :span="8">
                    <var-cell class="user-info-cell" title="关注"
                              :description="authStore.getFollowingCount.toString()"></var-cell>
                  </var-col>
                </var-row>
              </div>
            </div>
            <var-button style="top: 30%; width: 90%">编辑资料</var-button>
            <var-tabs class="user-tabs-container" v-model:active="active">
              <var-tab class="user-tab">帖子</var-tab>
              <var-tab class="user-tab">粉丝列表</var-tab>
              <var-tab class="user-tab">关注列表</var-tab>
            </var-tabs>
          </div>
        </var-skeleton>
      </var-paper>

      <var-paper :elevation="2" :radius="8">
        <var-card title="个人信息" style="padding: 0 5px">
          <template #description>
            <var-skeleton :rows="4" :loading="authStore.needRefreshInfo">
              <var-divider/>
              <var-cell icon="email" :title="authStore.getUserInfo.email"></var-cell>
              <var-cell icon="notebook" :title="authStore.getUserInfo.motto"></var-cell>
            </var-skeleton>
          </template>
        </var-card>
      </var-paper>
    </div>
    <var-result v-else type="error" title="不能访问该用户"
                description="您查找的用户不存在或您无权访问！">
      <template #footer>
        <var-button type="primary" @click="returnToIndex()">返回首页</var-button>
      </template>
    </var-result>
  </main>
</template>

<style scoped>
#main-container {
  display: grid;
  gap: 2em;
  grid-template-columns: 1fr 2fr 1fr;
  justify-content: center;
  align-items: center;
  width: 90vw;
  max-width: inherit;
}

#user-profile-header {
  display: grid;
  grid-template-columns: 7fr 1fr;
  grid-template-rows: 3fr 1fr;
}

#user-profile-main {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 1fr 1fr;
}

#user-profile-avatar {
  grid-row-start: span 2;
  margin: 15px;
}

#user-profile-username {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: left;
  padding-left: 40px;
}

.user-info-cell {
  --cell-font-size: 0.8rem;
}

.user-tabs-container {
  grid-column-start: span 2;
  height: 100%;
  width: 100%;
  display: flex;
  background: rgba(0, 0, 0, 0);
}

.user-tab {
  padding: 10px 20px;
}
</style>