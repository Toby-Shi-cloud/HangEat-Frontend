<script setup lang="ts">
import {ref, reactive, computed} from 'vue';
import type {List, PostInfo} from "@/store";
import LazyList from "@/components/LazyList.vue";
import {doDownVote, doGetPostList, doUpVote} from "@/services/post";
import {useUsersStore} from "@/store/user";
import {Snackbar} from "@varlet/ui";
import router from "@/router";

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
  const response = await doGetPostList(props.restaurantId, postData.length, postData.length + 10);
  const data = response.data as List<PostInfo>;
  postData.push(...data.list);
  total.value = data.all_num;
  data.list.forEach(item => {
    usersStore.fetchUserInfo(item.id!).catch();
  });
};

const vote = async (post: PostInfo) => {
  try {
    let handle = post.is_agreed ? doDownVote : doUpVote;
    const {data} = await handle(post.id!);
    Snackbar.success(data.message);
    post.is_agreed = !post.is_agreed;
    post.agrees = post.is_agreed ? post.agrees! + 1 : post.agrees! - 1;
  } catch (e) {}
};

const toUser = (id: number) => {
  router.push(`/user/${id}`);
};
</script>

<template>
  <LazyList :data="postData" :finished="finished" :column="column" :gutter="[10, 10]" :load="load">
    <template #default="{item}">
      <var-paper :elevation="true" :radius="8" class="post-paper">
        <var-skeleton avatar title card :loading="usersStore.getUserInfo(item.creator) == null" class="post-block">
          <var-space direction="row" style="display: grid; grid-template-columns: 1fr auto">
            <var-space direction="column" align="center" :size="5" style="height: 100%">
              <var-avatar :src="usersStore.getUserInfo(item.creator)?.avatar" hoverable
                          @click="toUser(usersStore.getUserInfo(item.creator)?.id!)"/>
              <var-link underline="hover" :to="`/user/${usersStore.getUserInfo(item.creator)?.id!}`">
                <p>{{ usersStore.getUserInfo(item.creator)?.username }}</p>
              </var-link>
            </var-space>
            <var-card :elevation="false">
              <template #title>
                <var-link style="margin: 0 10px" :to="`/post/${item.id!}`">
                  <h2>{{ item.title! }}</h2>
                </var-link>
              </template>

              <template #image>
                <var-image :src="item.image" lazy fit="scale-down"/>
              </template>

              <template #subtitle>
                <var-space direction="row" align="center" style="margin: 0 10px">
                  <p v-if="item.avg_price">人均：¥{{ item.avg_price }}</p>
                  <var-space v-if="item.grade" direction="row" :size="2" align="center">
                    <p>评分：</p>
                    <font-awesome-icon
                        v-for="i in Array(5).keys()"
                        :icon="[item.grade! > i ? 'fas' : 'far', 'star']"/>
                  </var-space>
                </var-space>
              </template>

              <template #description>
                <var-space direction="column" style="margin: 0 10px;">
                  <var-ellipsis v-if="item.content" :line-clamp="3" class="pre-wrap">
                    {{ item.content }}
                  </var-ellipsis>
                  <var-space direction="row" :size="2" align="center">
                    <font-awesome-icon size="lg" :icon="[item.is_agreed ? 'fas' : 'far', 'thumbs-up']"
                                       @click="vote(item)"/>
                    <p>{{ item.agrees || 0 }}</p>
                  </var-space>
                </var-space>
              </template>
            </var-card>
          </var-space>
        </var-skeleton>
      </var-paper>
    </template>
  </LazyList>
</template>

<style scoped>
.post-block {
  width: 100%;
  height: 100%;
}

.post-paper {
  padding: 10px 10px 0;
  width: 100%;
  height: 100%;
}
</style>