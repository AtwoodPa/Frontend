<template>
  <template v-if="tabId">
    <Card>
      <template #title>
        <img :src="src" class="gaoqu-extension" />
        <template v-if="signInUser">{{ signInUser.name }}</template>
        <span style="font-size: 11px">({{ publication }})</span>
      </template>
      <template #extra>
        <div @click="test">{{ tabId }}</div>
        <div v-if="signInUser" @click="signOut">
          <Icon type="md-exit" size="13" />登出
        </div>
        <a :href="href" target="_blank" v-else>
          <Icon type="md-contact" size="13" />登录
        </a>
      </template>
      <RenderComponent :renderFunction="cardFunction" v-if="cardFunction" />
    </Card>
    <Modal
      v-model="showBind"
      footer-hide
      width="205px"
      class-name="bind-code-modal"
    >
      <template #header> <Icon type="md-qr-scanner" />扫码登录 </template>
      <BindCode @bind-ok="onBindOk" v-if="showBind" />
    </Modal>
  </template>
  <RenderComponent :renderFunction="formFunction" v-if="formFunction" />
  <RenderComponent :renderFunction="infoFunction" v-if="infoFunction" />
  <RenderComponent :renderFunction="drawFunction" v-if="drawFunction" />
  <!-- <RenderComponent :renderFunction="placeholder1" v-if="placeholder1" />
  <RenderComponent :renderFunction="placeholder2" v-if="placeholder2" /> -->
  <!-- <RenderComponent :renderFunction="formFunction" v-if="formFunction" /> -->
  <!-- <template v-for="item in teleportList" :key="item.to">
    <Teleport :to="item.to">
      <RenderComponent :renderFunction="item.render" />
    </Teleport>
  </template> -->

  <!-- <Modal
    v-model="showBrand"
    draggable
    scrollable
    footer-hide
    :mask="mask"
    :width="width"
    class-name="common-view"
  >
    <template #header>{{ title }}</template>
    <Alert type="success">
      <template v-if="brand"> OP品牌名称/Id：{{ brand.name }}/{{ brand.id }} </template>
      <Spin fix v-else />
    </Alert>
    <Row :gutter="row.gutter" v-for="(row, i) in viewList" :align="row.align" :key="i">
      <Col
        :span="column.span"
        :offset="column.offset"
        :className="column.className || ''"
        v-for="(column, j) in row.subList"
        :key="j"
        v-html="column.html"
      >
      </Col>
    </Row>
    <Poptip
      confirm
      title="确定要绑定op中的品牌吗"
      @on-ok="keySubmit('绑定品牌')"
      ok-text="确定"
      cancel-text="取消"
      class="submit"
    >
      <Button type="primary" long :loading="bindingBrand">绑定品牌</Button>
    </Poptip>
  </Modal>

  <Modal
    v-model="showBindingBy"
    draggable
    scrollable
    footer-hide
    :mask="mask"
    :width="width"
    class-name="common-view"
  >
    <template #header>{{ title }}</template>
    <Alert type="success">
      <template v-if="resource">
        资源名称/Id：{{ resource.name }}/{{ resource.id }}
      </template>
      <Spin fix v-else />
    </Alert>
    <Row :gutter="row.gutter" v-for="(row, i) in viewList" :align="row.align" :key="i">
      <Col
        :span="column.span"
        :offset="column.offset"
        v-for="(column, j) in row.subList"
        :className="column.className || ''"
        :key="j"
        v-html="column.html"
      >
      </Col>
    </Row>
    <Poptip
      confirm
      title="确定要绑定op中的资源吗"
      @on-ok="keySubmit('绑定百应资源')"
      ok-text="确定"
      cancel-text="取消"
      class="submit"
    >
      <Button type="primary" long :loading="bindingBy">绑定百应资源</Button>
    </Poptip>
  </Modal>
  <Teleport v-if="teleportList" :to="teleportTo">
    <template v-for="teleport in teleportList" :key="teleport.label">
      <template v-if="teleport.type == 'img'">
        <span class="label">{{ teleport.label }}</span>
        <Image
          :src="teleport.src"
          @click="handleShowPreview(teleport.src)"
          :style="teleport.style"
        />
      </template>
      <template v-else-if="teleport.type == 'button'">
        <Button :style="teleport.style" @click="teleport.cb">{{ teleport.value }}</Button>
      </template>
      <template v-else>
        <span class="label">{{ teleport.label }}</span>
        <span class="item" :style="teleport.style">
          {{ teleport.value }}
        </span>
      </template>
    </template>
  </Teleport> -->
</template>
<script>
import userStore from "./store/index.ts";
import { mapActions, mapState, mapStores } from "pinia";
import BindCode from "./BindCode.vue";
import { appMousedown } from "./helper.ts";
import { bindHandler } from "./handlerLoader.ts";
const src = chrome.runtime.getURL("./assets/icons/logo.png");
import publication from "../publication.js";
import RenderComponent from "./RenderComponent.vue";
console.log("publication", publication);
export default {
  components: {
    BindCode,
    RenderComponent,
  },
  data() {
    return {
      publication,
      src,
      cardFunction: null,
      formFunction: null,
      infoFunction: null,
      tabId: "",
    };
  },
  computed: {
    ...mapStores(userStore),
    ...mapState(userStore, ["signInUser"]),
    href() {
      if (import.meta.env.MODE !== "development") {
        return "http://op.gaoq.com/";
      } else {
      }
    },
  },
  created() {
    bindHandler(this);
    // this.prepareUser();
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
  methods: {
    ...mapActions(userStore, ["signIn", "signOut"]),
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
  .ivu-card-head {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .ivu-card-body {
    padding: 0;
  }
  .ivu-card-extra {
    color: green;
    font-size: 12px;
    top: 16px;
  }
  .active {
    color: #2db7f5;
  }
  .gaoqu-extension {
    display: inline-block;
    user-select: none;
    width: 16px;
    transform: scale(1.5);
    position: relative;
    left: -8px;
    -webkit-user-drag: none;
  }
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
.bind-code-modal {
  .ivu-modal-body {
    padding: 5px;
  }
}
</style>
