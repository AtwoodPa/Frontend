<template v-if="tabId">
  <RenderComponent
    v-for="(renderFunction, key) in renderFunctionMap"
    :key="key"
    :renderFunction="renderFunction"
  />
</template>
<script>
import { appMousedown } from "./helper.ts";
import { bindHandler } from "./handlerLoader.ts";
import publication from "../publication.js";
import RenderComponent from "./RenderComponent.vue";
const src = chrome.runtime.getURL("./assets/icons/logo.png");
export default {
  components: {
    RenderComponent,
  },
  data() {
    return {
      publication,
      src,
      renderFunctionMap: {},
    };
  },
  created() {
    bindHandler(this);
  },
  mounted() {
    const app = document.querySelector("#crx-app");
    app.addEventListener("mousedown", appMousedown);
  },
  unmounted() {
    const app = document.querySelector("#crx-app");
    app.removeEventListener("mousedown", appMousedown);
    if (this.it) {
      clearTimeout(this.it);
    }
  },
};
</script>

<style lang="less">
#crx-app {
  cursor: pointer;
  position: fixed;
  font-size: 14px;
  right: 15px;
  width: 250px;
  top: 66px;
  z-index: 1000;
}
@keyframes lightSpeedInRight {
  from {
    transform: translate3d(100%, 0, 0) skewX(-30deg);
    opacity: 0;
  }

  60% {
    transform: skewX(20deg);
    opacity: 1;
  }

  80% {
    transform: skewX(-5deg);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}
.animate__lightSpeedInRight {
  animation-name: lightSpeedInRight;
  animation-timing-function: ease-out;
  animation-duration: 1s;
}
</style>
