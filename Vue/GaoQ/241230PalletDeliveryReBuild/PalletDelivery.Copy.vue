<template>
  <div class="pallet-delivery region">
    <div class="wrapper">
      <div class="search" v-if="isSharedMode? authenticated && isSharedMode: true ">
        <div class="item" v-if="!isSharedMode">
          <span class="label">商品ID</span>
          <Input
              v-model="condition.productId"
              placeholder="请输入商品ID"
              @on-enter="doSearch(1)"
              clearable
          ></Input>
        </div>
        <div class="item" v-if="isSharedMode? authenticated && isSharedMode: true ">
          <span class="label">商品名称</span>
          <Input
              v-model="condition.productName"
              placeholder="商品名称"
              @on-enter="doSearch(1)"
              clearable
          ></Input>
        </div>
        <!--    v-if="!isSharedMode" 外链模式    -->
        <div class="item" v-if="!isSharedMode">
          <span class="label">店铺名称</span>
          <Input
              v-model="condition.shopName"
              placeholder="商品名称"
              @on-enter="doSearch(1)"
              clearable
          ></Input>
        </div>
        <div class="item" v-if="!isSharedMode">
          <span class="label">交付状态</span>
          <Select v-model="condition.statusList" multiple style="width:200px">
            <Option v-for="item in deliveryStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <Button
            type="primary"
            shape="circle"
            icon="ios-search"
            class="search-btn"
            @click="doSearch(1)"
        ></Button>
      </div>
      <div class="opts">
        <Button
            v-if="!isSharedMode"
            :loading="downloading"
            icon="ios-list-box-outline"
            type="warning" shape="circle"
            @click="openTaskWorkDrawer">作业工单</Button>
        <Button
            v-if="!isSharedMode"
            :loading="downloading"
            icon="ios-download-outline"
            type="success" shape="circle"
            @click="exportData">导出货盘</Button>
        <Button
            v-if="!isSharedMode"
            :loading="uploading"
            icon="ios-cloud-upload-outline"
            type="primary"
            shape="circle"
            @click="importExcel">填充货盘</Button>
        <Button
            v-if="!isSharedMode"
            icon="ios-share-outline"
            type="info"
            shape="circle"
            @click="showShareModal">分享货盘</Button>
      </div>
    </div>
    <PageTable
        v-if="isSharedMode? authenticated && isSharedMode: true "
        :columns="columns"
        :data="data"
        :loading="loading"
        @on-change="doSearch"
        @on-selection-change="handleSelectionChange"
        ref="table">
    </PageTable>
    <Modal
        v-if="!authenticated && isSharedMode"
        title="请输入密码"
        v-model="showPasswordModal"
        :mask-closable="false"
        :closable="false"
        @on-ok="verifyPassword"
    >
      <Input
          v-model="password"
          type="password"
          password
          placeholder="请输入访问密码"
          style="margin-bottom: 20px"
      />
    </Modal>

    <Modal v-model="shareModalVisible" title="分享货盘" @on-ok="generateShareLink" width="600">
      <div class="inner-form">
        <div>
          <span>选择店铺: </span>
          <Select v-model="selectedShop" style="margin-left: 20px" placeholder="请选择外链店铺信息" filterable>
            <Option v-for="shop in shopList" :value="shop._id" :key="shop._id" >
              <div class="shop-item">
                <span>{{ shop.shop_name }}</span>-<span class="shop-id" :title="shop._id">{{ shop._id.substring(0, 10) }}...</span>
              </div>
            </Option>
          </Select>
        </div>
        <div style="margin-top: 10px">
          <span>外链有效期: </span>
          <Select v-model="shareDays" style="margin-left: 5px">
            <Option :value="7">7天</Option>
            <Option :value="30">30天</Option>
            <Option :value="90">90天</Option>
          </Select>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script >
import ColumnFactory from "./js/column-factory";
import SortGroup from "pc/component/draggable/SortGroup.vue";
import PageTable from "~/vp/PageTable.vue";
import BusKeySelect from "pc/component/select/BusKeySelect.vue";
import Frame from "@/pc/page/frame-open";
import {Ellipsis} from "view-ui-plus";
export default {
  components: {Ellipsis, BusKeySelect, SortGroup, PageTable},
  props: {
    teleport: {
      type: String,
    },
    target: {
      type: Object,
      required: true
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  created() {
    // 检查是否为外链访问
    const uuid = this.$route.params.uuid
    if (uuid){// 外链模式
      this.isSharedMode = true;
      this.columns = ColumnFactory(this, { forPalletDeliveryOutLink: true });
      this.uuid = uuid;
      this.loadSharedData();
    }else {// 正常模式
      this.columns = ColumnFactory(this, { forPalletDelivery: true });
      this.doSearch();
    }
  },
  data() {
    return {
      columns: [],
      data: [],
      condition: {},
      selections: [],
      deliveryStatus:[
        {
          value: 1,
          label: '寄样中'
        },
        {
          value: 2,
          label: '待出单'
        },
        {
          value: 3,
          label: '合作完成'
        },
      ],
      loading: false,
      page: { current: 1, size: 10 },
      downloading: false,
      uploading: false, // excel导入
      showBackToTop: false,
      shopMap: {},
      shopList: {},
      goodsMap:{},
      shareModalVisible: false,
      uuid: null,
      shareDays: 7, // 外链有效期: 默认7天
      shareLink: '',
      selectedShop: null,
      isSharedMode: false, // 外链展示内容
      saltKeyValue: '', // 加密盐值 pid:xxx_sid:xxx （项目id_店铺id）
      authenticated: false, // 是否已验证
      showPasswordModal: true,
      password: "",
      liveProjectId: null,
      shopId: null,
      resourceId: null,
      resourceName: null,
    }
  },
  methods: {
    openTaskWorkDrawer(){
      this._emit("deliveryTaskWork-drawer",{
        deliveryList: this.data, // 货盘列表数据
      })
    },
    async verifyPassword() {
      this.loading = true;
      console.log(this.password);
      const { data } =await this.$api.liveProject.verifyPassword( {
        saltKeyValue: this.saltKeyValue,
        password: this.password,
      });
      this.loading = false;

      if (data.success) {
        this.authenticated = true;
        this.liveProjectId = data.projectId;
        this.shopId = data.shopId;
        await this.doSearch()
      } else {
        this.showPasswordModal = true;
        this.$Message.error("密码验证失败！");
      }
    },
    async loadSharedData() {
      this.loading = true;
      try {
        const resp = await this.$api.liveProject.getProjectFromCache(this.uuid)
        if (resp.data.success) {
          this.saltKeyValue = resp.data.saltKeyValue;
          this.$Message.success('加载成功');
        }

      } catch (error) {
        this._messageError('数据加载失败');
      } finally {
        this.loading = false;
      }
    },
    async generateShareLink(){
      if (!this.selectedShop.length) {
        this.$Message.warning('请至少选择一个店铺');
        return;
      }
      try{
        const params = {
          projectId: this.target.id,
          projectName: this.target.liveProjectName,
          resourceId: this.target.resource.id,
          resourceName: this.target.resource.name,
          shopId: this.selectedShop,// shop._id
          expireDays: this.shareDays,// 外链有效期
        }
        const resp = await this.$api.liveProject.generateLink(params);
        if (resp.data.success){
          let { link, password } = resp.data;
          this.shareLink = link;
          this.password = password;
          await this.handleCopy()
        }
      }catch (error){
        this._messageError('生成外链失败');
      }

    },
    async handleCopy(){
      const copyText = this.generateCopyText();
      try {
        await this._copy(copyText)
      } catch (err) {
        this.Message.error('复制失败，请手动复制',err);
      }
    },
    generateCopyText() {
      const parts = [
        // 项目名称
        `项目名称：${this.target.liveProjectName || '暂无项目名称'}`,
        // 达人名称
        `达人名称：${this.target.resource.name || '暂无达人名称'}`,
        // 外链地址
        `外链地址：${this.shareLink || '暂无外链地址'}`,
        // 访问密码
        `访问密码：${this.password || '暂无卖点'}`,
        // 外链有效期
        `外链有效期：${this.shareDays}天`
      ];
      return parts.join('\n');
    },
    showShareModal() {
      this.shareModalVisible = true;
      this.shareLink = '';
    },
    importExcel(){
      this._emit('deliverExcelImport-drawer',{
        liveProjectId: this.target.id,
      });
    },
    async exportData() {
      const params = {
        asyncId: this.user.id + '.' + Date.now(),
        data: this.selections,
        downloadKind: "货盘交付"
      }
      Frame.downCxExcel(params)
    },
    handleSelectionChange(selection) {
      this.selections = selection;
    },
    // 选品列搜索
    async doSearch(pageNo) {
      this.loading = true;
      this.condition.executionStep = 2;// 货盘交付
      if (!this.page) {
        this.page = {current: 1, size: 10};
      }
      if (!this.condition) {
        this.condition = {};
      }
      this.condition.forExcel = true;// 不分页展示数据
      // this.condition.withShop = true
      if (pageNo) {
        this.page.current = pageNo;
      }
      if (!this.isSharedMode){
        this.condition.liveProjectId = this.target.id;
      }else {// 外链模式，搜索项目中指定商家的品
        this.condition.liveProjectId = this.liveProjectId;
        this.condition.shopId = this.shopId;
      }

      try {
        let {code, data} = await this.$api.liveProject.searchChooseGoods({
          condition: this.condition,
          page: this.page
        });
        if (code === 0) {
          let {groupGoodsDeliveryList, shopList, goodsList, page} = data;
          let shopMap = {};
          if (shopList) {
            this.shopList = shopList;// 货盘分享-店铺选择
            shopList.forEach((shop) => {
              if (shop.qrCodes) {
                shop.qrCodes = shop.qrCodes.map((item) =>
                    this.$filter.photo(item)
                );
              }
              shopMap[shop.shop_id] = shop;
            });
          }
          let goodsMap = {};
          if (goodsList) {
            goodsList.forEach((goods) => {
              goodsMap[goods.product_id] = goods;
            });
          }
          groupGoodsDeliveryList.forEach((item) => {
            if (goodsMap[item.product_id]) {
              item.goods = goodsMap[item.product_id];
            }
            if (shopMap[item.shop_id]) {
              item.shop = shopMap[item.shop_id];
            }
          });
          this.data = groupGoodsDeliveryList;
          this.shopMap = shopMap;
          this.goodsMap = goodsMap;
          this.page = page;
        }
      } catch (error) {
        console.error("选品搜索请求失败:", error);
      } finally {
        this.loading = false;
      }
    },
    doModify(row, options){
      this._emit('modifyChooseGoods-drawer',{
        save: true,
        isSharedMode: options === true,
        ...row,
        callback: (item) => {
          this.doSearch(1)
          // this.localForm.resourceId = item
        }
      })
    },
    doDelete(row){
      this._confirm('删除' + row._id + '?', '删除后无法还原', async () => {
        let { code } = await this.$api.liveProject.deleteChooseGoods({
          id: row._id
        });
        if (code === 0) {
          this._messageSuccess('已删除');
          this.doSearch();
        }
      });
    },
    doMaterial(row, options){
      this._emit('materialChoose-drawer',{
        ...row,
        resourceId: this.target ?this.target.resource.id :'',
        resourceName: this.target ?this.target.resource.name :'',
        liveProjectName: this.target ?this.target.liveProjectName :'',
        callback: (item) => {
          this.doSearch()
        },
        readOnly: options === true,
      })
    },
    doTaskWork(row, options){// 发起作业工单
      this._emit('modifyChooseGoods-drawer',{
        save: false,
        options,
        ...row,
        resource: this.target ? this.target.resource :'',
        callback: (item) => {
          this.doSearch(1)
        }
      })
    },
    openWindow(url) {
      window.open(url, "_blank")
    },
    afterUpdateDelivery(event, row){
      Object.assign(row, event);
    },
  }
}
</script>
<style lang="less">
.pallet-delivery {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  .shop-item {
    position: relative;
    display: flex;
    align-items: center;
    .shop-id {
      margin-left: 5px;
      color: gray;
      cursor: pointer;
      position: relative;
    }

    .shop-id:hover::after {
      content: attr(title);
      position: absolute;
      top: 100%;
      left: 0;
      background-color: #333;
      color: #fff;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 10;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .shop-id:hover {
      text-decoration: underline;
    }
  }
}
</style>