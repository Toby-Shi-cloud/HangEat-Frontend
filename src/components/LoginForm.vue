<script setup lang="ts">
import {reactive, ref} from "vue"
import {type Form, Snackbar} from "@varlet/ui";
import {doLogin} from "@/services/user";
import {usernameOrEmailRules, passwordRules} from "./ts/rules";
import RegisterForm from "@/components/RegisterForm.vue";
import router from "@/router";

const props = defineProps<{
  url: string
}>();

defineEmits<{
  toggle: []
}>();

const data = reactive({
  username: "",
  password: "",
});

const form = ref<Form | null>(null);

async function login() {
  let validation = await (form.value as Form).validate();
  if (!validation) return;
  doLogin(data.username, data.password).then(response => {
    Snackbar.success(response.data.message);
    setTimeout(() => {
      router.push(props.url);
    }, 1000);
  }).catch(() => {
    data.password = "";
    document.getElementById("reg-log.username")?.focus();
  });
}

async function onKeyDown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    await login();
  }
}

const forgetPassword = ref(false);
</script>

<template>
  <var-paper class="login-paper" :elevation="20" :radius="8">
    <h1 style="text-align: center">登录</h1>
    <var-form
        class="login-form"
        ref="form"
        scroll-to-error="start"
        :onkeydown="onKeyDown">
      <var-space direction="column" justify="space-around">
        <var-input
            id="reg-log.username"
            v-model="data.username"
            placeholder="请输入用户名或邮箱"
            :autofocus="true"
            :rules="usernameOrEmailRules"
        />
        <var-input
            id="reg-log.password"
            type="password"
            v-model="data.password"
            placeholder="请输入密码"
            :rules="passwordRules"
        />
        <var-button
            block
            type="primary"
            @click="login">
          登录
        </var-button>
      </var-space>
    </var-form>

    <var-button
        class="left-button"
        type="default"
        @click="forgetPassword = true">
      忘记密码？去找回
    </var-button>
    <var-button
        class="right-button"
        type="default"
        @click="$emit('toggle')">
      没有账号？去注册
    </var-button>

    <var-popup overlay-class="normal-popup-overlay"
               class="normal-popup-class"
               v-model:show="forgetPassword">
      <RegisterForm special forgetPassword :url="url"/>
    </var-popup>
  </var-paper>
</template>

<style scoped src="./css/login.css"/>
