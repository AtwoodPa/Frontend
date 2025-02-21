<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center">
    <div class="w-[1000px] h-[600px] bg-white rounded-xl shadow-lg flex overflow-hidden">
      <!-- 左侧品牌展示区 -->
      <div class="w-1/2 relative bg-gray-800 overflow-hidden">
        <div class="absolute inset-0">
          <img
              :src="brandImage"
              class="w-full h-full object-cover"
              alt="Brand Background"
          />
        </div>
        <div class="relative z-10 p-8 text-white">
          <h1 class="text-3xl font-bold mb-6 text-center">GaoQ</h1>
          <div class="space-y-3">
            <div class="bg-pink-200/20 backdrop-blur-sm rounded px-3 py-2 text-pink-100 inline-block">
              专业直播导师
            </div>
            <div class="bg-pink-200/20 backdrop-blur-sm rounded px-3 py-2 text-pink-100 inline-block">
              亚洲知名主播
            </div>
            <div class="bg-pink-200/20 backdrop-blur-sm rounded px-3 py-2 text-pink-100 inline-block">
              电商带货达人
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧注册表单 -->
      <div class="w-1/2 p-8 flex flex-col">
        <h2 class="text-3xl font-bold mb-8 text-gray-800">欢迎注册</h2>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-2">
            <label class="block text-sm text-gray-600">用户名</label>
            <el-input
                v-model="formData.username"
                placeholder="请输入用户名"
                class="!rounded-lg"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm text-gray-600">手机号</label>
            <el-input
                v-model="formData.phone"
                placeholder="请输入手机号"
                class="!rounded-lg"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm text-gray-600">密码</label>
            <el-input
                v-model="formData.password"
                type="password"
                placeholder="请输入密码"
                class="!rounded-lg"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm text-gray-600">验证码</label>
            <div class="flex gap-4">
              <el-input
                  v-model="formData.code"
                  placeholder="请输入验证码"
                  class="!rounded-lg"
              />
              <el-button
                  type="primary"
                  :disabled="countdown > 0"
                  @click="getVerificationCode"
                  class="!rounded-button whitespace-nowrap min-w-[120px]"
              >
                {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
              </el-button>
            </div>
          </div>

          <el-button
              type="primary"
              class="w-full !rounded-button !bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
              @click="handleSubmit"
          >
            立即注册
          </el-button>

          <p class="text-xs text-gray-500 text-center">
            注册即表示同意
            <a href="#" class="text-orange-500 hover:text-orange-600">《用户协议》</a>
            和
            <a href="#" class="text-orange-500 hover:text-orange-600">《隐私政策》</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const brandImage = 'https://ai-public.mastergo.com/ai/img_res/3d4be22e994596d804b69fd7d63cda1a.jpg';

const formData = ref({
  username: '',
  phone: '',
  password: '',
  code: ''
});

const countdown = ref(0);

const getVerificationCode = () => {
  if (!/^1[3-9]\d{9}$/.test(formData.value.phone)) {
    ElMessage.error('请输入正确的手机号');
    return;
  }

  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

const handleSubmit = () => {
  if (!formData.value.username) {
    ElMessage.error('请输入用户名');
    return;
  }
  if (!formData.value.phone) {
    ElMessage.error('请输入手机号');
    return;
  }
  if (!formData.value.password) {
    ElMessage.error('请输入密码');
    return;
  }
  if (!formData.value.code) {
    ElMessage.error('请输入验证码');
    return;
  }

  ElMessage.success('注册成功');
};
</script>
<style scoped>
.container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-panel {
  width: 1000px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
}

/* 左侧品牌区样式 */
.brand-section {
  width: 50%;
  position: relative;
  background: #1f2937;
  overflow: hidden;
}

.brand-image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  top: 0;
  left: 0;
}

.brand-content {
  position: relative;
  z-index: 10;
  padding: 2rem;
  color: white;
}

.brand-tag {
  background: rgba(251, 207, 232, 0.2);
  backdrop-filter: blur(4px);
  border-radius: 4px;
  padding: 0.5rem 1rem;
  display: inline-block;
  color: #fbcfe8;
  margin: 0.25rem 0;
}

/* 右侧表单区样式 */
.form-section {
  width: 50%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.form-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
}

/* 输入框样式覆盖 */
.el-input__wrapper {
  box-shadow: 0 0 0 1px #e5e7eb !important;
  border-radius: 8px !important;
}

.el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1px #f97316 !important;
}

/* 按钮样式 */
.el-button--primary {
  background: #f97316 !important;
  border-color: #f97316 !important;
  border-radius: 8px !important;
  transition: all 0.3s;
}

.el-button--primary:hover {
  background: #ea580c !important;
  border-color: #ea580c !important;
}

.verify-button {
  min-width: 120px;
  white-space: nowrap;
}

/* 协议链接 */
.agreement-link {
  color: #f97316;
  text-decoration: none;
}

.agreement-link:hover {
  color: #ea580c;
}

/* 表单间距 */
.form-item {
  margin-bottom: 1.5rem;
}

.form-item label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
}

/* 验证码输入容器 */
.code-input-group {
  display: flex;
  gap: 1rem;
}
</style>

