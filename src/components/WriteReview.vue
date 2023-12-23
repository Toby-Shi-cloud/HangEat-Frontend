<script setup lang="ts">
import {ref} from "vue";
import {type Form, Snackbar, type VarFile} from "@varlet/ui";
import {QuillEditor} from "@vueup/vue-quill";
import BlotFormatter from 'quill-blot-formatter';
import ImageUploader from 'quill-image-uploader';
import MarkdownShortcuts from 'quill-markdown-shortcuts';
import {doCreatePost, doUploadImage, doUpdatePostImage} from "@/services/post";

const props = defineProps<{
  restaurantId: number
}>();

const emits = defineEmits<{
  submit: []
}>();

const quillEditorRef = ref<InstanceType<typeof QuillEditor>>();
const quillModules = [{
  name: "blotFormatter",
  module: BlotFormatter,
}, {
  name: "markdownShortcuts",
  module: MarkdownShortcuts,
}, {
  name: "imageUploader",
  module: ImageUploader,
  options: {
    upload: async (file: File) => {
      const {data} = await doUploadImage(file);
      return data.url;
    }
  }
}];

const form = ref<Form>();
const title = ref('');
const content = ref('');
const grade = ref(0);
const price = ref('');
const images = ref<VarFile[]>([]);

const handleReview = async () => {
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
    try { await doUpdatePostImage(data.id, image.file); } catch (e) {}
    Snackbar.success(data.message);
    emits('submit');
    title.value = '';
    content.value = '';
    grade.value = 0;
    price.value = '';
    images.value = [];
  } catch (e) {}
};

const focusEditor = () => {
  quillEditorRef.value?.focus();
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
    <quill-editor v-model:content="content" contentType="html" :modules="quillModules"
                  ref="quillEditorRef" style="min-height: 20vh"/>
    <var-button block type="primary" style="margin: 10px 0" @click="handleReview">发布</var-button>
  </var-form>
</template>

<style scoped src="./css/edit.css"/>
