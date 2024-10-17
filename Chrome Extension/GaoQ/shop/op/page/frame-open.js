import api from '@/api'
import router from '../router'
export default {
    updateResource(target, title) {
        this.frame('UpdateResource', target, title || '修改资源->' + target.name + '(' + target.id + ')')
    },
    updateShop(target, title) {
        this.frame('UpdateShop', target, title || '店铺->' + target.shop_name + '(' + target.shop_id + ')')
    },
    cpe(target, title) {
        this.frame('Cpe', target, title || 'cpe详情->' + target.name + (target.code ? '(' + target.code + ')' : ''))
    },
    frame(component, target, title, more) {
        let storeId = api.storage.md5Set({ component, target, title });
        // console.log('storeId', storeId)
        let params = { name: 'Frame', query: { s: storeId, ...more } };
        let route = router.resolve(params);
        api.util.open(route.href, true)
    },
    signClaim(target) {
        this.frame('SignClaim', target, '报名签约->' + target.unClaimInit.name)
    },
    pgyExclude() {
        this.frame('PgyExclude', {}, '达人蒲公英线索排除')
    },
    groupGoodsImport(target) {
        this.frame('GroupGoodsImport', target, '谈判商品列表')
    },
    workOrderLineUpdate(target) {
        this.frame('WorkOrderLineUpdate', target, '工单(' + target.id + ')')
    },
    workTodoUpdate(target) {
        this.frame('WorkTodoUpdate', target, '工单待办(' + target.id + ')')
    },
    shop(target) {
        this.frame('Shop', target, '店铺列表')
    },
    downExcel(target, title) {
        this.frame('DownExcel', target, target.downloadKind + '下载->' + title)
    },
    managerTree(target) {
        this.frame('ManagerTree', target, '管理树')
    },
    updateChannel(target, title) {
        this.frame('UpdateChannel', target, title || '修改渠道->' + target.name + '(' + target.id + ')')
    },
    updateList(target, title) {
        this.frame('UpdateList', target, title || '修改渠道小组->' + target.name + '(' + target.id + ')')
    },
    gmvPoint(target) {
        this.frame('GmvPoint', target, '分析图')
    },
    updateBrand(target, title) {
        this.frame('UpdateBrand', target, title || '修改品牌->' + target.name + '(' + target.id + ')')
    },
    claimOfMember(target, title) {
        this.frame('ClaimOfMember', target, title || '认领签约->' + target.name + '(' + target.id + ')')
    },
    processOfMember(target, title) {
        this.frame('ProcessOfMember', target, title || '签约详情->' + target.name + '(' + target.id + ')')
    },
    innerPushList(target, title) {
        this.frame('InnerPushList', target, title || '内推详情->' + target.name + '(' + target.id + ')')
    },
    signInnerPushDetail(target, title) {
        this.frame('SignInnerPushDetail', target, title || '内推详情->' + target.name + '(' + target.id + ')')
    },

    pointDetail(target, title) {
        this.frame('PointDetail', target, title || '积分->' + '详情页面')
    },
    updateProject(target, title) {
        this.frame('UpdateProject', target, title || '修改项目->' + target.name + '(' + target.id + ')')
    },
    updateProjectReserve(target, title) {
        this.frame('UpdateProjectReserve', target, title || '修改储备项目->' + target.name + '(' + target.id + ')')
    },
    updateExtension(target, title) {
        this.frame('UpdateExtension', target, title || '完善待建联->' + target.name + '(' + target.id + ')')
    },
    auditExtension(target, title) {
        this.frame('AuditExtension', target, title || '入库审核->' + target.name + '(' + target.id + ')')
    },
    updateGroupGoods(target, title) {
        this.frame('UpdateGroupGoods', target, title || '修改商品->' + target.title)
    },
    updateGroupGoodsImport(target, title) {
        this.frame('UpdateGroupGoodsImport', target, title || '谈判商品->' + target.title + '(' + target._id + ')')
    },
    orderList(target, title) {
        this.frame('OrderList', target, title)
    },
    monthGradientPoint(target) {
        this.frame('MonthGradientPoint', target, '梯度积分')
    },
    monthGradientOrder(target) {
        this.frame('MonthGradientOrder', target, '积分订单')
    },
    livePointDetail(target) {
        this.frame("LivePointDetail", target, '上车上播积分详情')
    },
    extensionPatch(target) {
        this.frame('ExtensionPatch', target, '商品详情批量补充插件')
    },
    extensionImport(target, title) {
        this.frame('ExtensionImport', target, title || '资源入库->' + target.name + '(' + target.id + ')')
    },
    extensionSpider(target) {
        this.frame('ExtensionSpider', target, '资源批量补充插件')
    },
    shopExtensionSpider(target) {
        this.frame('ShopExtensionSpider', target, '店铺批量补充插件')
    },
    updateGroupList(target, title) {
        this.frame('UpdateGroupList', target, title || '修改清单->' + target.name)
    },
    updateOption(target, title) {
        this.frame('UpdateOption', target, title)
    },
    inGroupStock(target, title) {
        this.frame('InGroupStock', target, title || '入库商品 -> ' + target.title)
    },
    listResource(target, title) {
        this.frame('ListResource', target, "资源列表->" + title)
    },
    // updateGroupGoods(target, title) {
    //     this.frame('UpdateGroupGoods', target, title || '修改商品->' + target.name)
    // },
    // groupInquiryList() {
    //     this.frame('GroupInquiry', {}, '引流列表->组货清单')
    // },
    checkAccount(target, title) {
        this.frame('CheckAccount', target, title || '审核资源->' + target.account.dyNickname)
    },
    colonelActivityProduct(target, title) {
        this.frame('ColonelActivityProduct', target, title || '商品列表->' + target.activity_name)
    },
    douYinData(target, title) {
        this.frame('DouYinData', target, title || '抖音数据->' + target.dyNickname)
    },
    allianceData(target, title) {
        if (target) {
            this.frame('AllianceData', target, title || '联盟数据->' + target.dyNickname)
        }
    },
    douYinVideoData(target, title) {
        this.frame('DouYinVideoData', target, title || '抖音视频数据->' + target.title)
    },
    assignPricing(target, title) {
        this.frame('AssignPricing', target, '经纪提成列表')
    },
    buyinKolMaterialsProductsSearch(target, title) {
        this.frame('BuyinKolMaterialsProductsSearch', target, title || '检索精选联盟商品->' + target.title)
    },
    updateGroupSpread(target, title) {
        this.frame('UpdateGroupSpread', target, title || '修改推广->' + target.name)
    },
    updateFlash(target, title) {
        this.frame('UpdateFlash', target, title || '修改快询->' + target.name + '(' + target.id + ')')
    },
    updateAssign(target, title) {
        this.frame('UpdateAssign', target, title || '分配项目->' + target.name + '(' + target.id + ')')
    },
    updateReplay(target, title) {
        this.frame('UpdateReplay', target, title || '复盘项目->' + target.name + '(' + target.id + ')')
    },
    updateAudit(target, title) {
        this.frame('UpdateAudit', target, title || '审核复盘->' + target.project.name + '(' + target.project.id + ')')
    },
    updateGroupTeam(target, title) {
        this.frame('UpdateGroupTeam', target, title || '修改小组->' + target.name + '(' + target.id + ')')
    },
    publicTopic(target, title) {
        this.frame('PublicTopic', target, title)
    },
    updatePlatform(target, title) {
        this.frame('UpdatePlatform', target, title || '修改平台->' + target.name + '(' + target.id + ')')
    },
    echoSuggestion(target, title) {
        this.frame('EchoSuggestion', target, title || `意见->${target.title}`)
    },
    inquiryHistory(target) {
        this.frame('InquiryHistory', target, '询价历史')
    },
    privateSearch(target) {
        this.frame('PrivateSearch', target, '对私付款查询')
    },
    corporateSearch(target) {
        this.frame('CorporateSearch', target, '对公付款查询')
    },
    corporateHistory(target) {
        this.frame('CorporateHistory', target, '对公历史')
    },
    // importGoods() {
    //     this.frame('ImportGoods', {}, '批量导入精选商品')
    // },
    corporateCy(target) {
        this.frame('CorporateCy', target, '对公制单记录')
    },
    privateCy(target) {
        this.frame('PrivateCy', target, '对私制单记录')
    },
    orderNo(target) {
        this.frame('OrderNo', target, '对账查询')
    },
    testEnter(target) {
        this.frame('testEnter', target, '测试入口')
    },
    cardAudit(target) {
        this.frame('CardAudit', target, '完善名片' + '(' + target.id + ')')
    },
    workOrderAbutment(target) {
        this.frame('WorkOrderAbutment', target, '业务线对接工单审核')
    },
    workOrderReserve(target) {
        this.frame('WorkOrderReserve', target, '储备签署居间工单审核')
    },
    AutoGradPlus(target) {
        this.frame('AutoGradPlus', target, '抓取专列')
    },
    BusinessGradeRecord(target) {
        this.frame('BusinessGradeRecord', target, '梯度备案')
    },
    cardVerification(target) {
        this.frame('CardVerification', target, '名片自动审核')
    },
    DelayScore(target) {
        this.frame('DelayScore', target, '立项拖延扣分->' + target.name)
    },
    ExecProjectAccount(target) {
        this.frame('ExecProjectAccount', target, '执行项目金额列表')
    },
    FullContractExec(target) {
        this.frame('FullContractExec', target, '编导毛利列表')
    },
    Project(target) {
        this.frame('Project', target, '项目列表')
    },
    KocApply(target) {
        this.frame('KocApply', target, '博主报名列表')
    },
    BusinessBelongYwx(target) {
        this.frame('BusinessBelongYwx', target, '业务线列表')
    },
    updateTopic({ targetId, belong, topicTitle, title }) {
        // notice -> topicTitle
        // topic -> title
        let target = { id: targetId, activeName: 'comment' };
        let _title = `话题->${topicTitle || title}`
        switch (belong) {
            case '项目':
                this.updateProject(target, _title)
                break;
            case '快捷询单':
                this.updateFlash(target, _title)
                break;
            case '资源':
                this.updateResource(target, _title)
                break;
            case '渠道':
                this.updateChannel(target, _title)
                break;
            case '渠道小组':
                this.UpdateList(target, _title)
                break;
            case '品牌':
                this.updateBrand(target, _title)
                break;
            case '公共':
                this.publicTopic({ belong, targetId }, _title)
                break;
        }
    },
    code(url) {
        // todo
        return `${window.location.origin}/frame.html?c=${url}`
    }
}
