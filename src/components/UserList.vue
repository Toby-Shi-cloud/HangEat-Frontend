<script setup lang="ts">
import {reactive, computed} from 'vue';
import LazyList from "@/components/LazyList.vue";
import {type UserInfo} from "@/store/user";

const props = defineProps<{
  total: number
  load: (from: number, to: number) => Promise<any>
}>();

const data = reactive<UserInfo[]>([]);
const finished = computed(() => data.length === props.total);

const load = () => {
  if (finished.value) return;
  props.load(data.length, data.length + 20).then(res => {
    data.push(...res.data.list);
  }).catch();
};

const toUser = (id: number) => {
  window.open(`/user/${id}`);
}
</script>

<template>
  <LazyList :data="data" :finished="finished" @load="load">
    <template #default="{item}">
      <div style="display: block; width: 100%">
        <var-cell :description="item.motto" style="height: 80px">
          <var-link underline="hover" @click="toUser(item.id)">{{ item.username }}</var-link>
          <template #icon>
            <var-avatar :src="item.avatar" style="margin-right: 8px" :hoverable="true" @click="toUser(item.id)"/>
          </template>
          <template #extra>
            <slot :data="data" :id="item.id"></slot>
          </template>
        </var-cell>
        <var-divider/>
      </div>
    </template>
  </LazyList>
</template>

<style scoped>

</style>