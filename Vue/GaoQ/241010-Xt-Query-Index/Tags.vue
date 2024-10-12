<script>
export default {
  name: "Tags"
}
</script>

<template>
  <Tag
      closable
      size="medium"
      v-if="condition.sbfbMaxs.length > 0"
      @on-close="
            condition.sbfbMaxs = [];
            condition.sbfbRateRange = [null, null];
          "
      :color="randomColor('sbfbMaxs')"
  >粉丝设备居多:{{ condition.sbfbMaxs.join("、") }}
  </Tag>
</template>

<style scoped>

</style>