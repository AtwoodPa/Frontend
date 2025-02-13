<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="mx-auto max-w-[1440px]">
      <!-- 上部分数据卡片 -->
      <div class="grid grid-cols-3 gap-6">
        <!-- 销售总计卡片 -->
        <div class="col-span-2 rounded-lg bg-white p-6 shadow-sm">
          <div class="mb-4">
            <h2 class="text-gray-600">销售额总计</h2>
            <div class="mt-2 text-4xl font-bold text-orange-400">8888 元</div>
          </div>
          <div class="h-[300px]" ref="salesChart"></div>
        </div>

        <!-- 产品销售数据卡片 -->
        <div class="rounded-lg bg-white p-6 shadow-sm">
          <h2 class="mb-6 text-gray-600">产品销售数据</h2>
          <div class="space-y-6">
            <div v-for="(item, index) in productSales" :key="index" class="relative">
              <div class="mb-2 flex items-center justify-between">
                <div class="flex items-center">
                  <div class="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                    {{ index + 1 }}
                  </div>
                  <span class="text-sm text-gray-700">{{ item.name }}</span>
                </div>
                <span class="text-orange-400">{{ item.price }}元</span>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full bg-orange-100">
                <div class="h-full rounded-full bg-orange-400" :style="{ width: item.percentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 博主销售数据表格 -->
      <div class="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 class="mb-6 text-gray-600">博主销售数据</h2>
        <el-table :data="streamerData" style="width: 100%">
          <el-table-column label="博主" width="200">
            <template #default="scope">
              <div class="flex items-center">
                <el-avatar :size="40" :src="scope.row.avatar" class="mr-3" />
                <span>{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="直播主题" />
          <el-table-column prop="date" label="直播时间" width="180" />
          <el-table-column prop="viewers" label="预计观看量" width="180">
            <template #default="scope">
              {{ scope.row.viewers }}w
            </template>
          </el-table-column>
          <el-table-column label="直播状态" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.status === '待直播' ? 'warning' : 'info'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const salesChart = ref<HTMLElement | null>(null);

const productSales = [
  { name: 'PREP 应急套大容量装 75ml', price: 4215, percentage: 100 },
  { name: '蝴蝶结提花拖口毛衣', price: 899, percentage: 70 },
  { name: '雪花长毛切尔西靴', price: 531, percentage: 40 }
];

const streamerData = [
  {
    avatar: 'https://ai-public.mastergo.com/ai/img_res/e23992da0a4e3ba3b7b8288332b11d96.jpg',
    name: '@八斗',
    title: '年末好物特惠',
    date: '2025-1-16',
    viewers: '30',
    status: '待直播'
  },
  {
    avatar: 'https://ai-public.mastergo.com/ai/img_res/d3c7426b659d9a23a4f6b549ebd9d1a9.jpg',
    name: '@赫赫',
    title: '双11百货特卖会',
    date: '2024-11-20',
    viewers: '200',
    status: '已直播'
  }
];

onMounted(() => {
  if (salesChart.value) {
    const chart = echarts.init(salesChart.value);
    const option = {
      animation: false,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1/5', '1/6', '1/7', '1/8', '1/9', '1/10', '1/11', '1/12'],
        axisLine: {
          lineStyle: {
            color: '#eee'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#eee'
          }
        }
      },
      series: [
        {
          data: [12, 5, 20, 15, 17, 20, 13, 17],
          type: 'line',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(255, 159, 64, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(255, 159, 64, 0.1)'
                }
              ]
            }
          },
          itemStyle: {
            color: '#ff9f40'
          },
          lineStyle: {
            color: '#ff9f40'
          },
          showSymbol: false
        }
      ]
    };
    chart.setOption(option);

    window.addEventListener('resize', () => {
      chart.resize();
    });
  }
});
</script>

<style scoped>
.el-table {
  --el-table-border-color: #eee;
  --el-table-header-bg-color: #f8f9fa;
  --el-table-row-hover-bg-color: #f8f9fa;
}

.el-tag {
  border: none;
}

.el-tag--warning {
  background-color: #fff7ed;
  color: #f97316;
}

.el-tag--info {
  background-color: #f3f4f6;
  color: #6b7280;
}
</style>

