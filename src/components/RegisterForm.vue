<script setup lang="ts">
import {reactive, ref} from "vue";
import {type Form, Snackbar} from "@varlet/ui";
import {doRegister, doSendCaptcha} from "@/services/user";

defineProps<{
  toLoginView: () => void
}>();

const data = reactive({
  email: "",
  captcha: "",
  username: "",
  password: "",
  re_password: "",
});

const emailForm = ref<Form | null>(null);
const regForm = ref<Form | null>(null);
const captchaCountdown = ref(0);

async function sendCaptcha() {
  if (!await (emailForm.value as Form).validate()) return;
  if (captchaCountdown.value > 0) {
    Snackbar.warning("哈哈！太着急了吧！");
    return;
  }
  captchaCountdown.value = 60;
  let timer = setInterval(() => {
    captchaCountdown.value--;
    if (captchaCountdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
  doSendCaptcha(data.email).then(response => {
    Snackbar.success(response.data.message);
  }).catch(() => {
    captchaCountdown.value = 0;
  });
}

async function register() {
  if (!await (emailForm.value as Form).validate()) return;
  if (!await (regForm.value as Form).validate()) return;
  doRegister(data.email, data.captcha, data.username, data.password).then(response => {
    Snackbar.success(response.data.message);
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  }).catch(() => {
    data.password = "";
    data.re_password = "";
  });
}

async function onKeyDown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    await register();
  }
}

const emailRules = [
  (v: string) => !!v || '邮箱不能为空',
  (v: string) => v.endsWith('@buaa.edu.cn') || '请输入北航邮箱',
  (v: string) => v !== '@buaa.edu.cn' || '非法邮箱',
];

const captchaRules = [
  (v: string) => !!v || '验证码不能为空',
  (v: string) => v.length == 6 || '验证码长度必须为6位',
];

const usernameRules = [
  (v: string) => !!v || '用户名不能为空',
  (v: string) => !v.includes('@') || '用户名不能包含@',
  (v: string) => !v.includes('$') || '用户名不能包含$',
];

const passwordRules = [
  (v: string) => !!v || '密码不能为空',
  (v: string) => v.length >= 6 || '密码长度不能小于6位',
];

const rePasswordRules = [
  (v: string) => !!v || '密码不能为空',
  (v: string) => v.length >= 6 || '密码长度不能小于6位',
  (v: string) => v == data.password || '两次输入密码不一致',
];
</script>

<template>
  <var-paper class="login-paper" :elevation="20" :radius="8">
    <h1 style="text-align: center">注册</h1>
    <var-form class="login-form" ref="emailForm" style="padding-bottom: 5px" :onkeydown="onKeyDown">
      <var-row :gutter="5" style="align-items: flex-end">
        <var-col :span="20">
          <var-input
              v-model="data.email"
              placeholder="请输入北航邮箱"
              :rules="emailRules"
              style="width: 100%"
          />
        </var-col>
        <var-col :span="4">
          <var-button
              type="primary"
              :disabled="captchaCountdown > 0"
              @click="sendCaptcha">
            {{ captchaCountdown > 0 ? "已发送 " + captchaCountdown + "s" : "发送验证码" }}
          </var-button>
        </var-col>
      </var-row>
    </var-form>
    <var-form class="login-form" ref="regForm" style="padding-top: 0" :onkeydown="onKeyDown">
      <var-space direction="column" justify="space-around">
        <var-input
            v-model="data.captcha"
            placeholder="请输入验证码"
            :rules="captchaRules"
        />
        <var-input
            v-model="data.username"
            placeholder="请输入用户名"
            :rules="usernameRules"
        />
        <var-input
            type="password"
            v-model="data.password"
            placeholder="请输入密码"
            :rules="passwordRules"
        />
        <var-input
            type="password"
            v-model="data.re_password"
            placeholder="请再次输入密码"
            :rules="rePasswordRules"
        />
        <var-button
            block
            type="primary"
            native-type="submit"
            @click="register">
          注册
        </var-button>
      </var-space>
    </var-form>
    <var-button
        class="right-button"
        type="default"
        @click="toLoginView()">
      已有账号？去登录
    </var-button>
  </var-paper>
</template>

<style scoped src="./css/login.css"/>
