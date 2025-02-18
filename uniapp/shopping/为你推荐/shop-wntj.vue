
<template>
  <view class="page">
    <!-- 店铺头部 -->
    <view class="shop-header">
      <view class="shop-info">
        <image class="shop-logo" :src="shopInfo.logo" mode="aspectFit" />
        <view class="shop-detail">
          <view class="shop-name">{{ shopInfo.name }}</view>
          <view class="shop-tags">
            <view class="tag self-tag">{{ shopInfo.type }}</view>
            <view class="tag rank-tag">{{ shopInfo.rank }}</view>
            <view class="tag year-tag">{{ shopInfo.year }}</view>
          </view>
        </view>
      </view>
      <uni-button class="follow-btn" type="default" size="mini">关注</uni-button>
    </view>

    <!-- 分类导航 -->
    <view class="category-list">
      <view v-for="(item, index) in categories" :key="index" class="category-item">
        <image class="category-image" :src="item.image" mode="aspectFill" />
        <text class="category-name">{{ item.name }}</text>
      </view>
    </view>

    <!-- 推荐标题 -->
    <view class="recommend-header">
      <text class="recommend-title">为你推荐</text>
      <view class="more">
        <text class="more-text">看更多</text>
        <uni-icons type="right" size="14" color="#666666"></uni-icons>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="product-list">
      <view v-for="(item, index) in products" :key="index" class="product-item">
        <image class="product-image" :src="item.image" mode="aspectFill" />
        <view class="product-info">
          <view class="product-brand">{{ item.brand }}</view>
          <view class="product-title">{{ item.title }}</view>
          <view class="product-price-box">
            <text class="price-symbol">¥</text>
            <text class="product-price">{{ item.price }}</text>
            <view class="add-cart">
              <uni-icons type="plus" size="20" color="#ff0000"></uni-icons>
            </view>
          </view>
          <view class="product-tag" v-if="item.tag">{{ item.tag }}</view>
        </view>
      </view>
    </view>

  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const shopInfo = ref({
  logo: 'https://ai-public.mastergo.com/ai/img_res/208a91954df8a2489b06fa441f5d2ac6.jpg',
  name: '威尔胜京东自营旗舰店',
  type: '自营',
  rank: '篮球运动店铺TOP10',
  year: '8年老店'
});

const categories = ref([
  {
    name: '篮球热销爆款',
    image: 'https://ai-public.mastergo.com/ai/img_res/56ddb392e04e9d445611e6c207d98690.jpg'
  },
  {
    name: '专业拍',
    image: 'https://ai-public.mastergo.com/ai/img_res/e7df8ed9882f67aad246b6574e6e5ed3.jpg'
  },
  {
    name: '休闲拍',
    image: 'https://ai-public.mastergo.com/ai/img_res/0194680e25a370e2c97d87e4846e8b4c.jpg'
  },
  {
    name: '其他配件',
    image: 'https://ai-public.mastergo.com/ai/img_res/8596afb9dba6aae742bb03d3492e8c6e.jpg'
  }
]);

const products = ref([
  {
    image: 'https://ai-public.mastergo.com/ai/img_res/35e5e041d50bf3a3b8a7aafbedd33aa3.jpg',
    brand: '威尔胜（Wilson）',
    title: '2025款CLASH V3',
    price: '2380.00',
    tag: '每满300-60'
  },
  {
    image: 'https://ai-public.mastergo.com/ai/img_res/af65632f50db74ca35bf742f1aba5152.jpg',
    brand: '威尔胜（Wilson）',
    title: '金玄剑典藏礼盒专享版',
    price: '10339.00',
    tag: '跨店每满300减40'
  },
  {
    image: 'https://ai-public.mastergo.com/ai/img_res/032b1d1e063c77fd9b6b492e0a2b8e86.jpg',
    brand: '威尔胜（Wilson）',
    title: '郑钦文同款PRO S',
    price: '2549.00',
    tag: '跨店每满300减40'
  }
]);
</script>

<style>
page {
  height: 100%;
  background-color: #f5f5f5;
}

.page {
  padding: 24rpx;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.shop-info {
  display: flex;
  align-items: center;
}

.shop-logo {
  width: 88rpx;
  height: 88rpx;
  border-radius: 8rpx;
  margin-right: 16rpx;
}

.shop-detail {
  display: flex;
  flex-direction: column;
}

.shop-name {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8rpx;
}

.shop-tags {
  display: flex;
  gap: 12rpx;
}

.tag {
  font-size: 12px;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.self-tag {
  color: #ffffff;
  background-color: #ff4d4f;
}

.rank-tag {
  color: #ff4d4f;
  background-color: #fff1f0;
}

.year-tag {
  color: #666666;
  background-color: #f5f5f5;
}

.follow-btn {
  margin: 0;
  background-color: #333333;
  color: #ffffff;
}

.category-list {
  display: flex;
  justify-content: space-between;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140rpx;
}

.category-image {
  width: 100rpx;
  height: 100rpx;
  margin-bottom: 12rpx;
}

.category-name {
  font-size: 14px;
  color: #333333;
}

.recommend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.recommend-title {
  font-size: 18px;
  font-weight: 500;
  color: #333333;
}

.more {
  display: flex;
  align-items: center;
}

.more-text {
  font-size: 14px;
  color: #666666;
  margin-right: 4rpx;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
}

.product-item {
  width: calc(50% - 12rpx);
  background-color: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 340rpx;
}

.product-info {
  padding: 16rpx;
}

.product-brand {
  font-size: 14px;
  color: #666666;
  margin-bottom: 8rpx;
}

.product-title {
  font-size: 14px;
  color: #333333;
  margin-bottom: 16rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price-box {
  display: flex;
  align-items: baseline;
  margin-bottom: 8rpx;
}

.price-symbol {
  font-size: 14px;
  color: #ff4d4f;
}

.product-price {
  font-size: 20px;
  font-weight: 500;
  color: #ff4d4f;
  margin-right: 12rpx;
}

.add-cart {
  margin-left: auto;
}

.product-tag {
  display: inline-block;
  font-size: 12px;
  color: #ff4d4f;
  background-color: #fff1f0;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}
</style>

