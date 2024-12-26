<template>
  <div class="delivery-detail-render">
    <div class="item">
      <span class="label">数量</span>
      <span v-if="target.goodsQuantity">{{ target.goodsQuantity }}</span>
      <span class="value" v-else>
        0
      </span>
    </div>
    <div class="item">
      <span class="label">原价</span>
      <span v-if="target.price">{{ target.price}}</span>
      <span class="value" v-else>
        ---
      </span>
    </div>
    <div class="item">
      <span class="label">库存</span>
      <span v-if="target.stockNeed">{{ target.stockNeed }}</span>
      <span class="value" v-else>
        0
      </span>
    </div>
    <div class="item">
      <span class="label">直播价</span>
      <span v-if="target.broadcastPrice">{{ target.broadcastPrice}}</span>
      <span class="value" v-else>
        ---
      </span>
    </div>
    <div class="item">
      <span class="label">效期</span>
      <span v-if="target.validTime">{{ target.validTime }}</span>
      <span class="value" v-else>
        ---
      </span>
    </div>
    <div class="item">
      <span class="label">赠品</span>
      <span v-if="target.gift">{{ target.gift }}</span>
      <span class="value" v-else>
        ---
      </span>
    </div>
    <div class="item">
      <span class="label">保存期限</span>
      <span v-if="target.storageTime">{{ target.storageTime }}</span>
      <span class="value" v-else>
        ---
      </span>
    </div>
    <div class="item">
      <span class="label">商品规格</span>
      <span v-if="target.productStandard">{{ target.productStandard }}</span>
      <span class="value" v-else>
        ---
      </span>
    </div>
    <div class="item">
      <span class="label">独家</span>
      <span>{{ target.onlyOne === true ? "是" : "否" }}</span>
    </div>
  </div>
</template>

<script>
import CopyRender from "./CopyRender";
import {Icon, Input, Space, Tooltip} from "view-ui-plus";
import MemberRender from '@/pc/component/render/MemberRender'

export default {
  components: {
    Icon,
    Tooltip,
    MemberRender,
    Space,
    Input,
    CopyRender,
  },
  data() {
    return {
      step: 1,
    };
  },
  props: {
    target: {
      type: Object,
      required: true,
    },
    display: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="less">
.delivery-detail-render {
  padding: var(--cellPadding) 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 1fr));
  grid-auto-rows: var(--cellHeight);
  gap: var(--cellGap);

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 10px;
    overflow: hidden;

    .label {
      float: left;
    }

    .value{
      text-align: right;
      min-width: 140px;
    }
  }

}
</style>