<script setup lang="ts">
import {computed} from 'vue';
import type {UserInfo} from "@/store";
import {useAuthStore} from "@/store/user";
import {doGetSubscribersList, doSubscribe, doUnsubscribe} from "@/services/user";
import {Snackbar} from "@varlet/ui";
import UserList from "@/components/UserList.vue";

const props = defineProps<{
  userId: number
}>();

const authStore = useAuthStore();
const isMyself = computed(() => props.userId === authStore.getUserInfo.id);

const subscribe = (id: number, item: UserInfo) => {
  doSubscribe(id).then(() => {
    Snackbar.success("关注成功！");
    authStore.updateSubscriptionsNum();
    item.is_mutual = true;
  }).catch();
}

const unsubscribe = (id: number, item: UserInfo) => {
  doUnsubscribe(id).then(() => {
    Snackbar.success("取关成功！");
    authStore.updateSubscriptionsNum();
    item.is_mutual = false;
  }).catch();
}
</script>

<template>
  <UserList v-if="isMyself" :total="authStore.getUserInfo.subscribers_num!" :load="doGetSubscribersList">
    <template #default="{id, item}">
      <var-menu v-if="item.is_mutual" trigger="hover">
        <var-button type="success" size="small">已互关</var-button>
        <template #menu>
          <var-button type="danger" size="small" @click="unsubscribe(id, item)">取消关注</var-button>
        </template>
      </var-menu>
      <var-button v-else type="primary" size="small" @click="subscribe(id, item)">√ 关注</var-button>
    </template>
  </UserList>
  <var-result v-else type="error" title="无权访问！"
              description="您无权访问该用户的粉丝列表！">
  </var-result>
</template>

<style scoped>

</style>