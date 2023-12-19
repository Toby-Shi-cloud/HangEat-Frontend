/**
* LazyList
* @description 封装的 Varlet 库的 VarList 组件，用于实现懒加载列表
* @param {T[]} data 列表数据
* @param {boolean} finished 是否加载完毕
* @param {number} column 列数 (默认为 1)
* @param {number | [number, number]} gutter 列间距。可设置为 [垂直间距, 水平间距]
**/

<script setup lang="ts" generic="T">
import {ref} from 'vue';

withDefaults(defineProps<{
  data: T[]
  finished: boolean
  column?: number
  gutter?: string | number | [string | number, string |number]
}>(), {
  column: 1,
  gutter: 0
});

const emits = defineEmits<{
  load: []
}>();

const error = ref(false);
const loading = ref(false);

const load = () => {
  try {
    emits('load');
  } catch (e) {
    error.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <var-list
      class="lazy-list"
      :finished="finished"
      v-model:error="error"
      v-model:loading="loading"
      @load="load">
    <var-row :gutter="gutter">
      <var-col :key="item" v-for="item in data" :span="24 / column">
        <slot :item="item"></slot>
      </var-col>
    </var-row>
  </var-list>
</template>

<style scoped>

</style>