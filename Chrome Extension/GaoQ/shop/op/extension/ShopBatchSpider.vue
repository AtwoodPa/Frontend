<template>
  <Tabs class="batch-spider flex-tabs" v-model="active" :animated="false">
    <!--    清理记录按钮    -->
    <!--    <template #extra>-->
    <!--      <CleanRecordTrigger />-->
    <!--    </template>-->
    <TabPane label="百应店铺ID补充" name="by">
      <PageTable
          :columns="by.columns"
          @on-change="doSearch"
          :sizeOpts="pageSizeList"
          :page="by.page"
          class="common-page region extension-patch"
          :data="by.data"
          :loading="by.loading"
      >
        <template #condition>
          <div class="wrapper">
            <div class="search">
              <div class="item">
                <span class="label">店铺名称</span>
                <Input
                    type="text"
                    v-model.trim="by.condition.shop_name"
                    placeholder="模糊查询"
                    @on-enter="doSearch(1)"
                    clearable
                ></Input>
              </div>
              <div class="item">
                <span class="label">不走团</span>
                <Select v-model="by.condition.unGroup" transfer clearable>
                  <Option :value="0">否</Option>
                  <Option :value="1">是</Option>
                </Select>
              </div>
<!--              <div class="item">-->
<!--                <span class="label">品牌</span>-->
<!--                <BusAllSelect kind="Brand" v-model="by.condition.brandIds"/>-->
<!--              </div>-->
<!--              <div class="item">-->
<!--                <span class="label">类目</span>-->
<!--                <BusAllSelect kind="ShopCategory" v-model="by.condition.categories"/>-->
<!--              </div>-->

              <!--              <div class="item">-->
              <!--                <span class="label">更新时间</span>-->
              <!--                <Select v-model="by.condition.operator" style="width: 80px">-->
              <!--                  <Option :value="'<'">小于</Option>-->
              <!--                  <Option :value="'='">等于</Option>-->
              <!--                  <Option :value="'!='">不等于</Option>-->
              <!--                  <Option :value="'>'">大于</Option>-->
              <!--                </Select>-->
              <!--                <DateAdapter time v-model="by.condition.updateTime"> </DateAdapter>-->
              <!--              </div>-->

              <Button
                  type="primary"
                  shape="circle"
                  icon="ios-search"
                  class="search-btn"
                  @click="doSearch(1)"
              ></Button>
            </div>
          </div>
        </template>
      </PageTable>
    </TabPane>
  </Tabs>
</template>
<script>
import RangeAdapter from "@/pc/component/adapter/RangeAdapter";
import BusStaticSelect from "@/pc/component/select/BusStaticSelect";
import PageTable from "~/vp/PageTable";
import DateAdapter from "@/pc/component/adapter/DateAdapter";
import ColumnFactory from "./shop-column-factory";
import CleanRecordTrigger from "@/pc/component/drawer/cleanRecord-drawer/Trigger";
import {Msg, Aim, For, Tag, Grab, spiderLink} from "@/pc/business/extension/map";
import BusAllSelect from "pc/component/select/BusAllSelect.vue";
// import { PlatformValue } from "../resource/map";
export default {
  props: {
    projectId: Number,
    statusList: Array,
    turnList: Array,
  },
  emits: ["closeDrawer"],
  components: {
    BusAllSelect,
    PageTable,
    BusStaticSelect,
    RangeAdapter,
    DateAdapter,
    CleanRecordTrigger,
  },
  computed: {
    tabId() {
      return this.$store.getters.tabId;
    },
  },
  emits: ["getTabId"],
  data() {
    return {
      throttle: 0,
      active: "by",
      pageSizeList: [500, 1000, 1500, 2000],
      // PlatformValue,
      map: {},
      loading: false,
      by: {
        condition: {
          asNotZsOpId: false,
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
        },
        data: [],
        columns: [],
        page: {
          current: 1,
          size: 500,
        },
        loading: false,
      },
    };
  },
  created() {
    this.active = "by";
    this.doSearch();
    window.addEventListener("message", this.onMessage);
  },
  mounted() {
    this.by.columns = ColumnFactory(this, "by");
  },
  unmounted() {
    window.removeEventListener("message", this.onMessage);
    clearInterval(this.timer);
  },
  watch: {
    active(val) {
      console.log("watch active", val)
      // if (!this.projectId) {
      //   if (this[this.active].data.length < 1) {
      //     this.doSearch(1);
      //   }
      // }
    },
  },
  methods: {
    getCondition() {
      let {
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
      } = this.by.condition;

      let condition = {
        withBrand: true,
      };
      if (categories.length) {
        condition.categories = {$in: categories};
      }
      condition.shop_id = {
        $eq: null
      };
      if (shop_name) {
        condition.shop_name = {
          $regex: shop_name,
          $options: "is",
        };
      }else {
        condition.shop_name = {
          $exists: true,
        };
      }
      if (brandIds && brandIds.length) {
        condition.brandId = {$in: brandIds};
      }
      if (unGroup != null) {
        condition.unGroup = !!unGroup;
      }
      if (platformId) {
        condition.platform = platformId;
      }
      if (hasNotZsOpId) {
        condition.$or = [
          {zsOpId: {$lte: 0}},
          {zsOpId: {$exists: false}},
        ];
      } else if (zsOpIds.length) {
        condition.zsOpId = {$in: zsOpIds};
      }
      if (opIds.length) {
        condition.opId = {$in: opIds};
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
    getLink(detailUrl, id, num, product_id, by ) {
      // let mark = this.active == "by" || by ? "&" : "?";
      let link =
          detailUrl +
          "?" +
          "fromTabId=" +
          this.tabId +
          "&fromId=by"+
          "&name=" +
          product_id +
          "&forGaoqu=" +
          num +
          "&gaoqId=" +
          id;
      ;
      // if (this.projectId) {
      //   link += "&grab=" + Grab.不抓额外数据;
      // } else {
      //
      // }
      link += "&grab=" + Grab.抓取全部数据;
      return link;
    },

    async clickSite(row, toId) {
      console.log("%c 9 --> Line: 250||ShopBatchSpider.vue\n row: ","color:#acf;", row);

      const { id, platform, sec_shop_id ,shop_name} = row;
      const site = "https://buyin.jinritemai.com/dashboard/goodsCooperation/product-saving"
      if ( platform === 9 ){// 抖音百应
        const condition = {}
        condition.sec_shop_id = {
          $eq: sec_shop_id
        }
        condition.shop_name = {
          $eq: shop_name
        }

        const { code, data } =  await this.$api.goodsImport.search(
            {
              condition,
              page:{
                current: 1,
                size: 20,
              }
            }
        );
        if (code === 0) {
          const { product_id } = data.goodsImportList[0]
          this.windowOpenSite({site, id, product_id});
        }
      }
    },
    // getSelectSite(row) {
    //   console.log("getSelectSite", row);
    //   const {id, xtId, byCode, byUpdateTime, xtUpdateTime, mediaId, name} = row;
    //   console.log(
    //       ", xtId, byCode, byUpdateTime, xtUpdateTime",
    //       xtId,
    //       byCode,
    //       byUpdateTime,
    //       xtUpdateTime
    //   );
    //   this.map[id] = {id, xtId, byCode, byUpdateTime, xtUpdateTime};
    //   this.currentId = id;
    //   let site = "";
    //
    //   console.log("!xtUpdateTime && !xtId", !xtUpdateTime && !xtId);
    //   if (!xtUpdateTime && !xtId) {
    //     site =
    //         spiderShopLink(Tag.XtSearch) +
    //         `?keyword=${encodeURIComponent(mediaId)}&name=${encodeURIComponent(
    //             name
    //         )}&forGaoqu=${For.查询星图存在资源}&fromTabId=${this.tabId}&fromId=xt`;
    //   } else {
    //     this.map[id].xtPatch = "done";
    //   }
    //   console.log("!byUpdateTime && !byCode", !byUpdateTime && !byCode);
    //   if (!byUpdateTime && !byCode) {
    //     site =
    //         spiderLink(Tag.BySearch) +
    //         `?keyword=${encodeURIComponent(mediaId)}&name=${encodeURIComponent(
    //             name
    //         )}&forGaoqu=${For.查询百应存在资源}&fromTabId=${this.tabId}&fromId=by`;
    //   } else {
    //     this.map[id].byPatch = "done";
    //   }
    //   if (site) {
    //     return site;
    //   } else {
    //     return null;
    //   }
    // },
    windowOpenSite({site, id, product_id}) {
      if (product_id != null){
        window.open(this.getLink(site, id, For.爬取百应店铺ID, product_id), "_blank");
      }
    },
    onMessage(e) {
      console.log("onMessage", e);
      if (e.data && e.data[0] === "{") {
        try {
          let json = JSON.parse(e.data);
          console.log("onMessage json", json);
          if (Msg.content通过background转发其他content发送给page == json.msg) {
            if (Aim.通知已提取 == json.aim) {
              console.log("content通过background转发其他content发送给page", json);
              if (!this.map[json.data.gaoqId]) {
                console.log("json.data.shop_id",json.data.gaoqId)
                this.tryNext(json, 1000);
              }
              this.throttle = json.data.gaoqId;
              console.log("%c 9 --> Line: 344||ShopBatchSpider.vue\n this.throttle: ","color:#acf;", this.throttle);
            }
            if (Aim.通知已提取 == json.aim) {
              console.log("content通过background转发其他content发送给page", json);
              console.log(123)
              this.patchProcess(json);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    async patchProcess(json) {
      console.log("patchProcess", json)
      console.log("=====this",this)
      const currentRow = this.map[this.currentId];
      const {data, toId} = json;
      let pass = false;

      if (toId == "by") {
        console.log("toId", toId)
        console.log("=====currentRow",currentRow)
        console.log("=====data",data)
        // currentRow.byPatch = "done";
        // if (data.shop_id) {
        //   currentRow.shop_id = data.shop_id;
        //   pass = true;
        // } else {
        //   currentRow.byUpdateTime = new Date();
        //   currentRow.shop_id = "未查询到";
        // }
      }
      console.log("currentRow", currentRow);
      console.log("pass1111", pass);
      if (pass) {
        this.clickSite(currentRow, toId);
      } else {
        const site = this.getSelectSite(currentRow);
        //
        if (site) {
          window.open(site);
        } else {
          // const { id, xtId, byCode, byUpdateTime, xtUpdateTime } = find;
          // this.map[this.map.id] = {
          //   id,
          //   xtId,
          //   byCode,
          //   byUpdateTime,
          //   xtUpdateTime,
          // };
          // this.currentId = id;
          // console.log("map", this.map);
          //1. 这里要做一下数据更新博主，因为星图、百应可能没有该博主页

          //2. 抓取下一个博主数据
         // this.fixByXtTryNext(this.currentId, 1000);
        }
      }
    },
    // fixByXtTryNext(id, timeout) {
    //   if (this[this.active].data.length > 0) {
    //     let preId;
    //     let find = null;
    //     if (id) {
    //       // this.map[id] = true;
    //       find = this[this.active].data.find((item, i) => {
    //         if (this.map[item.id] || this.map[item.id] === 0) {
    //           preId = item.id;
    //           return false;
    //         } else {
    //           return item;
    //         }
    //       });
    //     } else if (Object.keys(this.map).length < 1) {
    //       find = this[this.active].data[0];
    //       preId = find.id;
    //     }
    //
    //     console.log("find", find);
    //     if (find) {
    //       console.log(`#${this.active}${preId}`);
    //       let dom = document.querySelector(`#${this.active}${preId}`);
    //       if (dom) {
    //         dom.scrollIntoView();
    //       }
    //       setTimeout(() => {
    //         const site = this.getSelectSite(find);
    //         const {id, xtId, byCode, byUpdateTime, xtUpdateTime} = find;
    //         this.map[this.map.id] = {
    //           id,
    //           xtId,
    //           byCode,
    //           byUpdateTime,
    //           xtUpdateTime,
    //         };
    //         this.currentId = id;
    //         console.log("map", this.map);
    //         //
    //         if (site) {
    //           window.open(site);
    //         } else {
    //           //1. 这里要做一下数据更新博主，因为星图、百应可能没有该博主页
    //
    //           //2. 抓取下一个博主数据
    //           this.fixByXtTryNext(id, 1000);
    //         }
    //       }, timeout);
    //     }
    //   }
    // },
    async doSearch(pageNo) {
      let {active} = this;
      let target = this[active];
      target.loading = true;
      // 确保 page 已经存在
      if (!this.by.page) {
        this.by.page = {
          current: 1, // 默认当前页
          size: 500,  // 默认每页显示条数
        };
      }
      if (pageNo) {
        this.by.page.current = pageNo;
      }
      let {code, data, page} = await this.$api.shop.search({
        condition: this.getCondition(),
        page: this.by.page,
        sort: {
          createdAt: -1,
        },
      });
      if (code === 0) {
        target.data = data.shopList;
        target.page = page;
      }
      target.loading = false;
    },
    tryNext(json, timeout) {
      console.log("tryNext", json);
      console.log("this[this.active].data[0]",this[this.active].data[0])
      if (this[this.active].data.length > 0) {
        let preId;
        let find = null;
        if (json) {
          this.map[json.data.gaoqId] = json.data;
          find = this[this.active].data.find((item, i) => {
            if (this.map[item.id] || this.map[item.id] === 0) {
              preId = item.id;
              return false;
            } else {
              return item;
            }
          });
          console.log("111find", find);
        } else if (Object.keys(this.map).length < 1) {
          find = this[this.active].data[0];
          preId = find.id;
        }

        console.log("222find", find);
        if (find) {
          console.log(`#${this.active}${preId}`);
          let dom = document.querySelector(`#${this.active}${preId}`);
          if (dom) {
            dom.scrollIntoView();
          }
          setTimeout(() => {
            this.clickSite(find);
          }, timeout);
        } else {
          if (this.projectId) {
            this.$emit("closeDrawer", false);
          }
        }
      } else {
        if (this.projectId) {
          this.$emit("closeDrawer", false);
        }
      }
    },
  },
};
</script>


<style lang="less">
.lverror {
  position: fixed;
  top: 8px;
  right: 20px;
}

.batch-spider {
  height: 100%;
  overflow: hidden;

  .date-adapter {
    width: 180px !important;
    min-width: 180px;
  }

  .photo {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    margin-right: 5px;
  }

  .ivu-checkbox-wrapper {
    margin-left: 5px;
  }

  .pgy-error {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pgy-level-normal {
    color: #ff9635;
  }

  .pgy-level-good {
    color: #2fc061;
  }

  .pgy-level-abnormal {
    width: 80px;
    color: red;
  }

  .ivu-tabs-nav-right {
    height: 100%;
    display: flex;
    align-items: center;

    .ivu-checkbox-wrapper {
      margin: 0px 5px;
    }
  }

  .wrapper .search .item {
    align-items: center;
    margin: 0 5px;

    .label {
      margin-right: 5px;
    }
  }

  .resource-render {
    justify-content: start !important;
  }

  .ivu-table-cell {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    // align-items: center;

    .display {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .lvButton {
      align-self: center;
    }
  }
}
</style>
