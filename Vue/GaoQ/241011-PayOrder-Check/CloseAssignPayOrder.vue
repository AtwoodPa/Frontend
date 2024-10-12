<template>
  <div class="close-apply-check common-page region">
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
        <div class="wrapper">
          <div class="search">
            <div class="item">
              <span class="label">项目名称</span>
              <Input
                  placeholder="模糊查询"
                  @on-enter="doSearch(1)"
                  v-model="condition.projectName"
                  clearable
              ></Input>
            </div>
            <div class="item">
              <span class="label">项目ID</span>
              <Input
                  type="number"
                  @on-enter="doSearch(1)"
                  v-model="condition.projectId"
              ></Input>
            </div>
            <div class="item">
              <span class="label">申请人</span>
              <BusKeySelect kind="Member" v-model="condition.submitterId" />
            </div>
            <div class="item">
              <span class="label">状态</span>
              <BusStaticSelect
                  v-model="condition.statusList"
                  kind="AssignPayOrderCHeckStatus"
              />
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
    </PageTable>
    <Modal
        v-if="showModal"
        v-model="showModal"
        :title="`项目ID：${currentRow.projectId}`"
        ok-text="驳回"
        cancel-text="取消"
        placeholder="输入驳回原因(选填)"
        @on-ok="refuse(currentRow, currentOption)"
        @on-cancel="clearCurrentData"
    >
      <Input type="textarea" v-model="this.remark" />
    </Modal>
  </div>
</template>
<script>
import PageTable from "~/vp/PageTable";
import Frame from "@/pc/page/frame-open";
import BusStaticSelect from "@/pc/component/select/BusStaticSelect";
import BusKeySelect from "@/pc/component/select/BusKeySelect";
import ButtonRender from "@/pc/component/render/ButtonRender";
import MemberRender from "@/pc/component/render/MemberRender";
import {
  ProjectApplyCHeckStatusValue,
  StatusToClass,
  ProjectApplyCHeckStatusLabel, AssignPayOrderCHeckStatusValue,
} from "./map.js";
import AdUpload from "~/vp/AdUpload.vue";
import {resolveComponent} from "vue";
import ProjectRender from "pc/component/render/ProjectRender.vue";
export default {
  components: {
    PageTable,
    ButtonRender,
    BusKeySelect,
    BusStaticSelect,
  },
  data() {
    const me = this;
    return {
      data: [],
      showModal: false,
      currentRow: null,
      currentOption: null,
      currentRemark: "",
      condition: {
        projectId: "",
        projectName: "",
        submitterId: null,
        statusList: [AssignPayOrderCHeckStatusValue.待审核],
      },
      columns: [
        {
          title: "项目ID/名称",
          minWidth: me.$width.project,

          render(h, { row }) {
            return h(ProjectRender, {
              id: row.projectId,
            });
          },
        },
        {
          title: "申请人",
          width: me.$width.member,
          render(h, { row }) {
            return h(MemberRender, {
              id: row.submitterId,
            });
          },
        },
        {
          title: "审核人",
          width: me.$width.member,
          render(h, { row }) {
            return h(MemberRender, {
              id: row.reviewerId,
            });
          },
        },
        {
          title: "申请时间",
          align: "center",
          width: 170,
          render(h, { row }) {
            return h(
                "div",
                new Date(row.submitTime).format("yyyy-MM-dd hh:mm:ss")
            );
          },
        },
        {
          title: "审核时间",
          align: "center",
          width: 170,
          render(h, { row }) {
            return h(
                "div",
                new Date(row.actionTime).format("yyyy-MM-dd hh:mm:ss")
            );
          },
        },
          // 图片 submitUrl
        {
          title: "沟通截图",
          align: "center",
          minWidth: 120,
          key: "submitUrl",
          render: (h, { row }) => {
            if (row.submitUrl) {
              return h(AdUpload, {
                    trigger: "lazy",
                    modelValue: row.submitUrl,
                    disabled: true,
                  }
              );

            }else{
              return h("span", "无");
            }

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
          title: "备注",
          minWidth: 150,
          render(h, { row }) {
            return [
              h("span", { class: "ratio-a" }, row.remark)
            ];
          },
        },
        {
          title: "状态",
          align: "center",
          width: me.$width.status,
          render(h, { row }) {
            const label = ProjectApplyCHeckStatusLabel[row.status];
            return h(
                "div",
                {
                  class: ProjectApplyCHeckStatusLabel[StatusToClass],
                },
                label
            );
          },
        },
        {
          title: "操作",
          align: "center",
          width: me.$width.action,
          render(h, { row }) {
            const currentUser = this.$store.getters.user;
            if ((currentUser.id === 4878 || currentUser.id === 398240 || currentUser.id === 29|| currentUser.id === 39) && row.status === ProjectApplyCHeckStatusValue.待审核) {
              return h(
                  "div",
                  { class: "operation-btn-wrapper" },
                  [
                    h(ButtonRender, {
                      text: "驳回",
                      className: "refuse",
                      onClick(option) {
                        me.currentOption = option;
                        me.currentRow = row;
                        me.showModal = true;
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
            }
            return "-";
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
  created() {
    this.doSearch();
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    clearCurrentData() {
      this.showModal = false;
      if (this.currentOption) {
        this.currentOption.loading = false;
        this.currentOption = null;
      }
      this.currentRow = null;
      this.remark = "";
    },
    async judge(type, row, option) {
      console.log("row", row);
      const { code } = await this.$api.auditAssignPayLog.judge({
        id: row.id,
        assignId: row.assignId,
        submitterId: row.submitterId,
        projectId: row.projectId,
        reviewerId: this.user.id,
        status: type,
        remark: this.remark,
      });
      if (code === 0) {
        this._messageSuccess("操作成功");
        this.doSearch(1);
      } else {
        this._messageWarning("操作失败，请稍后重试");
      }
      option.loading = false;
      this.clearCurrentData();
    },

    refuse(row, option) {
      this.judge(AssignPayOrderCHeckStatusValue.已驳回, row, option);
    },

    pass(row, option) {
      this.judge(AssignPayOrderCHeckStatusValue.已通过, row, option);
    },
    async doSearch(pageNo) {
      if (pageNo) {
        this.page.current = pageNo;
      }
      this.loading = true;
      const { data, code, page } = await this.$api.auditAssignPayLog.search({
        page: this.page,
        ...this.condition,
      });
      console.log("data", data);
      if (code == 0) {
        const { auditAssignPayLogList } = data;
        this.data = auditAssignPayLogList;
        this.page = page;
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="less">
.close-apply-check {
  .undo {
    color: gray;
  }
  .textarea-remark {
    width: 80%;
  }
  .refused {
    color: red;
  }
  .passed {
    color: green;
  }
  .refuse {
    color: red;
  }

  .pass {
    color: green;
  }
}
</style>
