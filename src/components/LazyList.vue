<script setup lang="ts">
import {ref} from 'vue';

const props = withDefaults(defineProps<{
  data: any[]
  finished: boolean
  column?: number
}>(), {
  column: 1
});

const emits = defineEmits<{
  (e: 'load'): void
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
    <var-row>
      <var-col :key="item" v-for="item in data" :span="24 / column">
        <slot :item="item"></slot>
      </var-col>
    </var-row>
  </var-list>
</template>

<style scoped>

</style>