<script setup lang="ts">
import {ref, computed} from "vue";
import type {RestaurantInfo, UserInfo} from "@/store";
import {doDeleteRestaurant, doGetRestaurantDetail} from "@/services/restaurant";
import {type Input, Snackbar} from "@varlet/ui";
import {useAuthStore, useUsersStore} from "@/store/user";
import {doFavoriteRestaurant, doUnfavoriteRestaurant} from "@/services/user";
import {doGetPostNum} from "@/services/post";
import RestaurantEdition from "@/components/RestaurantEdition.vue";
import RestaurantNewImg from "@/components/RestaurantNewImg.vue";
import PostList from "@/components/PostList.vue";
import WriteReview from "@/components/WriteReview.vue";
import GradeView from "@/components/GradeView.vue";
import router from "@/router";
import os from "@/components/ts/os";
import screen from "@/components/ts/screen";

const props = defineProps<{
  id: string
}>();
const restId = /^\d+$/.test(props.id) ? parseInt(props.id) : undefined;
const restaurant = ref<RestaurantInfo>({});
const postsNum = ref<number | null>(null);
const loading = ref(true);
const error = ref(restId === undefined);
const authStore = useAuthStore();
const usersStore = useUsersStore();
const creatorInfo = ref<UserInfo | null>(null);
const overviewSpan = computed(() => screen.width.value < 768 ? 24 : 8);
const writeReviewRef = ref<InstanceType<typeof WriteReview>>();
const postsRef = ref<InstanceType<typeof PostList>>();

const getRestaurantInfo = () => {
  if (!restId) return;
  doGetRestaurantDetail(restId).then(res => {
    restaurant.value = res.data;
    loading.value = false;
    usersStore.fetchUserInfo(restaurant.value.creator!).then(data => {
      creatorInfo.value = data;
    }).catch();
  }).catch(() => {
    error.value = true;
  });
  doGetPostNum(restId).then(res => {
    postsNum.value = res.data.post_num;
  }).catch(() => {
    postsNum.value = null;
  });
};
getRestaurantInfo();

const unimplement = () => Snackbar.warning('功能尚未实现');

const handleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    Snackbar.error('请先登录');
    setTimeout(() => router.push(`/login?url=${location.pathname}`), 1000);
    return;
  }
  try {
    let handler = restaurant.value.is_collected ? doUnfavoriteRestaurant : doFavoriteRestaurant;
    const {data} = await handler(restId!);
    Snackbar.success(data.message);
    restaurant.value.is_collected = !restaurant.value.is_collected;
    if (restaurant.value.is_collected) restaurant.value.collectors_num = restaurant.value.collectors_num! + 1;
    else restaurant.value.collectors_num = restaurant.value.collectors_num! - 1;
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

const inEdition = ref(false);
const updatingImg = ref(false);
const handleEdition = (what: string) => {
  if (!authStore.isAuthenticated) {
    if (what === 'img') return;
    Snackbar.error('请先登录');
    setTimeout(() => router.push(`/login?url=${location.pathname}`), 1000);
    return;
  }
  if (restaurant.value.creator !== authStore.getUserInfo.id) {
    if (what === 'img') return;
    Snackbar.error('您无权修改此餐厅信息');
    return;
  }
  if (what === 'edit') inEdition.value = true;
  if (what === 'img') updatingImg.value = true;
};

const deletingRestaurant = ref(false);
const deletingInputString = ref("");
const deletingInput = ref<Input>();
const deleteRestaurant = async () => {
  if (!await (deletingInput.value as Input).validate()) return;
  try {
    const {data} = await doDeleteRestaurant(restaurant.value.id!);
    Snackbar.success(data.message);
    setTimeout(() => router.push('/restaurants'), 1000);
  } catch (e) {
  }
};

const handleTagClick = (tag: string) => router.push(`/restaurants?tags=${tag}`);
</script>

<template>
  <var-result v-if="error" type="error" title="餐厅不存在" description="请检查链接是否正确"/>
  <main v-else>
    <var-app-bar id="restaurant-header" elevation="false">
      <template #left>
        <var-space direction="row" :size="3" align="end">
          <h1>{{ restaurant.name }}</h1>
          <var-space direction="row" :size="2" align="center">
            <font-awesome-icon :icon="['far', 'heart']"/>
            <p>{{ restaurant.collectors_num }}</p>
          </var-space>
        </var-space>
      </template>
      <template #right>
        <var-space v-if="!os.isPhone" size="small" style="margin-right: 10px">
          <font-awesome-icon :icon="['fas', 'pencil']"/>
          <var-link underline="hover" @click="writeReviewRef?.focusEditor()">发布帖子</var-link>
          <span>|</span>
          <font-awesome-icon :icon="[restaurant.is_collected ? 'fas' : 'far', 'heart']"
                             :color="restaurant.is_collected ? 'red' : ''"/>
          <var-link underline="hover" @click="handleFavorite">收藏</var-link>
          <span>|</span>
          <font-awesome-icon :icon="['fas', 'up-right-from-square']"/>
          <var-link underline="hover" @click="handleShare">分享</var-link>
        </var-space>
      </template>
      <template #content>
        <var-space v-if="os.isPhone" size="small" style="margin-right: 10px">
          <font-awesome-icon :icon="['fas', 'pencil']"/>
          <var-link underline="hover" @click="writeReviewRef?.focusEditor()">发布帖子</var-link>
          <span>|</span>
          <font-awesome-icon :icon="[restaurant.is_collected ? 'fas' : 'far', 'heart']"
                             :color="restaurant.is_collected ? 'red' : ''"/>
          <var-link underline="hover" @click="handleFavorite">收藏</var-link>
          <span>|</span>
          <font-awesome-icon :icon="['fas', 'up-right-from-square']"/>
          <var-link underline="hover" @click="handleShare">分享</var-link>
        </var-space>
        <var-space size="small">
          <font-awesome-icon :icon="['fas', 'location-dot']"/>
          <var-link @click="handlePosition">{{ restaurant.detail_addr }}</var-link>
          <span>|</span>
          <font-awesome-icon :icon="['fas', 'phone']"/>
          <var-link v-if="restaurant.phone" :href="`tel: ${restaurant.phone}`">
            {{ restaurant.phone }}
          </var-link>
          <p v-else>&emsp;-&emsp;</p>
          <span>|</span>
          <font-awesome-icon :icon="['far', 'pen-to-square']"/>
          <var-link @click="handleEdition('edit')">更改信息</var-link>
        </var-space>
      </template>
    </var-app-bar>

    <var-divider class="restaurant-divider"/>

    <var-space direction="column" size="20px">
      <div id="restaurant-main">
        <div id="restaurant-images">
          <var-image height="30vh" fit="scale-down" :src="restaurant.img"></var-image>
        </div>
      </div>
      <var-row id="restaurant-overview" :gutter="[10, 10]" :align="'' as any">
        <var-col class="restaurant-overview-card" :span="overviewSpan">
          <var-paper :elevation="true" :radius="8" style="height: 100%; width: 100%">
            <var-card :elevation="false" title="总体评价">
              <template #description>
                <div class="restaurant-overview-description">
                  <var-space direction="column">
                    <GradeView :grade="restaurant.avg_grade" title detail/>
                    <p>人均价格：¥{{ restaurant.avg_price?.toFixed(2) || '未知' }}</p>
                  </var-space>
                </div>
              </template>
            </var-card>
            <var-divider/>
            <var-card :elevation="false" title="信息修改历史">
              <template #description>
                <var-space v-if="creatorInfo" direction="column" style="margin: 10px 10px 0">
                  <var-space direction="row" :size="0">
                    <p>页面所有者：</p>
                    <var-link :to="`/user/${creatorInfo.id}`">{{ creatorInfo.username }}</var-link>
                  </var-space>
                  <p>页面创建时间：{{ new Date(restaurant.created_at!).toLocaleDateString() }}</p>
                  <p>最后修改时间：{{ new Date(restaurant.updated_at!).toLocaleDateString() }}</p>
                </var-space>
                <var-cell v-else title="信息缺失"/>
              </template>
            </var-card>
          </var-paper>
        </var-col>
        <var-col class="restaurant-overview-card" :span="overviewSpan">
          <var-card title="详细信息" style="height: 100%">
            <template #description>
              <div class="restaurant-overview-description">
                <var-image fit="scale-down" :src="restaurant.img" @click="handleEdition('img')"/>
                <var-divider/>
                <h3>详细描述</h3>
                <pre class="pre-wrap">{{ restaurant.description || '\n' }}</pre>
                <h3>Tags</h3>
                <var-space direction="row" v-if="restaurant.tags">
                  <var-chip v-for="tag in restaurant.tags" class="restaurant-overview-tag"
                            size="large" @click="handleTagClick(tag)"
                            v-hover="{ color: '#fff', background: 'var(--color-primary)' }">
                    {{ tag }}
                  </var-chip>
                </var-space>
              </div>
            </template>
          </var-card>
        </var-col>
        <var-col class="restaurant-overview-card" :span="overviewSpan">
          <var-card title="地址和联系方式" style="height: 100%">
            <template #description>
              <div class="restaurant-overview-description">
                <var-image src="https://s2.loli.net/2024/01/01/zhaYnUV7LGDtflH.png"
                           href="https://sm.ms/image/zhaYnUV7LGDtflH" target="_blank"/>
                <var-divider/>
                <var-cell>
                  <template #icon>
                    <font-awesome-icon :icon="['fas', 'location-dot']"/>
                  </template>
                  <var-link @click="handlePosition" style="margin: 0 10px">
                    {{ restaurant.detail_addr }}
                  </var-link>
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
              <var-button outline text type="primary" @click="handleEdition('edit')">修改信息</var-button>
            </template>
          </var-card>
        </var-col>
      </var-row>
      <var-paper :elevation="true" :radius="8" style="padding: 15px">
        <h2 style="margin-bottom: 10px">写帖子
          <var-link v-if="!authStore.isAuthenticated" text-size="20px" :to="`/login?url=${$route.path}`">
            请先登录
          </var-link>
        </h2>
        <WriteReview ref="writeReviewRef" :restaurant-id="restId!" @submit="postsRef?.refresh(); getRestaurantInfo()"/>
      </var-paper>
      <var-paper :elevation="true" :radius="8" style="padding: 15px">
        <h2 style="margin-bottom: 10px">帖子（{{ postsNum === null ? '加载失败' : postsNum }}）</h2>
        <PostList :restaurant-id="restId!" ref="postsRef"/>
      </var-paper>
    </var-space>
  </main>

  <footer v-if="authStore.isAuthenticated && authStore.userInfo.id === restaurant.creator" id="app-footer">
    <div style="display: inline-grid; place-items: center; width: 100%">
      <var-link type="danger" @click="deletingRestaurant = true" style="place-self: center">永久删除餐馆</var-link>
    </div>
  </footer>

  <var-popup overlay-class="normal-popup-overlay"
             class="normal-popup-class"
             v-model:show="inEdition">
    <RestaurantEdition :restaurant="restaurant" @close="inEdition = false" @update-img="updatingImg = true"/>
  </var-popup>

  <var-popup overlay-class="normal-popup-overlay"
             class="normal-popup-class"
             v-model:show="updatingImg">
    <RestaurantNewImg :restaurant="restaurant" @close="updatingImg = false; getRestaurantInfo()"/>
  </var-popup>

  <var-popup overlay-class="normal-popup-overlay"
             class="normal-popup-class"
             v-model:show="deletingRestaurant">
    <var-result type="warning" title="永久删除餐馆" description="您确定要永久删除餐馆吗？">
      <template #image>
        <font-awesome-icon
            :icon="['fas', 'circle-exclamation']"
            style="color: var(--color-danger); width: 72px; height: 72px"/>
      </template>
      <template #footer>
        <var-form>
          <var-input
              ref="deletingInput"
              v-model="deletingInputString"
              :placeholder="`请输入：“我确定删除${restaurant.name!}”`"
              :validate-trigger="[]"
              :rules="[v => v === `我确定删除${restaurant.name!}` || '输入内容错误']"
              :style="{'margin-top': '-20px', 'width': `min(100vw, max(${10 + restaurant.name!.length}rem, 20rem))`}"
          />
          <var-button block type="danger" @click="deleteRestaurant" style="margin-top: 5px">确定删除</var-button>
        </var-form>
      </template>
    </var-result>
  </var-popup>
</template>

<style scoped>
#restaurant-header {
  z-index: 9;
  width: 100%;
  max-width: var(--app-max-width);
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
  max-width: 100%;
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
</style>