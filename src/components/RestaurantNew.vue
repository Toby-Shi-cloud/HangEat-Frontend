<script setup lang="ts">
import {ref} from "vue";
import {type Input, Snackbar} from "@varlet/ui";
import {doCreateRestaurant, doReferTag, doUpdateRestaurant} from "@/services/restaurant";
import {tagRules} from "@/components/ts/rules";

const emit = defineEmits<{
  close: []
}>();

const name = ref('');
const address = ref('');
const phone = ref('');
const description = ref('');
const tags = ref<string[]>([]);
const tag = ref('');
const tagInput = ref<Input>();

const doCreate = async () => {
  try {
    const {data} = await doCreateRestaurant(name.value, address.value, phone.value);
    Snackbar.success(data.message);
    try {
      await doReferTag(data.id, tags.value);
      await doUpdateRestaurant(data.id, undefined, description.value);
    } catch (e) {
      console.log(e);
    }
    location.href = `/restaurant/${data.id}`;
  } catch (e) {}
}

const onTagEnter = async (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    if (!await (tagInput.value as Input).validate()) return;
    if (tag.value === '') return;
    tags.value.push(...tag.value.split(/[,，]/));
    tag.value = '';
  }
}
</script>

<template>
  <var-form class="edit-block">
    <h1>新餐馆</h1>
    <var-input class="edit-input" v-model="name" placeholder="餐馆名称" variant="outlined" :autofocus="true"/>
    <var-input class="edit-input" v-model="address" placeholder="餐馆地址" variant="outlined"/>
    <var-input class="edit-input" v-model="phone" placeholder="餐馆电话" variant="outlined"/>
    <var-space direction="row" align="center" class="edit-tags edit-input">
      <font-awesome-icon size="xl" :icon="['fas', 'tags']"/>
      <var-chip v-for="tag in tags" closeable
                @close="tags.splice(tags.indexOf(tag), 1)">
        {{ tag }}
      </var-chip>
    </var-space>
    <var-input class="edit-input" ref="tagInput" v-model="tag" placeholder="新标签"
               variant="outlined" :onkeydown="onTagEnter" :rules="tagRules(tags)"/>
    <var-input class="edit-input" v-model="description" :textarea="true" placeholder="餐馆描述" variant="outlined"/>
    <var-button-group class="edit-button-group">
      <var-button type="default" @click="$emit('close')">取消</var-button>
      <var-button type="primary" @click="doCreate">保存</var-button>
    </var-button-group>
  </var-form>
</template>

<style scoped src="./css/edit.css"/>