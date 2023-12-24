<script setup lang="ts">
import {ref, computed} from "vue";
import {useAuthStore, useUsersStore} from "@/store/user";
import type {CommentInfo} from '@/store';
import {doDeleteComment, doDownVote, doUpVote} from "@/services/comment";
import {Snackbar} from "@varlet/ui";
import AvatarCard from "@/components/AvatarCard.vue";
import WriteComment from "@/components/WriteComment.vue";
import router from "@/router";

const props = defineProps<{
  comment: CommentInfo
  getCommentName: (id: number) => string
}>();

defineEmits<{
  created: []
  changed: []
  deleted: []
}>();

const authStore = useAuthStore();
const usersStore = useUsersStore();
const inReply = ref(false);
const inEdition = ref(false);
const inDelete = ref(false);
const isCreator = computed(() => authStore.getUserInfo.id === props.comment.author);

const vote = async () => {
  try {
    let handle = props.comment.is_agreed ? doDownVote : doUpVote;
    const {data} = await handle(props.comment.id!);
    Snackbar.success(data.message);
    props.comment.is_agreed = !props.comment.is_agreed;
    props.comment.agrees = props.comment.is_agreed ? props.comment.agrees! + 1 : props.comment.agrees! - 1;
  } catch (e) {
  }
};

const onDelete = () => {
  doDeleteComment(props.comment.id!).then(() => {
    Snackbar.success('删除成功');
  }).catch();
};

const handleReply = () => {
  if (authStore.isAuthenticated) {
    inReply.value = true;
  } else {
    Snackbar.error('请先登录');
    setTimeout(() => router.push(`/login?url=${location.pathname}`), 1000);
  }
};
</script>

<template>
  <var-skeleton avatar title card :loading="usersStore.getUserInfo(comment.author) == null">
    <AvatarCard :creator-info="usersStore.getUserInfo(comment.author)!" row>
      <template #description>
        <var-space direction="column" style="margin: 10px 10px -30px">
          <p class="pre-wrap">
            <var-link v-if="comment.reply_to" underline="hover"
                      :href="`#comment-${comment.reply_to!}`">
              @{{ getCommentName(comment.reply_to!) }}
            </var-link>
            {{ comment.content }}
          </p>
          <var-space direction="row" align="center">
            <var-button-group mode="text" style="justify-self: end">
              <var-button @click="vote">
                <var-space direction="row" :size="2" align="center">
                  <font-awesome-icon size="lg" :icon="[comment.is_agreed ? 'fas' : 'far', 'thumbs-up']"/>
                  <p>{{ comment.agrees ?? 0 }}</p>
                </var-space>
              </var-button>
              <var-button type="primary" @click="handleReply">回复</var-button>
              <var-button v-if="isCreator" type="primary" @click="inEdition = true">编辑</var-button>
              <var-button v-if="isCreator" type="danger" @click="inDelete = true">删除</var-button>
            </var-button-group>
          </var-space>
        </var-space>
      </template>

      <template #extra>
        <slot/>
      </template>
    </AvatarCard>
  </var-skeleton>

  <var-popup overlay-class="normal-popup-overlay" class="normal-popup-class" v-model:show="inReply">
    <var-paper class="edit-block">
      <h1>回复评论</h1>
      <var-input v-model="comment.content" :placeholder="'@' + getCommentName(comment.id!)" disabled class="edit-input"/>
      <WriteComment :post-id="comment.post_id" :reply-id="comment.id" class="edit-input"
                    @submit="inReply = false; $emit('created')"/>
    </var-paper>
  </var-popup>

  <var-popup v-if="isCreator" overlay-class="normal-popup-overlay" class="normal-popup-class" v-model:show="inEdition">
    <var-paper class="edit-block">
      <h1>编辑评论</h1>
      <WriteComment :comment-id="comment.id" :content="comment.content" class="edit-input"
                    @submit="content => {comment.content = content; inEdition = false; $emit('changed')}"/>
    </var-paper>
  </var-popup>

  <var-popup v-if="isCreator" overlay-class="normal-popup-overlay" class="normal-popup-class" v-model:show="inDelete">
    <var-paper style="padding: 20px; min-width: 360px">
      <h1>删除评论</h1>
      <p style="margin-bottom: 5px;">确定要删除评论吗？</p>
      <var-button-group class="edit-button-group">
        <var-button type="primary" @click="inDelete = false">取消</var-button>
        <var-button type="danger" @click="inDelete = false; onDelete(); $emit('deleted')">确定</var-button>
      </var-button-group>
    </var-paper>
  </var-popup>
</template>

<style scoped src="./css/edit.css"/>