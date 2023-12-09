<script setup lang="ts">
import {onMounted} from "vue";
import {setTheme, Theme} from "./components/themes";
import Header from "./views/Header.vue";

onMounted(() => {
  let saveThemeMode = localStorage.getItem("kThemeMode");
  setTheme(saveThemeMode as Theme || Theme.System);
});
</script>

<template>
  <Header/>
  <router-view/>
</template>

<style scoped>
</style>
