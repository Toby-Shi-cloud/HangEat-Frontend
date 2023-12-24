<script setup lang="ts">
withDefaults(defineProps<{
  grade?: number
  title?: boolean
  detail?: boolean
}>(), {
  title: false,
  detail: false,
});
</script>

<template>
  <var-space direction="row" :size="2" align="center">
    <p v-if="title">评分：</p>
    <p v-if="grade">
      <font-awesome-icon
          v-for="i in Array(5).keys()"
          :icon="grade! >= i + 0.3 ? ['fas', grade! >= i + 0.9 ? 'star' : 'star-half-stroke'] : ['far', 'star']"/>
      {{ detail ? grade.toFixed(1) : '' }}
    </p>
    <p v-else>（暂无评分）</p>
  </var-space>
</template>

<style scoped/>