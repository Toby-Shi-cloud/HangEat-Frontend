<script setup lang="ts">
import {ref} from "vue";
import {QuillEditor} from "@vueup/vue-quill";
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
import ImageUploader from 'quill-image-uploader';
import MarkdownShortcuts from 'quill-markdown-shortcuts';
import {doUploadImage} from "@/services/post";

const editor = ref<InstanceType<typeof QuillEditor>>();
const quillModules = [{
  name: "blotFormatter",
  module: BlotFormatter,
  options: {},
}, {
  name: "markdownShortcuts",
  module: MarkdownShortcuts,
  options: {},
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

defineExpose({editor});
</script>

<template>
  <quill-editor contentType="html" :modules="quillModules" ref="editor" style="min-height: 20vh"/>
</template>

<style scoped/>