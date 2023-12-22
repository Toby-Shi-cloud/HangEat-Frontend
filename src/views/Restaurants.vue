<script setup lang="ts">
import {computed, watch} from 'vue';
import RestaurantList from "@/components/RestaurantList.vue";
import {
  doGetRestaurantList,
  doGetRestaurantListByTags,
  doGetRestaurantNum,
  doGetRestaurantNumByTags
} from "@/services/restaurant";

const props = defineProps<{
  tag?: string,
}>();

const getRestaurantNum = computed(() => props.tag ? () => doGetRestaurantNumByTags([props.tag!]) : doGetRestaurantNum);
const getRestaurantList = computed(() => props.tag ? (from: number, to: number) => doGetRestaurantListByTags([props.tag!], from, to) : doGetRestaurantList);
</script>

<template>
  <main>
    <RestaurantList
        class="restaurant-list"
        :get-restaurant-num="getRestaurantNum"
        :get-restaurant-list="getRestaurantList"/>
  </main>
</template>

<style scoped>
.restaurant-list {
  width: 100vw;
  max-width: min(1280px, 100vw - 4rem);
}
</style>