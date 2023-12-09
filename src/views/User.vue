<script setup lang="ts">
import {ref, computed, onMounted} from "vue";
import {useAuthStore} from "@/store/user";
import {Snackbar} from "@varlet/ui";
import {setAppStyle} from "@/components/themes";

const authStore = useAuthStore();
const userInfo = computed(() => authStore.getUserInfo);

const active = ref(0);

onMounted(() => {
  authStore.updateFollowers().catch(() => {
    Snackbar.error("获取粉丝列表失败");
  });
  authStore.updateFollowing().catch(() => {
    Snackbar.error("获取关注列表失败");
  });
});

setAppStyle("user");
</script>

<template>
  <main>
    <var-paper id="user-profile-header" :elevation="2" :radius="8">
      <div style="display: flex">
        <div id="user-profile-main">
          <var-avatar id="user-profile-avatar" :src="userInfo.avatar" :size="120"></var-avatar>
          <var-cell id="user-profile-username" :title="userInfo.username"></var-cell>
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
        <var-tab class="user-tab">选项1</var-tab>
        <var-tab class="user-tab">选项22</var-tab>
        <var-tab class="user-tab">选项333</var-tab>
        <var-tab class="user-tab">选项4444</var-tab>
        <var-tab class="user-tab">选项55555</var-tab>
      </var-tabs>
    </var-paper>
    <var-paper :elevation="2" :radius="8">
      <var-card title="个人信息" style="padding: 0 5px">
        <template #description>
          <var-divider/>
          <var-cell icon="email" :title="userInfo.email"></var-cell>
          <var-cell icon="notebook" :title="userInfo.motto"></var-cell>
        </template>
      </var-card>
    </var-paper>
  </main>
</template>

<style scoped>
main {
  display: grid;
  gap: 2em;
  grid-template-columns: 1fr 2fr 1fr;
  justify-content: center;
  align-items: center;
  width: 90vw;
}

#user-profile-header {
  grid-column-start: span 3;
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