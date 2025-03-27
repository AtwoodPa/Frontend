<template>
  <div class="container">
    <!-- 组件库 -->
    <div class="component-palette">
      <div
          class="component-item"
          draggable="true"
          @dragstart="handleDragStart('text')"
      >
        📝 文本组件
      </div>
      <div
          class="component-item"
          draggable="true"
          @dragstart="handleDragStart('image')"
      >
        🖼️ 图片组件
      </div>
    </div>

    <!-- 网格容器 -->
    <grid-stack
        ref="gridStackRef"
        @resizedstop="onChange"
        @movestop="onChange"
    >
      <grid-stack-item
          v-for="(item, index) in gridItems"
          :key="item.id"
          :id="item.id"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
      >
        <component
            :is="item.type === 'text' ? TextWidget : ImageWidget"
            :content="item.content"
            @remove="removeItem(item.id)"
            @update:content="item.content = $event"
        />
      </grid-stack-item>
    </grid-stack>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

// 文本组件
const TextWidget = {
  props: ['content'],
  emits: ['remove', 'update:content'],
  template: `
    <div class="widget text-widget">
      <div class="toolbar">
        <button @click="$emit('remove')">×</button>
      </div>
      <textarea
        v-model="text"
        @input="$emit('update:content', text)"
      ></textarea>
    </div>
  `,
  setup(props) {
    const text = ref(props.content || '编辑文本...');
    return { text };
  }
};

// 图片组件
const ImageWidget = {
  props: ['content'],
  emits: ['remove', 'update:content'],
  template: `
    <div class="widget image-widget">
      <div class="toolbar">
        <button @click="$emit('remove')">×</button>
      </div>
      <img :src="content" alt="图片" v-if="content">
      <input
        type="text"
        v-model="url"
        placeholder="输入图片URL"
        @input="$emit('update:content', url)"
      >
    </div>
  `,
  setup(props) {
    const url = ref(props.content || '');
    return { url };
  }
};

// 主组件逻辑
const gridStackRef = ref(null);
const gridItems = ref([]);
let grid = null;

onMounted(() => {
  grid = GridStack.init({
    acceptWidgets: true,
    float: true,
    removable: true,
    disableDrag: false,
    disableResize: false,
  }).on('dropped', (event, previousWidget, newWidget) => {
    const type = event?.element?.dataset?.type;
    if (type) {
      addItem({
        type,
        x: newWidget.x,
        y: newWidget.y,
        w: newWidget.width || 2,
        h: newWidget.height || 2,
        content: type === 'image' ? 'https://picsum.photos/200/150' : ''
      });
    }
  });
});

const handleDragStart = (type) => (e) => {
  e.dataTransfer.setData('text/plain', type);
  e.dataTransfer.effectAllowed = 'move';
};

const addItem = (item) => {
  gridItems.value.push({
    ...item,
    id: Date.now().toString()
  });
};

const removeItem = (id) => {
  gridItems.value = gridItems.value.filter(item => item.id !== id);
};

const onChange = () => {
  // 可以在这里保存布局状态
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.component-palette {
  width: 400px;
  padding: 20px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
}

.component-item {
  padding: 10px;
  margin: 10px 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: grab;
  user-select: none;
}

.component-item:active {
  cursor: grabbing;
}

.grid-stack {
  flex: 1;
  background: #fff;
  min-height: 100vh;
}

.widget {
  height: 100%;
  padding: 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.toolbar {
  text-align: right;
  margin-bottom: 5px;
}

.toolbar button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.text-widget textarea {
  width: 100%;
  height: calc(100% - 25px);
  resize: none;
  border: none;
  outline: none;
}

.image-widget img {
  width: 100%;
  height: calc(100% - 30px);
  object-fit: cover;
}

.image-widget input {
  width: 100%;
  margin-top: 5px;
}
</style>