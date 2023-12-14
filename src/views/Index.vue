<script setup lang="ts">
import RestaurantList from "@/components/RestaurantList.vue";
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
    <RestaurantList class="restaurant-list"/>
  </main>
</template>

<style scoped>
.swipe-example {
  width: 90vw;
  height: 30vh;
  margin: 0 auto 30px;
}

.swipe-example-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.restaurant-list {
  width: calc(90vw + 12px);
}
</style>
