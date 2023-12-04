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
  <h1>登录</h1>
  <var-form
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
</template>

<style scoped>

</style>