<template>
  <div class="property-panel">
    <div v-if="selectedComponent" class="property-content">
      <h3>组件属性</h3>

      <div class="property-group">
        <label>位置</label>
        <div class="input-group">
          <input type="number" v-model.number="selectedComponent.position.x">
          <input type="number" v-model.number="selectedComponent.position.y">
        </div>
      </div>

      <div class="property-group">
        <label>尺寸</label>
        <div class="input-group">
          <input type="number" v-model.number="selectedComponent.size.width">
          <input type="number" v-model.number="selectedComponent.size.height">
        </div>
      </div>

      <div class="property-group">
        <label>背景颜色</label>
        <input type="color" v-model="selectedComponent.styles.backgroundColor">
      </div>

      <div class="property-group">
        <label>字体大小</label>
        <input
            type="range"
            min="12"
            max="48"
            v-model.number="selectedComponent.styles.fontSize"
        >
      </div>
    </div>
    <div v-else class="empty-tip">请选择组件</div>
  </div>
</template>

<script>
export default {
  props: {
    selectedComponent: {
      type: Object,
      default: null
    }
  },
  watch: {
    selectedComponent: {
      handler(newVal) {
        if (newVal) {
          this.$emit('style-change', newVal.styles)
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.property-panel {
  padding: 20px;
  background: white;
  border-left: 1px solid #e4e7ed;
  height: 100%;
  .property-group {
    margin-bottom: 20px;

    label {
      display: block;
      margin-bottom: 8px;
      color: #606266;
    }
    .input-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    input[type="number"] {
      width: 100%;
      padding: 8px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
    }

    input[type="color"] {
      width: 100%;
      height: 40px;
    }
  }
  .empty-tip {
    color: #909399;
    text-align: center;
    padding: 40px 0;
  }
}
</style>