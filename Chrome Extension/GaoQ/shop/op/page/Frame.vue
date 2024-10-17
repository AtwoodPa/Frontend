<template>
  <div class="ivu-modal-header modal-header frame">
    <div class="ivu-modal-header-inner">
      {{ title }}
    </div>
    <div class="frame-top">
      <!-- <Button type="text" v-if="interpolate" @click="interpolateShow">内推</Button> -->
      <Button type="text" v-if="canShare" @click="shareLink">共享链接</Button>
    </div>
  </div>
  <div class="modal-body">
    <component :is="component" ref="body" :target="target" />
  </div>
</template>
<script>
import {
  getCurrentInstance,
  toRefs,
  onUnmounted,
  onMounted,
  ref,
  reactive,
  defineAsyncComponent,
} from "vue";
import { useRoute } from "vue-router";

const UpdateBrand = defineAsyncComponent(() =>
  import("@/pc/business/brand/Update")
);
const UpdateGroupGoods = defineAsyncComponent(() =>
  import("@/pc/business/group-goods/Update")
);
const WorkTodoUpdate = defineAsyncComponent(() =>
  import("@/pc/business/work-order-line/WorkTodoUpdate")
);
const WorkOrderLineUpdate = defineAsyncComponent(() =>
  import("@/pc/business/work-order-line/WorkOrderLineUpdate")
);
const PgyExclude = defineAsyncComponent(() =>
  import("@/pc/business/clue/pgy-invite/Exclude")
);
const GroupGoodsImport = defineAsyncComponent(() =>
  import("@/pc/business/group-goods-import/Index")
);
const UpdateGroupGoodsImport = defineAsyncComponent(() =>
  import("@/pc/business/group-goods-import/Update")
);
const ExtensionPatch = defineAsyncComponent(() =>
  import("@/pc/business/group-goods/ExtensionPatch")
);
const ExtensionSpider = defineAsyncComponent(() =>
  import("@/pc/business/extension/BatchSpider")
);
const ShopExtensionSpider = defineAsyncComponent(() =>
    import("@/pc/business/extension/shop/ShopBatchSpider")
);
const EchoSuggestion = defineAsyncComponent(() =>
  import("@/pc/business/topic/EchoSuggestion")
);
const UpdateResource = defineAsyncComponent(() =>
  import("@/pc/business/resource/Update")
);
const CardVerification = defineAsyncComponent(() =>
  import("@/pc/business/card-verification/Index")
);
const UpdateShop = defineAsyncComponent(() =>
  import("@/pc/business/shop/Update")
);
const Shop = defineAsyncComponent(() => import("@/pc/business/shop/Index"));
const ManagerTree = defineAsyncComponent(() =>
  import("@/pc/business/member/ManagerTree")
);
const ListResource = defineAsyncComponent(() =>
  import("@/pc/business/resource/List")
);
const UpdatePlatform = defineAsyncComponent(() =>
  import("@/pc/business/platform/Update")
);
const InquiryHistory = defineAsyncComponent(() =>
  import("@/pc/business/inquiry/ListOfProjectResource")
);
const PrivateSearch = defineAsyncComponent(() =>
  import("@/pc/business/finance/PrivateSearch")
);
const CorporateSearch = defineAsyncComponent(() =>
  import("@/pc/business/finance/CorporateSearch")
);
const CorporateHistory = defineAsyncComponent(() =>
  import("@/pc/business/finance/CorporateHistory")
);
const CorporateCy = defineAsyncComponent(() =>
  import("@/pc/business/finance/CorporateCy")
);
const PrivateCy = defineAsyncComponent(() =>
  import("@/pc/business/finance/PrivateCy")
);

const OrderNo = defineAsyncComponent(() =>
  import("@/pc/business/order-no/Index")
);
const TestEnter = defineAsyncComponent(() =>
  import("@/pc/business/order-no/TestEnter")
);
const UpdateProject = defineAsyncComponent(() =>
  import("@/pc/business/project/Update")
);
const UpdateProjectReserve = defineAsyncComponent(() =>
  import("@/pc/business/project-reserve/Update")
);
const UpdateGroupTeam = defineAsyncComponent(() =>
  import("@/pc/business/group-team/Update")
);
const UpdateGroupList = defineAsyncComponent(() =>
  import("@/pc/business/group-list/Update")
);
const UpdateGroupSpread = defineAsyncComponent(() =>
  import("@/pc/business/group-spread/Update")
);
const PublicTopic = defineAsyncComponent(() =>
  import("@/pc/business/topic/Common")
);
const UpdateFlash = defineAsyncComponent(() =>
  import("@/pc/business/flash/Update")
);
const UpdateAssign = defineAsyncComponent(() =>
  import("@/pc/business/exec/Update")
);
const UpdateReplay = defineAsyncComponent(() =>
  import("@/pc/business/replay/Update")
);
const UpdateAudit = defineAsyncComponent(() =>
  import("@/pc/business/replay/AuditUpdate")
);
const SignClaim = defineAsyncComponent(() =>
  import("@/pc/business/sign/Claim")
);
const UpdateChannel = defineAsyncComponent(() =>
  import("@/pc/business/channel/Update")
);
const UpdateList = defineAsyncComponent(() =>
  import("@/pc/business/team/Update")
);
const DownExcel = defineAsyncComponent(() =>
  import("@/pc/business/excel/Down")
);
const UpdateOption = defineAsyncComponent(() =>
  import("@/pc/business/option/Index")
);
const DouYinData = defineAsyncComponent(() =>
  import("@/pc/business/group-account/DouYinData")
);
const CheckAccount = defineAsyncComponent(() =>
  import("@/pc/business/group-account/Check")
);

const AllianceData = defineAsyncComponent(() =>
  import("@/pc/business/group-jinritemai/AllianceData")
);

const InGroupStock = defineAsyncComponent(() =>
  import("@/pc/business/group-stock/StockIn")
);

const UpdateExtension = defineAsyncComponent(() =>
  import("@/pc/business/extension/Update")
);
const AuditExtension = defineAsyncComponent(() =>
  import("@/pc/business/extension/Audit")
);
const DouYinVideoData = defineAsyncComponent(() =>
  import("@/pc/business/group-account/DouYinVideoData")
);

const BuyinKolMaterialsProductsSearch = defineAsyncComponent(() =>
  import("@/pc/business/group-jinritemai/MaterialsProductsSearch")
);

const ColonelActivityProduct = defineAsyncComponent(() =>
  import("@/pc/business/group-jinritemai/ColonelActivityProduct")
);

const ClaimOfMember = defineAsyncComponent(() =>
  import("@/pc/business/sign/ClaimOfMember")
);

const ProcessOfMember = defineAsyncComponent(() =>
  import("@/pc/business/sign/ProcessOfMember")
);

const InnerPushList = defineAsyncComponent(() =>
  import("@/pc/business/inquiry/InnerPushList")
);
const SignInnerPushDetail = defineAsyncComponent(() =>
  import("@/pc/business/sign/InnerPushDetail")
);

const PointDetail = defineAsyncComponent(() =>
  import("@/pc/business/point/PointDetail")
);

const ExtensionImport = defineAsyncComponent(() =>
  import("@/pc/business/extension/Import")
);

const OrderList = defineAsyncComponent(() =>
  import("@/pc/business/group-order/OrderList")
);
const MonthGradientPoint = defineAsyncComponent(() =>
  import("@/pc/business/gmv/MonthGradientPoint.vue")
);

const MonthGradientOrder = defineAsyncComponent(() =>
  import("@/pc/business/gmv/MonthGradientOrder.vue")
);

const LivePointDetail = defineAsyncComponent(() =>
  import("@/pc/business/gmv/LivePointDetail.vue")
);

const AssignPricing = defineAsyncComponent(() =>
  import("@/pc/business/exec/AssignPricing.vue")
);

const GmvPoint = defineAsyncComponent(() =>
  import("@/pc/business/gmv/PointDetail")
);

const CardAudit = defineAsyncComponent(() =>
  import("@/pc/business/card/CardAudit")
);
const WorkOrderAbutment = defineAsyncComponent(() =>
  import("@/pc/business/work-order/WorkOrderAbutment")
);
const WorkOrderReserve = defineAsyncComponent(() =>
  import("@/pc/business/work-order/WorkOrderReserve")
);

const AutoGradPlus = defineAsyncComponent(() =>
  import("@/pc/business/card-verification/autoGradPlus")
);
const BusinessGradeRecord = defineAsyncComponent(() =>
  import("@/pc/business/record/BusinessGradeRecord")
);

const DelayScore = defineAsyncComponent(() =>
  import("@/pc/business/score/DelayScore")
);

const ExecProjectAccount = defineAsyncComponent(() =>
  import("@/pc/business/exec/ExecProjectAccount")
);
const FullContractExec = defineAsyncComponent(() =>
  import("@/pc/business/exec/FullContractExec")
);
const KocApply = defineAsyncComponent(() =>
  import("@/pc/business/inquiry/KocApply")
);
const Project = defineAsyncComponent(() =>
  import("@/pc/business/project/Index")
);
const BusinessBelongYwx = defineAsyncComponent(() =>
  import("@/pc/business/team-follow-brand/BusinessBelongYwx")
);

// const GroupInquiry = defineAsyncComponent(() =>
//     import("@/pc/business/group-inquiry/List")
// );
// const Cpe = () => import("@/index/resource/cpe");
export default {
  components: {
    UpdateBrand,
    // GroupInquiry,
    DownExcel,
    ExtensionImport,
    UpdateFlash,
    WorkTodoUpdate,
    WorkOrderLineUpdate,
    UpdateOption,
    PrivateCy,
    OrderNo,
    UpdateShop,
    Shop,
    TestEnter,
    UpdateGroupGoodsImport,
    AssignPricing,
    OrderList,
    MonthGradientPoint,
    MonthGradientOrder,
    LivePointDetail,
    InGroupStock,
    DouYinData,
    AutoGradPlus,
    CardVerification,
    BusinessGradeRecord,
    PointDetail,
    DouYinVideoData,
    CorporateCy,
    EchoSuggestion,
    InquiryHistory,
    PgyExclude,
    UpdateResource,
    ListResource,
    UpdateAssign,
    UpdateExtension,
    AuditExtension,
    UpdateProject,
    UpdateProjectReserve,
    PublicTopic,
    UpdateReplay,
    UpdatePlatform,
    UpdateAudit,
    SignClaim,
    PrivateSearch,
    AllianceData,
    ManagerTree,
    UpdateGroupGoods,
    ExtensionPatch,
    ExtensionSpider,
    ShopExtensionSpider,
    UpdateGroupList,
    CheckAccount,
    UpdateGroupTeam,
    CorporateSearch,
    CorporateHistory,
    BuyinKolMaterialsProductsSearch,
    UpdateChannel,
    UpdateList,
    ColonelActivityProduct,
    UpdateGroupSpread,
    ClaimOfMember,
    GmvPoint,
    ProcessOfMember,
    InnerPushList,
    GroupGoodsImport,
    SignInnerPushDetail,
    CardAudit,
    WorkOrderAbutment,
    WorkOrderReserve,
    DelayScore,
    ExecProjectAccount,
    FullContractExec,
    Project,
    KocApply,
    BusinessBelongYwx,
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const route = useRoute();
    const componentRef = ref(null);
    const form = reactive({
      show: false,
      canShare: false,
      // interpolate: false,
      component: "",
      target: null,
      title: "",
    });
    async function parse() {
      let isFirstOne = true;
      let pack;
      if (route.name == "UpdateProject") {
        pack = {
          component: "UpdateProject",
          title: "查看项目(" + route.query.pid + ")",
          target: {
            id: route.query.pid,
            activeName: "inquiry",
            condition: {
              key: route.query.rid,
            },
          },
        };
      } else if (route.query.s) {
        pack = proxy.$api.storage.get(route.query.s);
        if (!pack) {
          isFirstOne = false;
          let { code, data } = await proxy.$api.redis.get(route.query.s);
          if (data) {
            pack = JSON.parse(data);
          }
        }
      }
      if (pack) {
        let { component, target, title } = pack;
        form.component = component;
        form.target = target;
        form.title = title;
        form.canShare = isFirstOne && ["UpdateResource"].includes(component);
        // form.interpolate = isFirstOne && ["UpdateResource"].includes(component);
        document.title = title;
        document.querySelector("#app").setAttribute("component", component);
      } else {
        proxy._jump({ name: "Exception", query: { type: "404" } });
      }
    }
    parse();
    onMounted(function () {
      form.show = true;
    });
    onUnmounted(function () {
      document.querySelector("#app").removeAttribute("component");
    });
    async function shareLink() {
      let { code } = await proxy.$api.redis.set(
        route.query.s,
        JSON.stringify(pack)
      );
      if (code === 0) {
        proxy._copy(window.location.href);
      }
    }
    function interpolateShow() {
      // console.log("refs", proxy.$refs.body);
      // proxy._emit("interpolate-drawer", proxy.$refs.body);

      proxy._emit("interpolate-drawer", form.target);
    }
    // window.addEventListener("beforeunload", function () {
    //   proxy.$api.storage.delete(route.query.s);
    //   return 1;
    // });
    return {
      componentRef,
      interpolateShow,
      shareLink,
      ...toRefs(form),
    };
  },
};
</script>
<style lang="less">
@import "~/vp/TModalInner";

#app[page="Frame"] {
  background-color: #fff;
  overflow: hidden;
  background-clip: padding-box;
  display: flex;
  flex-direction: column;
  .frame {
    height: 48px;
  }
  .frame-top {
    position: fixed;
    right: 7px;
    top: 7px;
    display: flex;
    background: white;
    flex-direction: row-reverse;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
  }
}
</style>
