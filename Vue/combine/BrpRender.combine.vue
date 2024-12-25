<template>
  <!-- {{ target.assign.ptbb }} -->
  <!-- {{ target.resource.publication }} -->
  <!-- {{ patch.bzgRebate }} {{ patch.channelRebate }} -->
  <!-- 博主到手价 -->
  <!-- {{ target.publication }} {{ target.signState }}
    ---
    {{ target.resource.publication }} {{ target.resource.signState }} -->
  <div class="brp-render" :mode="mode">
    <template v-if="mode == '项目付款'">
      <span v-if="!isQcqProject && ml <= 0" class="error">请检查毛利</span>
      todo
      <!-- <PayStatusRender
        v-else
        :canWrite="canDoPay"
        :target="target.pay"
        :resource="target.resource"
        :assign="target.assign"
      /> -->

      <div class="formula">
        <div class="success">合计付款</div>
        <div>
          <span class="success">{{ Number(hjfk.toFixed(2)) }}</span
          ><template v-if="isFdjBb">（非独家报备）</template
        ><template v-else>
          = {{ pricingForm.buyPrice }} + ({{ pricingForm.projectPrice }} / 1.06 -
          {{ pricingForm.projectPrice }} * {{ pricingForm.channelRebate / 100 }} -
          {{ pricingForm.extraFee }} - {{ pricingForm.buyPrice }}) *
          {{ pricingForm.ybzShare / 100 }}
        </template>
        </div>
        <div class="success">毛利</div>
        <div>
          <span class="success"> {{ ml }}</span>
          =
          <template v-if="isFdjBb"
          >{{ pricingForm.projectPrice }} / 1.06 * ({{ pricingForm.bzgRebate / 100 }} -
            {{ pricingForm.channelRebate / 100 }})</template
          ><template v-else>
          {{ pricingForm.projectPrice }} / 1.06 - {{ hjfk }} -
          {{ pricingForm.projectPrice }} *
          {{ pricingForm.channelRebate / 100 }}
        </template>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="item a-price primary">
        <span class="label">
          {{ target.pricing.label }}
        </span>
        <span class="value">
          {{ target.pricing.price }}
        </span>
      </div>
      <div class="item a-publication primary">
        <span class="label">刊例状态</span>
        <span class="value">
          {{ target.pricing.publication }}
          <Icon
              v-if="editPublication"
              type="ios-create"
              @click="_emit('projectPricing-drawer', target.pricing)"
              class="primary"
              size="18"
          />
        </span>
      </div>
      <div class="item a-signState primary">
        <span class="label">签约状态</span>
        <span class="value">
          {{ target.pricing.signState }}
        </span>
      </div>
      <div class="item a-buyPrice">
        <span class="label"
        >博主到手价￥<Poptip
            title="报价参考"
            placement="left"
            trigger="hover"
            v-model="showTip"
            transfer
        >
            <Icon type="md-help-circle" class="hover-primary" />
            <template #content>
              <RadioGroup vertical size="small" @on-change="onBuyPriceRadio">
                <template v-for="item in tipList" :key="item.prop">
                  <!-- label用prop不用price，是因为price可能多个数值一样 -->
                  <Radio :disabled="readOnly" :label="item.prop">
                    {{ item.label }} {{ item.price }}
                  </Radio>
                </template>
              </RadioGroup>
            </template>
          </Poptip>
        </span>
        <span class="value" :class="pricingClass.buyPrice">
          <Input type="number" v-model.number="pricingForm.buyPrice" size="small" />
        </span>
      </div>
      <div class="item a-ratioB">
        <span class="label">提价{{ usePercent ? "%" : "￥" }}</span>
        <span class="value" :class="pricingClass.ratioB">
          <Input
              type="number"
              v-if="usePercent"
              v-model.number="pricingForm.ratioB"
              :disabled="readOnly"
              size="small"
          />
          <Input
              v-else
              type="number"
              v-model.number="pricingForm.money"
              :disabled="readOnly"
              size="small"
          />
        </span>
      </div>
      <div class="item a-extraFee">
        <span class="label">额外费用￥</span>
        <span class="value" :class="pricingClass.extraFee">
          <Input
              type="number"
              v-model.number="pricingForm.extraFee"
              :disabled="readOnly"
              size="small"
          />
        </span>
      </div>
      <div class="item a-projectPrice">
        <span class="label">对客户报价￥</span>
        <span class="value" :class="pricingClass.projectPrice">
          <Input
              type="number"
              v-model.number="pricingForm.projectPrice"
              :disabled="readOnly"
              size="small"
          />
        </span>
      </div>
      <div class="item a-channleRebate">
        <span class="label">对客户返点%</span>
        <span class="value" :class="pricingClass.channelRebate">
          <Input
              type="number"
              v-model.number="pricingForm.channelRebate"
              :disabled="readOnly"
              size="small"
          />
        </span>
      </div>
      <div class="item a-extraFeeDesc item-text">
        <span class="label">费用说明</span>
        <span class="value" :class="pricingClass.extraFeeDesc">
          <TextInputPoptip :disabled="readOnly" v-model="pricingForm.extraFeeDesc" />
        </span>
      </div>
      <div class="item a-rebate">
        <span class="label">
          <template v-if="isFdjResource">已备案返点%</template>
          <template v-else>统一对外返点%</template>
        </span>
        <span class="value">
          <template v-if="isFdjResource">
            {{ target.resource.rebate }}
          </template>
          <template v-else>
            {{ target.resource.unifyRebate }}
          </template>
        </span>
      </div>
      <div class="item a-bzgRebate">
        <span class="label">博主给返点%</span>
        <span class="value" :class="pricingClass.bzgRebate">
          <Input
              type="number"
              v-model.number="pricingForm.bzgRebate"
              :disabled="readOnly"
              size="small"
          />
        </span>
      </div>
      <div class="item a-hjfk">
        <span class="label">合计付款￥</span>
        <span class="value">
          <Numeral :value="hjfk" format="0,0.00" />
        </span>
      </div>
      <div class="item a-share">
        <span class="label">已备案分成%</span>
        <span class="value">
          {{ target.resource.share }}
        </span>
      </div>

      <div class="item a-ybzShare">
        <span class="label">与博主分成%</span>
        <span class="value" :class="pricingClass.ybzShare">
          <Input
              type="number"
              v-model.number="pricingForm.ybzShare"
              :disabled="readOnly"
              size="small"
          />
        </span>
      </div>
      <div class="item a-ml">
        <span class="label">毛利￥</span>
        <span class="value">
          <Numeral :value="ml" format="0,0.00" />
        </span>
      </div>
      <div class="item a-ptbb">
        <div class="label">平台报备</div>
        <div class="value" :class="pricingClass.ptbb">
          <BusStaticSelect
              size="small"
              v-model="pricingForm.ptbb"
              kind="平台报备"
              transfer
              :clearable="false"
          />
        </div>
      </div>
      <div class="item a-save">
        <Button
            type="success"
            size="small"
            v-if="hasUpdate"
            @click="update"
            :loading="loading"
            icon="ios-checkbox-outline"
        >保存</Button
        >
        <Button
            type="info"
            size="small"
            icon="ios-code"
            v-if="target.assign"
            @click="doPre"
        >预检</Button
        >
      </div>
      <template v-if="mode == '项目执行'">
        <div class="item a-orderNo">
          <div class="label">平台单号</div>
          <div class="value" :class="assignClass.platformOrderNo">
            <OrderNoSelect
                :disabled="readOnly"
                v-model="assignForm.platformOrderNo"
                placeholder="必填"
                size="small"
                transfer
                :current="target.assign.platformOrderNo"
                :params="params"
                @afterPatch="afterPatch"
                clearable
            />
          </div>
        </div>
        <div class="item a-visitTime">
          <div class="label">探店日期</div>
          <div class="value" :class="assignClass.visitTime">
            <DateAdapter
                size="small"
                transfer
                v-model="assignForm.visitTime"
                :disable="readOnly"
            />
          </div>
        </div>
        <div class="item a-execTime">
          <div class="label">发布日期</div>
          <div class="value" :class="assignClass.execTime">
            <DateAdapter
                :disabled="readOnly"
                size="small"
                transfer
                v-model="assignForm.execTime"
            />
            <!-- <div v-if="readOnly" style="text-align: center">
          {{ $filter.empty(target.execTime) }}
        </div>
        <div v-else-if="isLock" style="text-align: center">
          <CommonPoptip style="margin-right: 5px" type="execTimeLock" />
        </div>
        <DateAdapter v-else size="small" transfer v-model="target.execTime" /> -->
          </div>
        </div>
        <div class="item a-link item-text">
          <div class="label">执行链接</div>
          <div class="value" :class="assignClass.link">
            <TextInputPoptip :disabled="readOnly" v-model="assignForm.link" />
          </div>
        </div>
        <div class="item a-workKind">
          <div class="label">作品类型</div>
          <div class="value" :class="assignClass.workKind">
            <BusStaticSelect
                size="small"
                :disabled="readOnly"
                v-model="assignForm.workKind"
                kind="作品类型"
                transfer
            />
          </div>
        </div>
        <div class="item a-payCompany">
          <div class="label">付款公司</div>
          <div class="value" :class="assignClass.payCompany">
            {{ $filter.empty(assignForm.payCompany) }}
          </div>
        </div>
        <div class="item a-executorId">
          <div class="label">执行人</div>
          <div class="value" :class="assignClass.executorId">
            <MemberRender v-if="readOnly" :photo="false" :id="assignForm.executorId" />
            <MemberTrigger
                v-else
                :photo="false"
                :name="target.resource.name"
                :id="assignForm.executorId"
                @updateMemberId="updateExecutorId"
            />
          </div>
        </div>
        <div class="item a-mark item-text">
          <div class="label">特别备注</div>
          <div class="value" :class="assignClass.mark">
            <TextInputPoptip :disabled="readOnly" v-model="assignForm.mark" />
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
<script>
import TextInputPoptip from "@/pc/component/poptip/TextInputPoptip";
import DateAdapter from "@/pc/component/adapter/DateAdapter";
import { splitDot, combineDot } from "@/pc/business/exec/map";
import { judgeFdjdr, judgeWsd } from "../../business/resource/map";
import PayStatusRender from "@/pc/component/render/PayStatusRender";
import MemberRender from "@/pc/component/render/MemberRender";
import MemberTrigger from "@/pc/component/drawer/member-drawer/Trigger";
import BusStaticSelect from "@/pc/component/select/BusStaticSelect";
import { patchTargetPrice } from "@/helper";
import OrderNoSelect from "@/pc/component/select/OrderNoSelect";
import CommonPoptip from "@/pc/component/poptip/CommonPoptip";
import { 付款公司补丁, payCompanyProjection } from "../../business/finance/map";

export default {
  components: {
    PayStatusRender,
    TextInputPoptip,
    DateAdapter,
    CommonPoptip,
    OrderNoSelect,
    BusStaticSelect,
    MemberTrigger,
    MemberRender,
  },
  emits: ["updatePricing", "assignSave", "afterPatch"],
  props: {
    target: Object,
    readOnly: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: "推荐报价",
    },
    editPublication: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      showTip: false,
      ...this.getFormClass(),
    };
  },

  computed: {
    usePercent() {
      return !this.isQcqProject;
    },
    isQcqProject() {
      let { kind } = this.target.project;
      return "青潮区" == kind;
    },
    params() {
      let { xtId, bloggerId, name, platformId, xtRegister, id } = this.target.resource;
      return {
        uid: platformId == 9 ? xtId : bloggerId,
        resourceName: name,
        platformId,
        xtRegister,
        id,
      };
    },
    hasUpdate() {
      return (
          Object.values(this.pricingClass).findIndex((item) => item) > -1 ||
          Object.values(this.assignClass).findIndex((item) => item) > -1
      );
    },
    tipList() {
      let { resource, platform } = this.target;
      let priceForm = resource.price || {};
      let platformFields = patchTargetPrice(platform, priceForm);
      let tipList = [];
      platformFields.forEach(({ label, prop }) => {
        let price = priceForm[prop];
        if (price > 0) {
          tipList.push({
            label,
            prop,
            price,
          });
        }
      });
      return tipList;
    },
    isFdjResource() {
      let {publication, signState} = this.target.resource;
      return judgeFdjdr(publication, signState);
    },
    isFdjBb() {
      let {pricingForm, target} = this;
      let {pricing} = target;
      let {publication, signState} = pricing;
      if (pricingForm.ptbb == "报备" && judgeFdjdr(publication, signState)) {
        return true;
      }
      return false;
    },
    hjfk() {
      if (this.isFdjBb) {
        return 0;
      }
      // 合计付款=博主到手价+(对客户报价/1.06-对客户报价*对客户返点比例-额外费用-博主到手价)*与博主分成比例
      let {
        projectPrice,
        channelRebate,
        buyPrice,
        extraFee,
        ybzShare,
      } = this.pricingForm;
      let a = projectPrice / 1.06;
      let b = (projectPrice * channelRebate) / 100;
      return buyPrice + (a - b - extraFee - buyPrice) * (ybzShare / 100);
    },
    ml() {
      // 默认=对客户报价/1.06-合计付款-对客户报价*对客户返点比例 -->
      let {projectPrice, channelRebate, bzgRebate} = this.pricingForm;
      let a = projectPrice / 1.06;
      if (this.isFdjBb) {
        return (a * (bzgRebate - channelRebate)) / 100;
      }
      let b = (projectPrice * channelRebate) / 100;
      return Number((a - this.hjfk - b).toFixed(2));
    },
  },

  watch: {
    "target.pricing": {
      deep: true,
      handler(val) {
        let {pricingForm, pricingClass} = this.getPricingFormClass();
        Object.assign(this.pricingForm, pricingForm);
        Object.assign(this.pricingClass, pricingClass);
      },
    },
    "target.assign": {
      deep: true,
      handler(val) {
        let {assignForm, assignClass} = this.getAssignFormClass();
        Object.assign(this.assignForm, assignForm);
        Object.assign(this.assignClass, assignClass);
      },
    },
    "assignForm.visitTime"(value) {
      let {visitTime} = this.target.assign;
      this.assignClass.visitTime = visitTime == value ? "" : "dirty-cell";
    },
    "assignForm.link"(value) {
      let {link} = this.target.assign;
      this.assignClass.link = link == value ? "" : "dirty-cell";
    },
    "assignForm.workKind"(value) {
      let {workKind} = this.target.assign;
      this.assignClass.workKind = workKind == value ? "" : "dirty-cell";
    },
    "assignForm.execTime"(value) {
      let {execTime} = this.target.assign;
      this.assignClass.execTime = execTime == value ? "" : "dirty-cell";
    },
    "assignForm.executorId"(value) {
      let {executorId} = this.target.assign;
      this.assignClass.executorId = executorId == value ? "" : "dirty-cell";
    },
    "assignForm.mark"(value) {
      let {mark} = this.target.assign;
      this.assignClass.mark = mark == value ? "" : "dirty-cell";
    },
    "assignForm.payCompany"(value) {
      let {payCompany} = this.target.assign;
      this.assignClass.payCompany = payCompany == value ? "" : "dirty-cell";
    },
    "pricingForm.extraFeeDesc"(value) {
      let {extraFeeDesc} = this.target.pricing;
      this.pricingClass.extraFeeDesc = extraFeeDesc == value ? "" : "dirty-cell";
    },
    "pricingForm.ptbb"(value) {
      let {project, resource} = this.target;
      let {_ptbb} = this.pricingForm;
      this.pricingClass.ptbb = _ptbb == value ? "" : "dirty-cell";
      if (this.mode == "项目执行") {
        if (value == "报备") {
          if (project.kind === "青潮区") {
            this.assignForm.payCompany = "福建青潮";
          } else {
            this.assignForm.payCompany = payCompanyProjection(resource.mcn);
          }
        }
      }
    },
    "pricingForm.buyPrice"(value) {
      let {pricing} = this.target;
      let className = "";
      let buyPrice = pricing.buyPrice / 100;
      if (value > buyPrice) {
        className = "dirty-up-cell";
      } else if (value < buyPrice) {
        className = "dirty-down-cell";
      }
      this.pricingClass.buyPrice = className;
    },
    "pricingForm.projectPrice"(value) {
      let {pricing} = this.target;
      let className = "";
      let projectPrice = pricing.projectPrice / 100;
      if (value > projectPrice) {
        className = "dirty-up-cell";
      } else if (value < projectPrice) {
        className = "dirty-down-cell";
      }
      this.pricingClass.projectPrice = className;

      // price单位为元，buyPrice projectPrice单位为分
      if (this.usePercent) {
        // 平台价
        if (pricing.price === 0) {
          this.pricingForm.ratioB = 0;
        } else {
          this.pricingForm.ratioB = Math.round((value * 100) / pricing.price - 100);
        }
      } else {
        this.money = Math.round(patch.projectPrice / 100 - this.target.price);
        // Math.round((patch.projectPrice - patch.price) / 100);
      }
    },
    "pricingForm.extraFee"(value) {
      let {pricing} = this.target;
      let className = "";
      let extraFee = (pricing.extraFee || 0) / 100;
      if (value > extraFee) {
        className = "dirty-up-cell";
      } else if (value < extraFee) {
        className = "dirty-down-cell";
      }
      this.pricingClass.extraFee = className;
    },

    "pricingForm.ratioB"(value) {
      let {ratioB, price} = this.target.pricing;
      let className = "";
      if (value > ratioB) {
        className = "dirty-up-cell";
      } else if (value < ratioB) {
        className = "dirty-down-cell";
      }
      this.pricingForm.projectPrice = Math.round(((100 + value) * price) / 100);
      this.pricingClass.ratioB = className;
    },
    "pricingForm.ybzShare"(value) {
      let {ybzShare} = this.target.pricing;
      let className = "";
      if (value > ybzShare) {
        className = "dirty-up-cell";
      } else if (value < ybzShare) {
        className = "dirty-down-cell";
      }
      this.pricingClass.ybzShare = className;
    },
    "pricingForm.channelRebate"(value) {
      let {_channelRebate} = this.pricingForm;
      let className = "";
      if (value > _channelRebate) {
        className = "dirty-up-cell";
      } else if (value < _channelRebate) {
        className = "dirty-down-cell";
      }
      this.pricingClass.channelRebate = className;
    },
    "pricingForm.bzgRebate"(value) {
      let {_bzgRebate} = this.pricingForm;
      let className = "";
      if (value > _bzgRebate) {
        className = "dirty-up-cell";
      } else if (value < _bzgRebate) {
        className = "dirty-down-cell";
      }
      this.pricingClass.bzgRebate = className;
    },
  },
  methods: {
    afterPatch() {
      this.$emit("afterPatch");
    },
    doPre() {
      this._emit("lxPre-drawer", this.target.assign.id);
    },
    updateExecutorId(id) {
      this.assignForm.executorId = id;
    },
    onBuyPriceRadio(value) {
      if (!this.readOnly) {
        let find = this.tipList.find((item) => item.prop === value);
        if (find) {
          this.pricingForm.buyPrice = find.price;
        }
      }
      this.showTip = false;
    },
    async update() {
      // 无私单类（即签约类型 = 内容约 OR 无私单独家）的付款时，他们既填了到手价，又填了分成比例。
      // 到手价 与 分成比例 均不为0时，无法提交付款，并告知：“无私单类不可同时填写到手价和分成比例，请只填写其中一个后提交。
      let {
        ratioB,
        buyPrice,
        projectPrice,
        channelRebate,
        ybzShare,
        bzgRebate,
        extraFee,
        ptbb,
      } = this.pricingForm;
      let {pricing, assign, project} = this.target;
      let {publication, signState} = pricing;
      let isWsd = judgeWsd(publication, signState);
      if (isWsd && buyPrice && ybzShare) {
        this._warning("提示", "无私单类不可同时填写到手价和分成比例。", {
          okText: "知道了",
        });
      } else {
        let channel = splitDot(channelRebate);
        let bzg = splitDot(bzgRebate);
        let updatePricing = {
          projectPricingId: pricing.id,
          ratioB,
          channelRebate: channel.intValue,
          dotStr: channel.dotStr,
          buyPrice: buyPrice * 100,
          projectPrice: projectPrice * 100,
          ybzShare,
          bzgRebate: bzg.intValue,
          bzgDotStr: bzg.dotStr,
          extraFee: extraFee * 100,
          ptbb,
        };

        this.loading = true;

        if (assign) {
          let {payCompany} = this.assignForm;
          if (payCompany && !付款公司补丁.includes(payCompany)) {
            this._warning("提示", "付款公司无法识别。", {
              okText: "知道了",
            });
          } else {
            let {
              inquiryId,
              projectResourceId,
              resourceId,
              id,
              projectPricingId,
            } = assign;
            let params = {
              projectId: project.id,
              update: updatePricing,
              assign: {
                ...this.assignForm,
                id,
                inquiryId,
                projectResourceId,
                projectPricingId,
                resourceId,
              },
            };
            let {code} = await this.$api.assign.save(params);
            if (code === 0) {
              this._messageSuccess("保存成功");
              this.$emit("assignSave", {
                updatePricing,
                updateAssign: this.assignForm,
              });
            }
          }
        } else {
          let {code} = await this.$api.projectPricing.updatePricing(updatePricing);
          if (code === 0) {
            this._messageSuccess("保存成功");
            this.$emit("updatePricing", updatePricing);
          }
        }
        this.loading = false;
      }
    },
    getAssignFormClass() {
      let {assign, project, resource} = this.target;
      if (assign) {
        let {
          visitTime,
          link,
          workKind,
          execTime,
          executorId,
          mark,
          payCompany,
        } = assign;
        if (project.kind == "青潮区") {
          payCompany = "福建青潮";
        }
        if (assign.ptbb == "报备" && !payCompany) {
          payCompany = payCompanyProjection(resource.mcn);
        }
        let assignForm = {
          visitTime,
          link,
          workKind,
          execTime,
          executorId,
          payCompany,
          mark,
        };
        let assignClass = {
          visitTime: "",
          link: "",
          workKind: "",
          execTime: "",
          executorId: "",
          mark: "",
          payCompany: payCompany == assign.payCompany ? "" : "dirty-cell",
        };
        return {
          assignForm,
          assignClass,
        };
      }
      return {
        assignForm: {},
        assignClass: {},
      };
    },
    getFormClass() {
      let pack = this.getPricingFormClass();
      Object.assign(pack, this.getAssignFormClass());
      return pack;
    },
    getPricingFormClass() {
      let {assign, pricing} = this.target;
      // console.log("this.target", this.target);
      let {
        channelRebate,
        dotStr,
        ybzShare,
        bzgRebate,
        ptbb,
        bzgDotStr,
        extraFee,
        extraFeeDesc,
        buyPrice,
        ratioB,
        projectPrice,
      } = pricing;
      let _channelRebate = combineDot(channelRebate, dotStr);
      let _bzgRebate = combineDot(bzgRebate, bzgDotStr);
      // 历史原因，有的pricing没有ptbb数据，所以优先从assign中拿
      let _ptbb = assign?.ptbb || ptbb;
      let pricingForm = {
        channelRebate: _channelRebate,
        _channelRebate,
        ybzShare,
        bzgRebate: _bzgRebate,
        _bzgRebate,
        extraFeeDesc,
        ratioB,
        buyPrice: buyPrice / 100,
        projectPrice: projectPrice / 100,
        extraFee: extraFee / 100,
        ptbb: _ptbb,
        _ptbb,
      };
      let pricingClass = {
        buyPrice: "",
        projectPrice: "",
        ratioB: "",
        channelRebate: "",
        bzgRebate: "",
        ybzShare: "",
        extraFee: "",
        ptbb: "",
        extraFeeDesc: "",
      };
      return {
        pricingForm,
        pricingClass,
      };
    },
  },
};
</script>
<style lang="less">
.brp-render {
  padding: var(--cellPadding) 0;
  display: grid;
  column-gap: 10px;
  font-size: var(--fontSize);

  &[mode="推荐报价"] {
    grid-template-areas:
      "a11 a12 a13"
      "a21 a22 a23"
      "a31 a32 a33"
      "a41 a42 a43"
      "a51 a52 a53"
      "a61 a62 a63";
    grid-template-columns: repeat(3, 1fr);

    .a-ptbb {
      grid-area: a61;
    }

    .a-save {
      grid-area: a62;
    }
  }

  &[mode="项目执行"] {
    grid-template-areas:
      "a11 a12 a13 a14 a14"
      "a21 a22 a23 a24 a25"
      "a31 a32 a33 a34 a35"
      "a41 a42 a43 a44 a45"
      "a51 a52 a53 a54 a55"
      "a61 a61 a61 a61 a61";
    grid-template-columns: repeat(5, 1fr);

    .a-save {
      grid-area: a61;
      display: flex;
      justify-content: center;
      gap: 10px;
    }

    .a-orderNo {
      grid-area: a14;
    }

    .a-link {
      grid-area: a25;
    }

    .a-ptbb {
      grid-area: a34;
    }

    .a-payCompany {
      grid-area: a35;
    }

    .a-visitTime {
      grid-area: a55;
    }

    .a-execTime {
      grid-area: a24;
    }

    .a-workKind {
      grid-area: a54;
    }

    .a-executorId {
      grid-area: a44;
    }

    .a-mark {
      grid-area: a45;
    }
  }

  &[mode="项目付款"] {
    display: flex;
    flex-direction: column;

    .formula {
      display: grid;
      grid-template-columns: 80px 1fr;
      grid-auto-rows: var(--cellHeight);
      grid-auto-flow: row;
      align-items: center;
    }
  }

  .a-price {
    grid-area: a11;
  }

  .a-publication {
    grid-area: a12;
  }

  .a-signState {
    grid-area: a13;
  }

  .a-buyPrice {
    grid-area: a21;
  }

  .a-ratioB {
    grid-area: a22;
  }

  .a-extraFee {
    grid-area: a23;
  }

  .a-projectPrice {
    grid-area: a31;
  }

  .a-channleRebate {
    grid-area: a32;
  }

  .a-extraFeeDesc {
    grid-area: a33;
  }

  .a-rebate {
    grid-area: a41;
  }

  .a-bzgRebate {
    grid-area: a42;
  }

  .a-hjfk {
    grid-area: a43;
  }

  .a-share {
    grid-area: a51;
  }

  .a-ybzShare {
    grid-area: a52;
  }

  .a-ml {
    grid-area: a53;
  }

  .item {
    flex: 1;
    display: flex;
    height: var(--cellHeight);
    justify-content: space-between;
    font-size: 12px;

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
      flex: unset;
    }

    .value {
      flex: 1;
      text-align: right;
      max-width: calc(100% - 70px);
    }
  }

  .ivu-input-type-number {
    width: 112px;
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
