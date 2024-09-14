<template>
  <div class="common-page region approval-excel">
    <!-- <Tabs v-model="kind" @on-click="doSearch(1)">
      <TabPane label="导出审核" name="1"> </TabPane>
      <TabPane label="立项审核" name="2"> </TabPane>
    </Tabs> -->
    <PageTable
      class="region"
      :columns="columns"
      :data="data"
      :loading="loading"
      @on-change="doSearch"
      ref="pageTable"
      :page="page"
    >
      <template #condition>
        <template v-if="kind == 1">
          <div class="wrapper">
            <div class="search">
              <div class="item">
                <span class="label">项目名称</span>
                <Input
                  placeholder="模糊查询"
                  @on-enter="doSearch(1)"
                  v-model="conditionDc.title"
                  clearable
                ></Input>
              </div>
              <div class="item">
                <span class="label">ID</span>
                <Input
                  type="number"
                  placeholder="项目ID"
                  @on-enter="doSearch(1)"
                  v-model="conditionDc.target"
                  clearable
                ></Input>
              </div>
              <div class="item">
                <span class="label">申请人</span>
                <BusKeySelect kind="Member" v-model="conditionDc.submitOpId" />
              </div>
              <div class="item">
                <span class="label">状态</span>
                <CheckboxGroup v-model="conditionDc.statusList">
                  <Checkbox
                    :label="index"
                    v-for="(item, index) in StatusMap"
                    :key="item"
                    class="status-checkbox"
                    >{{ item }}</Checkbox
                  >
                </CheckboxGroup>
              </div>
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
        <template v-else-if="kind == 2">
          <div class="wrapper">
            <div class="search">
              <div class="item">
                <span class="label">项目名称</span>
                <Input
                  placeholder="模糊查询"
                  @on-enter="doSearch(1)"
                  v-model="conditionLx.title"
                  clearable
                ></Input>
              </div>
              <div class="item">
                <span class="label">ID</span>
                <Input
                  type="number"
                  placeholder="项目ID"
                  @on-enter="doSearch(1)"
                  v-model="conditionLx.target"
                  clearable
                ></Input>
              </div>
              <div class="item">
                <span class="label">申请人</span>
                <BusKeySelect kind="Member" v-model="conditionLx.submitOpId" />
              </div>
              <div class="item">
                <span class="label">状态</span>
                <CheckboxGroup v-model="conditionLx.statusList">
                  <Checkbox
                    :label="index"
                    v-for="(item, index) in StatusMap"
                    :key="item"
                    class="status-checkbox"
                    >{{ item }}</Checkbox
                  >
                </CheckboxGroup>
              </div>
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
      </template>
    </PageTable>
  </div>
</template>
<script>
import PageTable from "~/vp/PageTable";
import Frame from "@/pc/page/frame-open";
import BusKeySelect from "@/pc/component/select/BusKeySelect";
import ButtonRender from "@/pc/component/render/ButtonRender";
import MemberRender from "@/pc/component/render/MemberRender";
import { StatusMap, StatusToClass, ApprovalKindMap } from "./map.js";
export default {
  components: {
    PageTable,
    ButtonRender,
    BusKeySelect,
  },
  data() {
    const me = this;
    return {
      StatusMap,
      kind: ApprovalKindMap["报价表"],
      data: [],
      remark: "1232131",
      conditionDc: {
        target: null,
        title: "",
        submitOpId: null,
        statusList: ["0"],
      },
      conditionLx: {
        target: null,
        title: "",
        submitOpId: null,
        statusList: ["0"],
      },
      columns: [
        {
          title: "项目ID/名称",
          minWidth: me.$width.project,
          key: "name",
          render(h, { row }) {
            let { target, title } = row;
            return [
              h(
                "span",
                {
                  class: "warning",
                  onClick() {
                    me._copy(row.target);
                  },
                },
                target
              ),
              ,
              " / ",
              h(
                "span",
                {
                  class: "hover-primary",
                  onClick() {
                    Frame.updateProject({ id: target, name: title });
                  },
                },
                title
              ),
            ];
          },
        },
        {
          title: "申请人",
          width: me.$width.member,
          render(h, { row }) {
            return h(MemberRender, {
              id: row.submitOpId,
            });
          },
        },
        {
          title: "审核人",
          width: me.$width.member,
          render(h, { row }) {
            return h(MemberRender, {
              id: row.judgeOpId,
            });
          },
        },
        {
          title: "申请时间",
          align: "center",
          width: 180,
          render(h, { row }) {
            return h(
              "div",
              new Date(row.submitTime).format("yyyy-MM-dd hh:mm:ss")
            );
          },
        },
        // {
        //   title: "申请备注",
        //   align: "center",
        //   minWidth: 100,
        //   key: "submitMsg",
        // },
        // {
        //   title: "审批备注",
        //   align: "center",
        //   minWidth: 100,
        //   key: "remark",
        // },
        {
          title: "申请/审批备注",
          minWidth: 150,
          render(h, { row }) {
            return [
              h("span", { class: "ratio-a" }, row.submitMsg),
              " / ",
              h("span", { class: "ratio-b" }, row.remark),
            ];
          },
        },

        {
          title: "状态",
          align: "center",
          width: me.$width.status,
          render(h, { row }) {
            return h(
              "div",
              {
                class: StatusToClass[StatusMap[row.status]],
              },
              StatusMap[row.status]
            );
          },
        },
        {
          title: "操作",
          align: "center",
          width: 120,
          render(h, { row }) {
            if (row.status !== 0) return "-";
            return h(
              "div",
              {
                class: "operation-btn-wrapper",
              },
              [
                h(ButtonRender, {
                  text: "驳回",
                  className: "refuse",
                  onClick(option) {
                    me.$Modal.confirm({
                      render: (h) => {
                        return h("input", {
                          class: "input-remark",
                          modelValue: me.remark,
                          autofocus: true,
                          placeholder: "输入驳回原因(选填)",
                          onInput: (event) => {
                            me.remark = event.target.value;
                          },
                        });
                      },
                      onOk: () => {
                        me.refuse(row, option);
                        me.remark = "";
                        option.loading = false;
                      },
                      onCancel: () => {
                        me.remark = "";
                        option.loading = false;
                      },
                    });
                  },
                }),
                h(ButtonRender, {
                  text: "通过",
                  className: "pass",
                  onClick(option) {
                    me.pass(row, option);
                    option.loading = false;
                  },
                }),
              ]
            );
          },
        },
      ],
      page: {
        size: 10,
        total: 0,
        current: 1,
      },

      loading: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    async judge(type, row, option) {
      const { code } = await this.$api.approval.judge({
        id: row.id,
        judgeOpId: this.user.id,
        status: type,
        remark: this.remark,
      });
      this.remark = "";
      if (code === 0) {
        this._messageSuccess("操作成功");
        this.doSearch(1);
      } else {
        this._messageWarning("操作失败，请稍后重试");
      }
      option.loading = false;
    },

    refuse(row, option) {
      this.judge(1, row, option);
    },

    pass(row, option) {
      this.judge(2, row, option);
    },
    async doSearch(pageNo) {
      if (pageNo) {
        this.page.current = pageNo;
      }
      const kind = this.kind;
      this.loading = true;
      let condition;
      if (kind == 1) {
        condition = this.conditionDc;
      } else if (kind) {
        condition = this.conditionLx;
      }
      const { data, code, page } = await this.$api.approval.search({
        page: this.page,
        kind,
        ...condition,
      });

      if (code == 0) {
        this.data = data;
        this.page = page;
      }
      this.loading = false;
    },
  },
  created() {
    this.doSearch();
  },
};
</script>
<style lang="less">
.approval-excel {
  display: flex;
  flex-direction: column;
  .region {
    display: flex;
    flex: 1;
  }
  .approval-undo {
    color: gray;
  }
  .approval-refused {
    color: red;
  }
  .approval-passed {
    color: green;
  }
  .operation-btn-wrapper {
    .refuse {
      color: red;
    }

    .pass {
      color: green;
    }
  }
  .status-checkbox {
    margin-top: 5px;
  }
}
</style>
