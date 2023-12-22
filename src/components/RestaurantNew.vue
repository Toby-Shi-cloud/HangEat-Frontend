<script setup lang="ts">
import {ref} from "vue";
import {type Form, Snackbar} from "@varlet/ui";
import {doCreateRestaurant} from "@/services/restaurant";

const emit = defineEmits<{
  (e: 'close'): void
}>();

const name = ref('');
const address = ref('');
const phone = ref('');
const form = ref<Form | null>(null);

const doCreate = async () => {
  if (!await (form.value as Form).validate()) return;
  doCreateRestaurant(name.value, address.value, phone.value).then(response => {
    Snackbar.success(response.data.message);
    emit("close");
  }).catch();
}
</script>

<template>

  <var-form class="edit-block" ref="form">
    <h1>新餐馆</h1>
    <var-input class="edit-input" v-model="name" placeholder="餐馆名称" variant="outlined" :autofocus="true"/>
    <var-input class="edit-input" v-model="address" placeholder="餐馆地址" variant="outlined"/>
    <var-input class="edit-input" v-model="phone" placeholder="餐馆电话" variant="outlined"/>
    <var-button-group class="edit-button-group">
      <var-button type="default" @click="$emit('close')">取消</var-button>
      <var-button type="primary" @click="doCreate">保存</var-button>
    </var-button-group>
  </var-form>
</template>

<style scoped src="./css/edit.css"/>