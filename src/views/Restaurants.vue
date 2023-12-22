<script setup lang="ts">
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

const getRestaurantNum = props.tag ? () => doGetRestaurantNumByTags([props.tag!]) : doGetRestaurantNum;
const getRestaurantList = props.tag ? (from: number, to: number) => doGetRestaurantListByTags([props.tag!], from, to) : doGetRestaurantList;
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

</style>