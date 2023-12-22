<script setup lang="ts">
import {ref} from "vue";
import {type Form, Snackbar} from "@varlet/ui";
import type {RestaurantInfo} from "@/store";
import {doUpdateRestaurant} from "@/services/restaurant";

const props = defineProps<{
  restaurant: RestaurantInfo
}>();

const emit = defineEmits<{
  close: []
  updateImg: []
}>();

const id = props.restaurant.id!;
const name = ref(props.restaurant.name || '');
const description = ref(props.restaurant.description || '');
const address = ref(props.restaurant.detail_addr || '');
const phone = ref(props.restaurant.phone || '');
const form = ref<Form | null>(null);

const doEdition = async () => {
  if (!await (form.value as Form).validate()) return;
  let _name = name.value === props.restaurant.name ? undefined : name.value;
  doUpdateRestaurant(id, _name, description.value, address.value, phone.value).then(response => {
    Snackbar.success(response.data.message);
    props.restaurant.name = name.value;
    props.restaurant.description = description.value;
    props.restaurant.detail_addr = address.value;
    props.restaurant.phone = phone.value;
    emit("close");
  }).catch();
};
</script>

<template>
  <var-form class="edit-block" ref="form">
    <h1>编辑餐馆资料</h1>
    <var-input class="edit-input" v-model="name" placeholder="餐馆名称" variant="outlined" :autofocus="true"/>
    <var-input class="edit-input" v-model="address" placeholder="餐馆地址" variant="outlined"/>
    <var-input class="edit-input" v-model="phone" placeholder="餐馆电话" variant="outlined"/>
    <var-input class="edit-input" v-model="description" :textarea="true" placeholder="餐馆描述" variant="outlined"/>
    <var-button-group class="edit-button-group" style="grid-template-columns: 1fr 1fr 1fr">
      <var-button type="default" @click="$emit('close')">取消</var-button>
      <var-button type="info" @click="$emit('updateImg')">上传封面照片</var-button>
      <var-button type="primary" @click="doEdition">保存</var-button>
    </var-button-group>
  </var-form>
</template>

<style scoped src="./css/edit.css"/>