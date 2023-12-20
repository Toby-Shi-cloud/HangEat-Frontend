<script setup lang="ts">
import {computed} from 'vue';
import type {UserInfo} from "@/store";
import {useAuthStore} from "@/store/user";
import {doGetSubscriptionsList, doUnsubscribe} from "@/services/user";
import {Snackbar} from "@varlet/ui";
import UserList from "@/components/UserList.vue";

const props = defineProps<{
  userId: number
}>();

const authStore = useAuthStore();
const isMyself = computed(() => props.userId === authStore.getUserInfo.id);

const unsubscribe = (id: number, data: UserInfo[]) => {
  doUnsubscribe(id).then(() => {
    Snackbar.success("取关成功！");
    data.splice(data.findIndex(item => item.id === id), 1);
    authStore.updateSubscriptionsNum();
  }).catch();
}
</script>

<template>
  <UserList v-if="isMyself" :total="authStore.getUserInfo.subscriptions_num!" :load="doGetSubscriptionsList">
    <template #default="{id, item, data}">
      <var-menu trigger="hover">
        <var-button v-if="item.is_mutual" type="success" size="small">已互关</var-button>
        <var-button v-else type="primary" size="small">已关注</var-button>
        <template #menu>
          <var-button type="danger" size="small" @click="unsubscribe(id, data)">取消关注</var-button>
        </template>
      </var-menu>
    </template>
  </UserList>
  <var-result v-else type="error" title="无权访问！"
              description="您无权访问该用户的关注列表！">
  </var-result>
</template>

<style scoped>

</style>