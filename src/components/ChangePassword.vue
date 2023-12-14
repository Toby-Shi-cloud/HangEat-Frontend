<script setup lang="ts">
import {ref} from "vue";
import {type Form, Snackbar} from "@varlet/ui";
import {passwordRules} from "./ts/rules";
import {doChangePassword} from "@/services/user";

const emit = defineEmits<{
  (e: 'close'): void
}>();

const oldPassword = ref("");
const newPassword = ref("");
const rePassword = ref("");

const rePasswordRules = passwordRules.concat([
  (v: string) => v === newPassword.value || '两次输入密码不一致',
]);

const form = ref<Form | null>(null);

async function updatePassword() {
  if (!await (form.value as Form).validate()) return;
  doChangePassword(oldPassword.value, newPassword.value).then(response => {
    Snackbar.success(response.data.message);
    emit("close");
  }).catch(() => {
    oldPassword.value = "";
    newPassword.value = "";
    rePassword.value = "";
  });
}

async function onKeyDown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    await updatePassword();
  } else if (event.key === "Escape") {
    emit("close");
  }
}
</script>

<template>
  <var-form class="edit-block" ref="form" :onkeydown="onKeyDown">
    <h1>更改密码</h1>
    <var-input class="edit-input" v-model="oldPassword" placeholder="原密码"
               type="password" :rules="passwordRules" variant="outlined" :autofocus="true"/>
    <var-input class="edit-input" v-model="newPassword" placeholder="新密码"
               type="password" :rules="passwordRules" variant="outlined"/>
    <var-input class="edit-input" v-model="rePassword" placeholder="重复新密码"
               type="password" :rules="rePasswordRules" variant="outlined"/>
    <var-button-group class="edit-button-group">
      <var-button type="default" @click="$emit('close')">取消</var-button>
      <var-button type="primary" @click="updatePassword()">保存</var-button>
    </var-button-group>
  </var-form>
</template>

<style scoped>
.edit-block {
  display: block;
  width: min(100vw, 720px);
  background: var(--color-background);
  padding: 20px;
}

.edit-input {
  padding: 10px 0;
}

.edit-button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>