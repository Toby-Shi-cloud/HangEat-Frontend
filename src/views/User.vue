<script setup lang="ts">
import {ref, computed, watch, type ComponentPublicInstance} from "vue";
import type {UserInfo} from "@/store";
import {useAuthStore, useUsersStore} from "@/store/user";
import ChangeUserInfo from "@/components/ChangeUserInfo.vue";
import ChangePassword from "@/components/ChangePassword.vue";
import {
  doDelete, doGetFavorableRestaurantsList,
  doGetFavorableRestaurantsNum,
  doGetRelationBetween,
  doSubscribe,
  doUnsubscribe
} from "@/services/user";
import {doGetPostNumByUser} from "@/services/post";
import {type Input, Snackbar} from "@varlet/ui";
import Subscribers from "@/components/Subscribers.vue";
import Subscriptions from "@/components/Subscriptions.vue";
import RestaurantList from "@/components/RestaurantList.vue";
import PostList from "@/components/PostList.vue";
import router from "@/router";

const props = defineProps<{
  id: string
}>();
const userId = /^\d+$/.test(props.id) ? parseInt(props.id) : undefined;

const authStore = useAuthStore();
const usersStore = useUsersStore();
const activeTab = ref(0);
const editInfo = ref(false);
const editPassword = ref(false);
const deletingAccount = ref(false);
const deletingInputString = ref("");
const deletingInput = ref<Input | null>(null);

const isMyself = computed(() => !!userId && userId === authStore.getUserInfo.id);

const userInfoWithId = ref<UserInfo>({});
const userInfo = computed(() => isMyself.value ? authStore.getUserInfo : userInfoWithId.value);
const needRefreshInfo = computed(() => userInfo.value.id === undefined);
const failedToGetUserInfo = ref(false);
const isSubscription = ref(false);
const isSubscriber = ref(false);
const restaurantListRef = ref<ComponentPublicInstance | null>(null);
const restaurantListWidth = computed(() => restaurantListRef.value?.$el.width || 0);
const restaurantListTotal = ref(0);
const postListRef = ref<ComponentPublicInstance | null>(null);
const postListWidth = computed(() => restaurantListRef.value?.$el.width || 0);
const postListTotal = ref(0);

const refreshInfo = () => {
  if (userId !== undefined) {
    usersStore.fetchUserInfo(userId, true).then(data => {
      userInfoWithId.value = data;
    }).catch(() => {
      failedToGetUserInfo.value = true;
    });
    if (authStore.isAuthenticated) {
      doGetRelationBetween(authStore.getUserInfo.id!, userId).then(res => {
        isSubscription.value = res.data['1subscribe2'];
        isSubscriber.value = res.data['2subscribe1'];
      }).catch();
    }
    doGetPostNumByUser(userId).then(res => {
      postListTotal.value = res.data.post_num;
    }).catch();
    watch(isMyself, () => {
      if (isMyself.value) doGetFavorableRestaurantsNum().then(res => {
        restaurantListTotal.value = res.data.collections_num;
      }).catch();
    });
  }
};
refreshInfo();

function subscribe() {
  doSubscribe(userId!).then(() => {
    Snackbar.success("关注成功！");
    refreshInfo();
  }).catch();
}

function unsubscribe() {
  doUnsubscribe(userId!).then(() => {
    Snackbar.success("取关成功！");
    refreshInfo();
  }).catch();
}

async function deleteAccount() {
  if (await (deletingInput.value as Input).validate()) {
    doDelete().then(() => {
      authStore.logout();
      localStorage.removeItem('_token');
      localStorage.removeItem('_refresh_token');
      Snackbar.success("账号已删除！");
      setTimeout(() => router.push('/'), 2000);
    }).catch();
  }
}
</script>

<template>
  <main>
    <var-result v-if="userId === undefined" type="error" title="非法用户ID"
                description="您查找的用户ID非法！">
      <template #footer>
        <var-button type="primary" @click="$router.push('/')">返回首页</var-button>
      </template>
    </var-result>
    <div v-else-if="!failedToGetUserInfo" id="main-container">
      <var-paper style="grid-column-start: span 3;" :elevation="2" :radius="8">
        <var-skeleton avatar title :rows="5" :avatar-size="120" :loading="needRefreshInfo">
          <div id="user-profile-header">
            <div style="display: flex">
              <div id="user-profile-main">
                <var-avatar id="user-profile-avatar" :src="userInfo.avatar" :size="120"/>
                <var-cell id="user-profile-username" :title="userInfo.username"/>
                <var-row :gutter="[10, 10]">
                  <var-col :span="isMyself ? 6 : 8">
                    <var-cell class="user-info-cell" title="贡献"
                              :description="`${postListTotal}`"/>
                  </var-col>
                  <var-col :span="isMyself ? 6 : 8">
                    <var-cell class="user-info-cell" title="粉丝"
                              :description="userInfo.subscribers_num!.toString()"/>
                  </var-col>
                  <var-col :span="isMyself ? 6 : 8">
                    <var-cell class="user-info-cell" title="关注"
                              :description="userInfo.subscriptions_num!.toString()"/>
                  </var-col>
                  <var-col :span="isMyself ? 6 : 0">
                    <var-cell class="user-info-cell" title="收藏"
                              :description="`${restaurantListTotal}`"/>
                  </var-col>
                </var-row>
              </div>
            </div>
            <div v-if="isMyself">
              <var-button style="top: 20%; width: 90%" @click="editInfo = true">编辑资料</var-button>
              <var-button style="top: 30%; width: 90%" @click="editPassword = true">更改密码</var-button>
            </div>
            <div v-else>
              <var-menu v-if="isSubscription" style="top: 30%; width: 90%; position: relative" trigger="hover"
                        same-width>
                <var-button v-if="isSubscriber" type="success" style="width: 100%">已互关</var-button>
                <var-button v-else type="primary" style="width: 100%">已关注</var-button>
                <template #menu>
                  <var-button block type="danger" @click="unsubscribe">取消关注</var-button>
                </template>
              </var-menu>
              <var-button
                  style="top: 30%; width: 90%" v-else @click="subscribe"
                  :disabled="!authStore.isAuthenticated">
                {{ isSubscriber ? "回关" : "关注" }}
              </var-button>
            </div>
            <var-tabs class="user-tabs-container" v-model:active="activeTab">
              <var-tab class="user-tab">帖子</var-tab>
              <var-tab v-if="isMyself" class="user-tab">粉丝列表</var-tab>
              <var-tab v-if="isMyself" class="user-tab">关注列表</var-tab>
              <var-tab v-if="isMyself" class="user-tab">收藏的餐馆</var-tab>
            </var-tabs>
          </div>
        </var-skeleton>
      </var-paper>

      <var-paper :elevation="2" :radius="8" style="align-self: start">
        <var-card title="个人信息" style="padding: 0 5px">
          <template #description>
            <var-skeleton :rows="4" :loading="needRefreshInfo">
              <var-divider/>
              <var-cell v-if="userInfo.email" icon="email">
                <var-link underline="hover" :href="`mailto: ${userInfo.email}`">{{ userInfo.email }}</var-link>
              </var-cell>
              <div class="var-cell pre-wrap">{{ userInfo.motto }}</div>
            </var-skeleton>
          </template>
        </var-card>
      </var-paper>

      <var-paper :radius="8" :elevation="2" style="align-self: start; grid-column-start: span 2">
        <var-tabs-items v-model:active="activeTab">
          <var-tab-item>
            <PostList class="post-list" style="margin: 10px 10px 0"
                      :user-id="userId!" :width="postListWidth" ref="postListRef"
                      @changed="total => postListTotal = total"/>
          </var-tab-item>
          <var-tab-item v-if="isMyself">
            <Subscribers :userId="userId"/>
          </var-tab-item>
          <var-tab-item v-if="isMyself">
            <Subscriptions :userId="userId"/>
          </var-tab-item>
          <var-tab-item v-if="isMyself">
            <RestaurantList class="restaurant-list" style="margin: 10px 10px 0"
                            no-extra :width="restaurantListWidth" ref="restaurantListRef"
                            @changed="total => restaurantListTotal = total"
                            :get-restaurant-num="doGetFavorableRestaurantsNum"
                            :get-restaurant-list="doGetFavorableRestaurantsList"/>
          </var-tab-item>
        </var-tabs-items>
      </var-paper>
    </div>
    <var-result v-else type="error" title="不能访问该用户"
                description="您查找的用户不存在或您无权访问！">
      <template #footer>
        <var-button type="primary" @click="$router.push('/')">返回首页</var-button>
      </template>
    </var-result>
  </main>
  <footer v-if="isMyself" id="app-footer">
    <div style="display: inline-grid; place-items: center; width: 100%">
      <var-link type="danger" @click="deletingAccount = true" style="place-self: center">永久删除账号</var-link>
    </div>
  </footer>
  <var-popup overlay-class="normal-popup-overlay"
             class="normal-popup-class"
             v-model:show="editInfo">
    <ChangeUserInfo @close="editInfo = false"/>
  </var-popup>
  <var-popup overlay-class="normal-popup-overlay"
             class="normal-popup-class"
             v-model:show="editPassword">
    <ChangePassword @close="editPassword = false"/>
  </var-popup>
  <var-popup overlay-class="normal-popup-overlay"
             class="normal-popup-class"
             v-model:show="deletingAccount"
             @closed="deletingInput?.reset()">
    <var-result type="warning" title="永久删除账号" description="您确定要永久删除账号吗？">
      <template #image>
        <font-awesome-icon
            :icon="['fas', 'circle-exclamation']"
            style="color: var(--color-danger); width: 72px; height: 72px"/>
      </template>
      <template #footer>
        <var-form>
          <var-input
              ref="deletingInput"
              v-model="deletingInputString"
              placeholder="请输入：“我确定删除账号”"
              :validate-trigger="[]"
              :rules="[v => v === '我确定删除账号' || '输入内容错误']"
              style="margin-top: -20px"
          />
          <var-button block type="danger" @click="deleteAccount" style="margin-top: 5px">确定删除</var-button>
        </var-form>
      </template>
    </var-result>
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