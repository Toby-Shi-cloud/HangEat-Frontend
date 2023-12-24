<script setup lang="ts">
import {ref} from "vue";
import {Quill, QuillEditor} from "@vueup/vue-quill";
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
import ImageUploader from 'quill-image-uploader';
import MarkdownShortcuts from 'quill-markdown-shortcuts';
import {doUploadImage} from "@/services/post";

if (!Quill.imports['modules/BlotFormatter']) {
  Quill.register('modules/BlotFormatter', BlotFormatter);
}
if (!Quill.imports['modules/MarkdownShortcuts']) {
  Quill.register('modules/MarkdownShortcuts', MarkdownShortcuts);
}
if (!Quill.imports['modules/ImageUploader']) {
  Quill.register('modules/ImageUploader', ImageUploader);
}

const editor = ref<InstanceType<typeof QuillEditor>>();
const options = {
  modules: {
    BlotFormatter: {},
    MarkdownShortcuts: {},
    ImageUploader: {
      upload: async (file: File) => {
        const {data} = await doUploadImage(file);
        return data.url;
      }
    },
  },
  theme: "snow",
};

defineExpose({editor});
</script>

<template>
  <quill-editor contentType="html" :options="options" ref="editor" style="min-height: 20vh"/>
</template>

<style scoped/>