<script setup lang="ts">
import {ref} from "vue";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import GradientBackground from "@/components/GradientBackground.vue";

withDefaults(defineProps<{
  special?: boolean
}>(), {
  special: false
});

let isLoginView = ref(true);
</script>

<template>
  <GradientBackground/>
  <main class="login" style="place-self: center">
    <Transition name="fade" mode="out-in">
      <LoginForm v-if="isLoginView" @toggle="isLoginView = false"/>
      <RegisterForm v-else @toggle="isLoginView = true" :special="special" :forget-password="false"/>
    </Transition>
  </main>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 150ms ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

</style>