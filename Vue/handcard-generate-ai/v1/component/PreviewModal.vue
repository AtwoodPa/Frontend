<template>
  <div class="preview-modal">
    <div class="preview-content">
      <div class="preview-header">
        <h3>模板预览</h3>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      <div class="preview-body">
        <div
            v-for="component in layout"
            :key="component.id"
            class="preview-component"
            :style="getPreviewStyle(component)"
        >
          <component
              :is="component.type + '-widget'"
              :component="component"
              :preview="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    layout: {
      type: Array,
      required: true
    }
  },
  methods: {
    getPreviewStyle(component) {
      return {
        left: `${component.position.x}px`,
        top: `${component.position.y}px`,
        width: `${component.size.width}px`,
        height: `${component.size.height}px`
      }
    }
  }
}
</script>

<style scoped>
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

}

.preview-content {
  background: white;
  width: 80%;
  height: 80%;
  border-radius: 8px;
  position: relative;
  .preview-header {
    padding: 16px;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .close-btn {
      font-size: 24px;
      cursor: pointer;
      padding: 0 12px;
    }
  }
  .preview-body {
    position: relative;
    height: calc(100% - 60px);
    overflow: auto;
    .preview-component {
      position: absolute;
      pointer-events: none;
    }
  }
}
</style>