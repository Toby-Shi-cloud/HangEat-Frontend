<script setup lang="ts">
import {ref, computed} from 'vue';
import RestaurantList from "@/components/RestaurantList.vue";
import {
  doGetRestaurantList,
  doGetRestaurantListByTags,
  doGetRestaurantNum,
  doGetRestaurantNumByTags
} from "@/services/restaurant";
import RestaurantNew from "@/components/RestaurantNew.vue";

const props = defineProps<{
  tag?: string,
}>();

const getRestaurantNum = computed(() => props.tag ? () => doGetRestaurantNumByTags([props.tag!]) : doGetRestaurantNum);
const getRestaurantList = computed(() => props.tag ? (from: number, to: number) => doGetRestaurantListByTags([props.tag!], from, to) : doGetRestaurantList);
const newRestaurant = ref(false);
</script>

<template>
  <main>
    <RestaurantList
        class="restaurant-list"
        :get-restaurant-num="getRestaurantNum"
        :get-restaurant-list="getRestaurantList"/>
  </main>
  <footer id="app-footer">
    <div style="display: inline-grid; place-items: center; width: 100%">
      <var-link type="primary" @click="newRestaurant = true" style="place-self: center">没有找到想要的餐馆？创建一个</var-link>
    </div>
  </footer>
  <var-popup overlay-class="normal-popup-overlay"
             class="normal-popup-class"
             v-model:show="newRestaurant">
    <RestaurantNew @close="newRestaurant = false"/>
  </var-popup>
</template>

<style scoped>
.restaurant-list {
  width: 100vw;
  max-width: min(1280px, 100vw - 4rem);
}
</style>