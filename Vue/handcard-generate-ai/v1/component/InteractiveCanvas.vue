<template>
  <div
      class="canvas-container"
      @dragover.prevent
      @drop="handleDrop"
  >
    <div
        v-for="component in components"
        :key="component.id"
        class="canvas-component"
        :style="getComponentStyle(component)"
        @mousedown="handleSelect(component)"
        @touchstart="handleSelect(component)"
    >
      <component
          :is="component.type + '-widget'"
          :component="component"
      />
      <div class="resize-handle" @mousedown.stop="startResize(component)"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    components: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleDrop(){

    },
    getComponentStyle(component) {
      return {
        left: `${component.position.x}px`,
        top: `${component.position.y}px`,
        width: `${component.size.width}px`,
        height: `${component.size.height}px`,
        ...component.styles
      }
    },
    handleSelect(component) {
      this.$emit('component-select', component)
    },
    startResize(component) {
      const startX = event.clientX
      const startY = event.clientY
      const startWidth = component.size.width
      const startHeight = component.size.height

      const doResize = (e) => {
        const deltaX = e.clientX - startX
        const deltaY = e.clientY - startY
        component.size = {
          width: startWidth + deltaX,
          height: startHeight + deltaY
        }
      }

      const stopResize = () => {
        window.removeEventListener('mousemove', doResize)
        window.removeEventListener('mouseup', stopResize)
        this.$emit('component-move', component)
      }

      window.addEventListener('mousemove', doResize)
      window.addEventListener('mouseup', stopResize)
    }
  }
}
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fafafa;
  overflow: hidden;
  .canvas-component {
    position: absolute;
    border: 1px dashed #409eff;
    background: rgba(64, 158, 255, 0.1);
    cursor: move;
    .resize-handle {
      position: absolute;
      right: -4px;
      bottom: -4px;
      width: 8px;
      height: 8px;
      background: #409eff;
      cursor: nwse-resize;
    }

  }
}




</style>