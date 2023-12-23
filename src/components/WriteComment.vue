<script setup lang="ts">
import {ref} from "vue";
import {doCreateComment, doUpdateComment} from "@/services/comment";
import {type Form, Snackbar} from "@varlet/ui";

const props = defineProps<{
  postId?: number
  commentId?: number
  replyId?: number
  content?: string
}>();

const emits = defineEmits<{
  submit: [content: string]
}>();

const form = ref<Form>();
const content = ref(props.content ?? '');

const updateComment = async () => {
  if (!await form.value?.validate()) return;
  try {
    const {data} = props.commentId
        ? await doUpdateComment(props.commentId!, content.value)
        : await doCreateComment(props.postId!, content.value, props.replyId);
    Snackbar.success(data.message);
    emits('submit', content.value);
    content.value = '';
  } catch (e) {}
}
</script>

<template>
  <var-form ref="form">
    <var-input v-model="content" placeholder="评论内容" variant="outlined" textarea
               :rules="[v => v.trim() != '' || '评论不能为空']"/>
    <var-button block type="primary" @click="updateComment" style="margin-top: 10px">回复</var-button>
  </var-form>
</template>

<style scoped>

</style>