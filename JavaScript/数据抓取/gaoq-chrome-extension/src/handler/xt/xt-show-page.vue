<template>
  <div class="grid-2 grid-column">
    <FormItem v-if="form.pgy" label="30天数据">
      <div class="data-container">
        <div class="detail-data">
          <div class="title">广告</div>
          <div class="item">
            <div class="label">曝光中位数</div>
            <div class="value">
              {{ form.pgy.bgzws1m }}
            </div>
          </div>
          <div class="item">
            <div class="label">阅读中位数</div>
            <div class="value">
              {{ form.pgy.ydzws1m }}
            </div>
          </div>
          <div class="item">
            <div class="label">互动中位数</div>
            <div class="value">
              {{ form.pgy.hdzws1m }}
            </div>
          </div>
          <div class="item">
            <div class="label">中位点赞量</div>
            <div class="value">
              {{ form.pgy.zwdzl1m }}
            </div>
          </div>
          <div class="item">
            <div class="label">中位收藏量</div>
            <div class="value">
              {{ form.pgy.zwscl1m }}
            </div>
          </div>
          <div class="item">
            <div class="label">中位评论量</div>
            <div class="value">
              {{ form.pgy.zwpll1m }}
            </div>
          </div>
          <div class="item">
            <div class="label">中位分享量</div>
            <div class="value">
              {{ form.pgy.zwfxl1m }}
            </div>
          </div>
          <div class="item">
            <div class="label">互动率</div>
            <div class="value">{{ form.pgy.hdl1m }}%</div>
          </div>
          <div class="item">
            <div class="label">视频完播率</div>
            <div class="value">{{ form.pgy.spwbl1m }}%</div>
          </div>
          <div class="item">
            <div class="label">图文3秒阅读率</div>
            <div class="value">{{ form.pgy.tw3mydl1m }}%</div>
          </div>
          <div class="item">
            <div class="label">千赞笔记比例</div>
            <div class="value">{{ form.pgy.qzbjbl1m }}%</div>
          </div>
          <div class="item">
            <div class="label">百赞笔记比例</div>
            <div class="value">{{ form.pgy.bzbjbl1m }}%</div>
          </div>
        </div>
        <div class="detail-data">
          <div class="title">日常</div>
          <div class="item">
            <div class="label">曝光中位数</div>
            <div class="value">
              {{ form.pgy.rcbgzws1m }}
            </div>
          </div>
          <div class="item">
            <div class="label">阅读中位数</div>
            <div class="value">
              {{ form.pgy.rcydzws1m }}
            </div>
          </div>
          <div class="item">
            <div class="label">互动中位数</div>
            <div class="value">
              {{ form.pgy.rchdzws1m }}
            </div>
          </div>
          <div class="item">
            <div class="label">中位点赞量</div>
            <div class="value">
              {{ form.pgy.rczwdzl1m }}
            </div>
          </div>
          <div class="item">
            <div class="label">中位收藏量</div>
            <div class="value">
              {{ form.pgy.rczwscl1m }}
            </div>
          </div>
          <div class="item">
            <div class="label">中位评论量</div>
            <div class="value">
              {{ form.pgy.rczwpll1m }}
            </div>
          </div>
          <div class="item">
            <div class="label">中位分享量</div>
            <div class="value">
              {{ form.pgy.rczwfxl1m }}
            </div>
          </div>
          <div class="item">
            <div class="label">互动率</div>
            <div class="value">{{ form.pgy.rchdl1m }}%</div>
          </div>
          <div class="item">
            <div class="label">视频完播率</div>
            <div class="value">{{ form.pgy.rcspwbl1m }}%</div>
          </div>
          <div class="item">
            <div class="label">图文3秒阅读率</div>
            <div class="value">{{ form.pgy.rctw3mydl1m }}%</div>
          </div>
          <div class="item">
            <div class="label">千赞笔记比例</div>
            <div class="value">{{ form.pgy.rcqzbjbl1m }}%</div>
          </div>
          <div class="item">
            <div class="label">百赞笔记比例</div>
            <div class="value">{{ form.pgy.bzbjbl1m }}%</div>
          </div>
        </div>
      </div>
    </FormItem>
    <FormItem label="CPE">
      <div v-if="form.platformId == 9 && form.xt" class="detail-data">
        <div class="item">
          <div class="label" style="padding-right: 0px">1-20s视频CPE</div>
          <div class="value">
            {{ form.xt.cpe120 ? form.xt.cpe120 / 100 : 0 }}
          </div>
        </div>
        <div class="item">
          <div class="label" style="padding-right: 0px">21-60s视频CPE</div>
          <div class="value">
            {{ form.xt.cpe2160 ? form.xt.cpe2160 / 100 : 0 }}
          </div>
        </div>
        <div class="item">
          <div class="label" style="padding-right: 0px">1-20s视频CPE</div>
          <div class="value">
            {{ form.xt.cpe60 ? form.xt.cpe60 / 100 : 0 }}
          </div>
        </div>
      </div>
      <div v-else-if="form.platformId == 8 && form.pgy" class="detail-data">
        <div class="item">
          <div class="label">30天合作CPE</div>
          <div class="value">
            {{ form.pgy.cpe1m ? form.pgy.cpe1m / 100 : 0 }}
          </div>
        </div>
        <div class="item">
          <div class="label">90天合作CPE</div>
          <div class="value">
            {{ form.pgy.cpe3m ? form.pgy.cpe3m / 100 : 0 }}
          </div>
        </div>
        <div class="item">
          <div class="label">综合合作CPE</div>
          <div class="value">
            {{ form.pgy.cpe ? form.pgy.cpe / 100 : 0 }}
          </div>
        </div>
        <div class="item">
          <div class="label">30天日常CPE</div>
          <div class="value">
            {{ form.pgy.rccpe1m ? form.pgy.rccpe1m / 100 : 0 }}
          </div>
        </div>
        <div class="item">
          <div class="label">90天日常CPE</div>
          <div class="value">
            {{ form.pgy.rccpe3m ? form.pgy.rccpe3m / 100 : 0 }}
          </div>
        </div>
        <div class="item">
          <div class="label">综合日常CPE</div>
          <div class="value">
            {{ form.pgy.rccpe ? form.pgy.rccpe / 100 : 0 }}
          </div>
        </div>
      </div>
      <div v-else>无</div>
    </FormItem>
    <FormItem v-if="form.pgy" label="90天数据">
      <div class="data-container">
        <div class="detail-data">
          <div class="title">广告</div>
          <div class="item">
            <div class="label">曝光中位数</div>
            <div class="value">
              {{ form.pgy.bgzws3m }}
            </div>
          </div>
          <div class="item">
            <div class="label">阅读中位数</div>
            <div class="value">
              {{ form.pgy.ydzws3m }}
            </div>
          </div>
          <div class="item">
            <div class="label">互动中位数</div>
            <div class="value">
              {{ form.pgy.hdzws3m }}
            </div>
          </div>
          <div class="item">
            <div class="label">中位点赞量</div>
            <div class="value">
              {{ form.pgy.zwdzl3m }}
            </div>
          </div>
          <div class="item">
            <div class="label">中位收藏量</div>
            <div class="value">
              {{ form.pgy.zwscl3m }}
            </div>
          </div>
          <div class="item">
            <div class="label">中位评论量</div>
            <div class="value">
              {{ form.pgy.zwpll3m }}
            </div>
          </div>
          <div class="item">
            <div class="label">中位分享量</div>
            <div class="value">
              {{ form.pgy.zwfxl3m }}
            </div>
          </div>
          <div class="item">
            <div class="label">互动率</div>
            <div class="value">{{ form.pgy.hdl3m }}%</div>
          </div>
          <div class="item">
            <div class="label">视频完播率</div>
            <div class="value">{{ form.pgy.spwbl3m }}%</div>
          </div>
          <div class="item">
            <div class="label">图文3秒阅读率</div>
            <div class="value">{{ form.pgy.tw3mydl3m }}%</div>
          </div>
          <div class="item">
            <div class="label">千赞笔记比例</div>
            <div class="value">{{ form.pgy.qzbjbl3m }}%</div>
          </div>
          <div class="item">
            <div class="label">百赞笔记比例</div>
            <div class="value">{{ form.pgy.bzbjbl3m }}%</div>
          </div>
        </div>
        <div class="detail-data">
          <div class="title">日常</div>
          <div class="item">
            <div class="label">曝光中位数</div>
            <div class="value">
              {{ form.pgy.rcbgzws3m }}
            </div>
          </div>
          <div class="item">
            <div class="label">阅读中位数</div>
            <div class="value">
              {{ form.pgy.rcydzws3m }}
            </div>
          </div>
          <div class="item">
            <div class="label">互动中位数</div>
            <div class="value">
              {{ form.pgy.rchdzws3m }}
            </div>
          </div>
          <div class="item">
            <div class="label">中位点赞量</div>
            <div class="value">
              {{ form.pgy.rczwdzl3m }}
            </div>
          </div>
          <div class="item">
            <div class="label">中位收藏量</div>
            <div class="value">
              {{ form.pgy.rczwscl3m }}
            </div>
          </div>
          <div class="item">
            <div class="label">中位评论量</div>
            <div class="value">
              {{ form.pgy.rczwpll3m }}
            </div>
          </div>
          <div class="item">
            <div class="label">中位分享量</div>
            <div class="value">
              {{ form.pgy.rczwfxl3m }}
            </div>
          </div>
          <div class="item">
            <div class="label">互动率</div>
            <div class="value">{{ form.pgy.rchdl3m }}%</div>
          </div>
          <div class="item">
            <div class="label">视频完播率</div>
            <div class="value">{{ form.pgy.rcspwbl3m }}%</div>
          </div>
          <div class="item">
            <div class="label">图文3秒阅读率</div>
            <div class="value">{{ form.pgy.rctw3mydl3m }}%</div>
          </div>
          <div class="item">
            <div class="label">千赞笔记比例</div>
            <div class="value">{{ form.pgy.rcqzbjbl3m }}%</div>
          </div>
          <div class="item">
            <div class="label">百赞笔记比例</div>
            <div class="value">{{ form.pgy.rcbzbjbl3m }}%</div>
          </div>
        </div>
      </div>
    </FormItem>

    <FormItem label="CPM">
      <div v-if="form.platformId == 9 && form.xt" class="detail-data">
        <div class="item">
          <div class="label" style="padding-right: 0px">1-20s视频CPM</div>
          <div class="value">
            {{ form.xt.cpm120 ? form.xt.cpm120 / 100 : 0 }}
          </div>
        </div>
        <div class="item">
          <div class="label" style="padding-right: 0px">21-60s视频CPM</div>
          <div class="value">
            {{ form.xt.cpm2160 ? form.xt.cpm2160 / 100 : 0 }}
          </div>
        </div>
        <div class="item">
          <div class="label" style="padding-right: 0px">1-20s视频CPM</div>
          <div class="value">
            {{ form.xt.cpm60 ? form.xt.cpm60 / 100 : 0 }}
          </div>
        </div>
      </div>
      <div v-else-if="form.platformId == 8 && form.pgy" class="detail-data">
        <div class="item">
          <div class="label">30天合作CPM</div>
          <div class="value">
            {{ form.pgy.cpm1m ? form.pgy.cpm1m / 100 : 0 }}
          </div>
        </div>
        <div class="item">
          <div class="label">90天合作CPM</div>
          <div class="value">
            {{ form.pgy.cpm3m ? form.pgy.cpm3m / 100 : 0 }}
          </div>
        </div>
        <div class="item">
          <div class="label">综合合作CPM</div>
          <div class="value">
            {{ form.pgy.cpm ? form.pgy.cpm / 100 : 0 }}
          </div>
        </div>
        <div class="item">
          <div class="label">30天日常CPM</div>
          <div class="value">
            {{ form.pgy.rccpm1m ? form.pgy.rccpm1m / 100 : 0 }}
          </div>
        </div>
        <div class="item">
          <div class="label">90天日常CPM</div>
          <div class="value">
            {{ form.pgy.rccpm3m ? form.pgy.rccpm3m / 100 : 0 }}
          </div>
        </div>
        <div class="item">
          <div class="label">综合日常CPM</div>
          <div class="value">
            {{ form.pgy.rccpm ? form.pgy.rccpm / 100 : 0 }}
          </div>
        </div>
      </div>
      <div v-else>无</div>
    </FormItem>
  </div>
  <script setup lang="ts">
  </script>


<!--  多维度字段  -->
  <Divider size="small" dashed class="margin-top-10"
  >多维度字段</Divider
  >
  <Space direction="vertical" type="flex">
    <Checkbox
        :indeterminate="pgyMulIndeterminate"
        :model-value="pgyMulCheckAll"
        @click.prevent="handleCheckAll('pgyMul')"
    >全选</Checkbox
    >
    <div class="multiple-dimensions">
      维度：
      <Checkbox
          v-model="dimensions1m"
          @on-change="handleSelectCheck"
      >
        30日</Checkbox
      >
      <Checkbox
          v-model="dimensions3m"
          @on-change="handleSelectCheck"
      >
        90日</Checkbox
      >
      <Checkbox
          v-model="dimensionsCooperation"
          @on-change="handleSelectCheck"
      >
        合作</Checkbox
      >
      <Checkbox
          v-model="dimensionsDaily"
          @on-change="handleSelectCheck"
      >
        日常</Checkbox
      >
      <Checkbox
          v-model="dimensionsZrFlow"
          @on-change="handleSelectCheck"
      >
        自然流量</Checkbox
      >
      <Checkbox
          v-model="dimensionsAllFlow"
          @on-change="handleSelectCheck"
      >
        全流量</Checkbox
      >
    </div>

    <Divider size="small" class="ivu-m-0" />
    <CheckboxGroup
        v-model="pgyMulCheckAllGroup"
        class="field-list"
        @on-change="
                      (data) => {
                        checkAllGroupChange(data, 'pgyMul');
                      }
                    "
    >
      <Checkbox
          :label="item"
          v-for="item in pgyMulFields"
          :key="item"
      ></Checkbox>
    </CheckboxGroup>
  </Space>
</template>
<script setup lang="ts">
</script>