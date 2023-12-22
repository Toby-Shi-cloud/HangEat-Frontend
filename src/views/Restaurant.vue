<script setup lang="ts">
import {ref} from "vue";
import type {RestaurantInfo} from "@/store";
import {doGetRestaurantDetail} from "@/services/restaurant";
import {Snackbar} from "@varlet/ui";
import {useAuthStore} from "@/store/user";
import {doFavoriteRestaurant, doUnfavoriteRestaurant} from "@/services/user";

const props = defineProps<{
  id: string
}>();
const restId = /^\d+$/.test(props.id) ? parseInt(props.id) : undefined;
const restaurant = ref<RestaurantInfo>({});
const loading = ref(true);
const error = ref(restId === undefined);
const isFavorite = ref(false);
const authStore = useAuthStore();
const width = ref(window.innerWidth);
window.onresize = () => width.value = window.innerWidth;

const getRestaurantInfo = () => {
  if (!restId) return;
  doGetRestaurantDetail(restId).then(res => {
    restaurant.value = res.data;
    loading.value = false;
  }).catch(() => {
    error.value = true;
  });
};
getRestaurantInfo();

const unimplement = () => Snackbar.warning('功能尚未实现');

const handleReview = unimplement;

const handleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    Snackbar.error('请先登录');
    setTimeout(() => location.href = `/login?url=${location.href}`, 1000);
    return;
  }
  try {
    let handler = isFavorite.value ? doUnfavoriteRestaurant : doFavoriteRestaurant;
    const {data} = await handler(restId!);
    Snackbar.success(data.message);
    isFavorite.value = !isFavorite.value;
  } catch (e) {
  }
};

const handleShare = async () => {
  if (navigator.clipboard as unknown === undefined) {
    Snackbar.error(`无剪贴板写入权限（${window.isSecureContext ? '未知原因' : '不安全'}）`);
    return;
  }
  try {
    await navigator.clipboard.writeText(location.href);
    Snackbar.success('链接已复制到剪贴板');
  } catch (e) {
    Snackbar.error('复制失败');
  }
};

const handlePosition = unimplement;

const handleEdition = unimplement;

const handleTagClick = (tag: string) => location.href = `/restaurants?tag=${tag}`;
</script>

<template>
  <var-result v-if="error" type="error" title="餐厅不存在" description="请检查链接是否正确"/>
  <main v-else>
    <var-app-bar id="restaurant-header" elevation="false">
      <template #left>
        <h1>{{ restaurant.name }}</h1>
        <font-awesome-icon :icon="['fas', 'circle-check']" color="green" style="margin: 10px 5px; align-self: end"/>
      </template>
      <template #right>
        <var-space size="small" style="margin-right: 10px">
          <font-awesome-icon :icon="['fas', 'pencil']"/>
          <var-link underline="hover" @click="handleReview">写评论</var-link>
          <span>|</span>
          <font-awesome-icon :icon="[isFavorite ? 'fas' : 'far', 'heart']"/>
          <var-link underline="hover" @click="handleFavorite">收藏</var-link>
          <span>|</span>
          <font-awesome-icon :icon="['fas', 'up-right-from-square']"/>
          <var-link underline="hover" @click="handleShare">分享</var-link>
        </var-space>
      </template>
      <template #content>
        <var-space size="small">
          <font-awesome-icon :icon="['fas', 'location-dot']"/>
          <var-link @click="handlePosition">{{ restaurant.detail_addr }}</var-link>
          <span>|</span>
          <font-awesome-icon :icon="['fas', 'phone']"/>
          <var-link v-if="restaurant.phone" :href="`tel: ${restaurant.phone}`">{{ restaurant.phone }}</var-link>
          <p v-else>&emsp;-&emsp;</p>
          <span>|</span>
          <font-awesome-icon :icon="['far', 'pen-to-square']"/>
          <var-link @click="handleEdition">更改信息</var-link>
        </var-space>
      </template>
    </var-app-bar>

    <var-divider class="restaurant-divider"/>

    <var-space direction="column" size="20px">
      <div id="restaurant-main">
        <var-watermark content="买家秀">
          <div id="restaurant-images">
            <var-image height="30vh" fit="scale-down" :src="restaurant.img"></var-image>
          </div>
        </var-watermark>
      </div>
      <var-row id="restaurant-overview" :gutter="[10, 10]" :align="'' as any">
        <var-col class="restaurant-overview-card" :span="width < 768 ? 24 : 8">
          <var-card title="评分" style="height: 100%">
            <template #description>
              <div class="restaurant-overview-description">
                此处用于展示餐厅评分，评价数等信息，暂未实现。
              </div>
            </template>
          </var-card>
        </var-col>
        <var-col class="restaurant-overview-card" :span="width < 768 ? 24 : 8">
          <var-card title="详细信息" style="height: 100%">
            <template #description>
              <div class="restaurant-overview-description">
                <var-image fit="scale-down" :src="restaurant.img"/>
                <var-divider/>
                <h3>详细描述</h3>
                <pre class="pre-wrap">{{ restaurant.description || '\n' }}</pre>
                <h3>Tags</h3>
                <div v-if="restaurant.tags">
                  <div v-for="tag in restaurant.tags" class="restaurant-overview-tag">
                    <var-link @click="handleTagClick(tag)">{{ tag }}</var-link>
                  </div>
                </div>
              </div>
            </template>
          </var-card>
        </var-col>
        <var-col class="restaurant-overview-card" :span="width < 768 ? 24 : 8">
          <var-card title="地址和联系方式" style="height: 100%">
            <template #description>
              <div class="restaurant-overview-description">
                <var-image src="https://developers.google.cn/static/maps/images/landing/hero_js_api_480.png"
                           @click="unimplement"/>
                <var-divider/>
                <var-cell>
                  <template #icon>
                    <font-awesome-icon :icon="['fas', 'location-dot']"/>
                  </template>
                  <var-link @click="handlePosition" style="margin: 0 10px">{{ restaurant.detail_addr }}</var-link>
                </var-cell>
                <var-cell>
                  <template #icon>
                    <font-awesome-icon :icon="['fas', 'phone']"/>
                  </template>
                  <var-link v-if="restaurant.phone" :href="`tel: ${restaurant.phone}`" style="margin: 0 10px">
                    {{ restaurant.phone }}
                  </var-link>
                  <p v-else style="margin: 0 10px">&emsp;-&emsp;</p>
                </var-cell>
              </div>
            </template>
            <template #extra>
              <var-button outline text type="primary" @click="handleEdition">修改信息</var-button>
            </template>
          </var-card>
        </var-col>
      </var-row>
      <var-paper>
        <h1>评论模块（暂未实现）</h1>
        <div style="min-height: 30vh"></div>
      </var-paper>
    </var-space>
  </main>
</template>

<style scoped>
#restaurant-header {
  z-index: 9;
  margin-top: -2rem;
  width: calc(100vw - 4rem);
  max-width: 1280px;
  --app-bar-color: rgba(0, 0, 0, 0);
  --app-bar-text-color: var(--color-heading);
  --link-font-size: var(--font-size-lg);
}

.restaurant-divider {
  position: absolute;
  left: 0;
  width: 100vw;
  place-items: center;

  --divider-text-margin: 0;
  --divider-text-padding: 0;
  --divider-color: var(--color-border);
}

#restaurant-main {
  margin-top: 1rem;
  max-width: calc(100vw - 4rem);
}

#restaurant-images {
  display: flex;
  flex-direction: column;
  height: 30vh;
  max-width: inherit;
}

#restaurant-overview {
  max-width: inherit;
}

.restaurant-overview-description {
  padding: 10px;
}

.restaurant-overview-tag {
  display: inline;
}

.restaurant-overview-tag:before {
  content: "，";
}

.restaurant-overview-tag:first-child:before {
  content: "";
}
</style>