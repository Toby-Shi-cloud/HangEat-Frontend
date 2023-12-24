<script setup lang="ts">
import type {UserInfo} from "@/store";
import os from "./ts/os";

defineProps<{
  creatorInfo: UserInfo;
  title?: string
  subtitle?: string
  src?: string
  description?: string
  row?: boolean
}>();
</script>

<template>
  <var-space direction="row" :class="os.isPhone && !row ? 'card-paper-mobile' : 'card-paper'">
    <var-space direction="column" align="center" :size="5" class="avatar">
      <var-avatar :src="creatorInfo.avatar" hoverable
                  @click="$router.push(`/user/${creatorInfo.id!}`);"/>
      <var-link underline="hover" :to="`/user/${creatorInfo.id!}`">
        {{ creatorInfo.username }}
      </var-link>
    </var-space>
    <var-card :title="title" :subtitle="subtitle" :src="src" :description="description"
              :elevation="false" class="card">
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
.card-paper {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: "avatar card";
}

.card-paper-mobile {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  grid-template-areas: "avatar" "card";
}

.avatar {
  margin: 1rem 0 0 .5rem;
}
</style>