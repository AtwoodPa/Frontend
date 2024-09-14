import { Context, Options } from "../handler.interface";
import { CollectHandler } from '../handler.collect'
import { Render } from '../handler.collect.jss'
import { For, Msg, Aim } from "../enum";
import { content2Background, patchFrom } from "../bridge";
import { objectToList, tryDo, getDom, getDomText } from "../util";
import { text2Int } from "../filter";

export class ByResourceHandler extends CollectHandler {
    constructor(context: Context, options: Options) {
        super(context, options);
    }
    async _parser() {
        let uid = ""
        const { platformSite, byCode } = this.locationData();
        const {
            sex,
            site,
            mediaId,
            level,
            mainCategory,
            fanCount,
            region,
            mcn,
            photo,
            name,
            contentTags,
            introduce,
            demand,
        } = await this.baseBusData();
        if (site) {
            const match = site.match(/https:\/\/www.douyin.com\/user\/(\S+)/);
            uid = match[1];
        }

        const capability = await this.cargoAnalysisBusData();
        const authorFanData_dataOver = await this.authorFanData(capability)
        const capabilityPatch = await this.capabilityPatchData()
        const { patch, capabilityPatchSecond } = await this.domData()
        let data = {
            origin: '百应',
            platform: '抖音',
            name,
            byCode,
            fanCount,
            contentTags,
            region,
            patch,
            dataOverview: authorFanData_dataOver,
            mainCategory,
            mcn,
            introduce,
            demand,
            photo,
            site,
            mediaId,
            version: this.options.version,
            capability: { ...capabilityPatch, ...capability, ...capabilityPatchSecond },
            sex,
            platformSite,
            level,
            uid
        };
        console.log("json", data);
        return data
    }
    _formMeta(form: any) {
        let { options, reactive } = this;
        reactive.title = `资源基本信息(${options.version})`;
        const mainCategoryList = objectToList(form.mainCategory, this.render);
        const demandList = objectToList(form.demand, this.render);
        const saleAnalysisList = this.jsonToArr(form.saleAnalysis, this.render);
        return [
            this._basicView(form),
            {
                align: 'middle',
                gutter: 0,
                subList: [
                    {
                        span: 4,
                        html: this.render.label('介绍'),
                    },
                    {
                        span: 20,
                        html: form.introduce,
                    },
                    {
                        span: 4,
                        html: this.render.label('性别'),
                    },
                    {
                        span: 8,
                        html: form.sex,
                    },
                    {
                        span: 4,
                        html: this.render.label('粉丝'),
                    },
                    {
                        span: 8,
                        html: form.fanCount,
                    },
                    {
                        span: 4,
                        html: this.render.label('等级'),
                    },
                    {
                        span: 8,
                        html: form.level,
                    },
                    {
                        span: 4,
                        html: this.render.label('机构'),
                    },
                    {
                        span: 8,
                        html: form.mcn,
                    },
                    { span: 24, html: '' },
                    {
                        span: 4,
                        html: this.render.label('内容标签'),
                    },
                    {
                        span: 20,
                        html: form.contentTags.join(',') || '',
                    },
                    ...demandList,
                    ...mainCategoryList,
                    { span: 24, html: this.render.title('带货分析') },
                    ...saleAnalysisList,
                ],
            },
        ];
    }
    _ending(form: any) {
        const { tag, gaoqId, fromTabId, forGaoqu, fromId } = this.options;
        if (fromTabId && gaoqId && fromTabId > 0 && forGaoqu == For.爬取百应等级) {
            let res = "博主不存在或网络错误"
            if (form.mediaId) {
                res = form.level
            }
            return content2Background(
                patchFrom(
                    {
                        id: gaoqId,
                        res,
                        toTabId: fromTabId,
                        toId: fromId,
                        msg:
                            Msg.content通过background转发其他content发送给page,
                        aim: Aim.通知已补丁,
                        closeTab: true,
                    },
                    tag
                )
            );
        } else if ((fromTabId && fromTabId > 0 && forGaoqu == For.回填基础数据) && fromId) {
            return content2Background(
                patchFrom(
                    {
                        data: form,
                        toTabId: fromTabId,
                        toId: fromId,
                        msg:
                            Msg.content通过background转发其他content发送给page,
                        aim: Aim.通知已提取,
                        closeTab: true,
                    },
                    tag
                )
            );
        }
    }
    _makeParams(form: any) {
        const { saleAnalysis, demand, capability, mainCategory, dataOverview, ...others } = form
        return {
            ...others,
            capability: JSON.stringify(capability),
            saleAnalysis: JSON.stringify(saleAnalysis),
            demand: JSON.stringify(demand),
            mainCategory: JSON.stringify(mainCategory),
            dataOverview: JSON.stringify(dataOverview),

        }
    }
    _validateSubmit(form: any): boolean {
        return true;
    }
    _validateAuto(form: any): boolean {
        const { byCode } = form;
        if (!byCode) {
            this.context.$Notice.error({
                title: '获取byCode失败',
            });
            return false;
        }
        return true;
    }
    locationData() {
        let href = window.location.href;
        const byCodeArr: any = href.match(/uid=(\w+)&?/);
        console.log(byCodeArr);
        const byCode = byCodeArr[1];
        console.log("byCode", byCode);
        const platformSite =
            'https://buyin.jinritemai.com/dashboard/servicehall/daren-profile?uid=' +
            byCode;
        console.log('locationData ok', { platformSite });
        return { platformSite, byCode };
    }
    async baseBusData() {
        const { $bus } = this.context;
        // let authorProfileBody: any = null;
        // try {
        let authorProfileBody = await $bus.subscribe(
            /\/homePage\/author\/profile/,
            (rs: any) => {
                let body = $bus.parseBody(rs);
                console.log('profile-from', rs.from, rs.url)
                return body.data.hasOwnProperty('account_douyin') ? body.data : false;
                // return body.data;
            }
        );
        const storageUid = sessionStorage.getItem('uid');
        if (storageUid) {
            sessionStorage.removeItem('uid');
        }
        // } catch (error) {
        //     try {
        //         authorProfileBody = await $bus.subscribe(
        //             /\/api\/authorStatData\/authorProfile/,
        //             (rs: any) => {
        //                 let body = $bus.parseBody(rs);
        //                 return body.data.hasOwnProperty('account_douyin') ? body.data : false;
        //             }
        //         );
        //     } catch (error) {
        //         const storageUid = sessionStorage.getItem('uid');
        //         const href = location.href;
        //         const uid = href.match(/uid=(\S*)&?/)![1];
        //         if (storageUid !== uid) {
        //             sessionStorage.setItem('uid', uid);
        //         }
        //         console.log("error", error, href);
        //     }
        // }
        if (authorProfileBody) {
            const {
                gender,
                web_homepage_url,
                account_douyin,
                level,
                sale_type,
                fans_sum,
                city,
                agency,
                avatar,
                nickname,
                works_type,
                introduction,
                product_main_type_array,
                intention_catgory,
            } = authorProfileBody;
            console.log("authorProfileBody", authorProfileBody);
            let mainCategory: any = {};
            if (product_main_type_array) {
                product_main_type_array.map((item: any) => {
                    let { name, val } = item;
                    mainCategory[name] = val + '%';
                });
            }
            const data: any = {
                sex: gender == 1 ? '男' : '女',
                site: web_homepage_url,
                mediaId: account_douyin,
                level: level ? 'LV' + level : level,
                dataOverview: sale_type,
                fanCount: text2Int(fans_sum),
                region: city,
                mcn: agency,
                photo: avatar,
                name: nickname,
                contentTags: works_type,
                introduce: introduction,
                mainCategory,
                demand: intention_catgory,
            }
            console.log("baseBusData ok", data);
            return data
        }
        console.log("baseBusData failed");
        return {}
    }
    async cargoAnalysisBusData() {
        const { $bus } = this.context;
        let capability: any = {};
        let saleAnalysis: any = {};
        try {
            const authorOverviewV2: any = await $bus.subscribe(
                /\/api\/authorStatData\/authorOverviewV2/,
                (rs: any) => {
                    let body = $bus.parseBody(rs);
                    return body.data ? body.data : false;
                }
            );
            const { live_data, video_data, key_data, sale_analysis, } = authorOverviewV2;
            capability = {
                xszeMin: key_data.sale_low,
                xszeMax: key_data.sale_high,
                tgsps: key_data.promotion_sum,
                lsdhts: key_data.total_work_day,
                hzdps: key_data.cooperate_shop_num,

                zbxszb: live_data.percentage,
                zbcc: live_data.count,
                zbgkrs: live_data.watching_num,
                cjxseMin: live_data.sale_low,
                cjxseMax: live_data.sale_high,

                zbgpmMin: live_data.GPM_low,
                zbgpmMax: live_data.GPM_high,
                zbzcl: text2Int(live_data.recommend_rate),

                spxszb: video_data.percentage,
                dhsps: video_data.count,
                dhspbfl: video_data.watching_num,
                dspxseMin: video_data.sale_low,
                dspxseMax: video_data.sale_high,
                spgpmMin: video_data.GPM_low,
                spgpmMax: video_data.GPM_high,
                spzcl: text2Int(video_data.recommend_rate),
            };

            const lmData = sale_analysis.all.catogory
            const ppData = sale_analysis.all.brand

            for (let i = 0; i < ppData.length; i++) {
                capability['ppppt' + (i + 1)] = ppData[i].brand
                capability['ppjjt' + (i + 1)] = ppData[i].average_price
                capability['ppxsemint' + (i + 1)] = ppData[i].average_GMV_low
                capability['ppxsemaxt' + (i + 1)] = ppData[i].average_GMV_high
            }
            for (let i = 0; i < lmData.length; i++) {
                capability['lmlmt' + (i + 1)] = lmData[i].category
                capability['lmjjt' + (i + 1)] = lmData[i].average_price
                capability['lmxsemint' + (i + 1)] = lmData[i].average_GMV_low
                capability['lmxsemaxt' + (i + 1)] = lmData[i].average_GMV_high
                capability['lmyjmint' + (i + 1)] = lmData[i].suggest_ratio_min
                capability['lmyjmaxt' + (i + 1)] = lmData[i].suggest_ratio_max
            }


            // saleAnalysis = getDiffContent(sale_analysis)
            // const cs = getDiffContent(sale_analysis)
            // console.log(2222,getDiffContent());
            // saleAnalysis = {
            //     '热卖类目TOP3': sale_analysis.all.catogory,
            //     '热卖品牌TOP3': sale_analysis.all.brand
            // };

            const data = capability;
            // capability = { ...capability,...saleAnalysis }

            console.log("cargoAnalysisBusData ok", capability, 1111);

            return data
        } catch (error: any) {
            console.log("error", error);
            this.api.baojing({ tag: this.options.tag, error: error.message, at: "cargoAnalysisBusData", url: window.location.href });
            return { capability, saleAnalysis };
        }
    }
    async authorFanData(capability: any) {
        const { $bus } = this.context
        let authorFanData_dataOver = {};
        let fsKey = '';

        const dom: any = await tryDo(800, () => getDom(".auxo-tabs-nav-list"));
        console.log("dom", dom);
        if (dom) {
            const children = dom.children;
            console.log("children", children);
            if (children.length == 7) {
                try {
                    children[3].click();
                    const authorFanResponse: any = await $bus.subscribe(
                        /\/authorStatData\/authorFansV2/,
                        (rs: any) => {
                            let body = $bus.parseBody(rs);
                            console.log("body.data.hasOwnProperty('age')", body.data.hasOwnProperty('age'), body);
                            return body.data.hasOwnProperty('age') ? body.data : false;
                        }
                    );
                    let { age, analysis, avg_pay_price, city_level, consumer_group, device, gender, gmv_main_cate } = authorFanResponse;
                    authorFanData_dataOver = { age, avg_pay_price, city_level, device, consumer_group, gender, gmv_main_cate };
                    const fsKeyList = analysis[0].value
                    console.log("analysis", analysis);
                    console.log("analysis[0].value", analysis[0].value);
                    if (fsKeyList) {

                        let match = fsKeyList[0].match(/(\S+) \((\d+)/)
                        if (match[1] == "女性") {
                            capability.fsFemaleRate = match[2]
                            capability.fsMaleRate = 100 - match[2]
                        } else {
                            capability.fsFemaleRate = 100 - match[2]
                            capability.fsMaleRate = match[2]
                        }
                        match = fsKeyList[1].match(/(\S+) \((\d+)/)
                        capability.fsnlfbMax = match[1]
                        capability.fsnlfbRate = match[2]
                        match = fsKeyList[2].match(/(\S+) \((\d+)/)
                        capability.fscsdjfbMax = match[1]
                        capability.fscsdjfbRate = match[2]
                        match = fsKeyList[3].match(/(\S+) \((\d+)/)
                        capability.fsbdrqfbMax = match[1]
                        capability.fsbdrqfbRate = match[2]
                        capability.fsKey = fsKeyList.join();

                        console.log("capability", capability);
                    }
                } catch (error: any) {
                    console.log("sellProductResponse", error);
                    this.api.baojing({ tag: this.options.tag, error: error.message, at: "doCollect", url: window.location.href });
                }
            } else {
                this.api.baojing({ tag: this.options.tag, error: "博主tabs列较少，请做兼容处理", at: "doCollect", url: window.location.href });
            }
        }
        console.log("authorFanData", authorFanData_dataOver, fsKey);
        return authorFanData_dataOver
    }
    async capabilityPatchData() {
        const { $bus } = this.context
        let capability: any = {};
        const dom: any = await tryDo(800, () => getDom(".auxo-tabs-nav-list"));
        if (dom) {
            const children = dom.children;
            console.log("children", children);
            if (children.length == 7) {
                try {
                    children[4].click();
                    const capabilityResponse: any = await $bus.subscribe(
                        /\/authorStatData\/salesAnalyseV2/,
                        (rs: any) => {
                            let body = $bus.parseBody(rs);
                            return body.data.hasOwnProperty('video_data') ? body.data : false;
                        }
                    );
                    const { live_data, video_data, key_data } = capabilityResponse;
                    capability = {
                        pjjdj: key_data.average_price,
                        zbtgsps: live_data.promotion_sum,
                        zbhzdps: live_data.cooperate_shop_num,
                        zbpjjdj: live_data.average_price,
                        sptgsps: video_data.promotion_sum,
                        sphzdps: video_data.cooperate_shop_num,
                        sppjjdj: video_data.average_price,
                    }
                    children[0].click();
                } catch (error: any) {
                    console.log("sellProductResponse", error);
                    this.api.baojing({ tag: this.options.tag, error: error.message, at: "doCollect", url: window.location.href });
                }
            } else {
                this.api.baojing({ tag: this.options.tag, error: "博主tabs列较少，请做兼容处理", at: "doCollect", url: window.location.href });
            }
        }
        console.log("capability", capability);
        return capability
    }
    async domData() {
        let capabilityPatchSecond = this.dataOverviewInfo('.daren-overview-base-basepoints');
        const patch = await this.phoneWxHandler()
        const data = { patch, capabilityPatchSecond };
        console.log("domData ok", data);
        return data
    }
    dataOverviewInfo(selector: string) {
        let text = getDomText(selector);
        let map = {};
        let textSplitList = [];
        if (text.length > 4) {
            textSplitList = text.split('\n');
            textSplitList = textSplitList.filter(
                (item: any) => !/[中高低]/.test(item)
            );
            map = {
                dhkb: Math.ceil(textSplitList[0] * 100),
                xyf: Math.ceil(textSplitList[2] * 100),
                lyf: Math.ceil(textSplitList[4] * 100),
                pjf: Math.ceil(textSplitList[6] * 100)
            }
        }
        return map;
    }
    async phoneWxHandler() {
        let phone = "";
        let wx = ""
        let dom = getDom(".daren-overview-base-contactinfo");
        if (dom) {
            const text = dom.textContent;
            let phoneMatch = text.match(/手机号(\w+)/);
            let wxMatch = text.match(/微信号(\w+)/);
            const data: any = {}
            if (phoneMatch && !phoneMatch[1].includes("*****")) {
                data.phone = phoneMatch[1]
            }
            if (wxMatch && !wxMatch[1].includes("*****")) {
                data.wxId = wxMatch[1]
            }
            console.log("phoneWxHandler", data);
            return data

        }
        console.log("phoneWxHandler", {});
        return {};
    }
    jsonToArr(viewObject: any, render: Render) {
        const labelMap = {
            brand: '品牌',
            category: '类目',
            average_price: '均价',
        };
        const arr = [];
        if (viewObject != null) {
            arr.push({ span: 24, html: '' });
            Object.keys(viewObject).forEach((json) => {
                if (json == '热卖类目TOP3') {
                    arr.push({ span: 6, html: render.label('热卖类目') });
                    arr.push({ span: 6, html: render.label('均价') });
                    arr.push({ span: 6, html: render.label('佣金参考') });
                    arr.push({ span: 6, html: render.label('销售额') });
                } else if (json == '热卖品牌TOP3') {
                    arr.push({ span: 6, html: render.label('热卖品牌') });
                    arr.push({ span: 6, html: render.label('均价') });
                    arr.push({ span: 12, html: render.label('销售额') });
                }
                if (json != null) {
                    viewObject[json].forEach((item: any) => {
                        Object.keys(item).forEach((key) => {
                            Object.keys(labelMap).forEach((label) => {
                                if (key == label) {
                                    arr.push({ span: 6, html: item[key] });
                                }
                            });
                        });
                        if (
                            item.hasOwnProperty('suggest_ratio_min') ||
                            item.hasOwnProperty('suggest_ratio_max')
                        ) {
                            arr.push({
                                span: 6,
                                html:
                                    item['suggest_ratio_min'] +
                                    ',' +
                                    item['suggest_ratio_max'],
                            });
                        }
                        if (
                            item.hasOwnProperty('average_GMV_low') ||
                            item.hasOwnProperty('average_GMV_high')
                        ) {
                            if (item.hasOwnProperty('category')) {
                                arr.push({
                                    span: 6,
                                    html:
                                        item['average_GMV_low'] +
                                        ',' +
                                        item['average_GMV_high'],
                                });
                            } else {
                                arr.push({
                                    span: 12,
                                    html:
                                        item['average_GMV_low'] +
                                        ',' +
                                        item['average_GMV_high'],
                                });
                            }
                        }
                    });
                }
            });
        }
        return arr;
    }
}