<script setup lang="ts">
import {ref} from "vue";
import {doGetRestaurantList, OrderType} from "@/services/restaurant";
import type {RestaurantInfo} from "@/store";
import GradeView from "@/components/GradeView.vue";
import os from "@/components/ts/os";

const data = ref<RestaurantInfo[]>([]);

doGetRestaurantList(OrderType.AverageGrade, 0, 5).then((res) => {
  const list = res.data.list as RestaurantInfo[];
  data.value = list.filter(item => item.img && !item.img.includes('restaurant/default.png'));
});
</script>

<template>
  <var-swipe class="swipe" :autoplay="5000" :navigation="os.isPc">
    <var-swipe-item v-for="item in data" @click="$router.push(`/restaurant/${item.id!}`)">
      <var-image fit="contain" class="swipe-image" :src="item.img"/>
      <var-space direction="column" align="end" class="swipe-badge">
        <var-chip>{{ item.name }}</var-chip>
        <var-chip><GradeView :grade="item.avg_grade"/></var-chip>
        <var-chip>{{ os.isPc ? '人均价格：' : '' }}¥{{ item.avg_price?.toFixed(2) || '未知' }}</var-chip>
      </var-space>
    </var-swipe-item>
  </var-swipe>
</template>

<style scoped>
.swipe {
  width: 100%;
  height: 30vh;
  margin: 0 auto 30px;
}

.swipe-image {
  width: 100%;
  height: 100%;
}

.swipe-badge {
  position: absolute;
  top: 0;
  right: 0.5rem;
}
</style>