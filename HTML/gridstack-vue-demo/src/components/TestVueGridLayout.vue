<template>
  <div id="app">
    <grid-layout
        :layout.sync="layout"
        :col-num="12"
        :row-height="30"
        :is-draggable="true"
        :is-resizable="true"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
    >

      <grid-item v-for="item in layout"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
                 :key="item.i">
        {{item.i}}
      </grid-item>
    </grid-layout>

<!--    <grid-layout-->
<!--        :layout="layout"-->
<!--        :cols="12"-->
<!--        :rowHeight="30"-->
<!--        :isDraggable="true"-->
<!--        :isResizable="true"-->
<!--    >-->
<!--      <div v-for="item in layout" :key="item.i">-->
<!--        <component :is="item.component" :config="item.config" />-->
<!--      </div>-->
<!--    </grid-layout>-->

  </div>
</template>

<script>

import TextComponent from './customs/TextComponent.vue';
import ImageComponent from './customs/ImageComponent.vue';
import CustomComponent from './customs/CustomComponent.vue';

export default {
  name: 'App',
  components: {
    TextComponent,
    ImageComponent,
    CustomComponent
  },
  data() {
    return {
      layout: [
        { "x": 0, "y": 0, "w": 2, "h": 2, "i": "0" },
        { "x": 2, "y": 0, "w": 2, "h": 4, "i": "1" },
        { "x": 4, "y": 0, "w": 2, "h": 5, "i": "2" },
        { "x": 6, "y": 0, "w": 2, "h": 3, "i": "3" },
        { "x": 8, "y": 0, "w": 2, "h": 3, "i": "4" },
        { "x": 10, "y": 0, "w": 2, "h": 3, "i": "5" },
        { "x": 0, "y": 5, "w": 2, "h": 5, "i": "6" },
        { "x": 2, "y": 5, "w": 2, "h": 5, "i": "7" },
        { "x": 4, "y": 5, "w": 2, "h": 5, "i": "8" },
        { "x": 6, "y": 3, "w": 2, "h": 4, "i": "9" },
        { "x": 8, "y": 4, "w": 2, "h": 4, "i": "10" },
        { "x": 10, "y": 4, "w": 2, "h": 4, "i": "11" },
        { "x": 0, "y": 10, "w": 2, "h": 5, "i": "12" },
        { "x": 2, "y": 10, "w": 2, "h": 5, "i": "13" },
        { "x": 4, "y": 8, "w": 2, "h": 4, "i": "14" },
        { "x": 6, "y": 8, "w": 2, "h": 4, "i": "15" },
        { "x": 8, "y": 10, "w": 2, "h": 5, "i": "16" },
        { "x": 10, "y": 4, "w": 2, "h": 2, "i": "17" },
        { "x": 0, "y": 9, "w": 2, "h": 3, "i": "18" },
        { "x": 2, "y": 6, "w": 2, "h": 2, "i": "19" }
        // { i: '1', x: 0, y: 0, w: 3, h: 2, component: 'TextComponent', config: { text: '这是一个文本组件' } },
        // { i: '2', x: 3, y: 0, w: 3, h: 2, component: 'ImageComponent', config: { src: 'https://dummyimage.com/300x200/ff0000/ffffff' } },
        // { i: '3', x: 6, y: 0, w: 3, h: 2, component: 'CustomComponent', config: { message: '自定义组件消息' } }
      ]
    };
  }
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.gridItem {
  border: solid black 1px;
  background-color: #CCCCCC;
}
</style>