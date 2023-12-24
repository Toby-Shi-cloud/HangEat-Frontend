<script setup lang="ts">
import {ref, computed} from "vue";
import {useAuthStore, useUsersStore} from "@/store/user";
import type {PostInfo} from "@/store";
import {doDownVote, doUpVote} from "@/services/post";
import {Snackbar} from "@varlet/ui";
import AvatarCard from "@/components/AvatarCard.vue";
import RichTextEditor from "@/components/RichTextEditor.vue";
import WriteReview from "@/components/WriteReview.vue";

const props = defineProps<{
  post: PostInfo;
}>();

defineEmits<{
  changed: []
  deleted: []
}>();

const authStore = useAuthStore();
const usersStore = useUsersStore();
const inEdition = ref(false);
const inDelete = ref(false);
const isDetail = computed(() => props.post.restaurant !== undefined);
const isCreator = computed(() => authStore.getUserInfo.id === props.post.creator);

const vote = async (post: PostInfo) => {
  try {
    let handle = post.is_agreed ? doDownVote : doUpVote;
    const {data} = await handle(post.id!);
    Snackbar.success(data.message);
    post.is_agreed = !post.is_agreed;
    post.agrees = post.is_agreed ? post.agrees! + 1 : post.agrees! - 1;
  } catch (e) {}
};
</script>

<template>
  <var-skeleton avatar title card :loading="usersStore.getUserInfo(post.creator) == null">
    <AvatarCard :creator-info="usersStore.getUserInfo(post.creator)!">
      <template #title>
        <h1 v-if="isDetail" style="margin: 10px; font-size: 40px;">{{ post.title! }}</h1>
        <var-link v-else underline="hover" style="margin: 0 10px" :to="`/post/${post.id!}`">
          <h2>{{ post.title! }}</h2>
        </var-link>
      </template>

      <template #image>
        <var-image :radius="6" :src="post.image" fit="scale-down" class="card-image"
                   @click="$router.push(`/post/${post.id!}`)"/>
      </template>

      <template #subtitle>
        <var-space direction="row" align="center" style="margin: 0 10px">
          <p v-if="post.avg_price">人均：¥{{ post.avg_price }}</p>
          <var-space v-if="post.grade" direction="row" :size="2" align="center">
            <p>评分：</p>
            <font-awesome-icon
                v-for="i in Array(5).keys()"
                :icon="[post.grade! > i ? 'fas' : 'far', 'star']"/>
          </var-space>
          <p v-if="post.date">创建时间：{{ new Date(post.date!).toLocaleString() }}</p>
        </var-space>
      </template>

      <template #description>
        <var-space direction="column" style="margin: 0 10px">
          <RichTextEditor v-if="isDetail" v-model:content="post.content" read-only toolbar="#toolbar"/>
          <div style="display: grid; grid-template-columns: auto auto; align-items: center">
            <var-space direction="row" :size="2" align="center">
              <font-awesome-icon size="lg" :icon="[post.is_agreed ? 'fas' : 'far', 'thumbs-up']"
                                 @click="vote(post)"/>
              <p>{{ post.agrees || 0 }}</p>
            </var-space>
            <var-button-group v-if="isDetail" mode="outline" type="primary" style="justify-self: end">
              <var-button v-if="isCreator" type="danger" @click="inDelete = true">删除</var-button>
              <var-button v-if="isCreator" @click="inEdition = true">编辑</var-button>
              <var-button @click="$router.push(`/restaurant/${post.restaurant}`)">前往对应餐馆信息页</var-button>
            </var-button-group>
          </div>
        </var-space>
      </template>
    </AvatarCard>
  </var-skeleton>
  <div id="toolbar" style="display: none"/>

  <var-popup v-if="isCreator" overlay-class="normal-popup-overlay" class="normal-popup-class" v-model:show="inEdition">
    <var-paper style="padding: 20px">
      <h1>编辑帖子</h1>
      <WriteReview :restaurant-id="post.restaurant!" :post-info="post"
                   @submit="inEdition = false; $emit('changed')"/>
    </var-paper>
  </var-popup>

  <var-popup v-if="isCreator" overlay-class="normal-popup-overlay" class="normal-popup-class" v-model:show="inDelete">
    <var-paper style="padding: 20px; min-width: 360px">
      <h1>删除帖子</h1>
      <p style="margin-bottom: 5px;">确定要删除帖子吗？</p>
      <var-button-group class="edit-button-group">
        <var-button type="primary" @click="inDelete = false">取消</var-button>
        <var-button type="danger" @click="inDelete = false; $emit('deleted')">确定</var-button>
      </var-button-group>
    </var-paper>
  </var-popup>
</template>

<style scoped src="./css/edit.css"/>

<style scoped>
.card-image {
  max-height: 40vh;
  margin: auto auto 10px;
}
</style>