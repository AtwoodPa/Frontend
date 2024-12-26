<template>
  <div class="pallet-deliver-render">
    <div class="item a-spyj">
      <span class="label">原价</span>
      <span class="value" :class="deliveryClass.price">
        <Input
            type="number"
            v-model.number="deliveryForm.price"
            :disabled="deliveryForm.price !== 0"
            size="small"
        />
      </span>
    </div>

    <div class="item a-fwf">
      <span class="label">服务费%</span>
      <span class="value " :class="deliveryClass.serviceFee">
        <template v-if="!readOnly">
          <Input
              type="number"
              v-model.number="deliveryForm.serviceFee"
              size="small"
          />
        </template>
        <template v-else>
          ---
        </template>
      </span>
    </div>

    <div class="item a-kwf">
      <span class="label">坑位费%</span>
      <span class="value" :class="deliveryClass.placementFee">
        <Input
            type="number"
            v-model.number="deliveryForm.placementFee"
            :disabled="readOnly"
            size="small"
        />
      </span>
    </div>

    <div class="item a-xsyj">
      <span class="label">线上佣金%</span>
      <span class="value" :class="deliveryClass.onlineCommissionRate">
        <Input
            type="number"
            v-model.number="deliveryForm.onlineCommissionRate"
            :disabled="readOnly"
            size="small"
        />
      </span>
    </div>

    <div class="item a-xxyj">
      <span class="label">线下佣金%</span>
      <span class="value" :class="deliveryClass.offlineCommissionRate">
        <template v-if="!readOnly">
          <Input
              type="number"
              v-model.number="deliveryForm.offlineCommissionRate"
              size="small"
          />
        </template>
        <template v-else>
          ---
        </template>
      </span>
    </div>

    <div class="item a-dzhz">
      <span class="label">短直合作金额</span>
      <span class="value" :class="deliveryClass.directCooperationAmount">
        <Input
            type="number"
            v-model.number="deliveryForm.directCooperationAmount"
            :disabled="readOnly"
            size="small"
        />
      </span>
    </div>

    <div class="item a-dj primary">
      <span class="label" :class="deliveryClass.onlyOne">是否独家</span>
      <span class="value">
        <Switch
            size="small"
            v-model="deliveryForm.onlyOne"
            :trueValue="true"
            :falseValue="false"
        />
      </span>
    </div>

    <div class="item a-kdbkc">
      <span class="label">可调拨库存</span>
      <div class="value" :class="deliveryClass.assignStock">
        <TextInputPoptip  v-model="deliveryForm.assignStock"/>
      </div>
    </div>

    <div class="item a-zbj">
      <span class="label">直播价</span>
      <span class="value" :class="deliveryClass.broadcastPrice">
        <Input
            type="number"
            v-model.number="deliveryForm.broadcastPrice"
            size="small"
        />
      </span>
    </div>

    <div class="item a-kc">
      <span class="label">库存</span>
      <span class="value" :class="deliveryClass.goodsQuantity">
        <Input
            type="number"
            v-model.number="deliveryForm.goodsQuantity"
            size="small"
        />
      </span>
    </div>

    <div class="item a-gg">
      <span class="label">规格</span>
      <div class="value" :class="deliveryClass.productStandard">
        <TextInputPoptip  v-model="deliveryForm.productStandard"/>
      </div>
    </div>

    <div class="item a-zp">
      <span class="label">赠品</span>
      <div class="value" :class="deliveryClass.gift">
        <TextInputPoptip  v-model="deliveryForm.gift"/>
      </div>
    </div>

    <div class="item">
      <span class="label">商品链接</span>
      <div class="value" :class="deliveryClass.productLink">
        <TextInputPoptip  v-model="deliveryForm.productLink"/>
      </div>
    </div>

    <div class="item">
      <span class="label">佣金链接/口令</span>
      <div class="value" :class="deliveryClass.commissionLink">
        <TextInputPoptip  v-model="deliveryForm.commissionLink"/>
      </div>
    </div>

    <div class="item">
      <span class="label">手卡链接</span>
      <div class="value" :class="deliveryClass.handCardLink">
        <TextInputPoptip  v-model="deliveryForm.handCardLink"/>
      </div>
    </div>

    <div class="item">
      <span class="label">主要卖点</span>
      <div class="value" :class="deliveryClass.mainSellingPoint">
        <TextInputPoptip  v-model="deliveryForm.mainSellingPoint"/>
      </div>
    </div>



    <div class="item">
      <div class="label">效期</div>
      <div class="value" :class="deliveryClass.validTime">
        <DateAdapter
            size="small"
            transfer
            v-model="deliveryForm.validTime"
        />
      </div>
    </div>

    <div class="item a-execTime">
      <div class="label">保存期限</div>
      <div class="value" :class="deliveryClass.storageTime">
        <DateAdapter
            size="small"
            transfer
            v-model="deliveryForm.storageTime"
        />
      </div>
    </div>

    <div class="item a-jyxq primary">
      <span class="label">寄样需求</span>
      <span class="value">
        <Switch
            size="small"
            v-model="deliveryForm.sampleNeeded"
            :trueValue="true"
            :falseValue="false"
        />
      </span>
    </div>

    <div class="item a-jydh">
      <span class="label">寄样快递单号</span>
      <div class="value" :class="deliveryClass.sampleCode">
        <TextInputPoptip  v-model="deliveryForm.sampleCode"/>
      </div>
    </div>

    <div class="item a-jyhm">
      <span class="label">收样手机号码</span>
      <div class="value" :class="deliveryClass.sampleSfPhone">
        <TextInputPoptip  v-model="deliveryForm.sampleSfPhone"/>
      </div>
    </div>

    <div class="item a-jydz">
      <span class="label">收样地址</span>
      <div class="value" :class="deliveryClass.sampleAddress">
        <TextInputPoptip  v-model="deliveryForm.sampleAddress"/>
      </div>
    </div>

    <div class="item a-jymx">
      <span class="label">寄样明细</span>
      <div class="value" :class="deliveryClass.sampleDetails">
        <TextInputPoptip  v-model="deliveryForm.sampleDetails"/>
      </div>
    </div>

    <div class="item a-jysl">
      <span class="label">寄样数量</span>
      <span class="value" :class="deliveryClass.sampleQuantity">
        <Input
            type="number"
            v-model.number="deliveryForm.sampleQuantity"
            size="small"
        />
      </span>
    </div>

    <div class="item a-tyxq primary">
      <span class="label">退样需求</span>
      <span class="value">
        <Switch
            size="small"
            v-model="deliveryForm.returnNeeded"
            :trueValue="true"
            :falseValue="false"
        />
        {{ deliveryForm.returnNeeded ? '是' : '否' }}
      </span>
    </div>

    <div class="item a-tydh">
      <span class="label">退样快递单号</span>
      <div class="value" :class="deliveryClass.returnCode">
        <TextInputPoptip  v-model="deliveryForm.returnCode"/>
      </div>
    </div>

    <div class="item a-tyhm">
      <span class="label">退样手机号码</span>
      <div class="value" :class="deliveryClass. returnSfPhone">
        <TextInputPoptip  v-model="deliveryForm. returnSfPhone"/>
      </div>
    </div>

    <div class="item a-tydz">
      <span class="label">退样地址</span>
      <div class="value" :class="deliveryClass.returnAddress">
        <TextInputPoptip  v-model="deliveryForm.returnAddress"/>
      </div>
    </div>

    <div class="item a-tymx">
      <span class="label">退样明细</span>
      <div class="value" :class="deliveryClass.returnDetails">
        <TextInputPoptip  v-model="deliveryForm.returnDetails"/>
      </div>
    </div>

    <div class="item a-tysl">
      <span class="label">退样数量</span>
      <span class="value" :class="deliveryClass.returnQuantity">
        <Input
            type="number"
            v-model.number="deliveryForm.returnQuantity"
            size="small"
        />
      </span>
    </div>

    <div class="a-save">
      <Button
          type="success"
          size="small"
          v-if="hasUpdate"
          @click="doUpdate"
          :loading="loading"
          icon="ios-checkbox-outline">保存
      </Button>
    </div>
  </div>
</template>

<script>
import DateAdapter from "@/pc/component/adapter/DateAdapter.vue";
import MemberRender from "@/pc/component/render/MemberRender.vue";
import TextInputPoptip from "@/pc/component/poptip/TextInputPoptip.vue";

export default {
  name: 'PalletDeliverRender',
  components: {TextInputPoptip, MemberRender, DateAdapter},
  emits: ["updateDelivery"],
  props: {
    target: Object,
    readOnly: {// 外链只读
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      ...this.getDeliveryFormClass(),
    };
  },
  mounted() {
    if (this.hasUpdate){
      window.addEventListener("beforeunload", this.beforeUnloadHandler);
    }
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.beforeUnloadHandler);
  },
  computed: {
    hasUpdate() {
      return Object.values(this.deliveryClass).findIndex((item) => item) > -1;
    },
  },
  watch: {
    target: {
      deep: true,
      handler(val) {
        let {deliveryForm, deliveryClass} = this.getDeliveryFormClass();
        Object.assign(this.deliveryForm, deliveryForm);
        Object.assign(this.deliveryClass, deliveryClass);
      }
    },
    hasUpdate(newValue) {
      if (newValue) {
        window.addEventListener("beforeunload", this.beforeUnloadHandler);
      } else {
        window.removeEventListener("beforeunload", this.beforeUnloadHandler);
      }
    },
    "deliveryForm.serviceFee"(value) {
      this.updateInputClass("serviceFee", value, this.target.serviceFee);
    },
    "deliveryForm.placementFee"(value) {
      this.updateInputClass("placementFee", value, this.target.placementFee);
    },
    "deliveryForm.onlineCommissionRate"(value) {
      this.updateInputClass("onlineCommissionRate", value, this.target.onlineCommissionRate);
    },
    "deliveryForm.offlineCommissionRate"(value) {
      this.updateInputClass("offlineCommissionRate", value, this.target.offlineCommissionRate);
    },
    "deliveryForm.directCooperationAmount"(value) {
      this.updateInputClass("directCooperationAmount", value, this.target.directCooperationAmount);
    },
    "deliveryForm.price"(value) {
      this.updateInputClass("price", value, this.target.price);
    },
    "deliveryForm.broadcastPrice"(value) {
      this.updateInputClass("broadcastPrice", value, this.target.broadcastPrice);
    },
    "deliveryForm.goodsQuantity"(value) {
      this.updateInputClass("goodsQuantity", value, this.target.goodsQuantity);
    },
    "deliveryForm.sampleQuantity"(value) {
      // this.deliveryForm.sampleNeeded = this.deliveryForm.sampleQuantity !== undefined && this.deliveryForm.sampleQuantity > 0;
      this.updateInputClass("sampleQuantity", value, this.target.sampleQuantity);
    },
    "deliveryForm.returnQuantity"(value) {
      // this.deliveryForm.returnNeeded = this.deliveryForm.returnQuantity !== undefined && this.deliveryForm.returnQuantity > 0;
      this.updateInputClass("returnQuantity", value, this.target.returnQuantity);
    },
    "deliveryForm.onlyOne"(value) {
      this.updateTextInputClass("onlyOne", value, this.target.onlyOne);
    },
    "deliveryForm.productStandard"(value) {
      this.updateTextInputClass("productStandard", value, this.target.productStandard);
    },
    "deliveryForm.gift"(value) {
      this.updateTextInputClass("gift", value, this.target.gift);
    },
    "deliveryForm.productLink"(value) {
      this.updateTextInputClass("productLink", value, this.target.productLink);
    },
    "deliveryForm.commissionLink"(value) {
      this.updateTextInputClass("commissionLink", value, this.target.commissionLink);
    },
    "deliveryForm.handCardLink"(value) {
      this.updateTextInputClass("handCardLink", value, this.target.handCardLink);
    },
    "deliveryForm.mainSellingPoint"(value) {
      this.updateTextInputClass("mainSellingPoint", value, this.target.mainSellingPoint);
    },
    "deliveryForm.assignStock"(value) {
      this.updateTextInputClass("assignStock", value, this.target.assignStock);
    },
    "deliveryForm.validTime"(value) {
      this.updateTextInputClass("validTime", value, this.target.validTime);
    },
    "deliveryForm.storageTime"(value) {
      this.updateTextInputClass("storageTime", value, this.target.storageTime);
    },
    // "deliveryForm.sampleNeeded"(value){
    //   this.updateTextInputClass("sampleNeeded", value, this.target.sampleNeeded);
    // },
    "deliveryForm.sampleCode"(value) {
      this.deliveryForm.sampleNeeded = this.deliveryForm.sampleCode !== "";
      this.updateTextInputClass("sampleCode", value, this.target.sampleCode);
    },
    "deliveryForm.sampleSfPhone"(value) {
      this.deliveryForm.sampleNeeded = this.deliveryForm.sampleSfPhone !== "";
      this.updateTextInputClass("sampleSfPhone", value, this.target.sampleSfPhone);
    },
    "deliveryForm.sampleAddress"(value) {
      this.deliveryForm.sampleNeeded = this.deliveryForm.sampleAddress !== "";
      this.updateTextInputClass("sampleAddress", value, this.target.sampleAddress);
    },
    "deliveryForm.sampleDetails"(value) {
      this.deliveryForm.sampleNeeded = this.deliveryForm.sampleDetails !== "";
      this.updateTextInputClass("sampleDetails", value, this.target.sampleDetails);
    },
    // "deliveryForm.returnNeeded"(value){
    //   this.updateTextInputClass("returnNeeded", value, this.target.returnNeeded);
    // },
    "deliveryForm.returnCode"(value) {
      this.deliveryForm.returnNeeded = this.deliveryForm.returnCode !== "";
      this.updateTextInputClass("returnCode", value, this.target.returnCode);
    },
    "deliveryForm.returnSfPhone"(value) {
      this.deliveryForm.returnNeeded = this.deliveryForm.returnSfPhone !== "";
      this.updateTextInputClass("returnSfPhone", value, this.target.returnSfPhone);
    },
    "deliveryForm.returnAddress"(value) {
      this.deliveryForm.returnNeeded = this.deliveryForm.returnAddress !== "";
      this.updateTextInputClass("returnAddress", value, this.target.returnAddress);
    },
    "deliveryForm.returnDetails"(value) {
      this.deliveryForm.returnNeeded = this.deliveryForm.returnDetails !== "";
      this.updateTextInputClass("returnDetails", value, this.target.returnDetails);
    },
  },
  methods: {
    async doUpdate() {
      this.loading = true;
      const params = {
        id: this.target._id,
        liveProjectId: this.target.liveProjectId,
        agreed: this.target.agreed,
        executionStep: this.target.executionStep,
        ...this.deliveryForm
      }
      let { code } = await this.$api.liveProject.updateChooseGoods(params);
      if (code === 0) {
        this.loading = false;
        this._messageSuccess("保存成功");
        this.$emit("updateDelivery", this.deliveryForm);
      }
    },
    beforeUnloadHandler(event) {
      event.preventDefault();
      event.returnValue = "您有未保存的更改，确定要离开页面吗？";
    },
    updateInputClass(field, newValue, oldValue) {
      newValue = newValue === undefined ? 0 : newValue;
      oldValue = oldValue === undefined ? 0 : oldValue;
      let className = "";
      if (newValue > oldValue) {
        className = "dirty-up-cell";
      } else if (newValue < oldValue) {
        className = "dirty-down-cell";
      } else {
        className = "";
      }
      this.deliveryClass[field] = className;
    },
    updateTextInputClass(field, newValue, oldValue) {
      newValue = newValue === undefined ? "" : newValue;
      oldValue = oldValue === undefined ? "" : oldValue;
      this.deliveryClass[field] = oldValue === newValue ? "" : "dirty-cell";
    },
    getDeliveryFormClass() {
      let delivery = this.target;
      if (delivery) {
        let {
          responsibleOperation, // 责任运营
          serviceFee, // 服务费
          placementFee, // 坑位费
          onlineCommissionRate, // 线上佣金率
          offlineCommissionRate, // 线下佣金率
          directCooperationAmount, // 短直合作金额--
          onlyOne,// 是否独家
          price, // 原价
          broadcastPrice, // 直播价
          goodsQuantity, // 库存数
          productStandard, // 规格
          gift, // 赠品--
          productLink, // 商品链接
          commissionLink, // 佣金链接/口令
          handCardLink, // 手卡链接
          mainSellingPoint, // 主要卖点
          assignStock, // 可调拨库存
          validTime, // 效期
          storageTime, // 保存期限--
          sampleNeeded, // 寄样需求
          sampleCode, // 寄样快递单号
          sampleSfPhone, // 收样手机号码
          sampleAddress, // 收样地址
          sampleDetails, // 寄样明细
          sampleQuantity, // 寄样数量--
          returnNeeded, // 退样需求
          returnCode, // 退样快递单号
          returnSfPhone, // 退样手机号码
          returnAddress, // 退样地址
          returnDetails, // 退样明细
          returnQuantity, // 退样数量--
        } = delivery
        let deliveryForm = {
          responsibleOperation: responsibleOperation || -1, // 责任运营
          serviceFee: serviceFee || 0, // 服务费
          placementFee: placementFee || 0, // 坑位费
          onlineCommissionRate, // 线上佣金率
          offlineCommissionRate, // 线下佣金率
          directCooperationAmount: directCooperationAmount || 0, // 短直合作金额--
          onlyOne,// 是否独家
          price: price || price, // 原价
          broadcastPrice, // 直播价
          goodsQuantity: goodsQuantity || 0, // 库存数
          productStandard: productStandard || "", // 规格
          gift: gift || "", // 赠品--
          productLink: productLink || "", // 商品链接
          commissionLink: commissionLink || "", // 佣金链接/口令
          handCardLink: handCardLink || "", // 手卡链接
          mainSellingPoint: mainSellingPoint || "", // 主要卖点
          assignStock: assignStock || "", // 可调拨库存
          validTime: validTime || "", // 效期
          storageTime: storageTime || "", // 保存期限--
          sampleNeeded, // 寄样需求
          sampleCode: sampleCode || "", // 寄样快递单号
          sampleSfPhone: sampleSfPhone || "", // 收样手机号码
          sampleAddress: sampleAddress || "", // 收样地址
          sampleDetails: sampleDetails || "", // 寄样明细
          sampleQuantity: sampleQuantity || 0, // 寄样数量--
          returnNeeded, // 退样需求
          returnCode: returnCode || "", // 退样快递单号
          returnSfPhone: returnSfPhone || "", // 退样手机号码
          returnAddress: returnAddress || "", // 退样地址
          returnDetails: returnDetails || "", // 退样明细
          returnQuantity: returnQuantity || 0, // 退样数量--
        };
        let deliveryClass = {// 初始化样式
          responsibleOperation: "", // 责任运营
          serviceFee: "", // 服务费
          placementFee: "", // 坑位费
          onlineCommissionRate: "", // 线上佣金率
          offlineCommissionRate: "", // 线下佣金率
          directCooperationAmount: "", // 短直合作金额--
          onlyOne: "",// 是否独家
          price: "", // 原价
          broadcastPrice: "", // 直播价
          goodsQuantity: "", // 库存数
          productStandard: "", // 规格
          gift: "", // 赠品--
          productLink: "", // 商品链接
          commissionLink: "", // 佣金链接/口令
          handCardLink: "", // 手卡链接
          mainSellingPoint: "", // 主要卖点
          assignStock: "", // 可调拨库存
          validTime: "", // 效期
          storageTime: "", // 保存期限--
          sampleNeeded: "", // 寄样需求
          sampleCode: "", // 寄样快递单号
          sampleSfPhone: "", // 收样手机号码
          sampleAddress: "", // 收样地址
          sampleDetails: "", // 寄样明细
          sampleQuantity: "", // 寄样数量--
          returnNeeded: "", // 退样需求
          returnCode: "", // 退样快递单号
          returnSfPhone: "", // 退样手机号码
          returnAddress: "", // 退样地址
          returnDetails: "", // 退样明细
          returnQuantity: "", // 退样数量--
        };
        return {
          deliveryForm,
          deliveryClass,
        };
      }
      return {
        deliveryForm: {},
        deliveryClass: {}
      }
    },
  }
}
</script>

<style lang="less">
.pallet-deliver-render {
  padding: var(--cellPadding) 0;
  display: grid;
  column-gap: var(--cellColumnGap);
  //font-size: var(--fontSize);
  font-size: 12px;
  grid-template-areas:
      "a11 a12 a13 a14 a15"
      "a21 a22 a23 a24 a25"
      "a31 a32 a33 a34 a35"
      "a41 a42 a43 a44 a45"
      "a51 a52 a53 a54 a55"
      "a61 a62 a63 a64 a65"
      "a71 a72 a73 a74 a75";
  grid-template-columns: repeat(5, 1fr);

  .a-save {
    grid-area: a73;
  }

  .a-spyj {
    grid-area: a11;
  }

  .a-fwf {
    grid-area: a21;
  }

  .a-kwf {
    grid-area: a31;
  }

  .a-xsyj {
    grid-area: a41;
  }

  .a-xxyj {
    grid-area: a51;
  }

  .a-dzhz {
    grid-area: a61;
  }

  // 第二列
  .a-dj {
    grid-area: a12;
  }

  .a-zbj {
    grid-area: a22;
  }

  .a-kc {
    grid-area: a32;
  }

  .a-kdbkc {
    grid-area: a42;
  }

  .a-gg {
    grid-area: a52;
  }

  .a-zp {
    grid-area: a62;
  }

  // 第三列


  // 第四列
  .a-jyxq {
    grid-area: a14;
  }

  .a-jydh {
    grid-area: a24;
  }

  .a-jyhm {
    grid-area: a34;
  }

  .a-jydz {
    grid-area: a44;
  }

  .a-jymx {
    grid-area: a54;
  }

  .a-jysl {
    grid-area: a64;
  }

  // 第五列
  .a-tyxq {
    grid-area: a15;
  }

  .a-tydh {
    grid-area: a25;
  }

  .a-tyhm {
    grid-area: a35;
  }

  .a-tydz {
    grid-area: a45;
  }

  .a-tymx {
    grid-area: a55;
  }

  .a-tysl {
    grid-area: a65;
  }

  .item {
    flex: 1;
    display: flex;
    height: var(--cellHeight);
    justify-content: space-between;
    font-size: 12px;
    text-align: left; // 覆盖Table的text-align: center
    .label {
      flex: 1;
    }

    .value {
      max-width: calc(100% - 100px);
    }
  }

  .item-text {
    .label {
      min-width: 70px;
      flex: unset; // 不参与flex竞争
    }

    .value {
      flex: 1;
      text-align: right;
      max-width: calc(100% - 70px);
    }
  }

  .ivu-input-type-number {
    width: 80px;
  }

  .ivu-select {
    width: 112px;
  }

  .date-adapter {
    min-width: unset;
    width: 112px;
  }

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 10px;
    overflow: hidden;
  }

  .dirty-cell {
    color: var(--warning);

    .ivu-select-input {
      color: var(--warning);
    }

    .ivu-input {
      color: var(--warning);
    }
  }

  .dirty-up-cell {
    color: var(--error);

    .ivu-input {
      color: var(--error);
    }
  }

  .dirty-down-cell {
    color: var(--success);

    .ivu-input {
      color: var(--success);
    }
  }

}
</style>