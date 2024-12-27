<!--改版之前的老编辑页面-->
<template>
  <template v-else>
    <Row>
      <Col span="8">
        <FormItem label="责任运营" prop="responsibleOperation">
          <BusKeySelect
              kind="Member"
              v-model="target.responsibleOperation"
              transfer
              :disabled="isSharedMode"
              style="width: 150px"
          />
        </FormItem>
        <FormItem label="坑位费" prop="placementFee">
          <InputNumber
              controls-outside
              :min="0"
              v-model="target.placementFee"
              placeholder="请输入坑位费"
              :disabled="isSharedMode"
          />
        </FormItem>
        <FormItem label="服务费" prop="serviceFee">
          <template v-if="isSharedMode">
            ---
          </template>
          <template v-else>
            <InputNumber
                controls-outside
                :min="0"
                v-model="target.serviceFee"
                placeholder="请输入服务费"
            />
          </template>
        </FormItem>
        <FormItem label="线上佣金比例" prop="onlineCommissionRate">
          <InputNumber
              controls-outside
              :min="0"
              :max="100"
              v-model="target.onlineCommissionRate"
              placeholder="请输入线上佣金比例"
              class="to-margin"
              :disabled="isSharedMode"
          />
          <FilterRender filter="unitPer" :value="target.onlineCommissionRate" />
        </FormItem>
        <FormItem label="线下佣金比例" prop="offlineCommissionRate">
          <template v-if="isSharedMode">
            ---
          </template>
          <template v-else>
            <InputNumber
                controls-outside
                :min="0"
                :max="100"
                v-model="target.offlineCommissionRate"
                placeholder="请输入线下佣金比例"
                class="to-margin"
            />
            <FilterRender filter="unitPer" :value="target.offlineCommissionRate" />
          </template>
        </FormItem>
        <FormItem label="短直合作金额" prop="directCooperationAmount">
          <InputNumber
              controls-outside
              v-model="target.directCooperationAmount"
              placeholder="请输入短直合作金额"
              :disabled="isSharedMode"
          />
        </FormItem>
        <FormItem label="佣金链接" prop="commissionLink">
          <Input v-model="target.commissionLink" placeholder="请输入佣金链接" />
        </FormItem>
        <FormItem label="手卡链接" prop="handCardLink">
          <Input v-model="target.handCardLink" placeholder="请输入手卡链接" />
        </FormItem>
        <FormItem label="短直权益" prop="directRights">
          <Input
              type="textarea"
              v-model="target.directRights"
              placeholder="请输入短直权益"
              :rows="rows"
              :maxlength="maxLength"
              show-word-limit
              clearable
              :disabled="isSharedMode"
          />
        </FormItem>
        <FormItem label="其他备注" prop="remarks">
          <Input
              type="textarea"
              v-model="target.remarks"
              placeholder="请输入其他备注"
              :rows="rows"
              :maxlength="maxLength"
              show-word-limit
              clearable
              :disabled="isSharedMode"
          />
        </FormItem>
        <FormItem label="投流机制" prop="flowMechanism">
          <Select v-model="target.flowMechanism" style="width: 300px" :disabled="isSharedMode">
            <Option
                v-for="item in mechanismStatus"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="机制调研" prop="mechanismResearch">
          <Input
              type="textarea"
              v-model="target.mechanismResearch"
              placeholder="请输入机制调研"
              :rows="rows"
              :maxlength="maxLength"
              show-word-limit
              clearable
              :disabled="isSharedMode"
          />
        </FormItem>

      </Col>
      <Col span="8">
        <FormItem label="寄样" prop="sampleNeeded">
          <Switch
              v-model="target.sampleNeeded"
              :trueValue="true"
              :falseValue="false"
              :disabled="isSharedMode"
          />
        </FormItem>
        <template v-if="target.sampleNeeded">
          <FormItem label="寄样快递单号" prop="sampleCode">
            <Input v-model="target.sampleCode" placeholder="请输入寄样快递单号" />
          </FormItem>
          <FormItem label="收样地址" prop="sampleAddress">
            <Input v-model="target.sampleAddress" placeholder="请输入收样地址" />
          </FormItem>
          <FormItem
              v-if="showSampleSfPhone"
              label="收样手机号码"
              prop="sampleSfPhone"
          >
            <Input v-model="target.sampleSfPhone" placeholder="请输入收样手机号码" />
          </FormItem>
        </template>
        <FormItem label="退样" prop="returnNeeded">
          <Switch
              v-model="target.returnNeeded"
              :trueValue="true"
              :falseValue="false"
          />
        </FormItem>
        <template v-if="target.returnNeeded">
          <FormItem label="退样快递单号" prop="returnCode">
            <Input v-model="target.returnCode" placeholder="请输入退样快递单号" />
          </FormItem>
          <FormItem label="退样地址" prop="returnAddress">
            <Input v-model="target.returnAddress" placeholder="请输入退样地址" />
          </FormItem>
          <FormItem
              v-if="showReturnSfPhone"
              label="退样手机号码"
              prop="returnSfPhone"
          >
            <Input v-model="target.returnSfPhone" placeholder="请输入退样手机号码" />
          </FormItem>
        </template>
        <template v-if="isSharedMode">
        </template>
        <template v-else>
          <FormItem label="谈判工单" prop="negotiationWorkOrder" >
              <span>
                工单 (<a @click="toWorkOrderLine">{{ target.workOrderLineId }}</a
              >)
              </span>
            <span>
                待办 (<a @click="toWorkTodo">{{ target.workTodoId }}</a
            >)
              </span>
          </FormItem>
          <FormItem label="关联工单" prop="relatedWorkOrder"> 关联工单 </FormItem>
        </template>

        <FormItem label="是否独家" prop="onlyOne">
          <Switch v-model="target.onlyOne" />
        </FormItem>
        <FormItem label="产品数量" prop="goodsQuantity">
          <InputNumber
              type="number"
              v-model="target.goodsQuantity"
              placeholder="请输入产品数量"
          />
        </FormItem>
        <FormItem label="可调拨库存" prop="stockNeed">
          <InputNumber
              type="number"
              v-model="target.stockNeed"
              placeholder="请输入产品可调拨库存"
          />
        </FormItem>
        <FormItem label="直播价" prop="broadcastPrice">
          <InputNumber
              type="number"
              v-model="target.broadcastPrice"
              placeholder="请输入直播价"
              class="to-margin"
          />
          <span>原价: {{ target.goods.price / 100 }}</span>
        </FormItem>
        <FormItem label="效期" prop="validTime">
          <DateAdapter v-model="target.validTime" placeholder="请选择效期时间" />
        </FormItem>
        <FormItem label="保存期限" prop="storageTime">
          <DateAdapter v-model="target.storageTime" placeholder="请选择保存期限（产品保质期）" />
        </FormItem>
        <FormItem label="赠品" prop="gift">
          <Input
              type="textarea"
              v-model="target.gift"
              placeholder="请输入赠品"
              :rows="rows"
              :maxlength="maxLength"
              show-word-limit
              clearable
          />
        </FormItem>
        <FormItem label="规格" prop="productStandard">
          <Input
              type="textarea"
              v-model="target.productStandard"
              placeholder="请输入规格信息"
              :rows="rows"
              :maxlength="maxLength"
              show-word-limit
              clearable
          />
        </FormItem>
        <FormItem label="主要卖点" prop="mainSellingPoint">
          <Input
              type="textarea"
              v-model="target.mainSellingPoint"
              placeholder="请输入主要卖点"
              :rows="rows"
              :maxlength="maxLength"
              show-word-limit
              clearable
          />
        </FormItem>
      </Col>
    </Row>
  </template>
</template>

<style scoped lang="less">

</style>