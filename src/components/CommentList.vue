<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {useUsersStore} from "@/store/user";
import type {CommentInfo, List} from "@/store";
import {doGetCommentList} from "@/services/comment";
import LazyList from "@/components/LazyList.vue";
import CommentCard from "@/components/CommentCard.vue";
import ReplyList from "@/components/ReplyList.vue";

const props = defineProps<{
  postId: number
}>();

const usersStore = useUsersStore();
const total = ref(-1);
const comments = reactive<CommentInfo[]>([]);
const finished = computed(() => comments.length === total.value);
const nameMap = reactive(new Map<number, string>());
const lastLoad = ref(-1);

const initCommentInfo = async (list: CommentInfo[]) => {
  for (const item of list) {
    item.post_id = props.postId;
    const user = await usersStore.fetchUserInfo(item.author!);
    nameMap.set(item.id!, user.username!);
    await initCommentInfo(item.replies ?? []);
  }
};

const load = async () => {
  if (finished.value) return;
  const response = await doGetCommentList(props.postId, comments.length, comments.length + 10);
  const data = response.data as List<CommentInfo>;
  comments.push(...data.list);
  total.value = data.all_num;
  await initCommentInfo(data.list);
};

const reload = (id: number) => {
  const index = comments.findIndex(item => item.id === id);
  if (index === -1) return;
  doGetCommentList(props.postId, index, index + 1).then(res => {
    const data = res.data as List<CommentInfo>;
    comments.splice(index, 1, data.list[0]);
    lastLoad.value = id;
    initCommentInfo(data.list);
  }).catch();
};

const getCommentName = (id: number) => nameMap.get(id) ?? '';

const onDelete = (id: number) => {
  comments.splice(comments.findIndex(item => item.id === id), 1);
  refreshNum();
}

const refresh = () => {
  comments.splice(0, comments.length);
  total.value = -1;
};

const refreshNum = () => {
  total.value = -1;
};

defineExpose({refresh, refreshNum});
</script>

<template>
  <LazyList :data="comments" :load="load" :finished="finished" :gutter="[10, 10]">
    <template #default="{item}">
      <var-paper :elevation="true" :radius="8" width="100%" style="padding: 10px">
        <CommentCard :comment="item" :get-comment-name="getCommentName"
                     @created="reload(item.id!)" @deleted="onDelete(item.id!)">
          <ReplyList :get-comment-name="getCommentName" :replies="item.replies ?? []"
                     :last="lastLoad === item.id" style="margin-top: 5px" @refresh="reload(item.id!)"/>
        </CommentCard>
      </var-paper>
    </template>
  </LazyList>
</template>

<style scoped>

</style>