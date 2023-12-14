<script setup lang="ts">
import {computed} from 'vue';
import {useAuthStore, type UserInfo} from "@/store/user";
import {doGetSubscribesList, doUnsubscribe} from "@/services/user";
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
    authStore.updateFollowingNum();
  }).catch();
}
</script>

<template>
  <UserList v-if="isMyself" :total="authStore.getFollowingCount" :load="doGetSubscribesList">
    <template #default="{id, data}">
      <var-button type="primary" size="small" @click="unsubscribe(id, data)">取消关注</var-button>
    </template>
  </UserList>
  <var-result v-else type="error" title="无权访问！"
              description="您无权访问该用户的关注列表！">
  </var-result>
</template>

<style scoped>

</style>