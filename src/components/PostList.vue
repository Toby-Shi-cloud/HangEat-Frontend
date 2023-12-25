<script setup lang="ts">
import {ref, reactive, computed} from 'vue';
import type {List, PostInfo} from "@/store";
import LazyList from "@/components/LazyList.vue";
import {doGetPostList, doGetPostListByUser} from "@/services/post";
import {useUsersStore} from "@/store/user";
import PostCard from "@/components/PostCard.vue";
import screen from "@/components/ts/screen";

const props = defineProps<{
  restaurantId?: number
  userId?: number
  width?: number
}>();

const emits = defineEmits<{
  changed: [total: number]
}>();

if (!props.restaurantId && !props.userId) {
  throw new Error('restaurantId 和 userId 不能同时为空');
}

const usersStore = useUsersStore();
const total = ref(-1);
const postData = reactive<PostInfo[]>([]);
const finished = computed(() => postData.length === total.value);

const width = computed(() => props.width || screen.width.value);
const column = computed(() => width.value < 866 ? 1 : width.value < 1280 ? 2 : width.value < 1720 ? 3 : 4);

const load = async () => {
  if (finished.value) return;
  const response = props.restaurantId
      ? await doGetPostList(props.restaurantId, postData.length, postData.length + column.value * 3)
      : await doGetPostListByUser(props.userId!, postData.length, postData.length + column.value * 3);
  const data = response.data as List<PostInfo>;
  postData.push(...data.list);
  total.value = data.all_num;
  emits('changed', total.value);
  data.list.forEach(item => {
    usersStore.fetchUserInfo(item.creator!).catch();
  });
};

const refresh = () => {
  postData.splice(0, postData.length);
  total.value = -1;
};

defineExpose({refresh});
</script>

<template>
  <LazyList :data="postData" :finished="finished" :column="column" :gutter="[10, 10]" :load="load">
    <template #default="{item}">
      <var-paper :elevation="true" :radius="8" class="post-paper">
        <PostCard :post="item"/>
      </var-paper>
    </template>
  </LazyList>
</template>

<style scoped>
.post-paper {
  padding: 10px 10px 0;
  width: 100%;
  height: 100%;
}
</style>