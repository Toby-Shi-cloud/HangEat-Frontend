<script setup lang="ts">
import {ref} from "vue";
import RestaurantList from "@/components/RestaurantList.vue";
import {doGetReCommendList} from "@/services/restaurant";
import type {RestaurantInfo} from "@/store";
import BestRestaurantSwipe from "@/components/BestRestaurantSwipe.vue";

const data = ref<RestaurantInfo[]>([]);

doGetReCommendList().then((res) => {
  data.value = res.data.list;
});
</script>

<template>
  <main>
    <BestRestaurantSwipe/>
    <h2>为你推荐：</h2>
    <RestaurantList class="restaurant-list" :static-data="data"/>
  </main>
</template>

<style scoped>
main {
  width: calc(100vw - 2rem);
  max-width: inherit;
}
</style>
