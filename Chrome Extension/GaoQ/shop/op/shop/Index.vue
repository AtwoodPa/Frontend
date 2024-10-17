<template>
  <div class="shop-index common-page region">
    <PageTable
      :page="page"
      v-if="columns.length > 0"
      :columns="columns"
      :data="data"
      :loading="loading"
      @on-change="doSearch"
    />
    <div class="common-right-condition">
      <div class="ops">
        <!-- <Button shape="circle" v-if="hasBrandAdd" @click="addModal = true"
          >添加品牌</Button
        > -->

        <Button
          type="primary"
          shape="circle"
          icon="ios-search"
          class="search-btn"
          @click="doSearch(1)"
        ></Button>
        <Button
            class="search-btn"
            type="info"
            @click="goShopExtensionSpider"
            icon="ios-bug-outline"
            shape="circle"
        ></Button>

      </div>
      <div class="scroll">
        <div class="item">
          <span class="label">过滤</span>
          <Checkbox v-model="condition.hasNotZsOpId">未建联</Checkbox>
        </div>
        <div class="item" v-if="!condition.hasNotZsOpId">
          <span class="label">责任招商</span>
          <BusKeySelect kind="Member" v-model="condition.zsOpIds" />
        </div>

        <div class="item">
          <span class="label">ID</span>
          <Input
            v-model.trim="condition.shop_id"
            placeholder="模糊查询"
            @on-enter="doSearch(1)"
            clearable
          ></Input>
        </div>
        <div class="item">
          <span class="label">名称</span>
          <Input
            type="text"
            v-model.trim="condition.shop_name"
            placeholder="模糊查询"
            @on-enter="doSearch(1)"
            clearable
          />
        </div>
        <div class="item">
          <span class="label">不走团</span>
          <Select v-model="condition.unGroup" transfer clearable>
            <Option :value="0">否</Option>
            <Option :value="1">是</Option>
          </Select>
        </div>
        <div class="item">
          <span class="label">品牌</span>
          <BusAllSelect kind="Brand" v-model="condition.brandIds" />
        </div>
        <div class="item">
          <span class="label">平台</span>
          <Select v-model="condition.platformId" clearable transfer>
            <Option :value="8">小红书</Option>
            <Option :value="9">抖音</Option>
          </Select>
        </div>
        <div class="item">
          <span class="label">类目</span>
          <BusAllSelect kind="ShopCategory" v-model="condition.categories" />
        </div>
        <div class="item">
          <span class="label">入库人</span>
          <BusKeySelect kind="Member" v-model="condition.opIds" />
        </div>
        <div class="item">
          <span class="label">入库时间</span>
          <DateAdapter v-model="condition.createTimeRange" transfer />
        </div>
        <div class="item">
          <span class="label">提交时间</span>
          <DateAdapter v-model="condition.submitTimeRange" transfer />
        </div>
      </div>

      <div class="opts"></div>
    </div>
  </div>
</template>
<script>
import PageTable from "~/vp/PageTable.vue";
import BusStaticSelect from "@/pc/component/select/BusStaticSelect";
import BusKeySelect from "@/pc/component/select/BusKeySelect";
import BusAllSelect from "@/pc/component/select/BusAllSelect";
import Frame from "@/pc/page/frame-open";
import DateAdapter from "@/pc/component/adapter/DateAdapter";

import TagSelect from "@/pc/component/select/TagSelect";
import ColumnFactory from "./column-factory";
export default {
  components: {
    PageTable,
    BusKeySelect,
    BusAllSelect,
    DateAdapter,
    BusStaticSelect,
    TagSelect,
  },
  props: {
    target: Object,
  },
  data() {
    return {
      loading: false,
      page: {
        current: 1,
        size: 10,
      },
      condition: {
        hasNotZsOpId: false,
        shop_id: "",
        shop_name: "",
        zsOpIds: [],
        unGroup: null,
        brandIds: [],
        platformId: null,
        submitTime: [],
        categories: [],
        opIds: [],
        createTimeRange: [],
        submitTimeRange: [],
        ...this.target,
      },
      data: [],
      columns: [],
      brandMap: {},
    };
  },
  mounted() {
    // 用到了计算属性
    this.columns = ColumnFactory(this);
    this.doSearch();
  },
  computed: {
    // hasBrandAdd() {
    //   return this.$store.getters.hasBrandAdd;
    // },
    // hasBrandEdit() {
    //   return this.$store.getters.hasBrandEdit;
    // },
    hasSystem() {
      return this.$store.getters.hasSystem;
    },
    config() {
      return this.$store.getters.config;
    },
  },
  methods: {
    goShopExtensionSpider(){
      Frame.shopExtensionSpider();
    },
    getConditon() {
      let {
        shop_id,
        shop_name,
        unGroup,
        zsOpIds,
        hasNotZsOpId,
        brandIds,
        platformId,
        opIds,
        createTimeRange,
        submitTimeRange,
        categories,
      } = this.condition;
      let condition = {
        withBrand: true,
      };
      if (categories.length) {
        condition.categories = { $in: categories };
      }
      if (shop_id) {
        condition.shop_id = {
          $regex: shop_id,
          $options: "is",
        };
      }
      if (shop_name) {
        condition.shop_name = {
          $regex: shop_name,
          $options: "is",
        };
      }
      if (brandIds && brandIds.length) {
        condition.brandId = { $in: brandIds };
      }
      if (unGroup != null) {
        condition.unGroup = !!unGroup;
      }
      if (platformId) {
        condition.platform = platformId;
      }
      if (hasNotZsOpId) {
        condition.$or = [
          { zsOpId: { $lte: 0 } },
          { zsOpId: { $exists: false } },
        ];
      } else if (zsOpIds.length) {
        condition.zsOpId = { $in: zsOpIds };
      }
      if (opIds.length) {
        condition.opId = { $in: opIds };
      }
      if (createTimeRange && createTimeRange[0]) {
        condition.createTimeRange = [
          createTimeRange[0] + " 00:00:0",
          createTimeRange[1] + " 00:00:0",
        ];
      }
      if (submitTimeRange && submitTimeRange[0]) {
        condition.submitTimeRange = [
          submitTimeRange[0] + " 00:00:0",
          submitTimeRange[1] + " 00:00:0",
        ];
      }
      return condition;
    },
    async doSearch(pageNo) {
      this.loading = true;
      if (pageNo) {
        this.page.current = pageNo;
      }
      let { code, data } = await this.$api.shop.search({
        condition: this.getConditon(),
        page: this.page,
        sort: {
          createdAt: -1,
        },
      });
      if (code === 0) {
        let { shopList, page, brandList } = data;
        if (brandList) {
          let brandMap = {};
          brandList.forEach((item) => {
            brandMap[item.id] = item;
          });
          this.brandMap = brandMap;
        }
        shopList.forEach((shop) => {
          shop.qrCodes = shop.qrCodes.map((item) => this.$filter.photo(item));
        });

        this.page = page;
        this.data = shopList;
      }
      this.loading = false;
    },
  },
};
</script>
<style lang="less">
.shop-index {
  display: flex;
  .ops {
    display: flex;
    justify-content: flex-start; /* 将子元素（按钮）靠右对齐 */
    gap: 3px; /* 按钮之间增加间距 */
  }
  .info-list {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
}
</style>
