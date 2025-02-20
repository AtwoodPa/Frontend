<template>
  <div class="card-wrapper">
    <div class="card">
      <div class="user-info">
        <div class="avatar-container">
          <div class="avatar-wrapper">
            <img :src="avatarUrl" alt="用户头像" class="avatar" />
          </div>
          <div class="icon-container">
            <el-icon class="star-icon">
              <StarFilled />
            </el-icon>
          </div>
        </div>

        <div class="info-container">
          <div class="username">@小红薯</div>
          <div class="homepage-link">
            <span class="label">主页</span>
            <a href="https://www.xiaohongshu.com/" target="_blank" class="link"
              >https://www.xiaohongshu.com/</a
            >
          </div>
          <div class="live-time">
            <span class="label">直播时间段</span>
            <span class="time">2025-1-16 18:00-22:00</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { ref } from "vue";
import { StarFilled } from "@element-plus/icons-vue";

const avatarUrl =
  "https://ai-public.mastergo.com/ai/img_res/4604626dd63a8058adf8bcde0e4528b8.jpg";
</script>
  
  <style lang="less" scoped>
.card-wrapper {
  min-height: 1024px;
  width: 1440px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  background-color: #f5f5f5;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 800px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-container {
  position: relative;
}

.avatar-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #f0f0f0;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon-container {
  position: absolute;
  top: -4px;
  right: -4px;
}

.star-icon {
  color: #ff2442;
  font-size: 20px;
}

.info-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.username {
  font-size: 18px;
  font-weight: 500;
}

.homepage-link {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  color: #666;
}

.link {
  color: #ff6b00;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.live-time {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time {
  color: #999;
}
</style>