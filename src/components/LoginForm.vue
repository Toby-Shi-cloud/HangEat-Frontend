<script setup lang="ts">
import {reactive, ref} from "vue"
import type {Form} from "@varlet/ui";

const data = reactive({
  username: "",
  password: "",
  loading: false
})

const form = ref<Form | null>(null)

async function login() {
  let validation = await (form.value as Form).validate()
  if (!validation) return
  data.loading = true
  setTimeout(() => {
    if (data.username === "admin" && data.password === "123456") {
      data.loading = false
      alert("登录成功")
    } else {
      data.loading = false
      alert("用户名或密码错误")
    }
  }, 1000)
}
</script>

<template>
  <var-paper class="login-paper" :elevation="20" :radius="8">
    <h1 style="text-align: center">登录</h1>
    <var-form
        class="login-form"
        ref="form"
        scroll-to-error="start">
      <var-space direction="column" justify="space-around">
        <var-input
            v-model="data.username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[v => !!v || '用户名不能为空']"
            :disabled="data.loading"
        />
        <var-input
            type="password"
            v-model="data.password"
            label="密码"
            placeholder="请输入密码"
            :rules="[v => !!v || '密码不能为空']"
            :disabled="data.loading"
        />
        <var-button
            block
            type="primary"
            :loading="data.loading"
            :disabled="data.loading"
            @click="login">
          登录
        </var-button>
      </var-space>
    </var-form>
  </var-paper>
</template>

<style scoped>
.login-paper {
  padding: 15px;
  position: relative;
  overflow: hidden;
  background: var(--color-background-opacity);
  backdrop-filter: blur(2px);
  color: var(--vt-c-text-dark-1);
  align-items: center;

  --field-decorator-text-color: var(--vt-c-text-dark-1);
  --field-decorator-placeholder-color: var(--vt-c-text-dark-2);
  --field-decorator-focus-color: var(--color-success);
}

.login-form {
  min-width: 300px;
}

@media (min-width: 1024px) {
  .login-form {
    min-width: 600px;
    padding: 15px;
  }
}
</style>