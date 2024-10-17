<template>
  <Collapse :modelValue="[1, 2, 3, 4]" class="update-shop scroll">
    <Spin v-if="fetching" fix></Spin>
    <template v-else>
      <Panel name="1">
        审核信息
        <template #content>
          <Form :label-width="180" class="inner-form">
            <!-- <FormItem label="状态">
              {{ $filter.shopStatusLabel(form.status) }}
            </FormItem>
             -->
            <FormItem label="审核人">
              <MemberRender :id="form.checkOpId" v-if="form.checkOpId" />
            </FormItem>
            <FormItem label="意见">
              {{ form.reason || "暂无" }}
            </FormItem>
          </Form>
        </template>
      </Panel>
      <Panel name="2">
        基础信息
        <template #content>
          <!-- {{ form }} -->
          <Form
            ref="form"
            :model="form"
            :rules="rules"
            class="inner-form"
            :label-width="180"
          >
            <FormItem label="入库人员" class="custom">
              <MemberRender :id="form.opId" photoSize="30px" />{{
                $filter.date(form.createdAt)
              }}

              <Card class="float-container">
                <template #title>参考数据</template>
                <Collapse :modelValue="[1, 2]">
                  <Panel name="1" v-if="liveOverview">
                    30天商家数据
                    <template #content>
                      <div class="flex-item">
                        <span class="label">直播销量:</span>
                        {{ liveOverview.live_cps_goods_sell_cnt }}
                      </div>
                      <div class="flex-item">
                        <span class="label">直播客单价:</span>
                        {{ liveOverview.live_cps_per_price.toFixed(2) }}
                      </div>
                      <div class="flex-item">
                        <span class="label">用户下单人群:</span>
                        {{
                          (
                            Number(liveOverview.max_customer_portrait_rate) *
                            100
                          ).toFixed(2) +
                          "%" +
                          liveOverview.max_customer_portrait
                        }}
                      </div>
                      <div class="flex-item">
                        <span class="label">年龄:</span>
                        {{
                          (
                            Number(liveOverview.max_age_portrait_rate) * 100
                          ).toFixed(2) +
                          "%" +
                          liveOverview.max_age_portrait
                        }}
                      </div>
                      <div class="flex-item">
                        <span class="label">性别:</span>
                        {{
                          (
                            Number(liveOverview.max_gender_portrait_rate) * 100
                          ).toFixed(2) +
                          "%" +
                          ("1" == liveOverview.max_gender_portrait
                            ? "女"
                            : "男")
                        }}
                      </div>
                      <div class="flex-item">
                        <span class="label">合作买手:</span>
                        {{ liveOverview.live_cps_relation_cnt }}
                      </div>
                    </template>
                  </Panel>
                  <Panel name="2">
                    其他
                    <template #content>
                      <div class="flex-item">
                        <span class="label">月合作达人数:</span>
                        {{ form.corp_daren_count }}
                      </div>
                      <div class="flex-item">
                        <span class="label">粉丝数:</span>
                        {{ form.fansNum }}
                      </div>
                      <div class="flex-item">
                        <span class="label">已售:</span>
                        {{ form.saleQuantity }}
                      </div>
                      <div class="flex-item">
                        <span class="label">评分:</span>
                        <template v-if="shopScore">
                          {{
                            `店铺:${shopScore.sellerScore}, 商品:${shopScore.itemScore}, 咨询:${shopScore.replyRateScore}, 物流:${shopScore.deliveryScore}`
                          }}
                        </template>
                        <template v-if="shop_exper_score">
                          {{
                            `店铺:${shop_exper_score.exper_score.score}, 商品:${shop_exper_score.goods_score.score}, 服务:${shop_exper_score.service_score.score}, 物流:${shop_exper_score.logistics_score.score}`
                          }}
                        </template>
                      </div>
                    </template>
                  </Panel>
                </Collapse>
              </Card>
            </FormItem>
            <FormItem label="来源" class="custom">
              {{ $filter.importOriginLabel(form.importOrigin) }}
            </FormItem>
            <FormItem label="平台" class="custom">
              {{ $filter.platformLabel(form.platform) }}
              <template v-if="form.platformOrigin">
                {{ $filter.platformOriginLabel(form.platformOrigin) }}
              </template>
            </FormItem>
            <FormItem label="店铺" class="custom">
              <img
                :src="form.shop_image"
                class="photo"
                v-if="form.shop_image"
              />
              <Icon type="md-image" size="32" v-else />
              <CopyRender :target="form.shop_id" />/
              <a
                v-if="
                  $filter.platformOriginLabel(form.platformOrigin) === '蒲公英'
                "
                target="_blank"
                :href="`https://pgy.xiaohongshu.com/microapp/selection/shop-detail?sellerId=${form.shop_id}`"
              >
                {{ form.shop_name }}</a
              >

              <template v-else>
                {{ form.shop_name }}
              </template>
            </FormItem>
            <FormItem label="内容类目">
              <template v-if="form.categories && form.categories.length">
                <Tag
                  :color="$api.util.randomColor()"
                  v-for="item in form.categories"
                  :key="item"
                  >{{ item }}</Tag
                >
              </template>
              <template v-else>暂无</template>
            </FormItem>
            <FormItem label="沟通群" prop="qrCodes">
              <AdUpload v-model="form.qrCodes" :max="10" />
            </FormItem>
            <FormItem label="联系人" prop="person">
              <Input v-model="form.person" placeholder="..." clearable />
            </FormItem>
            <FormItem label="微信" prop="wx">
              <Input v-model="form.wx" placeholder="..." clearable />
            </FormItem>
            <FormItem label="内部微信" prop="innerWx">
              <Input v-model="form.innerWx" placeholder="..." clearable />
            </FormItem>
            <FormItem label="手机号" prop="phone">
              <Input v-model="form.phone" placeholder="..." clearable />
            </FormItem>
            <FormItem label="责任招商" prop="zsOpId">
              <MemberRender
                :id="form.zsOpId"
                v-if="form.zsOpId"
                photoSize="30px"
              />
              <!-- <BusKeySelect kind="Member" v-model="form.zsOpId" /> -->
            </FormItem>
            <FormItem label="关联品牌" prop="brandId">
              <BusKeySelect kind="Brand" v-model="form.brandId" />
            </FormItem>
            <FormItem label="货品来源" prop="hply">
              <BusStaticSelect v-model="form.hply" kind="SourceOfGoods" />
            </FormItem>
            <FormItem label="佣金优势" prop="hpys">
              <BusStaticSelect v-model="form.hpys" kind="ProductAdvantages" />
            </FormItem>
            <FormItem label="寄样标准" prop="jybz">
              <BusStaticSelect
                v-model="form.jybz"
                kind="SampleSendingStandard"
              />
            </FormItem>
            <FormItem label="是否允许破价">
              <Checkbox v-model="form.pj" />
            </FormItem>

            <FormItem label="不走团">
              <Checkbox v-model="form.unGroup" />
            </FormItem>
            <FormItem
              label="不走团商家沟通截图"
              prop="unGroupImgs"
              v-if="form.unGroup"
            >
              <AdUpload v-model="form.unGroupImgs" :max="10" />
            </FormItem>
            <FormItem label="备注" prop="mark">
              {{ mark }}
              <!-- <Input
                type="textarea"
                v-model="form.mark"
                :rows="rows"
                :maxlength="maxLength"
                show-word-limit
                clearable
              /> -->
            </FormItem>
            <FormItem label="商家投流标准" prop="tlbz">
              <Input
                type="textarea"
                v-model="form.tlbz"
                :rows="rows"
                placeholder="博主定向佣金/线下服务费谈判情况"
                :maxlength="maxLength"
                show-word-limit
                clearable
              />
            </FormItem>

            <FormItem label="货盘表" prop="hpb">
              <TUpload text="上传文件" v-model="form.hpb" :format="[]" />
            </FormItem>
          </Form>
        </template>
      </Panel>
      <Panel name="3">
        谈判商品
        <template #content>
          <GroupGoodsImport :target="goodsTraget" />
        </template>
      </Panel>
      <Panel name="4" v-if="target.platform == 9">
        精选商品
        <template #content>
          <GroupGoods :target="goodsTraget" />
        </template>
      </Panel>
      <Button
        :loading="loading"
        @click="doSave"
        type="primary"
        :icon="$icon.save"
        class="float-save"
        >保存</Button
      >
    </template>
  </Collapse>
</template>
<script>
import CopyRender from "@/pc/component/render/CopyRender";
import MemberRender from "@/pc/component/render/MemberRender";

import BusKeySelect from "@/pc/component/select/BusKeySelect";
import BusStaticSelect from "@/pc/component/select/BusStaticSelect";

import AdUpload from "~/vp/AdUpload";
import TUpload from "~/vp/TUpload";
import GroupGoodsImport from "../group-goods-import/Index";
import GroupGoods from "../group-goods/Index";

export default {
  props: {
    target: Object,
  },
  components: {
    MemberRender,
    AdUpload,
    TUpload,
    CopyRender,
    BusKeySelect,
    BusStaticSelect,
    GroupGoodsImport,
    GroupGoods,
  },
  data() {
    return {
      form: false,
      fetching: true,
      loading: false,
      liveOverview: false,
      shop_exper_score: false,
      shopScore: false,
      rules: {
        qrCodes: {
          required: true,
          type: "array",
          min: 1,
          message: "至少一个沟通群",
          trigger: "blur",
        },
        unGroupImgs: {
          required: true,
          type: "array",
          min: 1,
          message: "不走团商家沟通截图必填",
          trigger: "blur",
        },
        brandId: {
          required: true,
          type: "number",
          message: "品牌必填",
          trigger: "blur",
        },
      },
    };
  },
  computed: {
    goodsTraget() {
      return { shop_id: this.form.shop_id };
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.fetching = true;
      let { code, data } = await this.$api.shop.findById({
        id: this.target._id,
      });

      if (code == 0) {
        let {
          liveOverview,
          shopScore,
          shop_exper_score,
          unGroup,
          unGroupImgs,
          ...form
        } = data;
        this.form = {
          hply: null,
          hpys: null,
          jybz: null,
          mark: "",
          wx: "",
          phone: "",
          innerWx: "",
          unGroup: unGroup || false,
          unGroupImgs: unGroupImgs || [],
          ...form,
        };
        this.liveOverview = liveOverview;
        this.shopScore = shopScore;
        this.shop_exper_score = shop_exper_score;
        if (!form.shop_id) {
          this.$Notice.warning({
            title: "暂不可补充店铺ID",
            desc: "入库时缺少店铺ID，正在开发自动填充店铺ID的抓取，请等一段时间，预计上线时间 2024-10-17",
            duration: 0,
          });
        }
      }
      this.fetching = false;
    },
    async doSave() {
      // let valid = true;
      let valid = await this._validateForm("form");
      if (valid) {
        let {
          shop_id,
          hply,
          hpys,
          pj,
          unGroup,
          jybz,
          tlbz,
          hpb,
          brandId,
          qrCodes,
          wx,
          innerWx,
          person,
          phone,
          unGroupImgs,
          sec_shop_id,
        } = this.form;
        console.log("this.form", this.form);

        this.loading = true;
        let { code, data } = await this.$api.shop.update({
          shop_id,
          hply,
          hpys,
          brandId,
          qrCodes,
          wx,
          innerWx,
          person,
          phone,
          pj,
          unGroup,
          jybz,
          tlbz,
          hpb,
          unGroupImgs,
          sec_shop_id,
        });
        if (code === 0) {
          this._messageSuccess("操作成功");
        }
        this.loading = false;
      }
    },
  },
};
</script>
<style lang="less">
.update-shop {
  height: 100%;

  .photo {
    width: 30px;
    height: 30px;
  }

  .custom {
    .ivu-form-item-content {
      display: flex;
      gap: 5px;
      align-items: center;
      flex-wrap: wrap;
    }
  }
  .float-container {
    position: absolute;
    top: 0;
    z-index: 1000;
    left: 460px;
    .ivu-card-body {
      padding: 0;
      .ivu-collapse-content > .ivu-collapse-content-box {
        padding-top: 6px;
        padding-bottom: 6px;
      }
    }
    .flex-item {
      display: flex;
      .label {
        width: 90px;
        margin-right: 20px;
        text-align: right;
      }
    }
  }
}
</style>
