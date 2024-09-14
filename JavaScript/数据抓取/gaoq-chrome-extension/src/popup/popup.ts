import { createApp, resolveComponent, h, ref, reactive, Teleport, Suspense, toRaw, computed } from "vue";
import ViewUIPlus from 'view-ui-plus'
import App from './Popup.vue'
import "../assets/viewuiplus.css";
import ajax from '~/api/ajax'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())
const app = createApp(App);
app.config.globalProperties.$ajx = ajax;
app.config.globalProperties.$resolveComponent = resolveComponent;
app.config.globalProperties.$h = h;
app.config.globalProperties.$ref = ref;
app.config.globalProperties.$computed = computed;
app.config.globalProperties.$toRaw = toRaw;
app.config.globalProperties.$reactive = reactive;
app.config.globalProperties.$Teleport = Teleport;
app.config.globalProperties.$Suspense = Suspense;
app.config.globalProperties.$jss = jss;

app
    .use(ViewUIPlus)
    .mount('#app')
