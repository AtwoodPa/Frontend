<template>
  <div class="designer-container">
    <ComponentLibrary @drag-start="handleDragStart"/>
    <interactive-canvas
        :components="activeLayout"
        @component-move="handleComponentMove"
        @component-select="handleComponentSelect"
    />
    <property-panel
        :selected-component="selectedComponent"
        @style-change="handleStyleChange"
    />
    <div class="designer-toolbar">
      <button @click="undo" :disabled="!canUndo">撤销</button>
      <button @click="redo" :disabled="!canRedo">重做</button>
      <button @click="saveTemplate">保存</button>
      <button @click="togglePreview">预览</button>
    </div>
    <preview-modal v-if="showPreview" :layout="activeLayout" @close="showPreview = false"/>
  </div>
</template>

<script>
import ComponentLibrary from './component/ComponentLibrary.vue'
import InteractiveCanvas from "./component/InteractiveCanvas.vue";
import PropertyPanel from "./component/PropertyPanel.vue";
import PreviewModal from "./component/PreviewModal.vue";

export default {
  components: {
    ComponentLibrary,
    InteractiveCanvas,
    PropertyPanel,
    PreviewModal
  },
  data() {
    return {
      activeLayout: [],
      historyStack: [],
      currentHistoryIndex: -1,
      selectedComponent: null,
      showPreview: false
    }
  },
  computed: {
    canUndo() {
      return this.currentHistoryIndex > 0
    },
    canRedo() {
      return this.currentHistoryIndex < this.historyStack.length - 1
    }
  },
  methods: {
    deepClone(obj) {
      try {
        return JSON.parse(JSON.stringify(obj))
      } catch (e) {
        console.error('深拷贝失败:', e)
        return {}
      }
    },
    handleDragStart(componentType) {
      const newComponent = {
        id: `comp_${Date.now()}`,
        type: componentType,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 100 },
        styles: {}
      }
      this.activeLayout.push(newComponent)
      this.recordHistory()
    },
    handleComponentMove({ id, x, y }) {
      const component = this.activeLayout.find(c => c.id === id)
      if (component) {
        component.position = { x, y }
        this.recordHistory()
      }
    },
    handleComponentSelect(component) {
      this.selectedComponent = component
    },
    handleStyleChange(newStyles) {
      if (this.selectedComponent) {
        this.selectedComponent.styles = { ...this.selectedComponent.styles, ...newStyles }
        this.recordHistory()
      }
    },
    recordHistory() {
      this.historyStack = this.historyStack.slice(0, this.currentHistoryIndex + 1)
      this.historyStack.push(this.deepClone(this.activeLayout))
      this.currentHistoryIndex++
    },
    undo() {
      if (this.canUndo) {
        this.currentHistoryIndex--
        this.activeLayout = this.deepClone(this.historyStack[this.currentHistoryIndex])
      }
    },
    redo() {
      if (this.canRedo) {
        this.currentHistoryIndex++
        this.activeLayout = this.deepClone(this.historyStack[this.currentHistoryIndex])
      }
    },
    saveTemplate() {
      this.$emit('save', this.activeLayout)
    },
    togglePreview() {
      this.showPreview = !this.showPreview
    }
  }
}
</script>

<style lang="less" >
.designer-container {
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  height: 100vh;
  position: relative;
  .designer-toolbar {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    background: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
}


</style>