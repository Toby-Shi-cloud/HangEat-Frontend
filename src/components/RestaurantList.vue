<script setup lang="ts">
import {ref, reactive, computed} from "vue";
import LazyList from "@/components/LazyList.vue";
import type {RestaurantInfo} from "@/services/restaurant";
import {doGetRestaurantList, doGetRestaurantNum} from "@/services/restaurant";

const total = ref(-1);
const column = ref(3);
const data = reactive<RestaurantInfo[]>([]);
const finished = computed(() => total.value === data.length);

doGetRestaurantNum().then(res => {
  total.value = res.data.restaurant_num;
}).catch();

const load = () => {
  if (finished.value) return;
  doGetRestaurantList(data.length, data.length + 20).then(res => {
    data.push(...res.data.list);
    total.value = res.data.all_num;
    console.log(res.data);
  }).catch();
};

const reCalculateColumn = (screenWidth: number) => {
  if (screenWidth < 668) {
    column.value = 1;
  } else if (screenWidth < 992) {
    column.value = 2;
  } else {
    column.value = 3;
  }
}

reCalculateColumn(window.innerWidth);
window.onresize = () => {
  reCalculateColumn(window.innerWidth);
}
</script>

<template>
  <LazyList :data="data" :column="column" :finished="finished" :gutter="[10, 10]" @load="load">
    <template #default="{item}">
      <var-card class="restaurant-card" :title="item.name" :src="item.img">
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