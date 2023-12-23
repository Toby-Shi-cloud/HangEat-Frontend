<script setup lang="ts">
import {ref} from "vue";
import type {PostInfo} from "@/store";
import {useUsersStore} from "@/store/user";
import {doDeletePost, doGetPostDetail} from "@/services/post";
import PostCard from "@/components/PostCard.vue";
import {Snackbar} from "@varlet/ui";
import router from "@/router";

const props = defineProps<{
  id: string
}>();

const postId = /^\d+$/.test(props.id) ? parseInt(props.id) : undefined;
const post = ref<PostInfo>({});
const error = ref(postId === undefined);
const usersStore = useUsersStore();

const refreshInfo = () => {
  if (postId === undefined) return;
  doGetPostDetail(postId).then(async res => {
    post.value = res.data;
    await usersStore.fetchUserInfo(post.value.creator!);
  }).catch(() => {
    error.value = true;
  });
};
refreshInfo();

const deletePost = async () => {
  if (postId === undefined) return;
  try {
    const {data} = await doDeletePost(postId);
    Snackbar.success(data.message);
    setTimeout(() => router.push(`/restaurant/${post.value.restaurant!}`), 1000);
  } catch (e) {}
};
</script>

<template>
  <var-result v-if="error" type="error" title="帖子不存在" description="请检查链接是否正确"/>
  <main v-else>
    <var-paper :elevation="true" :radius="8" class="post-paper">
      <PostCard :post-info="post" @changed="refreshInfo" @deleted="deletePost">
      </PostCard>
    </var-paper>
  </main>
</template>

<style scoped>
.post-paper {
  width: 90vw;
  max-width: inherit;
  padding: 2rem;
}
</style>