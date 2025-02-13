<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 固定顶部标题栏 -->
    <div class="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center">
        <h1 class="text-xl font-medium">店铺关联</h1>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="max-w-7xl mx-auto px-4 pt-24 pb-8">
      <!-- 搜索区域 -->
      <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div class="flex items-center gap-4">
          <div class="relative flex-1 max-w-md">
            <input
                type="text"
                v-model="searchQuery"
                placeholder="请输入店铺名称搜索"
                class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>
          <button
              @click="handleSearch"
              class="!rounded-button px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 whitespace-nowrap"
          >
            搜索
          </button>
        </div>
      </div>

      <!-- 表格操作区域 -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-4 border-b border-gray-100">
          <button
              :disabled="!selectedShop"
              @click="handleAssociate"
              class="!rounded-button px-6 py-2 whitespace-nowrap"
              :class="selectedShop ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
          >
            关联店铺
          </button>
        </div>

        <!-- 表格区域 -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
            <tr>
              <th class="py-4 px-6 text-sm font-medium text-gray-500 text-left">选择</th>
              <th class="py-4 px-6 text-sm font-medium text-gray-500 text-left">店铺ID</th>
              <th class="py-4 px-6 text-sm font-medium text-gray-500 text-left">店铺名称</th>
              <th class="py-4 px-6 text-sm font-medium text-gray-500 text-left">创建时间</th>
            </tr>
            </thead>
            <tbody>
            <template v-if="shopList.length">
              <tr
                  v-for="shop in shopList"
                  :key="shop.id"
                  :class="{'bg-gray-50': shop.id === selectedShop?.id}"
                  class="hover:bg-gray-50 transition-colors"
              >
                <td class="py-4 px-6">
                  <input
                      type="radio"
                      :name="'shop'"
                      :value="shop.id"
                      :checked="shop.id === selectedShop?.id"
                      @change="() => handleSelect(shop)"
                      class="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                  />
                </td>
                <td class="py-4 px-6 text-sm text-gray-600">{{ shop.id }}</td>
                <td class="py-4 px-6 text-sm text-gray-600">{{ shop.name }}</td>
                <td class="py-4 px-6 text-sm text-gray-600">{{ shop.createTime }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="4" class="py-16 text-center text-gray-400">
                  <i class="fas fa-inbox text-3xl mb-2"></i>
                  <p>暂无数据</p>
                </td>
              </tr>
            </template>
            </tbody>
          </table>
        </div>

        <!-- 分页区域 -->
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div class="text-sm text-gray-500">
            共 {{ total }} 条数据
          </div>
          <div class="flex items-center gap-2">
            <select
                v-model="pageSize"
                class="text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-blue-500"
            >
              <option :value="10">10 条/页</option>
              <option :value="20">20 条/页</option>
              <option :value="50">50 条/页</option>
            </select>
            <button
                :disabled="currentPage === 1"
                @click="handlePrevPage"
                class="!rounded-button px-3 py-1 border border-gray-200 disabled:bg-gray-50 disabled:text-gray-400 whitespace-nowrap"
            >
              上一页
            </button>
            <span class="text-sm">第 {{ currentPage }} / {{ totalPages }} 页</span>
            <button
                :disabled="currentPage === totalPages"
                @click="handleNextPage"
                class="!rounded-button px-3 py-1 border border-gray-200 disabled:bg-gray-50 disabled:text-gray-400 whitespace-nowrap"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 成功提示 -->
    <div
        v-if="showSuccess"
        class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300"
        :class="{ 'opacity-0': !showSuccess }"
    >
      关联成功
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

interface Shop {
  id: number;
  name: string;
  createTime: string;
}

const searchQuery = ref('');
const selectedShop = ref<Shop | null>(null);
const showSuccess = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

// 模拟数据
const mockShops: Shop[] = [
  { id: 1001, name: '优品生活百货店', createTime: '2023-12-01 10:30:00' },
  { id: 1002, name: '晨光文具专营店', createTime: '2023-12-02 14:20:00' },
  { id: 1003, name: '品味食品商城', createTime: '2023-12-03 09:15:00' },
  { id: 1004, name: '时尚服装精品店', createTime: '2023-12-04 16:45:00' },
  { id: 1005, name: '电子数码旗舰店', createTime: '2023-12-05 11:25:00' },
  { id: 1006, name: '家居日用专卖店', createTime: '2023-12-06 13:50:00' },
  { id: 1007, name: '运动户外专营店', createTime: '2023-12-07 15:40:00' },
  { id: 1008, name: '美妆护肤精品店', createTime: '2023-12-08 08:55:00' },
  { id: 1009, name: '母婴用品商城', createTime: '2023-12-09 17:10:00' },
  { id: 1010, name: '图书文创专卖店', createTime: '2023-12-10 12:35:00' },
];

const shopList = ref<Shop[]>(mockShops);

const totalPages = computed(() => Math.ceil(total.value / pageSize.value));

const handleSearch = () => {
  currentPage.value = 1;
  // 实际项目中这里需要调用接口
};

const handleSelect = (shop: Shop) => {
  selectedShop.value = shop;
};

const handleAssociate = () => {
  if (selectedShop.value) {
    showSuccess.value = true;
    setTimeout(() => {
      showSuccess.value = false;
    }, 2000);
  }
};

const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>

