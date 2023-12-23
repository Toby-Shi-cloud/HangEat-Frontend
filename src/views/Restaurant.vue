<script setup lang="ts">
import {ref} from "vue";
import type {RestaurantInfo, UserInfo} from "@/store";
import {doDeleteRestaurant, doGetRestaurantDetail} from "@/services/restaurant";
import {type Input, Snackbar} from "@varlet/ui";
import {useAuthStore, useUsersStore} from "@/store/user";
import {doFavoriteRestaurant, doUnfavoriteRestaurant} from "@/services/user";
import RestaurantEdition from "@/components/RestaurantEdition.vue";
import RestaurantNewImg from "@/components/RestaurantNewImg.vue";
import PostList from "@/components/PostList.vue";
import {doGetPostNum} from "@/services/post";

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
const width = ref(window.innerWidth);
window.onresize = () => width.value = window.innerWidth;

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

const handleReview = unimplement;

const handleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    Snackbar.error('请先登录');
    setTimeout(() => location.href = `/login?url=${location.href}`, 1000);
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
    setTimeout(() => location.href = `/login?url=${location.href}`, 1000);
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
    setTimeout(() => location.href = '/restaurants', 1000);
  } catch (e) {}
};

const handleTagClick = (tag: string) => location.href = `/restaurants?tag=${tag}`;
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
            <p>{{ (restaurant as RestaurantInfo).collectors_num }}</p>
          </var-space>
        </var-space>
      </template>
      <template #right>
        <var-space size="small" style="margin-right: 10px">
          <font-awesome-icon :icon="['fas', 'pencil']"/>
          <var-link underline="hover" @click="handleReview">写评论</var-link>
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
        <var-space size="small">
          <font-awesome-icon :icon="['fas', 'location-dot']"/>
          <var-link @click="handlePosition">{{ (restaurant as RestaurantInfo).detail_addr }}</var-link>
          <span>|</span>
          <font-awesome-icon :icon="['fas', 'phone']"/>
          <var-link v-if="restaurant.phone" :href="`tel: ${restaurant.phone}`">
            {{ (restaurant as RestaurantInfo).phone }}
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
        <var-col class="restaurant-overview-card" :span="width < 768 ? 24 : 8">
          <var-paper :elevation="true" :radius="8" style="height: 100%; width: 100%">
            <var-card :elevation="false" title="总体评价">
              <template #description>
                <div class="restaurant-overview-description">
                  <var-space direction="column">
                    <var-space direction="row" :size="2" align="center">
                      <p>评分：</p>
                      <font-awesome-icon
                          v-if="restaurant.avg_grade"
                          v-for="i in Array(5).keys()"
                          :icon="restaurant.avg_grade! >= i + 0.9 ? ['fas', 'star']
                             : ['far', restaurant.avg_grade! >= i + 0.4 ? 'star-half-stroke' : 'star']"
                      />
                      <p v-else>（暂无评分）</p>
                    </var-space>
                    <p>人均价格：¥{{ (restaurant as RestaurantInfo).avg_price || '未知' }}</p>
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
                  <p>页面创建时间：{{ new Date((restaurant as RestaurantInfo).created_at).toLocaleDateString() }}</p>
                  <p>最后修改时间：{{ new Date((restaurant as RestaurantInfo).updated_at).toLocaleDateString() }}</p>
                </var-space>
                <var-cell v-else title="信息缺失"/>
              </template>
            </var-card>
          </var-paper>
        </var-col>
        <var-col class="restaurant-overview-card" :span="width < 768 ? 24 : 8">
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
                  <var-link @click="handlePosition" style="margin: 0 10px">
                    {{ (restaurant as RestaurantInfo).detail_addr }}
                  </var-link>
                </var-cell>
                <var-cell>
                  <template #icon>
                    <font-awesome-icon :icon="['fas', 'phone']"/>
                  </template>
                  <var-link v-if="restaurant.phone" :href="`tel: ${restaurant.phone}`" style="margin: 0 10px">
                    {{ (restaurant as RestaurantInfo).phone }}
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
      <var-paper :elevation="3" :radius="8" style="padding: 15px">
        <h2 style="margin-bottom: 10px">帖子（{{ postsNum === null ? '加载失败' : postsNum }}）</h2>
        <PostList :restaurant-id="restId!"/>
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
</style>