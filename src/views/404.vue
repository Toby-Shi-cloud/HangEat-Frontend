<script setup lang="ts">

</script>

<template>
  <main>
    <var-result type="error" title="404"
                description="啊哦！您走进了美食的荒漠！">
      <template #footer>
        <var-button type="primary" @click="$router.push('/')">返回首页</var-button>
      </template>
    </var-result>
  </main>
</template>

<style scoped>

</style>