<script setup lang="ts">
import {ref} from "vue";
import {type Form, type VarFile, Snackbar} from "@varlet/ui";
import type {RestaurantInfo} from "@/store";
import {doUpdateImage} from "@/services/restaurant";

const props = defineProps<{
  restaurant: RestaurantInfo
}>();

const emit = defineEmits<{
  close: []
}>();

const id = props.restaurant.id!;
const images = ref<VarFile[]>([]);
const form = ref<Form | null>(null);

const update = async () => {
  if (!await (form.value as Form).validate()) return;
  if (images.value.length === 0) {
    Snackbar.error('请先上传图片');
    return;
  }
  const image = images.value[0];
  if (image.state === "loading") {
    Snackbar.error("文件仍在加载中！");
    return;
  }
  doUpdateImage(id, images.value[0].file!).then(response => {
    Snackbar.success(response.data.message);
    emit("close");
  }).catch();
};
</script>

<template>
  <var-form class="edit-block" ref="form">
    <h1>上传餐馆封面</h1>
    <var-cell title="请上传照片（大小不超过2M）"></var-cell>
    <var-uploader v-model="images" :maxlength="1"
                  :maxsize="2048 * 1024" @oversize="Snackbar.error('文件大小超出限制')"/>
    <var-button-group class="edit-button-group">
      <var-button type="default" @click="$emit('close')">取消</var-button>
      <var-button type="primary" @click="update">保存</var-button>
    </var-button-group>
  </var-form>
</template>

<style scoped src="./css/edit.css"/>