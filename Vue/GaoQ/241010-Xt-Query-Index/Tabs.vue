<script>
export default {
  name: "Tabs"
}
</script>

<template>
  <Tabs value="name1" class="filter">
    <TabPane label="星图视频 30日" name="name1">
      <div class="item">
        <span class="label">播放量中位数</span>
        <RangeAdapter v-model="condition.xtAllbflzwsValue1mRange"/>
      </div>
      <div class="item">
        <span class="label">互动率(%)</span>
        <RangeAdapter v-model="condition.xtAllhdlValue1mRange"/>
      </div>
      <div class="item">
        <span class="label">完播率(%)</span>
        <RangeAdapter v-model="condition.xtAllwblValue1mRange"/>
      </div>
      <div class="item">
        <span class="label">发布作品</span>
        <RangeAdapter v-model="condition.xtAllfbzp1mRange"/>
      </div>
      <div class="item">
        <span class="label">平均时长</span>
        <RangeAdapter v-model="condition.xtAllpjsc1mRange"/>
      </div>
      <div class="item">
        <span class="label">平均点赞</span>
        <RangeAdapter v-model="condition.xtAllpjdz1mRange"/>
      </div>
      <div class="item">
        <span class="label">平均评论</span>
        <RangeAdapter v-model="condition.xtAllpjpl1mRange"/>
      </div>
      <div class="item">
        <span class="label">平均转发</span>
        <RangeAdapter v-model="condition.xtAllpjzf1mRange"/>
      </div>
    </TabPane>
    <TabPane label="星图视频 90日" name="name2">
      <div class="item">
        <span class="label">播放量中位数</span>
        <RangeAdapter v-model="condition.xtAllbflzwsValue3mRange"/>
      </div>
      <div class="item">
        <span class="label">互动率(%)</span>
        <RangeAdapter v-model="condition.xtAllhdlValue3mRange"/>
      </div>
      <div class="item">
        <span class="label">完播率(%)</span>
        <RangeAdapter v-model="condition.xtAllwblValue3mRange"/>
      </div>
      <div class="item">
        <span class="label">发布作品</span>
        <RangeAdapter v-model="condition.xtAllfbzp3mRange"/>
      </div>
      <div class="item">
        <span class="label">平均时长</span>
        <RangeAdapter v-model="condition.xtAllpjsc3mRange"/>
      </div>
      <div class="item">
        <span class="label">平均点赞</span>
        <RangeAdapter v-model="condition.xtAllpjdz3mRange"/>
      </div>
      <div class="item">
        <span class="label">平均评论</span>
        <RangeAdapter v-model="condition.xtAllpjpl3mRange"/>
      </div>
      <div class="item">
        <span class="label">平均转发</span>
        <RangeAdapter v-model="condition.xtAllpjzf3mRange"/>
      </div>
    </TabPane>
    <TabPane label="视频表现 个人" name="name3">
      <div class="item">
        <span class="label">最低播放量</span>
        <RangeAdapter v-model="condition.grBfMinRange" />
      </div>
      <div class="item">
        <span class="label">最高播放量</span>
        <RangeAdapter v-model="condition.grBfMaxRange" />
      </div>
      <div class="item">
        <span class="label">播放量均值</span>
        <RangeAdapter v-model="condition.grBfAvgRange" />
      </div>
      <div class="item">
        <span class="label">爆量视频百分比(%)</span>
        <RangeAdapter v-model="condition.grBlSpBfbValueRange" />
      </div>
      <div class="item">
        <span class="label">最低点赞量</span>
        <RangeAdapter v-model="condition.grDzMinRange" />
      </div>
      <div class="item">
        <span class="label">最高点赞量</span>
        <RangeAdapter v-model="condition.grDzMaxRange" />
      </div>
      <div class="item">
        <span class="label">点赞量均值</span>
        <RangeAdapter v-model="condition.grDzAvgRange" />
      </div>
      <div class="item">
        <span class="label">最低评论量</span>
        <RangeAdapter v-model="condition.grPlMinRange" />
      </div>
      <div class="item">
        <span class="label">最高评论量</span>
        <RangeAdapter v-model="condition.grPlMaxRange" />
      </div>
      <div class="item">
        <span class="label">评论量均值</span>
        <RangeAdapter v-model="condition.grPlAvgRange" />
      </div>
      <div class="item">
        <span class="label">最低转发量</span>
        <RangeAdapter v-model="condition.grZfMinRange" />
      </div>
      <div class="item">
        <span class="label">最高转发量</span>
        <RangeAdapter v-model="condition.grZfMaxRange" />
      </div>
      <div class="item">
        <span class="label">转发量均值</span>
        <RangeAdapter v-model="condition.grZfAvgRange" />
      </div>
    </TabPane>
    <TabPane label="视频表现 星图" name="name4">
      <div class="item">
        <span class="label">最低播放量</span>
        <RangeAdapter v-model="condition.xtAllBfMinRange" />
      </div>
      <div class="item">
        <span class="label">最高播放量</span>
        <RangeAdapter v-model="condition.xtAllBfMaxRange" />
      </div>
      <div class="item">
        <span class="label">播放量均值</span>
        <RangeAdapter v-model="condition.xtAllBfAvgRange" />
      </div>
      <div class="item">
        <span class="label">爆量视频百分比(%)</span>
        <RangeAdapter v-model="condition.xtAllBlSpBfbValueRange" />
      </div>
      <div class="item">
        <span class="label">最低点赞量</span>
        <RangeAdapter v-model="condition.xtAllDzMinRange" />
      </div>
      <div class="item">
        <span class="label">最高点赞量</span>
        <RangeAdapter v-model="condition.xtAllDzMaxRange" />
      </div>
      <div class="item">
        <span class="label">点赞量均值</span>
        <RangeAdapter v-model="condition.xtAllDzAvgRange" />
      </div>
      <div class="item">
        <span class="label">最低评论量</span>
        <RangeAdapter v-model="condition.xtAllPlMinRange" />
      </div>
      <div class="item">
        <span class="label">最高评论量</span>
        <RangeAdapter v-model="condition.xtAllPlMaxRange" />
      </div>
      <div class="item">
        <span class="label">评论量均值</span>
        <RangeAdapter v-model="condition.xtAllPlAvgRange" />
      </div>
      <div class="item">
        <span class="label">最低转发量</span>
        <RangeAdapter v-model="condition.xtAllZfMinRange" />
      </div>
      <div class="item">
        <span class="label">最高转发量</span>
        <RangeAdapter v-model="condition.xtAllZfMaxRange" />
      </div>
      <div class="item">
        <span class="label">转发量均值</span>
        <RangeAdapter v-model="condition.xtAllZfAvgRange" />
      </div>
    </TabPane>
    <TabPane label="CPE&CPM" name="name5">
      <div class="item">
        <span class="label">1-20s视频CPE</span>
        <RangeAdapter v-model="condition.cpe120Range"/>
      </div>
      <div class="item">
        <span class="label">21-60s视频CPE</span>
        <RangeAdapter v-model="condition.cpe2160Range"/>
      </div>
      <div class="item">
        <span class="label">60s以上视频CPE</span>
        <RangeAdapter v-model="condition.cpe60Range"/>
      </div>
      <div class="item">
        <span class="label">1-20s视频CPM</span>
        <RangeAdapter v-model="condition.cpm120Range"/>
      </div>
      <div class="item">
        <span class="label">21-60s视频CPM</span>
        <RangeAdapter v-model="condition.cpm2160Range"/>
      </div>
      <div class="item">
        <span class="label">60s以上视频CPM</span>
        <RangeAdapter v-model="condition.cpm60Range"/>
      </div>
    </TabPane>
    <TabPane label="连接用户数" name="name6">
      <div class="item">
        <span class="label">月连接用户数</span>
        <RangeAdapter v-model="condition.xtYljyhsRange" />
      </div>
      <div class="item">
        <span class="label">月深度用户数</span>
        <RangeAdapter v-model="condition.xtYsdyhsRange" />
      </div>
      <div class="item">
        <span class="label">了解</span>
        <RangeAdapter v-model="condition.ljConnectNumRange" />
      </div>
      <div class="item">
        <span class="label">兴趣</span>
        <RangeAdapter v-model="condition.xqConnectNumRange" />
      </div>
      <div class="item">
        <span class="label">喜欢</span>
        <RangeAdapter v-model="condition.xhConnectNumRange" />
      </div>
      <div class="item">
        <span class="label">追随</span>
        <RangeAdapter v-model="condition.zsConnectNumRange" />
      </div>
    </TabPane>
    <TabPane label="观众画像" name="name7">
      <div class="item">
        <span class="label">女性占比(%)</span>
        <RangeAdapter v-model="condition.fsFeMaleRateRange" />
      </div>
      <div class="item">
        <span class="label">男性占比(%)</span>
        <RangeAdapter v-model="condition.fsMaleRateRange" />
      </div>
      <div class="item">
        <span class="label">用户兴趣</span>
        <DistinctFansSelect
            :isTransfer="true"
            v-model="condition.yhxqMaxs"
            :params="{ field: 'yhxqMax', type: 'Pgy' }"
        />
      </div>
      <div class="item" v-if="condition.yhxqMaxs.length > 0">
        <span class="label">用户兴趣占比(%)</span>
        <RangeAdapter v-model="condition.yhxqRateRange" />
      </div>
      <div class="item">
        <span class="label">城市分布</span>
        <DistinctFansSelect
            :isTransfer="true"
            v-model="condition.csfbMaxs"
            :params="{ field: 'csfbMax', type: 'Pgy' }"
        />
      </div>
      <div class="item" v-if="condition.csfbMaxs.length > 0">
        <span class="label">城市分布占比(%)</span>
        <RangeAdapter v-model="condition.csfbRateRange" />
      </div>
      <div class="item">
        <span class="label">省份分布</span>
        <DistinctFansSelect
            :isTransfer="true"
            v-model="condition.sffbMaxs"
            :params="{ field: 'sffbMax', type: 'Pgy' }"
        />
      </div>
      <div class="item" v-if="condition.sffbMaxs.length > 0">
        <span class="label">省份分布占比(%)</span>
        <RangeAdapter v-model="condition.sffbRateRange" />
      </div>
      <div class="item">
        <span class="label">设备分布</span>
        <DistinctFansSelect
            :isTransfer="true"
            v-model="condition.sbfbMaxs"
            :params="{ field: 'sbfbMax', type: 'Pgy' }"
        />
      </div>
      <div class="item" v-if="condition.sbfbMaxs.length > 0">
        <span class="label">设备分布占比(%)</span>
        <RangeAdapter v-model="condition.sbfbRateRange" />
      </div>
      <div class="item">
        <span class="label">年龄分布</span>
        <BusStaticSelect
            :transfer="true"
            v-model="condition.nlfbMaxs"
            kind="pgy粉丝年龄"
        />
      </div>
      <div class="item" v-if="condition.nlfbMaxs.length > 0">
        <span class="label">年龄分布占比(%)</span>
        <RangeAdapter v-model="condition.nlfbRateRange" />
      </div>
    </TabPane>
    <TabPane label="粉丝画像" name="name8">
      <div class="item">
        <span class="label">女性占比(%)</span>
        <RangeAdapter v-model="condition.fsFeMaleRateRange" />
      </div>
      <div class="item">
        <span class="label">男性占比(%)</span>
        <RangeAdapter v-model="condition.fsMaleRateRange" />
      </div>
      <div class="item">
        <span class="label">用户兴趣</span>
        <DistinctFansSelect
            :isTransfer="true"
            v-model="condition.yhxqMaxs"
            :params="{ field: 'yhxqMax', type: 'Pgy' }"
        />
      </div>
      <div class="item" v-if="condition.yhxqMaxs.length > 0">
        <span class="label">用户兴趣占比(%)</span>
        <RangeAdapter v-model="condition.yhxqRateRange" />
      </div>
      <div class="item">
        <span class="label">城市分布</span>
        <DistinctFansSelect
            :isTransfer="true"
            v-model="condition.csfbMaxs"
            :params="{ field: 'csfbMax', type: 'Pgy' }"
        />
      </div>
      <div class="item" v-if="condition.csfbMaxs.length > 0">
        <span class="label">城市分布占比(%)</span>
        <RangeAdapter v-model="condition.csfbRateRange" />
      </div>
      <div class="item">
        <span class="label">省份分布</span>
        <DistinctFansSelect
            :isTransfer="true"
            v-model="condition.sffbMaxs"
            :params="{ field: 'sffbMax', type: 'Pgy' }"
        />
      </div>
      <div class="item" v-if="condition.sffbMaxs.length > 0">
        <span class="label">省份分布占比(%)</span>
        <RangeAdapter v-model="condition.sffbRateRange" />
      </div>
      <div class="item">
        <span class="label">设备分布</span>
        <DistinctFansSelect
            :isTransfer="true"
            v-model="condition.sbfbMaxs"
            :params="{ field: 'sbfbMax', type: 'Pgy' }"
        />
      </div>
      <div class="item" v-if="condition.sbfbMaxs.length > 0">
        <span class="label">设备分布占比(%)</span>
        <RangeAdapter v-model="condition.sbfbRateRange" />
      </div>
      <div class="item">
        <span class="label">年龄分布</span>
        <BusStaticSelect
            :transfer="true"
            v-model="condition.nlfbMaxs"
            kind="pgy粉丝年龄"
        />
      </div>
      <div class="item" v-if="condition.nlfbMaxs.length > 0">
        <span class="label">年龄分布占比(%)</span>
        <RangeAdapter v-model="condition.nlfbRateRange" />
      </div>
    </TabPane>
    <TabPane label="指数" name="name9">
      <div class="item">
        <span class="label">星图</span>
        <RangeAdapter v-model="condition.xtIndexValueRange"/>
      </div>
      <div class="item">
        <span class="label">传播</span>
        <RangeAdapter v-model="condition.cbIndexValueRange"/>
      </div>
      <div class="item">
        <span class="label">种草</span>
        <RangeAdapter v-model="condition.zcIndexValueRange"/>
      </div>
      <div class="item">
        <span class="label">转化</span>
        <RangeAdapter v-model="condition.zhIndexValueRange"/>
      </div>
      <div class="item">
        <span class="label">性价比</span>
        <RangeAdapter v-model="condition.xjbIndexValueRange"/>
      </div>
      <div class="item">
        <span class="label">合作</span>
        <RangeAdapter v-model="condition.hzIndexValueRange"/>
      </div>
    </TabPane>
  </Tabs>
</template>

<style scoped>

</style>