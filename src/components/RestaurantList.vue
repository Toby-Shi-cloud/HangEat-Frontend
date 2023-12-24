<script setup lang="ts">
import {ref, reactive, computed, watch} from "vue";
import LazyList from "@/components/LazyList.vue";
import type {List, RestaurantInfo} from "@/store";

const props = withDefaults(defineProps<{
  width?: number
  layout?: 'row' | 'column'
  noExtra?: boolean
  getRestaurantNum?: () => Promise<any>
  getRestaurantList?: (from: number, to: number) => Promise<any>
  staticData?: RestaurantInfo[]
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
const finished = computed(() => props.staticData ? true : total.value === data.length);

const load = async () => {
  if (finished.value) return;
  if (props.getRestaurantList === undefined) return;
  const response = await props.getRestaurantList(data.length, data.length + column.value * 3);
  const resData = response.data as List<RestaurantInfo>;
  data.push(...resData.list);
  total.value = resData.all_num;
  emits('changed', total.value);
};

const toRestaurant = (id: number) => {
  window.location.href = '/restaurant/' + id;
}

watch(() => props.getRestaurantNum, () => {
  total.value = -1;
  data.splice(0, data.length);
}, {immediate: true});
</script>

<template>
  <LazyList :data="staticData ?? data" :column="column" :finished="staticData ? true : finished" :gutter="[10, 10]" :load="load">
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