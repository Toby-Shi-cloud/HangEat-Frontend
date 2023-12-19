<script setup lang="ts">
import {reactive, ref} from "vue";
import {type Form, Snackbar} from "@varlet/ui";
import {doForgetPassword, doLogin, doRegister, doSendCaptcha} from "@/services/user";
import {emailRules, captchaRules, usernameRules, passwordRules} from "./ts/rules";

const props = withDefaults(defineProps<{
  special?: boolean
  forgetPassword?: boolean
}>(), {
  special: false,
  forgetPassword: false
});

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
    doLogin(data.username, data.password).catch();
    Snackbar.success(response.data.message);
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  }).catch(() => {
    data.password = "";
    data.re_password = "";
  });
}

async function resetPassword() {
  if (!await (emailForm.value as Form).validate()) return;
  if (!await (regForm.value as Form).validate()) return;
  doForgetPassword(data.email, data.captcha, data.password).then(response => {
    Snackbar.success(response.data.message);
    doLogin(data.email, data.password).then(() => {
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }).catch(error => {
      // wtf?
      console.log(error);
    });
  }).catch(() => {
    data.password = "";
    data.re_password = "";
  });
}

async function onKeyDown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    await (props.forgetPassword ? resetPassword() : register());
  }
}

const rePasswordRules = passwordRules.concat([
  (v: string) => v === data.password || '两次输入密码不一致',
]);
</script>

<template>
  <var-paper :class="forgetPassword ? '' : 'login-paper'" :elevation="20" :radius="8">
    <h1 style="text-align: center">{{ forgetPassword ? '忘记密码' : '注册' }}</h1>
    <var-form class="login-form" ref="emailForm" style="padding-bottom: 5px" :onkeydown="onKeyDown">
      <var-row :gutter="5" style="align-items: flex-end">
        <var-col :span="20">
          <var-input
              v-model="data.email"
              :placeholder="special ? '请输入邮箱' : '请输入北航邮箱'"
              :autofocus="true"
              :rules="special ? [v => v.includes('@') || '请输入邮箱'] : emailRules"
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
            v-if="!forgetPassword"
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
            v-if="forgetPassword"
            block
            type="primary"
            @click="resetPassword">
          确定
        </var-button>
        <var-button
            v-else
            block
            type="primary"
            @click="register">
          注册
        </var-button>
      </var-space>
    </var-form>
    <var-button
        v-if="!forgetPassword"
        class="right-button"
        type="default"
        @click="$emit('toggle')">
      已有账号？去登录
    </var-button>
  </var-paper>
</template>

<style scoped src="./css/login.css"/>
