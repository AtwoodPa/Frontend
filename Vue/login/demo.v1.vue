<template>
  <div class="page-container">
    <!-- 左侧轮播区域 -->
    <div class="left-section">
      <div class="left-header">
        <h1>小红书</h1>
        <p>发现美好生活</p>
      </div>

      <swiper
          :modules="swiperModules"
          :slides-per-view="1"
          :loop="true"
          :autoplay="{
          delay: 5000,
          disableOnInteraction: false
        }"
          :pagination="{ clickable: true }"
          class="swiper-container"
          @mouseenter="onSwiperMouseEnter"
          @mouseleave="onSwiperMouseLeave">
        <swiper-slide v-for="(slide, index) in slides" :key="index">
          <div class="slide-content">
            <img :src="slide.image" class="slide-image" />
            <div class="slide-overlay"></div>
            <div class="slide-info">
              <h3>🔥 实时数据播报</h3>
              <div class="slide-details">
                <p>✔️ 单场预约 {{ slide.booking }}+</p>
                <p>✔️ 人均停留 {{ slide.duration }}</p>
                <p>✔️ 在线峰值 {{ slide.peak }}+人</p>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <!-- 右侧登录区域 -->
    <div class="right-section">
      <div class="right-container">
        <div class="form-toggle">
          <button
              :class="['toggle-button', isLogin ? 'active' : '']"
              @click="toggleForm(true)">
            登录
          </button>
          <button
              :class="['toggle-button', !isLogin ? 'active' : '']"
              @click="toggleForm(false)">
            注册
          </button>
        </div>

        <transition name="fade" mode="out-in">
          <!-- 登录表单 -->
          <div v-if="isLogin" key="login" class="form-content">
            <h2>欢迎回来 👋</h2>

            <div class="input-group">
              <input
                  v-model="loginForm.account"
                  type="text"
                  placeholder="手机号/邮箱/用户名"
              />
              <Icon type="ios-checkmark" v-if="loginForm.account" class="input-icon" />
            </div>

            <div class="input-group">
              <input
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请输入密码"
              />
              <Icon
                  :type="showPassword ? 'ios-eye-off' : 'ios-eye'"
                  class="input-icon password-icon"
                  @click="showPassword = !showPassword"
              />
            </div>

            <button class="submit-button">登录</button>

            <div class="form-links">
              <a href="#">忘记密码？</a>
              <a href="#">短信验证码登录</a>
            </div>

            <div class="social-login">
              <button class="social-button">
                <Icon type="logo-wechat" class="social-icon" />
              </button>
              <button class="social-button">
                <Icon type="logo-weibo" class="social-icon" />
              </button>
            </div>
          </div>

          <!-- 注册表单 -->
          <div v-else key="register" class="form-content">
            <h2>加入我们 🌟</h2>

            <div class="input-group">
              <input
                  v-model="registerForm.phone"
                  type="text"
                  placeholder="请输入手机号"
              />
            </div>

            <div class="code-group">
              <input
                  v-model="registerForm.code"
                  type="text"
                  placeholder="请输入验证码"
              />
              <button class="code-button">发送验证码</button>
            </div>

            <div class="input-group">
              <input
                  v-model="registerForm.password"
                  :type="showRegisterPassword ? 'text' : 'password'"
                  placeholder="请设置密码"
              />
              <Icon
                  :type="showRegisterPassword ? 'ios-eye-off' : 'ios-eye'"
                  class="input-icon password-icon"
                  @click="showRegisterPassword = !showRegisterPassword"
              />
            </div>

            <div class="agreement">
              <input type="checkbox" v-model="registerForm.agreement" />
              <span>
                我已阅读并同意
                <a href="#">《用户协议》</a>
                和
                <a href="#">《隐私政策》</a>
              </span>
            </div>

            <button class="submit-button">注册</button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { ViewUI } from 'view-ui-plus';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';

export default {
  components: {
    ...ViewUI,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      swiperModules: [Pagination, Autoplay],
      isLogin: true,
      showPassword: false,
      showRegisterPassword: false,
      loginForm: {
        account: '',
        password: ''
      },
      registerForm: {
        phone: '',
        code: '',
        password: '',
        agreement: false
      },
      slides: [
        {
          image: 'https://ai-public.mastergo.com/ai/img_res/f9789114a6b73451192c32689705642a.jpg',
          booking: '150万',
          duration: '9分21秒',
          peak: '8000'
        },
        {
          image: 'https://ai-public.mastergo.com/ai/img_res/ab30effd4f4b1414c2555af864497d28.jpg',
          booking: '180万',
          duration: '10分05秒',
          peak: '9500'
        },
        {
          image: 'https://ai-public.mastergo.com/ai/img_res/17b4dd81db86d22d80af6037808659da.jpg',
          booking: '200万',
          duration: '11分15秒',
          peak: '12000'
        }
      ]
    };
  },
  methods: {
    toggleForm(value) {
      this.isLogin = value;
    },
    onSwiperMouseEnter(swiper) {
      swiper.autoplay.stop();
    },
    onSwiperMouseLeave(swiper) {
      swiper.autoplay.start();
    }
  }
};
</script>

<style scoped>
.page-container {
  display: flex;
  min-height: 1024px;
  width: 1440px;
  margin: 0 auto;
}

.left-section {
  width: 50%;
  position: relative;
  background: linear-gradient(to bottom right, #ff4b4b, #8a2be2, #4b6cb7);
}

.left-header {
  position: absolute;
  top: 32px;
  left: 32px;
  z-index: 10;
  color: white;
}

.left-header h1 {
  font-size: 32px;
  font-weight: bold;
}

.left-header p {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.8);
}

.swiper-container {
  height: 100%;
}

.slide-content {
  height: 100%;
  position: relative;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

.slide-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 32px;
  width: 80%;
}

.slide-info h3 {
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-bottom: 24px;
}

.slide-details p {
  font-size: 18px;
  color: white;
  margin-bottom: 8px;
}

.right-section {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 0 80px;
}

.right-container {
  width: 100%;
  max-width: 400px;
}

.form-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 48px;
}

.toggle-button {
  padding: 8px 32px;
  font-size: 18px;
  font-weight: 500;
  color: #666;
  position: relative;
  border: none;
  background: none;
  cursor: pointer;
}

.toggle-button.active {
  color: #ff4b4b;
}

.toggle-button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #ff4b4b;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-content h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 32px;
}

.input-group {
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
}

.input-group input:focus {
  border-color: #ff4b4b;
  box-shadow: 0 0 0 2px rgba(255, 75, 75, 0.2);
}

.input-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.password-icon {
  cursor: pointer;
}

.code-group {
  display: flex;
  gap: 16px;
}

.code-group input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
}

.code-group input:focus {
  border-color: #ff4b4b;
  box-shadow: 0 0 0 2px rgba(255, 75, 75, 0.2);
}

.code-button {
  padding: 12px 24px;
  background-color: #ff4b4b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.code-button:hover {
  background-color: #ff3333;
}

.agreement {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.agreement a {
  color: #ff4b4b;
  text-decoration: none;
}

.agreement a:hover {
  text-decoration: underline;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #ff4b4b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #ff3333;
}

.form-links {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
}

.form-links a {
  color: #ff4b4b;
  text-decoration: none;
}

.form-links a:hover {
  text-decoration: underline;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
}

.social-button {
  padding: 8px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.social-button:hover {
  background-color: #e0e0e0;
}

.social-icon {
  font-size: 24px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>

<!--<style lang="less">-->
<!--.sign-in-container {-->
<!--  display: flex;-->
<!--  min-height: 100vh; /* 改为视窗高度单位 */-->
<!--  width: 100%; /* 改为全宽 */-->
<!--  margin: 0 auto;-->
<!--  background: linear-gradient(to bottom, #f0f0f0, #ffffff); /* 添加全局渐变背景 */-->

<!--  .left-top-section {-->
<!--    position: absolute;-->
<!--    top: 20px; /* 调整位置 */-->
<!--    left: 5%; /* 改为百分比适配 */-->
<!--    z-index: 10;-->

<!--    .logo-container {-->
<!--      padding: 16px 0;-->
<!--      .logo {-->
<!--        width: 120px;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  /* 左侧区域保持不变 */-->

<!--  .right-section {-->
<!--    width: 50%;-->
<!--    position: relative;-->
<!--    overflow: hidden; /* 添加溢出隐藏 */-->

<!--    .right-section__top-bg {-->
<!--      position: absolute; /* 改为绝对定位 */-->
<!--      top: 0;-->
<!--      right: 0;-->
<!--      width: 100%;-->
<!--      height: 100%;-->
<!--      background-image: url("../../assets/mct/right-section-background.png");-->
<!--      background-size: cover;-->
<!--      background-position: right top; /* 背景图定位到右上角 */-->
<!--      background-repeat: no-repeat;-->
<!--      z-index: 1; /* 设置层级 */-->
<!--    }-->

<!--    .banner-container {-->
<!--      position: relative;-->
<!--      z-index: 2; /* 设置高于背景图的层级 */-->
<!--      width: 100%;-->
<!--      height: 50vh; /* 使用视窗高度单位 */-->
<!--      margin-top: 30%; /* 调整位置 */-->
<!--      transform: translateX(-10%); /* 微调水平位置 */-->

<!--      .banner-slide {-->
<!--        width: 120%; /* 扩大宽度防止留白 */-->
<!--        height: 100%;-->
<!--        img {-->
<!--          width: 100%;-->
<!--          height: 100%;-->
<!--          object-fit: contain; /* 保持图片完整显示 */-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  .footer-link {-->
<!--    /* 底部样式保持不变 */-->
<!--  }-->
<!--}-->
<!--</style>-->