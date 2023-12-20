<script setup lang="ts">
import {ref, reactive, computed} from "vue";
import LazyList from "@/components/LazyList.vue";
import type {RestaurantInfo} from "@/store";
import {doGetRestaurantList, doGetRestaurantNum} from "@/services/restaurant";

const props = withDefaults(defineProps<{
  width?: number
  layout?: 'row' | 'column'
  getRestaurantNum: typeof doGetRestaurantNum
  getRestaurantList: typeof doGetRestaurantList
}>(), {
  layout: 'column'
});

const screenWidth = ref(window.innerWidth);
window.onresize = () => screenWidth.value = window.innerWidth;
const width = computed(() => props.width || screenWidth.value);
const column = computed(() => props.layout == 'row' ? 1 : width.value < 668 ? 1 : width.value < 992 ? 2 : 3);

const total = ref(-1);
const data = reactive<RestaurantInfo[]>([]);
const finished = computed(() => total.value === data.length);

props.getRestaurantNum().then(res => {
  total.value = res.data.restaurant_num;
}).catch();

const load = () => {
  if (finished.value) return;
  props.getRestaurantList(data.length, data.length + 20).then(res => {
    data.push(...res.data.list);
    total.value = res.data.all_num;
  }).catch();
};

const toRestaurant = (id: number) => {
  window.location.href = '/restaurant/' + id;
}
</script>

<template>
  <LazyList :data="data" :column="column" :finished="finished" :gutter="[10, 10]" @load="load">
    <template #default="{item}">
      <var-card class="restaurant-card" :layout="layout"
                :title="item.name" :src="item.img" @click="toRestaurant(item.id!)">
        <template #description>
          <var-cell icon="phone-outline" :title="item.phone || ''"/>
          <var-cell icon="map-marker-radius-outline" :title="item.address || ''"/>
          <var-cell icon="star" :title="item.tags?.join('，') || ''"/>
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