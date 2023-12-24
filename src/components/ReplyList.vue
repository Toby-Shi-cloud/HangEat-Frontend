<script setup lang="ts">
import {ref} from "vue";
import type {CommentInfo} from "@/store";
import CommentCard from "@/components/CommentCard.vue";
import os from "./ts/os";

const props = defineProps<{
  replies: CommentInfo[]
  getCommentName: (id: number) => string
  last?: boolean
}>();

defineEmits<{
  refresh: []
}>();

const current = ref(1);
const pageSize = ref(5);

const onDelete = (id: number) => {
  props.replies.splice(props.replies.findIndex(item => item.id === id), 1);
}

const pageToLast = () => {
  current.value = Math.ceil(props.replies.length / pageSize.value);
  console.log(current.value);
}

if (props.last) pageToLast();
</script>

<template>
  <var-space direction="column" style="width: 100%">
    <var-paper v-for="reply in replies.slice((current - 1) * pageSize, current * pageSize)"
               :elevation="true" :radius="8">
      <CommentCard :comment="reply" :get-comment-name="getCommentName"
                   @created="$emit('refresh')" @deleted="onDelete(reply.id!)"/>
    </var-paper>
    <var-pagination v-model:current="current" v-model:size="pageSize" :size-option="[5, 10, 20, 50]"
                    :total="replies.length" :simple="!os.isPhone" :show-total="v => os.isPhone ? '' : `共 ${v} 条`"/>
  </var-space>
</template>

<style scoped>

</style>