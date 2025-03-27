<template>
  <div class="main-container">
<!--    <div class="components-container">-->
<!--      <div class="component-palette">-->
<!--        <div-->
<!--            class="component-item"-->
<!--            draggable="true"-->
<!--            @dragstart="handleDragStart('text')"-->
<!--        >-->
<!--          📝 文本组件-->
<!--        </div>-->
<!--        <div-->
<!--            class="component-item"-->
<!--            draggable="true"-->
<!--            @dragstart="handleDragStart('image')"-->
<!--        >-->
<!--          🖼️ 图片组件-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <div class="grid-layout-container">
      <grid-layout
          :layout="layout"
          :col-num="12"
          :row-height="30"
          :is-draggable="true"
          :is-resizable="true"
          :is-mirrored="false"
          :vertical-compact="true"
          :margin="[10, 10]"
          :use-css-transforms="true"
      >
        <grid-item
            class="grid-item"
            v-for="item in layout"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :key="item.i"
        >
          {{ item.i }}
        </grid-item>
      </grid-layout>
    </div>
  </div>

</template>

<script setup>
import {ref, reactive, onMounted} from "vue";
const draggable = ref(true);
const resizable = ref(true);
const colNum = ref(12);
const index = ref(0);
const layout = reactive([
])
onMounted(() => {
  index.value = layout.length
})

const addItem = (item) => {
  layout.push({
    ...item,
    i: index.value.toString()
  });
}
// const layout = reactive([
//   {x: 0, y: 0, w: 2, h: 2, i: "0"},
//   {x: 2, y: 0, w: 2, h: 4, i: "1"},
//   {x: 4, y: 0, w: 2, h: 5, i: "2"},
//   {x: 6, y: 0, w: 2, h: 3, i: "3"},
//   {x: 8, y: 0, w: 2, h: 3, i: "4"},
//   {x: 10, y: 0, w: 2, h: 3, i: "5"},
//   {x: 0, y: 5, w: 2, h: 5, i: "6"},
//   {x: 2, y: 5, w: 2, h: 5, i: "7"},
//   {x: 4, y: 5, w: 2, h: 5, i: "8"},
//   {x: 6, y: 3, w: 2, h: 4, i: "9"},
//   {x: 8, y: 4, w: 2, h: 4, i: "10"},
//   {x: 10, y: 4, w: 2, h: 4, i: "11"},
//   {x: 0, y: 10, w: 2, h: 5, i: "12"},
//   {x: 2, y: 10, w: 2, h: 5, i: "13"},
//   {x: 4, y: 8, w: 2, h: 4, i: "14"},
//   {x: 6, y: 8, w: 2, h: 4, i: "15"},
//   {x: 8, y: 10, w: 2, h: 5, i: "16"},
//   {x: 10, y: 4, w: 2, h: 2, i: "17"},
//   {x: 0, y: 9, w: 2, h: 3, i: "18"},
//   {x: 2, y: 6, w: 2, h: 2, i: "19"}
// ]);

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

const handleDragStart = (type) => (e) => {
  e.dataTransfer.setData('text/plain', type);
  e.dataTransfer.effectAllowed = 'move';
};

</script>




<style lang="less" scoped>
.main-container{
  display: flex;
  //flex-direction: column;
  height: 100vh;


  .components-container {
    height: 100vh;
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

  }

  .grid-layout-container {
    flex: 1;
    background: #fff;
    min-height: 100vh;

    .grid-item {
      display: flex;
      align-items: center;
      justify-content: center;
      border: solid #ccc 1px;
      background-color: #ccc;
    }

    .widget {
      height: 100%;
      padding: 10px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  }
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}


</style>
