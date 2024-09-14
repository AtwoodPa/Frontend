<template>
  <RenderComponent
    v-for="(renderFunction, key) in renderFunctionMap"
    :key="key"
    :renderFunction="renderFunction"
  />
</template>
<script>
import { bindHandler } from "../content-scripts/handlerLoader.ts";
import publication from "../publication.js";
import RenderComponent from "../content-scripts/RenderComponent.vue";
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
    bindHandler(this, true);
  },
};
</script>
