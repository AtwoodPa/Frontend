<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-7xl px-4">
      <!-- 顶部搜索和banner区域 -->
      <div class="flex gap-8 py-6">
        <!-- 左侧搜索区域 -->
        <div class="w-[460px] space-y-4">
          <div class="flex items-center gap-4">
            <div class="relative w-[220px]">
              <button class="!rounded-button flex w-full items-center justify-between border border-gray-300 bg-white px-4 py-2 text-sm">
                <span>直播平台</span>
                <i class="fa-solid fa-chevron-down text-gray-400"></i>
              </button>
            </div>
            <div class="relative flex-1">
              <input type="text" placeholder="请输入主播名称" class="w-full border border-gray-300 px-4 py-2 text-sm outline-none" />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="relative w-[220px]">
              <button class="!rounded-button flex w-full items-center justify-between border border-gray-300 bg-white px-4 py-2 text-sm">
                <span>选品类目</span>
                <i class="fa-solid fa-chevron-down text-gray-400"></i>
              </button>
            </div>
            <button class="!rounded-button whitespace-nowrap bg-blue-600 px-8 py-2 text-sm text-white hover:bg-blue-700">重置</button>
          </div>
        </div>


        <!-- 右侧banner区域 -->
        <div class="flex-1">
          <swiper :modules="swiperModules" :pagination="{ clickable: true }" :autoplay="{ delay: 3000 }" class="h-[120px] rounded-lg">
            <swiper-slide v-for="(banner, index) in banners" :key="index">
              <div class="relative h-full w-full overflow-hidden rounded-lg">
                <img :src="banner.image" :alt="banner.title" class="h-full w-full object-cover object-top" />
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 class="text-lg font-medium text-white">{{ banner.title }}</h3>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>

      <!-- 直播列表区域 -->
      <div class="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table class="w-full">
          <thead class="bg-gray-50">
          <tr>
            <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium text-gray-500">主播</th>
            <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium text-gray-500">合作模式</th>
            <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium text-gray-500">直播主题</th>
            <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium text-gray-500">选品类目</th>
            <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium text-gray-500">选品价格区间</th>
            <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium text-gray-500">直播时间</th>
            <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium text-gray-500">推荐产品上播</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
          <tr v-for="(item, index) in liveList" :key="index">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <img :src="item.avatar" :alt="item.name" class="h-10 w-10 rounded-full object-cover" />
                <div>
                  <div class="font-medium">{{ item.name }}</div>
                  <div class="text-sm text-gray-500">ID: {{ item.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm">{{ item.mode }}</td>
            <td class="px-6 py-4 text-sm">{{ item.topic }}</td>
            <td class="px-6 py-4 text-sm">{{ item.category }}</td>
            <td class="px-6 py-4 text-sm">{{ item.priceRange }}</td>
            <td class="px-6 py-4 text-sm">{{ item.time }}</td>
            <td class="px-6 py-4">
              <button class="!rounded-button whitespace-nowrap bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700">
                推荐商品
                <i class="fa-solid fa-chevron-right ml-1"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';

const swiperModules = [Pagination, Autoplay];

const banners = ref([
  {
    title: '2024春节直播带货战报',
    image: 'https://ai-public.mastergo.com/ai/img_res/22f159d797294d8718b1137655a221a8.jpg'
  },
  {
    title: '美妆护肤品类直播数据分析',
    image: 'https://ai-public.mastergo.com/ai/img_res/4a3fee447d586aa2ce052e486ed652e4.jpg'
  }
]);

const liveList = ref([
  {
    name: '周雨彤',
    id: 'ZYT889900',
    avatar: 'https://ai-public.mastergo.com/ai/img_res/277830ded5d507f00be1dfef21f61d30.jpg',
    mode: '坑位直播',
    topic: '春节美妆护肤专场',
    category: '美妆护肤',
    priceRange: '￥99-599',
    time: '2024-02-15 20:00'
  },
  {
    name: '林书豪',
    id: 'LSH668899',
    avatar: 'https://ai-public.mastergo.com/ai/img_res/749d562b507a7178568848c637524da6.jpg',
    mode: '达人自播',
    topic: '年货零食大礼包',
    category: '食品',
    priceRange: '￥29-299',
    time: '2024-02-16 19:30'
  },
  {
    name: '张梦晨',
    id: 'ZMC778899',
    avatar: 'https://ai-public.mastergo.com/ai/img_res/beab130139a5308d38b5e256df997523.jpg',
    mode: '平台自播',
    topic: '春节穿搭分享',
    category: '女装',
    priceRange: '￥89-899',
    time: '2024-02-17 19:00'
  }
]);
</script>

<style scoped>
.swiper {
  --swiper-pagination-color: #2563eb;
  --swiper-pagination-bullet-inactive-color: #94a3b8;
  --swiper-pagination-bullet-inactive-opacity: 0.8;
  --swiper-pagination-bullet-size: 8px;
  --swiper-pagination-bullet-horizontal-gap: 4px;
}
</style>

