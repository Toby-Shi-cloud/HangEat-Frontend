<script setup lang="ts">
import {computed} from 'vue';
import {useAuthStore} from "@/store/user";
import {doGetFansList, doSubscribe} from "@/services/user";
import {Snackbar} from "@varlet/ui";
import UserList from "@/components/UserList.vue";

const props = defineProps<{
  userId: number
}>();

const authStore = useAuthStore();
const isMyself = computed(() => props.userId === authStore.getUserInfo.id);

const subscribe = (id: number) => {
  doSubscribe(id).then(() => {
    Snackbar.success("关注成功！");
    authStore.updateFollowingNum();
  }).catch();
}
</script>

<template>
  <UserList v-if="isMyself" :total="authStore.getFollowersCount" :load="doGetFansList">
    <template #default="{id}">
      <var-button type="primary" size="small" @click="subscribe(id)">回关</var-button>
    </template>
  </UserList>
  <var-result v-else type="error" title="无权访问！"
              description="您无权访问该用户的粉丝列表！">
  </var-result>
</template>

<style scoped>

</style>