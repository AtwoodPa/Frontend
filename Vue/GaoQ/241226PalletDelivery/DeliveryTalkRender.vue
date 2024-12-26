<template>
  <div class="delivery-talk-render">
    <div class="item">
      <span class="label">责任运营</span>
      <MemberRender :photo="false" :id="target.responsibleOperation"/>
    </div>
    <div class="item">
      <span class="label">坑位费</span>
      <span v-if="target.placementFee">{{ target.placementFee }}</span>
      <span class="value" v-else>
        ---
      </span>
    </div>
    <div class="item">
      <span class="label">线上佣金比例</span>
      <span v-if="target.onlineCommissionRate">{{ target.onlineCommissionRate }}%</span>
      <span class="value" v-else>
        ---
      </span>
    </div>
    <div class="item">
      <span class="label">短直权益</span>
      <span class="value" v-if="target.directRights">
        <Ellipsis :text="target.directRights" :length="10" tooltip />
      </span>
      <span class="value" v-else>
        ---
      </span>
    </div>

    <div class="item">
      <span class="label">线下佣金比例</span>
      <span v-if="target.offlineCommissionRate">{{ target.offlineCommissionRate }}%</span>
      <span class="value" v-else>
        ---
      </span>
    </div>
    <div class="item">
      <span class="label">短直合作金额</span>
      <span v-if="target.directCooperationAmount">{{ target.directCooperationAmount }}</span>
      <span class="value" v-else>
        ---
      </span>
    </div>
<!--    <div class="item">-->
<!--      <span class="label">佣金链接</span>-->
<!--      &lt;!&ndash;      <template v-if="debug">{{ target.responsibleOperation }}</template>&ndash;&gt;-->
<!--      <span class="value" v-if="target.commissionLink">-->
<!--          <a :href="target.commissionLink" target="_blank" rel="noopener noreferrer" class="link">-->
<!--           {{ target.commissionLink ? '查看佣金' : '暂无佣金链接' }}-->
<!--          </a>-->
<!--        </span>-->
<!--      <span v-else class="value">-&#45;&#45;</span>-->
<!--    </div>-->
    <div class="item">
      <span class="label">服务费</span>
      <span v-if="target.serviceFee">{{ target.serviceFee }}%</span>
      <span class="value" v-else>
        ---
      </span>
    </div>
    <div class="item">
      <span class="label">投流机制</span>
      <span class="value" v-if="target.flowMechanism">
        <span v-if="target.flowMechanism === 1">有</span>
        <span v-else-if="target.flowMechanism === 2">无</span>
        <span v-else-if="target.flowMechanism === 3">其他</span>
        <span v-else>未知选项</span>
      </span>
      <span class="value" v-else>
        ---
      </span>
    </div>

    <div class="item">
      <span class="label">寄样需求</span>
      <span v-if="target.sampleNeeded">{{ target.sampleNeeded === true? "是": "否" }}</span>
      <span class="value" v-else>
        ---
      </span>
    </div>

    <div class="item">
      <span class="label">机制调研</span>
      <span v-if="target.mechanismResearch" class="value">
        <Ellipsis :text="target.mechanismResearch" :length="10" tooltip />
      </span>
      <span class="value" v-else>
        ---
      </span>
    </div>

    <div class="item">
      <span class="label">退样需求</span>
      <span v-if="target.returnNeeded">{{ target.returnNeeded === true? "是": "否"  }}</span>
      <span class="value" v-else>
        ---
      </span>
    </div>
    <div class="item">
      <span class="label">谈判要求</span>
      <span v-if="target.negotiationNote" class="value">
        <Ellipsis :text="target.negotiationNote" :length="10" tooltip />
      </span>
      <span class="value" v-else>
        ---
      </span>
    </div>
<!--    <div class="item">-->
<!--      <span class="label">关联工单</span>-->
<!--      <span v-if="target.workOrderLineId">-->
<!--        &lt;!&ndash; {{ target.associatedTasks }}&ndash;&gt;-->
<!--        <span>-->
<!--          工单 (<a @click="toWorkOrderLine">{{target.workOrderLineId}}</a>)-->
<!--        </span>-->
<!--        <span>-->
<!--          待办 (<a @click="toWorkTodo">{{target.workTodoId}}</a>)-->
<!--        </span>-->
<!--      </span>-->
<!--      <span class="value" v-else>-->
<!--        -&#45;&#45;-->
<!--      </span>-->
<!--    </div>-->
<!--    <div class="item">-->
<!--      <span class="label">主要卖点</span>-->
<!--      <span v-if="target.mainSellingPoint" class="value">-->
<!--        <Ellipsis :text="target.mainSellingPoint" :length="10" tooltip />-->
<!--      </span>-->
<!--      <span class="value" v-else>-->
<!--        -&#45;&#45;-->
<!--      </span>-->
<!--    </div>-->

  </div>
</template>

<script>
import Frame from "@/pc/page/frame-open";
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
  computed: {
    hasGoodsEdit() {
      return this.$store.getters.hasGoodsEdit;
    },
    isGroupMrt() {
      return this.$store.getters.isGroupMrt;
    },
    // 判断商品是否导入
    isGoodsImport() {
      return this.$store.getters.isGoodsImport;
    },
  },
  created() {
  },
  methods: {
    toWorkOrderLine(){// to工单
      Frame.workOrderLineUpdate({ id: this.target.workOrderLineId})
    },
    toWorkTodo(){// to工单待办
      const params = {
        id: this.target.workTodoId,
        workKind: 12
      }
      Frame.workTodoUpdate(params)
    },
    // 打开编辑窗口
    frame() {
      if (this.hasGoodsEdit || this.isGroupMrt) {
        if (this.isGoodsImport) {
          Frame.updateGroupGoodsImport(this.target);
        } else {
          Frame.updateGroupGoods({...this.target, activeName: "spread"});
        }
      }
    },
  },
};
</script>

<style lang="less">
.delivery-talk-render {
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