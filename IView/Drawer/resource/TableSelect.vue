<template>
  <div class="resource-index region">
    <Condition
      ref="cd"
      @search="doSearch"
      :init="initCondition"
      :conditionId="target.conditionId"
      :mode="target.mode"
    >
      <Button
        v-if="multiple"
        class="search-btn"
        @click="submitSelect"
        :disabled="recordsLength < 1"
        type="success"
        shape="circle"
        >提交选中</Button
      >
    </Condition>
    <PageTable
      v-if="columns.length > 0"
      :page="page"
      :columns="columns"
      :data="data"
      :loading="loading"
      class="bottom-resource"
      @on-change="doSearch"
      @on-select="doSelect"
      @on-select-cancel="doUnSelect"
      @on-select-all="doSelectAll"
      @on-select-all-cancel="doUnSelectAll"
      ref="table"
    >
      <template #pageLeft>
        选中:<span class="success">{{ recordsLength }}</span>
      </template>
    </PageTable>
  </div>
</template>
<script>
import ColumnFactory from "./column-factory";
import Table from "@/pc/mixin/table.multiple.select";
import mixin from "./mixin";
export default {
  mixins: [mixin, Table],
  mounted() {
    this.columns = ColumnFactory(this, {
      forSelect: true,
      multipleSelect: this.multiple,
      groupInquirySelect: this.target?.forGroupInquiry,
    });
    this.doSearch();
  },
  methods: {
    submitSelect() {
      let tags = this.$refs.cd.getCondition().tags || null;
      this.$emit("select", { records: this.records, tags });
      this.records = [];
    },
  },
};
</script>
