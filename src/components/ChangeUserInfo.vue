<script setup lang="ts">
import {ref, watch} from "vue";
import {type Form, type VarFile, Snackbar} from "@varlet/ui";
import {useAuthStore} from "@/store/user";
import {usernameRules} from "./ts/rules";
import {doUpdateAvatar, doUpdateInfo} from "@/services/user";

const emit = defineEmits<{
  (e: 'close'): void
}>();

const authStore = useAuthStore();
if (authStore.needRefreshInfo) {
  authStore.refreshUserInfo().catch();
}

const username = ref(authStore.getUserInfo.username || "");
const motto = ref(authStore.getUserInfo.motto || "");
watch([authStore.getUserInfo], () => {
  username.value = authStore.getUserInfo.username || "";
  motto.value = authStore.getUserInfo.motto || "";
});

const form = ref<Form | null>(null);

async function updateUserInfo() {
  if (!await (form.value as Form).validate()) return;
  const newName = username.value === authStore.getUserInfo.username ? null : username.value;
  doUpdateInfo(newName, motto.value).then(response => {
    Snackbar.success(response.data.message);
    authStore.setUserInfo({
      username: username.value,
      motto: motto.value
    })
    emit("close");
  }).catch();
}

async function onKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    emit("close");
  }
}

const uploadingAvatar = ref(false);
const avatars = ref<VarFile[]>([]);

async function updateAvatar() {
  const avatar = avatars.value[0];
  if (avatar.state === "loading") {
    Snackbar.error("文件在加载中！");
    return;
  }
  if (avatar.file === undefined) {
    Snackbar.error("没有上传文件！");
    return;
  }
  doUpdateAvatar(avatar.file).then(response => {
    Snackbar.success(response.data.message);
    authStore.setUserInfo({
      avatar: response.data.url
    });
    uploadingAvatar.value = false;
  }).catch();
}
</script>

<template>
  <var-skeleton :loading="authStore.needRefreshInfo">
    <div class="edit-block">
      <var-avatar class="edit-avatar" :src="authStore.getUserInfo.avatar" :size="120"
                  @click="uploadingAvatar = true" :hoverable="true"/>
      <var-form ref="form" class="edit-form" :onkeydown="onKeyDown">
        <var-input class="edit-input" v-model="username" placeholder="用户名"
                   :rules="usernameRules" variant="outlined" :autofocus="true"/>
        <var-input class="edit-input" v-model="motto" placeholder="用户签名"
                   :textarea="true" variant="outlined"/>
        <var-button-group class="edit-button-group">
          <var-button type="default" @click="$emit('close')">取消</var-button>
          <var-button type="primary" @click="updateUserInfo()">保存</var-button>
        </var-button-group>
      </var-form>
    </div>
  </var-skeleton>
  <var-popup
      overlay-class="normal-popup-overlay"
      style="border-radius: 8px"
      v-model:show="uploadingAvatar">
    <div class="upload-avatar">
      <h2>上传头像</h2>
      <var-cell title="请上传照片（大小不超过2M）"></var-cell>
      <var-uploader v-model="avatars" :maxlength="1"
                    :maxsize="2048 * 1024" @oversize="Snackbar.error('文件大小超出限制')"/>
      <var-button type="primary" @click="updateAvatar()">上传</var-button>
    </div>
  </var-popup>
</template>

<style scoped>
.edit-block {
  display: block;
  width: min(100vw, 720px);
  background: var(--color-background);
  padding: 20px 10px 20px 0;
  overflow: auto;
  --avatar-border: 1px solid var(--color-border);
}

@media (min-width: 720px) {
  .edit-block {
    display: grid;
    grid-template-columns: 1fr 4fr;
  }

  .edit-avatar {
    justify-self: center;
  }
}

.edit-input {
  padding: 10px 0;
}

.edit-button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.upload-avatar {
  display: block;
  padding: 20px;
}
</style>