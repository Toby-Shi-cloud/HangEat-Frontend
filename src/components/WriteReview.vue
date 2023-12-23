<script setup lang="ts">
import {ref} from "vue";
import {type Form, Snackbar, type VarFile} from "@varlet/ui";
import {doCreatePost, doUpdatePostImage, doUpdatePost} from "@/services/post";
import RichTextEditor from "@/components/RichTextEditor.vue";
import type {PostInfo} from "@/store";

const props = defineProps<{
  restaurantId: number
  postInfo?: PostInfo
}>();

const emits = defineEmits<{
  submit: []
}>();

const editor = ref<InstanceType<typeof RichTextEditor>>();
const form = ref<Form>();
const title = ref(props.postInfo?.title ?? '');
const content = ref(props.postInfo?.content ?? '');
const grade = ref(props.postInfo?.grade ?? 0);
const price = ref(props.postInfo?.avg_price?.toString() ?? '');
const images = ref<VarFile[]>(props.postInfo?.image ? [{
  url: props.postInfo.image,
  cover: props.postInfo.image,
}] : []);

const createReview = async () => {
  if (!await form.value?.validate()) return;
  const image = images.value[0];
  if (image.file === undefined) {
    Snackbar.error("没有上传文件！");
    return;
  }
  if (image.state === "loading") {
    Snackbar.error("文件在加载中！");
    return;
  }
  try {
    const {data} = await doCreatePost(props.restaurantId, title.value, content.value, grade.value, parseFloat(price.value));
    try {
      await doUpdatePostImage(data.id, image.file);
    } catch (e) {}
    Snackbar.success(data.message);
    emits('submit');
    title.value = '';
    grade.value = 0;
    price.value = '';
    images.value = [];
    editor.value?.editor?.setText('');
  } catch (e) {}
};

const editReview = async () => {
  if (!await form.value?.validate()) return;
  let image = images.value[0];
  if (image.state === "loading") {
    Snackbar.error("文件在加载中！");
    return;
  }
  try {
    const {data} = await doUpdatePost(props.postInfo!.id!, title.value, content.value, grade.value, parseFloat(price.value));
    if (image.file) try {
      await doUpdatePostImage(data.id, image.file);
    } catch (e) {}
    Snackbar.success(data.message);
    emits('submit');
  } catch (e) {}
};

const focusEditor = () => {
  editor.value?.editor?.focus();
}

defineExpose({focusEditor});
</script>

<template>
  <var-form ref="form">
    <var-input v-model="title" placeholder="标题" variant="outlined"
               class="edit-input" :rules="[v => v.trim() != '' || '标题不能为空']"/>
    <var-space direction="row" align="center" class="edit-input" style="margin-bottom: 5px">
      <var-space direction="row" align="center" :size="0">
        <span>评分：</span>
        <var-rate v-model="grade" :rules="[v => !!v || '请评分']"/>
      </var-space>
      <var-input v-model="price" placeholder="人均价格￥" variant="outlined"
                 :rules="[v => /^\d{0,5}$/.test(v) || '请输入正确的价格']"/>
      <var-space direction="row" align="center" :size="0">
        <span>封面：</span>
        <var-uploader v-model="images" maxlength="1"
                      :maxsize="2048 * 1024" @oversize="Snackbar.error('文件大小超出限制')"/>
      </var-space>
    </var-space>
    <RichTextEditor v-model:content="content" ref="editor"/>
    <var-button block type="primary" style="margin: 10px 0" @click="() => postInfo ? editReview() : createReview()">发布</var-button>
  </var-form>
</template>

<style scoped src="./css/edit.css"/>