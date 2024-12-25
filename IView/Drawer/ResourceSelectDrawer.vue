<template>
  <Drawer title="选择资源" v-model="showDrawer" width="100%" className="resource-select-drawer">
    <TableSelect @select="doHide" :target="target" />
  </Drawer>
</template>
<script>
import TableSelect from "../Drawer/resource/TableSelect";
import mixin from "@/pc/mixin/drawer";
export default {
  mixins: [mixin],
  components: {
    TableSelect,
  }
};
</script>
<style lang="less">
.resource-select-drawer {
  .ivu-drawer-body {
    padding: 0;
  }
}
</style>