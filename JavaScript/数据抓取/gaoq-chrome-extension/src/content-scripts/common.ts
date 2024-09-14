import { createApp, resolveComponent, h, ref, reactive, Teleport, Suspense, toRaw, computed } from "vue";
import ViewUIPlus from 'view-ui-plus'
// import { createPinia } from 'pinia'
// import api from './api'
import App from "./Common.vue";
import "../assets/viewuiplus.css";
import ajax from '~/api/ajax'
import { bus } from "./bus";
import { makeSureLoad } from "./helper";
import jss from 'jss'
import preset from 'jss-preset-default'
// One time setup with default plugins and settings.
jss.setup(preset())
makeSureLoad(function () {
  const el = document.querySelector('body');
  if (el) {
    el.insertAdjacentHTML(
      'afterend',
      '<div id="crx-app" class="animate__lightSpeedInRight"></div>',
    );
    const app = createApp(App)
    app.config.globalProperties.$ajax = ajax;
    app.config.globalProperties.$bus = bus;
    app.config.globalProperties.$resolveComponent = resolveComponent;
    app.config.globalProperties.$h = h;
    app.config.globalProperties.$computed = computed;
    app.config.globalProperties.$ref = ref;
    app.config.globalProperties.$toRaw = toRaw;
    app.config.globalProperties.$reactive = reactive;
    app.config.globalProperties.$Teleport = Teleport;
    app.config.globalProperties.$Suspense = Suspense;
    app.config.globalProperties.$jss = jss;
    app
      // .use(createPinia())
      .use(ViewUIPlus)
      .mount('#crx-app');
  }
})