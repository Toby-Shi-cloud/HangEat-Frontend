<script setup lang="ts">
import {ref, reactive, computed} from "vue";
import LazyList from "@/components/LazyList.vue";
import type {List, RestaurantInfo} from "@/store";
import GradeView from "@/components/GradeView.vue";
import screen from "@/components/ts/screen";

const props = withDefaults(defineProps<{
  width?: number
  layout?: 'row' | 'column'
  noExtra?: boolean
  getRestaurantNum?: () => Promise<any>
  getRestaurantList?: (from: number, to: number) => Promise<any>
  staticData?: RestaurantInfo[]
}>(), {
  layout: 'column',
  noExtra: false
});

const emits = defineEmits<{
  changed: [total: number]
}>();

const width = computed(() => props.width || screen.width.value);
const column = computed(() => props.layout == 'row' ? 1 : width.value < 720 ? 1 : width.value < 1080 ? 2 : width.value < 1440 ? 3 : 4);

const total = ref(-1);
const data = reactive<RestaurantInfo[]>([]);
const finished = computed(() => props.staticData ? true : total.value === data.length);

const load = async () => {
  if (finished.value) return;
  if (props.getRestaurantList === undefined) return;
  const response = await props.getRestaurantList(data.length, data.length + column.value * 3);
  const resData = response.data as List<RestaurantInfo>;
  data.push(...resData.list);
  total.value = resData.all_num;
  emits('changed', total.value);
};

const refresh = () => {
  total.value = -1;
  data.splice(0, data.length);
};

defineExpose({refresh});
</script>

<template>
  <LazyList :key="total" :data="staticData ?? data" :column="column"
            :finished="staticData ? true : finished" :gutter="[10, 10]" :load="load">
    <template #default="{item}">
      <var-card class="restaurant-card" :layout="layout"
                :title="item.name" :src="item.img"
                @click="$router.push(`/restaurant/${item.id!}`)">
        <template #description>
          <var-cell :title="item.tags?.join('，') || ''">
            <template #icon>
              <font-awesome-icon :icon="['fas', 'tags']" style="margin-right: 5px"/>
            </template>
          </var-cell>
          <GradeView :grade="item.avg_grade" title detail style="margin-left: 10px"/>
          <p style="margin-left: 10px">人均价格：¥{{ item.avg_price?.toFixed(2) || '未知' }}</p>
        </template>
        <template #extra v-if="!noExtra">
          <var-space direction="row" align="center" :size="3">
            <font-awesome-icon :icon="[item.is_collected ? 'fas' : 'far', 'heart']"
                               :color="item.is_collected ? 'red' : ''"/>
            <p>{{ item.collectors_num || 0 }}</p>
          </var-space>
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