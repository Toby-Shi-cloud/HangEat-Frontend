<script setup lang="ts">
import {ref, reactive, computed} from 'vue';
import type {List, PostInfo} from "@/store";
import LazyList from "@/components/LazyList.vue";
import {doGetPostList} from "@/services/post";
import {useUsersStore} from "@/store/user";
import PostCard from "@/components/PostCard.vue";

const props = defineProps<{
  restaurantId: number
}>();

const usersStore = useUsersStore();
const total = ref(-1);
const postData = reactive<PostInfo[]>([]);
const finished = computed(() => postData.length === total.value);

const screenWidth = ref(window.innerWidth);
window.onresize = () => screenWidth.value = window.innerWidth;
const column = computed(() => screenWidth.value < 866 ? 1 : screenWidth.value < 1280 ? 2 : 3);

const load = async () => {
  if (finished.value) return;
  const response = await doGetPostList(props.restaurantId, postData.length, postData.length + column.value * 3);
  const data = response.data as List<PostInfo>;
  postData.push(...data.list);
  total.value = data.all_num;
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