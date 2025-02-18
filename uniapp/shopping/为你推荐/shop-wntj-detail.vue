
<template>
  <view class="page">
    <view class="header">
      <view class="nav-bar">
        <uni-icons class="back-icon" type="back" size="24" color="#333"></uni-icons>
        <text class="title">为你推荐</text>
      </view>
    </view>

    <scroll-view class="content" scroll-y>
      <view class="product-grid">
        <view v-for="(item, index) in products" :key="index" class="product-item">
          <image class="product-image" :src="item.image" mode="aspectFill"></image>
          <view class="product-info">
            <view class="shop-tag" v-if="item.isOfficial">自营</view>
            <view class="product-title">{{ item.title }}</view>
            <view class="product-price-row">
              <text class="price-symbol">¥</text>
              <text class="price-value">{{ item.price }}</text>
              <text class="price-decimal">.00</text>
              <text class="arrival-price" v-if="item.originalPrice">到手价</text>
              <text class="original-price" v-if="item.originalPrice">¥{{ item.originalPrice }}</text>
            </view>
            <view class="product-rating">
              <text class="rating-count">{{ item.ratingCount }}评论，</text>
              <text class="rating-score">好评率{{ item.ratingScore }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface Product {
  image: string;
  isOfficial: boolean;
  title: string;
  price: number;
  originalPrice?: number;
  ratingCount: string;
  ratingScore: string;
}

const products = ref<Product[]>([
  {
    image: 'https://ai-public.mastergo.com/ai/img_res/a31efa1df89e0b108140da5489713f2a.jpg',
    isOfficial: true,
    title: '威尔胜 (Wilson) NOIR系列小黑拍全碳素专业网球拍 ULTRA',
    price: 2019,
    ratingCount: '500+',
    ratingScore: '96%'
  },
  {
    image: 'https://ai-public.mastergo.com/ai/img_res/2eb701c2f2e1e5583ae6dd82ea93a034.jpg',
    isOfficial: true,
    title: '威尔胜NOIR系列新款黑科技全碳素球拍训练减震专业单人网球拍',
    price: 2549,
    originalPrice: 2909,
    ratingCount: '99',
    ratingScore: '100%'
  },
  {
    image: 'https://ai-public.mastergo.com/ai/img_res/3efb0a2f099d9aee30c25dadf3d6a629.jpg',
    isOfficial: true,
    title: '海德 (HEAD) 网球拍 BOOM 2024新款 高美 全碳素',
    price: 1386,
    ratingCount: '100+',
    ratingScore: '100%'
  },
  {
    image: 'https://ai-public.mastergo.com/ai/img_res/f2f0ccd1fa37306f4fd1dc3df43d1fbb.jpg',
    isOfficial: true,
    title: 'Wilson威尔胜碳纤维专业网球拍 WR136011U2-PRO STAFF',
    price: 1409,
    ratingCount: '2000+',
    ratingScore: '97%'
  }
]);
</script>

<style>
page {
  height: 100%;
}

.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.header {
  flex-shrink: 0;
  background-color: #ffffff;
}

.nav-bar {
  position: relative;
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
}

.back-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  font-weight: 500;
  color: #333333;
}

.content {
  flex: 1;
  overflow: auto;
}

.product-grid {
  padding: 20rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.product-item {
  background-color: #ffffff;
  border-radius: 12rpx;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 340rpx;
  background-color: #f8f8f8;
}

.product-info {
  padding: 20rpx;
}

.shop-tag {
  display: inline-block;
  font-size: 12px;
  color: #ff4444;
  border: 1px solid #ff4444;
  padding: 2px 6px;
  border-radius: 4px;
  margin-bottom: 10rpx;
}

.product-title {
  font-size: 14px;
  color: #333333;
  line-height: 1.4;
  height: 80rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price-row {
  margin-top: 16rpx;
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 14px;
  color: #ff4444;
}

.price-value {
  font-size: 20px;
  font-weight: 600;
  color: #ff4444;
}

.price-decimal {
  font-size: 14px;
  color: #ff4444;
}

.arrival-price {
  font-size: 12px;
  color: #999999;
  margin-left: 10rpx;
}

.original-price {
  font-size: 12px;
  color: #999999;
  text-decoration: line-through;
  margin-left: 10rpx;
}

.product-rating {
  margin-top: 12rpx;
  font-size: 12px;
  color: #999999;
}

.rating-count {
  color: #666666;
}

.rating-score {
  color: #ff4444;
}
</style>

