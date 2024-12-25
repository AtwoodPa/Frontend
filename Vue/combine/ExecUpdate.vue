主导航
主页

搜索或转到…
项目
P
pnpm-vite-vue3

已钉选
议题
0
合并请求
0

管理

计划

代码
合并请求
0
仓库
分支
提交
标签
仓库图
比较修订版本
代码片段

构建

安全

部署

运维

监控

分析
gaoq
pnpm-vite-vue3
仓库
您推送了
master
2分钟前
pnpm-vite-vue3
mcn
src
pc
business
exec
Update.vue
用户头像
s
awesome 编辑于 3天前
da7c1137
Update.vue
12.95 KiB
<template>
  <div class="exec-container">
    <div class="wrapper">
      <div class="search">
        <div class="item">
          <span class="label">资源</span>
          <Input
              type="text"
              v-model="condition.key"
              placeholder="id或名称模糊查询"
              @on-enter="doSearch(1)"
              clearable
          ></Input>
        </div>
        <div class="item">
          <span class="label">付款ID</span>
          <Input
              type="text"
              v-model="condition.payId"
              placeholder="模糊查询"
              @on-enter="doSearch(1)"
              clearable
          ></Input>
        </div>
        <div class="item">
          <span class="label">执行人</span>
          <BusKeySelect kind="Member" v-model="condition.executorIds" />
        </div>
        <div class="item">
          <span class="label">发布日期</span>
          <div class="date-adapter">
            <DateAdapter v-model="condition.execTimeRange" transfer />
          </div>
        </div>
        <Button
            type="primary"
            shape="circle"
            icon="ios-search"
            class="search-btn"
            @click="doSearch(1)"
        ></Button>
      </div>
      <div class="opts">
        <Button v-if="data.length > 0" type="success" @click="createLink"
        >执行表外链</Button
        >
        <template v-if="canWrite && data.length > 0">
          <!-- <Poptip placement="bottom-end" v-model="lx.show" transfer> -->
          <Poptip placement="bottom-end" v-model="lx.show" transfer>
            <Button
                :disabled="projectStatus != '主管分配' && projectStatus != '执行'"
                type="warning"
            >氚云立项</Button
            >
            <!-- <Button type="primary">氚云立项</Button> -->
            <template #content>
              <RadioGroup v-model="lx.kind">
                <Radio label="kol" :disabled="lx.disabled">告趣</Radio>
                <Radio label="pupu" :disabled="lx.disabled">璞噗</Radio>
                <Radio label="qcq" :disabled="lx.disabled">青潮区</Radio>
                <Radio label="ld" :disabled="lx.disabled">律动</Radio>
              </RadioGroup>
              <br />
              <Button
                  @click="doLx"
                  icon="ios-checkmark"
                  style="
                  margin-top: 10px;
                  margin-bottom: 5px;
                  margin-left: 50%;
                  transform: translateX(-50%);
                "
                  shape="circle"
                  :loading="lx.busy"
              >确定</Button
              >
            </template>
          </Poptip>
          <!-- <Button type="primary" @click="checkSave" :loading="saving"
            >批量保存</Button
          > -->
        </template>
        <Trigger v-if="data.length > 0" :target="downTarget" />
      </div>
    </div>
    <!-- "view-ui-plus": "^1.3.1", -->
    <div :class="{ loading }" class="table-container">
      <!-- <div>
        {{ patchMap[data[0].id] }}
        {{ data[0].assign }}
      </div> -->
      <div class="table">
        <div class="title">#</div>
        <div class="title">达人情况</div>
        <div class="title">居间状态</div>
        <div class="title">价格信息/执行情况</div>
        <template v-for="(item, index) in data" :key="item.id">
          <div class="index">{{ index + 1 }}</div>
          <ResourceRender
              :resource="item.resource"
              :platform="item.platform"
              @updateResource="
              (params) => {
                console.log('params', params);
                Object.assign(item.resource, params);
              }
            "
              :needAddListen="true"
              openFrame="info"
          />
          <EqbFileRender :target="item.eqbFile" />
          <BrpRender
              :readOnly="!canWrite"
              mode="项目执行"
              :target="item"
              :editPublication="true"
              @assignSave="afterAssignSave($event, item)"
              @afterPatch="doSearch(1)"
          />
        </template>
      </div>
      <Spin class="table-loading" v-if="loading" />
    </div>
    <div class="page">
      <Page
          :total="page.total"
          :page-size="page.size"
          show-total
          show-elevator
          show-sizer
          :page-size-opts="sizeOpts"
          @on-change="doSearch"
          @on-page-size-change="sizeChangeHandler"
      />
    </div>
    <Modal
        v-model="showExemptApply"
        title="申请豁免内推立项"
        @on-ok="submitExemptApply"
        :loading="submitLoading"
    >
      <Input v-model="submitMsg" placeholder="备注(选填)" />
    </Modal>
  </div>
</template>
<script>
import { ApprovalKindMap } from "../excel/map";
import ExecProjectRender from "@/pc/component/render/ExecProjectRender";
import ExecCountRender from "@/pc/component/render/ExecCountRender";
import BrpRender from "@/pc/component/render/BrpRender.combine";
import BtnRender from "@/pc/component/render/ButtonRender";
import Trigger from "@/pc/business/excel/Trigger";
import { 付款公司补丁 } from "@/pc/business/finance/map";
import CopyRender from "@/pc/component/render/CopyRender";
import EqbFileRender from "@/pc/component/render/EqbFileRender";
import BusKeySelect from "@/pc/component/select/BusKeySelect";
import DateAdapter from "@/pc/component/adapter/DateAdapter";
import mixin from "./mixin";
export default {
  mixins: [mixin],
  components: {
    Trigger,
    BusKeySelect,
    BrpRender,
    BtnRender,
    ExecCountRender,
    ExecProjectRender,
    EqbFileRender,
    CopyRender,
    DateAdapter,
  },
  emits: ["needReload"],
  computed: {
    projectStatus() {
      return this.target.status;
    },
    downTarget() {
      return {
        kind: "执行表成本表",
        condition: this.condition,
        project: this.project,
      };
    },
    user() {
      return this.$store.getters.user;
    },
  },
  data() {
    return {
      condition: {
        executorIds: [],
        execTimeRange: [],
        key: "",
        keyId: null,
        payId: "",
        projectIds: [this.target.id],
        withResource: true,
        withPlatform: true,
        withProject: true,
        withAssign: true,
        withEqb: true,
        withRelateProject: true,
        resourceFields:
            "bloggerId, xtId, codeKind, name, site, publication, signState, bizObjectId, platformId, score, pgyLevel, xtLevel, byLevel, photo, code, id, mediaId, mcn, bloggerId, price,directorIds, xtRegister, unifyRebate, rebate",
      },
      lx: {
        kind: "kol",
        busy: false,
        show: false,
        disabled: false,
      },
      saving: false,
      // allSave: true,
      submitMsg: "",
      submitLoading: false,
      show: false,
      successList: [],
      failList: [],
      showExemptApply: false,
      signStatus: null,
      signTime: null,
      signFileName: null,
      signName: null,
      tablePassword: null,
      outLink: null,
    };
  },
  methods: {
    afterAssignSave({updateAssign, updatePricing}, row) {
      Object.assign(row.assign, updateAssign);
      Object.assign(row.pricing, updatePricing);
    },
    async doSave(item, index, option) {
      let i = index + 1;
      let warning = "";
      let { assign } = item;
      let { execTime, visitTime, executorId, workKind, ptbb, payCompany } = assign;
      if (this.project.kind === "青潮区") {
        if (!visitTime) {
          warning = `第${i}行探店日期未填`;
        }
      }
      if (!workKind) {
        warning = `第${i}行作品类型未填`;
      } else if (!ptbb) {
        warning = `第${i}行平台报备未填`;
      } else if (!executorId) {
        warning = `第${i}行执行人未填`;
      } else if (!execTime) {
        warning = `第${i}行执行日期未填`;
      } else if (payCompany && !付款公司补丁.includes(payCompany)) {
        warning = `第${i}行付款公司无法识别`;
      }
      if (warning) {
        this._warning("请完善数据", warning);
      } else {
        let patch = this.patchMap[item.id];
        let newAssign = Object.assign({}, assign);
        newAssign.executeMark = null;
        let params = {
          projectId: this.target.id,
          assign: newAssign,
          fromDirector: this.fromDirector,
        };
        if (patch.haveUpdate) {
          params.update = patch.update;
          params.update.ptbb = ptbb;
        }
        let { code, data } = await this.$api.assign.save(params);
        if (code === 0) {
          this._messageSuccess("保存成功");
          this.target.status = data;
          patch._patchRow();
          item.assign._patchRow();
        }
      }
      option.loading = false;
    },
    async doLx() {
      let tip = "";
      if (this.project.kind === "正常" || this.project.kind === "快捷") {
        for (let index = 0; index < this.data.length; index++) {
          let { executeList } = this.data[index].assign;
          if (executeList && executeList.length === 0) {
            tip = `第${index + 1}行反馈截图未填写`;
            break;
          }
        }
      }
      if (tip) {
        this._warning("请完善数据", tip);
      } else {
        this.lx.busy = true;
        let params = {
          projectId: this.target.id,
          kind: this.lx.kind,
        };
        let { code, data } = await this.$api.assign.execAssignLx(params);
        if (code === 0 && data.status != null) {
          this._messageSuccess("立项成功");
          this.target.status = data;
          this.lx.show = false;
        } else if (code === 0 && !data.status && data.msg) {
          const msg = data.msg;
          let target = this.target.id;
          let kind = ApprovalKindMap["立项豁免"];
          let status = 0;
          let res = await this.$api.approval.count({ target, kind, status });
          if (res.data > 0) {
            this._messageWarning({
              content: "此项目存在立项内推豁免的待审核，请审核",
              duration: 5,
            });
          } else {
            this._confirm(
                msg,
                "确认提交内推豁免申请",
                () => (this.showExemptApply = true)
            );
          }
        }
        this.lx.busy = false;
      }
    },
    async submitExemptApply() {
      this.submitLoading = true;
      let target = this.target.id;
      let kind = ApprovalKindMap["立项豁免"];
      let { code } = await this.$api.approval.submit({
        target,
        submitOpId: this.user.id,
        kind,
        submitMsg: this.submitMsg,
        title: this.target.name,
      });
      if (code === 0) {
        this._messageSuccess("申请成功");
      } else {
        this._messageWarning("操作失败，请稍后重试");
      }
      this.submitLoading = false;
      this.submitMsg = "";
    },
    async createLink() {
      this.tablePassword = null;
      this.outLink = null;
      let tablePassword = "";
      for (let i = 0; i < 6; i++) {
        tablePassword += Math.floor(Math.random() * 10);
      }
      let params = {
        projectId: this.target.id,
        tablePassword,
      };
      let { code } = await this.$api.assign.updateTablePassword(params);
      if (code === 0) {
        this.tablePassword = tablePassword;
        this.outLink = `http://op.gaoq.com//#/executeTable/${this.target.id}`;
        // this.outLink = `http://localhost:8088/#/executeTable/${this.target.id}`;
        this._copy(
            `项目名称：${this.project.name}
项目链接：${this.outLink}
打开密码：${this.tablePassword}`
        );
      }
    },
  },
};
</script>
<style lang="less">
.exec-container {
  padding: var(--padding);
  position: relative;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .copy-render {
    white-space: normal;
  }
  .table-container {
    width: 100%;
    flex: 1;
    overflow: auto;
    .table {
      position: relative;
      display: grid;
      // grid-template-columns: 85px 150px minmax(720px, 1fr) minmax(810px, 1fr) 65px;
      grid-template-columns:
        65px 160px 110px minmax(1100px, 1fr);
      grid-template-rows: 40px;
      place-items: center center;
      grid-auto-rows: auto;
      > div {
        width: 100%;
        height: 100%;
        background-color: #f8f8f9;
        border-bottom: 1px solid #e8eaec;
      }
      .title {
        text-align: center;
        line-height: 47px;
        position: sticky;
        z-index: 100;
        top: 0;
      }
      .index {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .table-loading {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
    }
  }
  .page {
    display: flex;
    justify-content: flex-end;
    margin-right: 5px;
    align-items: center;
    border-top: 1px solid #e8eaec;
    .ivu-page {
      margin-top: 3px;
    }
    > div,
    > button {
      margin-left: 5px;
    }
  }
}
</style>