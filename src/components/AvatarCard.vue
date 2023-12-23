<script setup lang="ts">
import type {UserInfo} from "@/store";

defineProps<{
  creatorInfo: UserInfo;
  title?: string
  subtitle?: string
  src?: string
  description?: string
}>();
</script>

<template>
  <var-space direction="row" style="display: grid; grid-template-columns: 1fr calc(100% - 60px)">
    <var-space direction="column" align="center" :size="5" style="height: 100%">
      <var-avatar :src="creatorInfo.avatar" hoverable
                  @click="$router.push(`/user/${creatorInfo.id!}`);"/>
      <var-link underline="hover" :to="`/user/${creatorInfo.id!}`">
        <p>{{ creatorInfo.username }}</p>
      </var-link>
    </var-space>
    <var-card :title="title" :subtitle="subtitle" :src="src" :description="description" :elevation="false">
      <template #title>
        <slot name="title"/>
      </template>
      <template #subtitle>
        <slot name="subtitle"/>
      </template>
      <template #image>
        <slot name="image"/>
      </template>
      <template #description>
        <slot name="description"/>
      </template>
      <template #extra>
        <slot name="extra"/>
      </template>
    </var-card>
  </var-space>
</template>

<style scoped>

</style>