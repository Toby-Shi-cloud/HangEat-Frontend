<script setup lang="ts">
import {ref, computed} from 'vue';
import RestaurantList from "@/components/RestaurantList.vue";
import {doGetRestaurantList, doGetRestaurantNum, OrderType} from "@/services/restaurant";
import RestaurantNew from "@/components/RestaurantNew.vue";

const props = withDefaults(defineProps<{
  tag?: string,
}>(), {
  tag: '',
});

const tags = computed(() => props.tag.split(','));
const getRestaurantNum = computed(() => () => doGetRestaurantNum(tags.value));
const getRestaurantList = computed(() => (from: number, to: number) => doGetRestaurantList(OrderType.CreateTime, from, to, false, tags.value));
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
      <var-link type="primary" @click="newRestaurant = true" style="place-self: center">
        没有找到想要的餐馆？创建一个
      </var-link>
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