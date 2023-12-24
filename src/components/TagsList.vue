<script setup lang="ts">
import {ref, watch} from 'vue';
import {doGetTagList, doGetTagNum} from "@/services/restaurant";
import CheckChip from "@/components/CheckChip.vue";

const props = withDefaults(defineProps<{
  title?: string
  checkedTags?: string[]
}>(), {
  title: '',
  checkedTags: () => [],
});

const emits = defineEmits<{
  clicked: [tag: string, checked: boolean]
  'update:checkedTags': [checkedTags: string[]]
}>();

interface TagInfo {
  name: string;
  state: number;
}

const data = ref<TagInfo[]>([]);
const total = ref(0);
const error = ref(false);

const refresh = async () => {
  total.value = (await doGetTagNum()).data.tag_num;
  const list = (await doGetTagList(0, total.value)).data.list;
  list.forEach((t: any) => t.state = props.checkedTags.includes(t.name) ? 1 : 0);
  data.value = list;
};
refresh().catch(() => error.value = true);

const onClicked = (tag: TagInfo) => {
  emits('clicked', tag.name, tag.state === 1);
  emits('update:checkedTags', data.value.filter(t => t.state === 1).map(t => t.name));
};
</script>

<template>
  <var-cell v-if="error" icon="close-circle" title="出错啦！" style="color: var(--color-danger)"/>
  <div v-else>
    {{ title }}
    <CheckChip v-for="tag in data" style="margin: 2px" v-model:current="tag.state" @clicked="onClicked(tag)">
      {{ tag.name }}
    </CheckChip>
  </div>
</template>

<style scoped>

</style>