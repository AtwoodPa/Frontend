<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="container mx-auto flex h-[600px] max-w-[1000px] relative overflow-hidden rounded-xl shadow-2xl">
      <!-- 左侧表单区域 -->
      <div
          :class="['w-1/2 bg-white p-8 transition-all duration-500 ease-out transform',
          isRegister ? 'translate-x-full opacity-90' : '']"
      >
        <div class="flex flex-col h-full">
          <h2 class="text-3xl font-bold mb-8">{{ isRegister ? '注册账号' : '欢迎登录' }}</h2>

          <!-- 登录表单 -->
          <template v-if="!isRegister">
            <div class="space-y-4">
              <el-input
                  v-model="loginForm.account"
                  placeholder="手机号/邮箱"
                  :prefix-icon="User"
                  class="!rounded-button"
              />
              <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="密码"
                  :prefix-icon="Lock"
                  class="!rounded-button"
                  show-password
              />
            </div>

            <div class="flex justify-between items-center mt-4">
              <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
              <a href="#" class="text-blue-600 hover:text-blue-700">忘记密码？</a>
            </div>

            <el-button type="primary" class="w-full mt-6 !rounded-button" @click="handleLogin">登录</el-button>

            <div class="mt-6">
              <p class="text-center text-gray-600">其他登录方式</p>
              <div class="flex justify-center space-x-6 mt-4">
                <el-icon class="text-2xl cursor-pointer text-gray-600 hover:text-blue-600"><ChatDotRound /></el-icon>
                <el-icon class="text-2xl cursor-pointer text-gray-600 hover:text-green-600"><Iphone /></el-icon>
                <el-icon class="text-2xl cursor-pointer text-gray-600 hover:text-red-600"><Message /></el-icon>
              </div>
            </div>
          </template>

          <!-- 注册表单 -->
          <template v-else>
            <div class="space-y-4">
              <el-input
                  v-model="registerForm.phone"
                  placeholder="手机号"
                  :prefix-icon="Iphone"
                  class="!rounded-button"
              />
              <div class="flex space-x-2">
                <el-input
                    v-model="registerForm.code"
                    placeholder="验证码"
                    :prefix-icon="Key"
                    class="!rounded-button"
                />
                <el-button
                    type="primary"
                    class="whitespace-nowrap !rounded-button"
                    :disabled="countdown > 0"
                    @click="handleSendCode"
                >
                  {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
                </el-button>
              </div>
              <el-input
                  v-model="registerForm.password"
                  type="password"
                  placeholder="设置密码"
                  :prefix-icon="Lock"
                  class="!rounded-button"
                  show-password
              />
            </div>

            <div class="mt-4">
              <el-checkbox v-model="registerForm.agreement">
                我已阅读并同意<a href="#" class="text-blue-600">《用户协议》</a>和<a href="#" class="text-blue-600">《隐私政策》</a>
              </el-checkbox>
            </div>

            <el-button type="primary" class="w-full mt-6 !rounded-button" @click="handleRegister">注册</el-button>
          </template>

          <div class="mt-auto text-center">
            <span class="text-gray-600">{{ isRegister ? '已有账号？' : '还没有账号？' }}</span>
            <a
                href="#"
                class="text-blue-600 hover:text-blue-700 ml-1"
                @click.prevent="toggleForm"
            >
              {{ isRegister ? '立即登录' : '立即注册' }}
            </a>
          </div>
        </div>
      </div>

      <!-- 右侧Banner区域 -->
      <div
          :class="['w-1/2 p-8 transition-all duration-500 ease-out transform relative',
          isRegister ? '-translate-x-full scale-95' : '']"
          :style="{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        }"
      >
        <div class="h-full flex flex-col text-white">
          <h2 class="text-3xl font-bold mb-6">{{ isRegister ? '新用户专属权益' : '实时数据概览' }}</h2>

          <!-- 登录态展示数据概览 -->
          <template v-if="!isRegister">
            <div ref="chartRef" class="w-full flex-1"></div>
          </template>

          <!-- 注册态展示权益 -->
          <template v-else>
            <div class="space-y-6">
              <div v-for="(benefit, index) in benefits" :key="index" class="flex items-start space-x-3">
                <el-icon class="text-xl mt-1"><Check /></el-icon>
                <div>
                  <h3 class="font-semibold text-lg">{{ benefit.title }}</h3>
                  <p class="text-white/80">{{ benefit.desc }}</p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { User, Lock, Iphone, Key, ChatDotRound, Message, Check } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';

const isRegister = ref(false);
const countdown = ref(0);
let timer: number;

const loginForm = ref({
  account: '',
  password: '',
  remember: false
});

const registerForm = ref({
  phone: '',
  code: '',
  password: '',
  agreement: false
});

const benefits = [
  {
    title: '新人专享优惠',
    desc: '注册即可获得 100 元新人专享优惠券'
  },
  {
    title: '专属客服服务',
    desc: '7×24 小时专属客服在线服务'
  },
  {
    title: '会员特权',
    desc: '享受会员价格优惠及积分奖励'
  },
  {
    title: '安全保障',
    desc: '专业的安全团队，保障账户安全'
  }
];

const toggleForm = () => {
  isRegister.value = !isRegister.value;
};

const handleSendCode = () => {
  if(!registerForm.value.phone) {
    ElMessage.warning('请输入手机号');
    return;
  }
  countdown.value = 60;
  timer = window.setInterval(() => {
    if(countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
};

const handleLogin = () => {
  if(!loginForm.value.account || !loginForm.value.password) {
    ElMessage.warning('请填写完整登录信息');
    return;
  }
  ElMessage.success('登录成功');
};

const handleRegister = () => {
  if(!registerForm.value.phone || !registerForm.value.code || !registerForm.value.password) {
    ElMessage.warning('请填写完整注册信息');
    return;
  }
  if(!registerForm.value.agreement) {
    ElMessage.warning('请阅读并同意用户协议');
    return;
  }
  ElMessage.success('注册成功');
};

const chartRef = ref<HTMLElement>();
let chart: echarts.ECharts;

onMounted(() => {
  if(chartRef.value) {
    chart = echarts.init(chartRef.value);
    const option = {
      animation: false,
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: 10,
        right: 30,
        bottom: 20,
        left: 40,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        axisLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.3)'
          }
        },
        axisLabel: {
          color: 'rgba(255,255,255,0.8)'
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.3)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.1)'
          }
        },
        axisLabel: {
          color: 'rgba(255,255,255,0.8)'
        }
      },
      series: [
        {
          name: '活跃用户',
          type: 'line',
          smooth: true,
          data: [820, 932, 901, 934, 1290, 1330, 1520],
          lineStyle: {
            color: '#fff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(255,255,255,0.3)'
              }, {
                offset: 1,
                color: 'rgba(255,255,255,0.1)'
              }]
            }
          },
          itemStyle: {
            color: '#fff'
          }
        }
      ]
    };
    chart.setOption(option);
  }
});

onBeforeUnmount(() => {
  if(chart) {
    chart.dispose();
  }
  if(timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
:deep(.el-input__wrapper) {
  background-color: #f3f4f6;
  border: none;
  box-shadow: none !important;
}

:deep(.el-input__wrapper.is-focus) {
  background-color: #fff;
  box-shadow: 0 0 0 1px #3b82f6 !important;
}

:deep(.el-checkbox__label) {
  color: #4b5563;
}

:deep(.el-button--primary) {
  background-color: #3b82f6;
  border-color: #3b82f6;
  height: 42px;
}

:deep(.el-button--primary:hover) {
  background-color: #2563eb;
  border-color: #2563eb;
}

:deep(.el-input__inner) {
  height: 42px;
}
</style>

