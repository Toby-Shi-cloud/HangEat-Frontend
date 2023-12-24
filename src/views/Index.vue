<script setup lang="ts">
import {ref} from "vue";
import RestaurantList from "@/components/RestaurantList.vue";
import {doGetReCommendList, doGetRestaurantList, doGetRestaurantNum, OrderType} from "@/services/restaurant";
import type {RestaurantInfo} from "@/store";

const data = ref<RestaurantInfo[]>([]);

doGetReCommendList().then((res) => {
  data.value = res.data.list;
});
</script>

<template>
  <main>
    <var-swipe class="swipe-example" :autoplay="5000" navigation>
      <var-swipe-item>
        <img class="swipe-example-image" src="https://varlet.gitee.io/varlet-ui/cat.jpg">
      </var-swipe-item>
      <var-swipe-item>
        <img class="swipe-example-image" src="https://varlet.gitee.io/varlet-ui/cat2.jpg">
      </var-swipe-item>
      <var-swipe-item>
        <img class="swipe-example-image" src="https://varlet.gitee.io/varlet-ui/cat3.jpg">
      </var-swipe-item>
    </var-swipe>
    <RestaurantList class="restaurant-list" :static-data="data"/>
  </main>
</template>

<style scoped>
main {
  width: calc(100vw - 2rem);
  max-width: inherit;
}

.swipe-example {
  width: 100%;
  height: 30vh;
  margin: 0 auto 30px;
}

.swipe-example-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

</style>
