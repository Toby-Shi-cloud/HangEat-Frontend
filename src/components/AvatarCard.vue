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
    <var-space direction="column" align="center" :size="5" class="avatar">
      <var-avatar :src="creatorInfo.avatar" hoverable
                  @click="$router.push(`/user/${creatorInfo.id!}`);"/>
      <var-link underline="hover" :to="`/user/${creatorInfo.id!}`">
        {{ creatorInfo.username }}
      </var-link>
    </var-space>
    <var-card :title="title" :subtitle="subtitle" :src="src" :description="description" :elevation="false">
      <template #title>
        <slot name="title">
          <var-link v-if="title === undefined" underline="hover" :to="`/user/${creatorInfo.id!}`"
                    :text-size="26" style="margin: 1rem 0 0 10px">
            {{ creatorInfo.username }}
          </var-link>
        </slot>
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
.avatar {
  height: 100%;
  margin: 1rem 0 0 .5rem;
}
</style>