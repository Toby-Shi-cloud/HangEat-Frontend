<script setup lang="ts">
import {computed, nextTick} from 'vue';

const props = withDefaults(defineProps<{
  current?: number
  states?: number
  defaultStyle?: any
  checkedStyle?: any
  hoverStyle?: any
  hoverOnDefaultStyle?: any
  hoverOnCheckedStyle?: any
}>(), {
  current: 0,
  states: 2,
  defaultStyle: {},
  checkedStyle: {
    color: '#444',
    background: 'var(--color-success)',
  },
  hoverStyle: {},
  hoverOnDefaultStyle: (props: any) => ({
    color: '#fff',
    background: 'var(--color-primary)',
    ...props.hoverStyle,
  }),
  hoverOnCheckedStyle: (props: any) => ({
    color: '#fff',
    background: 'var(--color-success)',
    ...props.hoverStyle,
  }),
});

const emits = defineEmits<{
  clicked: [checked: boolean, current: number]
  'update:current': [current: number]
}>();

const current = computed({
  get: () => props.current,
  set: (value) => {
    emits('update:current', value);
  },
});
const checked = computed(() => current.value !== 0);

const onClick = async () => {
  current.value = (current.value + 1) % props.states;
  await nextTick();
  emits('clicked', checked.value, props.current);
};
</script>

<template>
  <var-chip :style="checked ? checkedStyle : defaultStyle"
            v-hover="checked ? hoverOnCheckedStyle : hoverOnDefaultStyle"
            @click="onClick">
    <slot/>
  </var-chip>
</template>

<style scoped>

</style>