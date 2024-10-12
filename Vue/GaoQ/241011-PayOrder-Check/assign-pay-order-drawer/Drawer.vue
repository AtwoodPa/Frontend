<template>
  <div class="follow-brand-container">
    <Drawer
        width="600"
        title="氚云订单撤回提审"
        @on-close="value = ''"
        v-model="showDrawer"
        className="assign-pay-order"
    >
      <Form
          ref="form"
          :model="form"
          :rules="rules"
          class="form-container inner-form"
          :label-width="150"
          label-position="left"
      >
        <FormItem label="项目ID/名称" >
          <ProjectRender  :id="this.target.projectId"/>
        </FormItem>
        <FormItem label="公司/订单编号" prop="payCompany">
          <text >{{form.payCompany}}<span style="color: red;font-weight: bold">/</span>{{form.payId}}</text>
        </FormItem>
        <FormItem label="审核申请" prop="remark">
          <Input
              v-model="form.remark"
              placeholder="提审说明"
              clearable
              type="textarea"
              :maxlength="200"
              show-word-limit
              class="statement-input"
          ></Input>
        </FormItem>
        <FormItem label="氚云相关流程作废截图" prop="submitUrl">
          <AdUpload
              v-model="form.submitUrl"
              :max="10"
              style="margin-right: 4px"
          >
          </AdUpload>
        </FormItem>
      </Form>

      <div class="button-container">
        <Button type="success" @click="fill" class="confirm-button">提交</Button>
<!--        <Button type="success" @click="cancel" class="confirm-button">撤销</Button>-->
      </div>
    </Drawer>
  </div>

</template>

<script>
import CommonPoptip from "@/pc/component/poptip/CommonPoptip";
import ProjectRender from "@/pc/component/render/ProjectRender";
import AdUpload from "~/vp/AdUpload";
import BusStaticSelect from "@/pc/component/select/BusStaticSelect";
import BusAllSelect from "@/pc/component/select/BusAllSelect";
import BusKeySelect from "@/pc/component/select/BusKeySelect";
import RangeAdapter from "@/pc/component/adapter/RangeAdapter";
import PlatformRender from "@/pc/component/render/PlatformRender";
import ButtonRender from "@/pc/component/render/ButtonRender";
import DateAdapter from "@/pc/component/adapter/DateAdapter";
import MemberRender from "@/pc/component/render/MemberRender";
import BrandRender from "@/pc/component/render/BrandRender";
import TeamFollowBrandInfoRender from "@/pc/component/render/TeamFollowBrandInfoRender";
import {Text} from "view-ui-plus";

export default {
  components: {
    Text,
    ProjectRender,
    CommonPoptip,
    BusKeySelect,
    DateAdapter,
    BusAllSelect,
    MemberRender,
    RangeAdapter,
    BrandRender,
    PlatformRender,
    BusStaticSelect,
    AdUpload,
    ButtonRender,
    TeamFollowBrandInfoRender,
  },
  props: {
    target: Object,
    modelValue: Boolean
  },
  data() {
    return {
      value: "",
      form: this.initForm(),
      rules: {
        submitUrl: [
          { required: true, type: 'number', message: '请添加氚云作废截图', trigger: 'blur' }
        ]
      }
    };
  },
  watch: {
    target(val) {
      this.form = this.initForm();
    },
  },
  computed: {
    showDrawer: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  methods: {
    async fill() {
      let param = {
        projectId: this.target.projectId,
        assignId: this.target.assignId,
        payNewCode: this.form.payId,
        remark: this.form.remark,
        submitUrl: this.form.submitUrl,
      }
      let { code } = await this.$api.auditAssignPayLog.save(param);
      if (code === 0) {
        this._messageSuccess("审核提交成功！");
        this.form = {}
      }
      this.showDrawer = false;
    },
    // async cancel() {
    //   let param = {
    //     projectId: this.target.projectId,
    //     assignId: this.target.assignId,
    //     payNewCode: '',
    //     remark: '',
    //     submitUrl: '',
    //   }
    //   let { code } = await this.$api.auditAssignPayLog.save(param);
    //   if (code === 0) {
    //     this._messageSuccess("审核提交成功！");
    //   }
    //   this.target.callback(this.form);
    //   this.showDrawer = false;
    // },
    initForm() {
      const {
        assignId,
        resourceId,
        opId,
        projectId,
        remark,
        submitUrl,
        payId,
        payCompany,
      } = this.target;

      return {
        assignId,
        resourceId,
        opId,
        projectId,
        remark,
        submitUrl,
        payId,
        payCompany,
      };
    }

  },

};
</script>
<style lang="less">
.assign-pay-order {
  .ivu-drawer-body {
    .copy-render {
      display: block;
      white-space: normal;
    }
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .form-container {
    overflow-y: auto;
    flex: 1;
  }

  .ivu-btn-success {
    width: 100%;
  }

  .number-range {
    width: 318px;

    .ivu-input-number {
      width: 100% !important;  // 设置整个数字输入框的宽度占满容器
    }

    .ivu-input-number-input {
      width: 80% !important;  // 设置输入框部分的宽度占满容器
    }
  }
}
</style>

