<script setup lang="ts">
import {reactive, nextTick} from 'vue';
import CheckChip from "@/components/CheckChip.vue";
import {OrderType} from "@/services/restaurant";

const props = withDefaults(defineProps<{
  title?: string
  order?: OrderType
  reverse?: boolean
}>(), {
  title: '',
  order: OrderType.CreateTime,
  reverse: false,
});

const emits = defineEmits<{
  'update:order': [order: OrderType]
  'update:reverse': [reverse: boolean]
}>();

const states = reactive([...Array(4).keys()].map(i => props.order === i ? (props.reverse ? 2 : 1) : 0));
const labels = ['收藏数', '评分', '价格', '创建时间'];
const orders = ['', '(降序)', '(升序)'];

const onClicked = async (id: number) => {
  for (const i of states.keys()) {
    if (i === id) states[i] = states[i] || 1;
    else states[i] = 0;
  }
  await nextTick();
  emits('update:order', id);
  emits('update:reverse', states[id] === 2);
};
</script>

<template>
  {{ title }}
  <CheckChip v-for="i in states.keys()" style="margin: 2px"
             v-model:current="states[i]" :states="3"
             @clicked="onClicked(i)">
    {{ labels[i] }}{{ orders[states[i]] }}
  </CheckChip>
</template>

<style scoped>

</style>