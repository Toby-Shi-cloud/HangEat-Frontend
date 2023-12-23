<script setup lang="ts">
import {reactive, computed, watch} from 'vue';
import LazyList from "@/components/LazyList.vue";
import {type UserInfo} from "@/store";

const props = defineProps<{
  total: number
  load: (from: number, to: number) => Promise<any>
}>();

const data = reactive<UserInfo[]>([]);
const finished = computed(() => data.length === props.total);

watch(() => props.total, () => {
  props.load(0, 1).then(res => {
    if (data.length === 0) return;
    if (res.data.list[0].id != data[0].id) {
      data.splice(0, data.length);
      data.push(...res.data.list);
    }
  }).catch();
});

const load = async () => {
  if (finished.value) return;
  const res = await props.load(data.length, data.length + 10);
  data.push(...res.data.list);
};

const toUser = (id: number) => {
  window.open(`/user/${id}`);
}
</script>

<template>
  <LazyList :data="data" :finished="finished" :load="load">
    <template #default="{item}">
      <div style="display: block; width: 100%">
        <var-cell :description="item.motto" style="height: 80px">
          <var-link underline="hover" @click="toUser(item.id!)">{{ (item as UserInfo).username }}</var-link>
          <template #icon>
            <var-avatar :src="item.avatar" style="margin-right: 8px" :hoverable="true" @click="toUser(item.id!)"/>
          </template>
          <template #extra>
            <slot :data="data" :item="item" :id="item.id!"></slot>
          </template>
        </var-cell>
        <var-divider/>
      </div>
    </template>
  </LazyList>
</template>

<style scoped>

</style>