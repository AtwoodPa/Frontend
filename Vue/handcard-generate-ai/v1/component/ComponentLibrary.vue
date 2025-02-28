<template>
  <div class="component-library">
    <div
        v-for="component in componentTypes"
        :key="component.type"
        class="component-item"
        draggable="true"
        @dragstart="handleDragStart(component)"
    >
      <div class="component-icon">
        <i :class="component.icon"></i>
      </div>
      <span>{{ component.label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponentLibrary",
  data() {
    return {
      componentTypes: [
        { type: 'text', label: '文本组件', icon: 'icon-text' },
        { type: 'image', label: '图片组件', icon: 'icon-image' },
        { type: 'price', label: '价格标签', icon: 'icon-price' },
        // { type: 'button', label: '按钮', icon: 'icon-button' }
      ]
    }
  },
  methods: {
    handleDragStart(component) {
      this.$emit('drag-start', component.type)
    }
  }
}
</script>

<style lang="less" >
.component-library {
  padding: 20px;
  background: #f5f7fa;
  border-right: 1px solid #e4e7ed;
}

.component-item {
  padding: 12px;
  margin-bottom: 10px;
  background: white;
  border-radius: 6px;
  cursor: move;
  transition: all 0.3s;
  border: 1px solid #ebeef5;
}

.component-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.component-icon {
  font-size: 24px;
  margin-bottom: 8px;
  color: #409eff;
}
</style>