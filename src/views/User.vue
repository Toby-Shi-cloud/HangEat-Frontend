<script setup lang="ts">
import {ref, computed, onMounted} from "vue";
import {useAuthStore} from "@/store/user";
import ChangeUserInfo from "@/components/ChangeUserInfo.vue";
import ChangePassword from "@/components/ChangePassword.vue";

const props = defineProps<{
  id: string
}>();
const userId = /^\d+$/.test(props.id) ? parseInt(props.id) : undefined;

const authStore = useAuthStore();
const activeTab = ref(0);
const editInfo = ref(false);
const editPassword = ref(false);

const isMyself = computed(() => !!userId && userId === authStore.getUserInfo.id);

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
    <var-result v-if="userId === undefined" type="error" title="非法用户ID"
                description="您查找的用户ID非法！">
      <template #footer>
        <var-button type="primary" @click="returnToIndex()">返回首页</var-button>
      </template>
    </var-result>
    <div v-else-if="authStore.needRefreshInfo || isMyself" id="main-container">
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
            <div>
              <var-button style="top: 20%; width: 90%" @click="editInfo = true">编辑资料</var-button>
              <var-button style="top: 30%; width: 90%" @click="editPassword = true">更改密码</var-button>
            </div>
            <var-tabs class="user-tabs-container" v-model:active="activeTab">
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
              <pre class="var-cell">{{ authStore.getUserInfo.motto }}</pre>
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
  <var-popup overlay-class="normal-popup-overlay"
             style="border-radius: 8px"
             v-model:show="editInfo">
    <ChangeUserInfo @close="editInfo = false"/>
  </var-popup>
  <var-popup overlay-class="normal-popup-overlay"
             style="border-radius: 8px"
             v-model:show="editPassword">
    <ChangePassword @close="editPassword = false"/>
  </var-popup>
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
  padding-left: 10px;
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