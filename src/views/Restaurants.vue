<script setup lang="ts">
import {ref, computed, watch} from 'vue';
import RestaurantList from "@/components/RestaurantList.vue";
import {doGetRestaurantList, doGetRestaurantNum, OrderType} from "@/services/restaurant";
import RestaurantNew from "@/components/RestaurantNew.vue";
import TagsList from "@/components/TagsList.vue";
import OrderTypeList from "@/components/OrderTypeList.vue";
import {useAuthStore} from "@/store/user";
import {Snackbar} from "@varlet/ui";
import router from "@/router";

const props = withDefaults(defineProps<{
  tags?: string
  creator?: string
  order?: string
  reverse?: string
}>(), {
  tags: '',
  creator: '',
  order: '',
  reverse: '',
});

const authStore = useAuthStore();
const tags = ref(function () {
  let tags: string[] = [];
  props.tags.split(',').forEach(tg => tg.trim() === '' || tags.push(tg.trim()));
  return tags;
}());
const creatorId = ref(/^\d+$/.test(props.creator) ? parseInt(props.creator) : undefined);
const reverse = ref(props.reverse === 'true');
const order = ref(function () {
  let order = parseInt(props.order) as OrderType;
  if (isNaN(order) || order < 0 || order > 3) {
    order = OrderType.CreateTime;
  }
  return order;
}());

const pushNewUrl = (tags?: string[], creator?: number | string, reverse?: boolean | string, order?: OrderType | string) => {
  const query: Record<string, string> = {};
  if (tags && tags.length !== 0) {
    query.tags = tags.join(',');
  }
  if (creator) {
    query.creator = creator.toString();
  }
  if (reverse) {
    query.reverse = reverse.toString();
  }
  if (order && order !== OrderType.CreateTime) {
    query.order = order.toString();
  }
  router.push({query});
};

const restListRef = ref<InstanceType<typeof RestaurantList>>();
watch([tags, creatorId, reverse, order], (_new, _old) => {
  pushNewUrl(..._new);
  restListRef.value?.refresh();
});

const getRestaurantNum = computed(() =>
    () => doGetRestaurantNum(tags.value, creatorId.value));
const getRestaurantList = computed(() =>
    (from: number, to: number) => doGetRestaurantList(order.value, from, to, reverse.value, tags.value, creatorId.value));
const newRestaurant = ref(false);

const handleCreate = () => {
  if (authStore.isAuthenticated) {
    newRestaurant.value = true;
  } else {
    Snackbar.error('请先登录！');
    setTimeout(() => router.push(`/login?url=${location.href}`), 1000);
  }
};
</script>

<template>
  <main>
    <var-paper :elevation="true" :radius="8" class="search-paper">
      <h2>搜索
        <font-awesome-icon :icon="['fas', 'magnifying-glass']"/>
      </h2>
      <TagsList title="Tags: " v-model:checked-tags="tags"/>
      <OrderTypeList title="排序方式: " v-model:order="order" v-model:reverse="reverse"/>
    </var-paper>
    <RestaurantList class="restaurant-list" ref="restListRef"
                    :get-restaurant-num="getRestaurantNum"
                    :get-restaurant-list="getRestaurantList"/>
  </main>
  <footer id="app-footer">
    <div style="display: inline-grid; place-items: center; width: 100%">
      <var-link type="primary" style="place-self: center"
                @click="handleCreate">
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
.search-paper {
  width: 90%;
  min-height: 10vh;
  margin: -10px auto 15px;
  padding: 10px;
}

.restaurant-list {
  width: 100vw;
  max-width: min(1280px, 100vw - 4rem);
}
</style>