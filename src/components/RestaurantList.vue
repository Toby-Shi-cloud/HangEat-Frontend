<script setup lang="ts">
import {ref, reactive, computed, watch} from "vue";
import LazyList from "@/components/LazyList.vue";
import type {RestaurantInfo} from "@/store";
import {doGetRestaurantList, doGetRestaurantNum} from "@/services/restaurant";

const props = withDefaults(defineProps<{
  width?: number
  layout?: 'row' | 'column'
  noExtra?: boolean
  getRestaurantNum: typeof doGetRestaurantNum
  getRestaurantList: typeof doGetRestaurantList
}>(), {
  layout: 'column',
  noExtra: false
});

const emits = defineEmits<{
  changed: [total: number]
}>();

const screenWidth = ref(window.innerWidth);
window.onresize = () => screenWidth.value = window.innerWidth;
const width = computed(() => props.width || screenWidth.value);
const column = computed(() => props.layout == 'row' ? 1 : width.value < 668 ? 1 : width.value < 992 ? 2 : 3);

const total = ref(-1);
const data = reactive<RestaurantInfo[]>([]);
const finished = computed(() => total.value === data.length);
const loading = ref(false);

const load = () => {
  if (finished.value) return;
  if (loading.value) return;
  loading.value = true;
  props.getRestaurantList(data.length, data.length + 20).then(res => {
    data.push(...res.data.list);
    total.value = res.data.all_num;
    emits('changed', total.value);
  }).finally(() => loading.value = false);
};

const toRestaurant = (id: number) => {
  window.location.href = '/restaurant/' + id;
}

watch(() => props.getRestaurantNum, () => {
  total.value = -1;
  data.splice(0, data.length);
  load();
}, {immediate: true});
</script>

<template>
  <LazyList :data="data" :column="column" :finished="finished" :gutter="[10, 10]" @load="load">
    <template #default="{item}">
      <var-card class="restaurant-card" :layout="layout"
                :title="item.name" :src="item.img" @click="toRestaurant(item.id!)">
        <template #description>
          <var-cell :title="item.tags?.join('，') || ''">
            <template #icon>
              <font-awesome-icon :icon="['fas', 'tags']" style="margin-right: 5px"/>
            </template>
          </var-cell>
        </template>
        <template #extra v-if="!noExtra">
          <var-space direction="row" align="center" :size="3">
          <font-awesome-icon :icon="[item.is_collected ? 'fas' : 'far', 'heart']"
                             :color="item.is_collected ? 'red' : ''"/>
          <p>{{ item.collectors_num || 0 }}</p>
          </var-space>
        </template>
      </var-card>
    </template>
  </LazyList>
</template>

<style scoped>
.restaurant-card {
  width: 100%;
  height: 100%;
}
</style>