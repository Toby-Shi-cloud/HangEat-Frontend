<script setup lang="ts">
import {onMounted} from "vue";
import {setTheme, Theme} from "./components/themes";

onMounted(() => {
  let saveThemeMode = localStorage.getItem("kThemeMode");
  setTheme(saveThemeMode as Theme || Theme.System);
});
</script>

<template>
  <router-view/>
</template>

<style scoped>
</style>
