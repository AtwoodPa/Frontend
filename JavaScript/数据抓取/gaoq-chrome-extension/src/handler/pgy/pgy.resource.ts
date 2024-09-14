import { Context, Options } from "../../handler/handler.interface";
import { CollectHandler } from '../../handler/handler.collect'
import { For, Msg, Aim, Table, Platform } from "../enum";
import { content2Background, patchFrom } from "../bridge";
import { objectToList, portRequest, getAuthorContentData, formatDate, tryDo } from "../util";
import { isBroker } from "../perm"

export class PgyResourceHandler extends CollectHandler {
    total: number;
    constructor(context: Context, options: Options) {
        super(context, options);
        this.total = 8;
    }
    async _parser() {
        let { uid, site, platformSite } = locationData();
        const {
            sex,
            mcn,
            name,
            photo,
            level,
            price,
            region,
            mediaId,
            fanCount,
            greatCount,
            featureTags,
            contentTags,
            personalTags,
            subContentTags } = await this.basePortData(uid)
        let portNoteData = await this.portNoteData(uid);
        const { fansMap } = portNoteData;
        let { capability, dataOverview, otherData } = await this.portLiveData(portNoteData.capability, portNoteData.dataOverview, uid)
        // this.total = total;//该数据是用于提取博主笔记
        addCpeAndCpm(capability, price)
        console.log("dataOverview", dataOverview);
        const form = {
            mcn,
            uid,
            sex,
            site,
            name,
            level,
            price,
            photo,
            region,
            mediaId,
            version: this.options.version,
            fanCount,
            greatCount,
            contentTags,
            featureTags,
            dataOverview,
            capability,
            platformSite,
            personalTags,
            subContentTags,
            otherData,
            origin: '蒲公英',
            platform: '小红书',
            fansMap
        }
        console.log("dataOverview", JSON.stringify(form));
        return form;
    }
    _formMeta(form: any) {
        let { options, reactive } = this;
        reactive.title = `资源基本信息(${options.version})`;
        const priceSubList = objectToList(form.price, this.render);
        return [
            this._basicView(form),
            {
                align: 'middle',
                gutter: 0,
                subList: [...priceSubList, {
                    span: 4,
                    html: this.render.label('性别'),
                },
                {
                    span: 4,
                    html: form.sex,
                },
                {
                    span: 4,
                    html: this.render.label('蒲公英等级'),
                },
                {
                    span: 4,
                    html: form.level,
                },]
            },
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
                        html: this.render.label('一级内容'),
                    },
                    {
                        span: 20,
                        html: form.contentTags?.join(',')
                    },
                    {
                        span: 4,
                        html: this.render.label('二级内容'),
                    },
                    {
                        span: 20,
                        html: form.subContentTags?.join('')
                    },
                    {
                        span: 4,
                        html: this.render.label('内容特征'),
                    },
                    {
                        span: 20,
                        html: form.featureTags?.join(',')
                    },
                    {
                        span: 4,
                        html: this.render.label('特色人设'),
                    },
                    {
                        span: 20,
                        html: form.personalTags?.join(',')
                    },
                ],
            },
        ];
    }
    _makeParams(form: any): any {
        const { price, dataOverview, capability, ...others } = form
        return {
            ...others,
            price: JSON.stringify(price),
            dataOverview: JSON.stringify(dataOverview),
            capability: JSON.stringify(capability)
        }
    }
    _validateAuto(form: any): boolean {
        if (!form.mediaId || !form.version) {
            this.context.$Notice.error({
                title: '遇到问题-_-!',
                desc: '数据不完备',
            });
            return false;
        }
        return true;
    }
    _validateSubmit(form: any): boolean {
        if (isBroker(this.userTabId.user)) {
            const { fanCount, bloggerId, brand } = form;
            if ((fanCount < 5000) && ("63fc2548000000002901430b" != bloggerId) && !brand) {
                this.context.$Notice.warning({
                    title: '粉丝量低',
                    desc: '小红书粉丝量不低于5000才可入库',
                });
                return false;
            }
        }
        form.pass = true;
        return true;
    }
    _ending(form: any) {
        const { options } = this;
        const { tag, gaoqId, fromId, fromTabId, forGaoqu } = options;
        if ((fromTabId && fromTabId > 0 && forGaoqu == For.获取蒲公英等级) && gaoqId) {
            let { mediaId, name, level } = form;
            content2Background(
                patchFrom(
                    {
                        title: '小红书号:' + name + '(' + mediaId + ')',
                        message: '等级:' + level,
                        msg: Msg.content发送给background,
                        aim: Aim.系统通知
                    },
                    tag
                )
            );
            return content2Background(
                patchFrom(
                    {
                        id: gaoqId,
                        res: form ? form.level : '博主不存在或网络错误',
                        toTabId: fromTabId,
                        toId: fromId,
                        data: form,
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
    async basePortData(uid: string) {
        try {
            const blogger = await this.api.ajax.get(
                'https://pgy.xiaohongshu.com/api/solar/cooperator/user/blogger/' +
                uid
            );
            const bloggerData = blogger.data;
            let {
                gender,
                fansCount,
                fansNum,
                personalTags,
                featureTags,
                location,
                name,
                headPhoto,
                currentLevel,
                noteSign,
                pictureShowState,
                videoShowState,
                videoPrice,
                picturePrice,
                redId,
                likeCollectCountInfo,
            } = bloggerData;
            if (gender == '未知') {
                gender = null
            }
            console.log("bloggerData", bloggerData);
            personalTags = personalTags || [];
            let { contentTags, subContentTags } = tagAdjustment(
                bloggerData.contentTags
            );
            const level =
                currentLevel == 0
                    ? '异常'
                    : currentLevel == 1
                        ? '普通'
                        : '优秀';
            const price = {
                图文笔记一口价: pictureShowState ? picturePrice : 0,
                视频笔记一口价: videoShowState ? videoPrice : 0,
            };
            const mcn = noteSign ? noteSign.name : '';
            const data: any = {
                sex: gender,
                mcn,
                name,
                photo: headPhoto,
                level,
                price,
                region: location,
                mediaId: redId,
                fanCount: fansNum,
                greatCount: likeCollectCountInfo,
                featureTags,
                contentTags,
                personalTags,
                subContentTags,
                uid
            };
            console.log("basePortData ok", data);
            return data
        } catch (error) {
            console.log("basePortData ok", "错误");
            // this._ending({ level: "博主主页异常" })
            return null;
        }
    }

    async portRequest(url: string, name: string, tryCount = 5) {
        let response = null
        try {
            response = await this.api.ajax.get(url);
            console.log("url", url);
            console.log("response", response);
            const pass = response.data.hasOwnProperty(name)
            console.log("pass", pass);
            if (!pass) {
                throw new Error("data数据出错")
            }
        } catch (error: any) {
            if (tryCount > 0) {
            } else {
                this.api.baojing({ tag: this.options.tag, error: error?.message, at: `portRequest ${url}`, url: window.location.href });
            }
        }
        return response
    }

    async portLiveData(capability: any, dataOverview: any, uid: string) {
        const cardUrl = `https://pgy.xiaohongshu.com/api/solar/kol/kIntention/live/card?kolUserId=${uid}`
        const baseUrl = `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/liveSummary?userId=${uid}&dateType=`
        const live1mPromise = this.portRequest(baseUrl + 1, "fansNum")
        const live3mPromise = this.portRequest(baseUrl + 2, "fansNum")
        const cardPromise = this.portRequest(cardUrl, "fansNum")

        const [live1m, live3m, card] = await Promise.all([live1mPromise, live3mPromise, cardPromise])
        const totalData: any = { live1m, live3m }



        const liveDate: any = {
            live1m: {
                suffix: '1m'
            },
            live3m: {
                suffix: '3m'
            },
        }
        Object.keys(totalData).forEach((key: any) => {
            const data = totalData[key].data;
            const suffix = liveDate[key].suffix
            if (data) {
                // const {
                //     averageSales,   // 场均销售额（万）,
                //     overAverageSalesBuyers,// 
                //     liveGpm, // 直播GPM 1
                //     overLiveGpmBuyers,
                //     totalSales, // 销售总额
                //     overTotalSalesBuyers,
                //     numberOfOromotedProducts,// 推广商品数
                //     numberOfPartnerSeller,// 合作商家数
                //     newFansNum,// 新增粉丝数
                //     proportionOfActiveFans, // 活跃粉丝占比
                //     proportionOfOrderFans, // 下单粉丝占比
                //     fanUnitPrice,// 粉丝客单价水平
                //     liveDays,//直播天数
                //     liveCount,//直播场次
                //     averageViewTime,    // 平均直播时长 秒， 
                //     viewMiddleCount,//单场视播人数
                //     interactionRate,//直播观众互动率
                //     maxOnlineViewer,//在线人数峰值
                // } = data;
                capability["averageSales" + suffix] = getAuthorContentData(data, "averageSales");
                capability["overAverageSalesBuyers" + suffix] = getAuthorContentData(data, "overAverageSalesBuyers", 10000);
                capability["totalSales" + suffix] = getAuthorContentData(data, "totalSales");
                capability["overTotalSalesBuyers" + suffix] = getAuthorContentData(data, "overTotalSalesBuyers", 10000);
                capability["liveGpm" + suffix] = getAuthorContentData(data, "liveGpm", 100);
                capability["overLiveGpmBuyers" + suffix] = getAuthorContentData(data, "overLiveGpmBuyers", 10000);
                capability["numberOfOromotedProducts" + suffix] = getAuthorContentData(data, "numberOfOromotedProducts");
                capability["numberOfPartnerSeller" + suffix] = getAuthorContentData(data, "numberOfPartnerSeller");
                capability["newFansNum" + suffix] = getAuthorContentData(data, "newFansNum");
                capability["proportionOfActiveFans" + suffix] = getAuthorContentData(data, "proportionOfActiveFans", 10000);
                capability["overBuyerForProportionOfActiveFans" + suffix] = getAuthorContentData(data, "overBuyerForProportionOfActiveFans", 10000);
                capability["overBuyerForProportionOfOrderFans" + suffix] = getAuthorContentData(data, "overBuyerForProportionOfOrderFans", 10000);
                capability["proportionOfOrderFans" + suffix] = getAuthorContentData(data, "proportionOfOrderFans", 10000);
                capability["fanUnitPrice" + suffix] = getAuthorContentData(data, "fanUnitPrice", 100);
                capability["liveDays" + suffix] = getAuthorContentData(data, "liveDays");
                capability["liveCount" + suffix] = getAuthorContentData(data, "liveCount");
                capability["averageViewTime" + suffix] = getAuthorContentData(data, "averageViewTime");
                capability["viewMiddleCount" + suffix] = getAuthorContentData(data, "viewMiddleCount");
                capability["interactionRate" + suffix] = getAuthorContentData(data, "interactionRate", 10000);
                capability["maxOnlineViewer" + suffix] = getAuthorContentData(data, "maxOnlineViewer");
            }
        })



        const cardData = card.data
        const otherData: any = {}
        if (cardData?.cooperationStatus) {
            const { canDiscuss, cooperationStatus, cooperativeCondition, intentionalCommission, kolSelectionDirectionList, livePlan } = cardData;
            capability["canDiscuss"] = canDiscuss; // 是否线下协商
            capability["cooperationStatus"] = cooperationStatus; // 2 积极合作中
            capability["cooperativeCondition"] = cooperativeCondition; // 2 佣金＋坑位费  1 纯佣金
            capability["intentionalCommission"] = +intentionalCommission; // 合作佣金大于多少 
            let selectionList: any = []
            if (kolSelectionDirectionList?.length) {
                kolSelectionDirectionList.forEach((item: any) => {
                    const { firstSelectionDirection, secondProductDirection, secondStyleDirection } = item //
                    if (firstSelectionDirection) {
                        selectionList.push(firstSelectionDirection)
                    }
                    if (secondProductDirection) {
                        selectionList = [...selectionList, ...secondProductDirection]
                    }
                    if (secondStyleDirection) {
                        selectionList = [...selectionList, ...secondStyleDirection]
                    }
                })

                capability.selectionDirection = selectionList.join("、")

            }
            const resourceLivePlanList: any = []
            if (livePlan?.length) {
                livePlan.forEach((item: any) => {
                    let { endTime, livePlanId, merchantId, planGoodsCount, reservationNumber, selectedGoodsCount, showStatus, startTime, title } = item;
                    if (reservationNumber) {
                        let match = reservationNumber.match(/(\d+)人/);
                        console.log("match", match);
                        if (match) {
                            reservationNumber = +match[1]
                        } else {
                            reservationNumber = 0
                        }
                    } else {
                        reservationNumber = 0;
                    }
                    const resourceLivePath = {
                        endTime: formatDate(new Date(endTime)),
                        startTime: formatDate(new Date(startTime)),
                        livePlanId,
                        merchantId, planGoodsCount, reservationNumber, selectedGoodsCount, showStatus, title
                    }
                    resourceLivePlanList.push(resourceLivePath)
                })
            }
            // dataOverview.resourceLivePlanList = resourceLivePlanList
            // dataOverview['livePlan'] = livePlan
            console.log("nextJs-data-livePlan", { livePlan, resourceLivePlanList });
            if (resourceLivePlanList.length > 0) {
                otherData.buyerLivePlanList = resourceLivePlanList;
            }

        }

        console.log("portLiveData", { capability, dataOverview });
        return { capability, dataOverview, otherData };
    }
    async portNoteData(uid: string) {

        const dailyNotesPromise = this.portRequest(
            `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/dataSummary?userId=${uid}&business=0`, 'noteNumber'
        );
        const cooperationNotesPromise = this.portRequest(
            `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/dataSummary?userId=${uid}&business=1`, 'noteNumber'
        );
        // 30 天日常
        const notesDailyRatePromise = this.portRequest(
            `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/notesRate?userId=${uid}&business=0&noteType=3&dateType=1&advertiseSwitch=1`, 'noteNumber'
        );
        const notesCooperationRatePromise = this.portRequest(
            `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/notesRate?userId=${uid}&business=1&noteType=3&dateType=1&advertiseSwitch=1`, 'noteNumber'
        );
        // 90 天日常
        const notesDailyRateV2Promise = this.portRequest(
            `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/notesRate?userId=${uid}&business=0&noteType=3&dateType=2&advertiseSwitch=1`, 'noteNumber'
        );
        const notesCooperationRateV2Promise = this.portRequest(
            `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/notesRate?userId=${uid}&business=1&noteType=3&dateType=2&advertiseSwitch=1`, 'noteNumber'
        );
        // 30 天日常--自然流量
        const zrNotesDailyRatePromise = this.portRequest(
            `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/notesRate?userId=${uid}&business=0&noteType=3&dateType=1&advertiseSwitch=0`, 'noteNumber'
        );
        const zrNotesCooperationRatePromise = this.portRequest(
            `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/notesRate?userId=${uid}&business=1&noteType=3&dateType=1&advertiseSwitch=0`, 'noteNumber'
        );
        // 90 天日常--自然流量  
        const zrNotesDailyRateV2Promise = this.portRequest(
            `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/notesRate?userId=${uid}&business=0&noteType=3&dateType=2&advertiseSwitch=0`, 'noteNumber'
        );
        const zrNotesCooperationRateV2Promise = this.portRequest(
            `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/notesRate?userId=${uid}&business=1&noteType=3&dateType=2&advertiseSwitch=0`, 'noteNumber'
        );

        const fansSummaryPromise = this.portRequest(
            `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/fansSummary?userId=${uid}`, 'fansNum'
        );
        const fansProfilePromise = this.portRequest(
            `https://pgy.xiaohongshu.com/api/solar/kol/data/${uid}/fans_profile`, 'gender'
        );
        let dataOverview: any = {}
        const capability = {}
        let fansMap = null

        // try {
        const [
            dailyNotes,
            cooperationNotes,
            notesDailyRate,
            notesCooperationRate,
            zrNotesDailyRate,
            zrNotesCooperationRate,
            zrNotesDailyRateV2,
            zrNotesCooperationRateV2,
            fansSummary,
            fansProfile,
            notesDailyRateV2,
            notesCooperationRateV2,
        ] = await Promise.all([
            dailyNotesPromise,
            cooperationNotesPromise,
            notesDailyRatePromise,
            notesCooperationRatePromise,
            zrNotesDailyRatePromise,
            zrNotesCooperationRatePromise,
            zrNotesDailyRateV2Promise,
            zrNotesCooperationRateV2Promise,
            fansSummaryPromise,
            fansProfilePromise,
            notesDailyRateV2Promise,
            notesCooperationRateV2Promise,
        ]);
        console.log("promiseData", {
            dailyNotes,
            cooperationNotes,
            notesDailyRate,
            notesCooperationRate,
            zrNotesDailyRateV2,
            zrNotesCooperationRateV2,
            zrNotesDailyRate,
            zrNotesCooperationRate,
            fansSummary,
            fansProfile,
            notesDailyRateV2,
            notesCooperationRateV2,
        });
        // let total = null
        // const { $bus } = this.context;

        if (dailyNotes && cooperationNotes && dailyNotes.data && cooperationNotes.data) {
            dataOverview.数据概览 = notesDataMap(dailyNotes.data, cooperationNotes.data,
                capability)
        }
        if (notesDailyRate && notesCooperationRate && notesDailyRate.data && notesCooperationRate.data && zrNotesDailyRate && zrNotesCooperationRate && zrNotesDailyRate.data && zrNotesCooperationRate.data) {
            dataOverview['传播表现(30天)'] = notesRateMap1m(
                notesDailyRate.data,
                notesCooperationRate.data,
                zrNotesDailyRate.data,
                zrNotesCooperationRate.data,
                capability
            )
        }
        if (notesDailyRateV2 && notesCooperationRateV2 && notesDailyRateV2.data && notesCooperationRateV2.data && zrNotesDailyRateV2 && zrNotesCooperationRateV2 && zrNotesDailyRateV2.data && zrNotesCooperationRateV2.data) {
            dataOverview['传播表现(90天)'] = notesRateMap3m(
                notesDailyRateV2.data,
                notesCooperationRateV2.data,
                zrNotesDailyRateV2.data,
                zrNotesCooperationRateV2.data,
                capability
            )
        }

        if (fansSummary && fansProfile && fansSummary.data && fansProfile.data) {
            dataOverview.粉丝分析 = funSummaryMap(
                fansSummary.data,
                fansProfile.data,
                capability
            )
            // fansMap = fansProfile.data
            fansMap = fansPgyHandler(fansProfile.data)
        }

        // } catch (error) {
        //     console.debug(error);
        // }
        const data = { dataOverview, capability, fansMap }
        console.log('portData ok', data);
        console.log('capability ok', JSON.parse(JSON.stringify(capability)));
        return data;
    }
    async notesCollect(form: any) {
        const { options, context, api } = this;
        const { tag } = options;
        const { $bus } = context;
        const { mediaId, uid, origin, platform, fansMap } = form;

        let noteParams: any = {
            mediaId, uid, origin, platform, fansMap
        }
        api.fansPgy.addOrUpdate(noteParams)
        let notes = [];
        const pageSize = 8;
        //api/solar/kol/dataV2/notesDetail
        const notesDetail = await portRequest(api, getNotesPageUrl(1, uid, 10), 'list', tag)
        const total = notesDetail ? notesDetail.data.total : null;
        if (total > pageSize) {
            const { data } = await portRequest(api, getNotesPageUrl(1, uid, total), 'list', tag);
            notes = data.list
        } else {
            notes = notesDetail.data.list
        }
        console.log("notes1", notes);
        if (notes.length > 0) {
            for (let note of notes) {
                const { isAdvertise, isVideo, noteId } = note;
                note.isAdvertise = isAdvertise ? 1 : 0
                note.isVideo = isVideo ? 1 : 0
                if (isAdvertise) {
                    const { code, data } = await portRequest(api, getBrandUrl(noteId), 'reportBrandUserId', tag);
                    note.brandXhsCode = data.reportBrandUserId
                }
            }
        }
        console.log("notes2", notes);
        noteParams.noteCollectList = notes
        await api.notesCollect.addOrUpdate(noteParams);
        return "ok";
    }
    async liveCollect(form: any, resourceId: number) {
        const { options, context, api } = this;
        const { tag } = options;
        const { $bus } = context;
        const { uid, otherData } = form;
        const { buyerLivePlanList } = otherData;
        console.log("resourceId", resourceId);

        if (buyerLivePlanList) {
            this.api.buyerLivePlan.addOrUpdate({ buyerLivePlanList, uid, resourceId })
        }
        // // 可能会因为电脑卡页面加载慢，导致订阅不上，这里咱们等1秒哈
        // await tryDo(1000, () => { })

        // // 抓直播30天数据 初次页面加载会请求30日直播数据，所以获取30日数据的total使用订阅拿

        // // 类目分析
        // const category1mPromise = $bus.subscribe(/api\/draco\/distributor-square\/distributor\/cooperative\/category\/v2/,
        //     (rs: any) => {
        //         let body = $bus.parseBody(rs);
        //         console.log("body", body);
        //         return body?.data;
        //     })

        // // 合作店铺分析
        // const shop1mPromise = $bus.subscribe(/api\/draco\/distributor-square\/distributor\/cooperative\/shop\/v2/,
        //     (rs: any) => {
        //         let body = $bus.parseBody(rs);
        //         console.log("body", body);
        //         return body?.data;
        //     })

        // // 合作商品分析
        // const item1mPromise = $bus.subscribe(/api\/draco\/distributor-square\/distributor\/cooperative\/item\/v2/,
        //     (rs: any) => {
        //         let body = $bus.parseBody(rs);
        //         console.log("body", body);
        //         return body?.data;
        //     })

        // 获取90天数据，要先请求一次获取total
        const liveParams = {
            buyer_id: uid,
            date_type: 1,// 1代表 30天    2代表 90天
            page: 1,
            first_live_category: "",
            second_live_category: "",
            size: 10
        }
        const category1mPromise = portRequest(api, getLiveUrl("category"), 'buyer_coo_categories_analysis_infos', tag, liveParams);
        const item1mPromise = portRequest(api, getLiveUrl("item"), 'buyer_coo_categories_analysis_infos', tag, liveParams);
        const shop1mPromise = portRequest(api, getLiveUrl("shop"), 'buyer_coo_categories_analysis_infos', tag, liveParams);

        liveParams.date_type = 2
        const category3mPromise = portRequest(api, getLiveUrl("category"), 'buyer_coo_categories_analysis_infos', tag, liveParams);
        const item3mPromise = portRequest(api, getLiveUrl("item"), 'buyer_coo_categories_analysis_infos', tag, liveParams);
        const shop3mPromise = portRequest(api, getLiveUrl("shop"), 'buyer_coo_categories_analysis_infos', tag, liveParams);




        const [categoryData1m, shopData1m, itemData1m, categoryData3m, shopData3m, itemData3m] = await Promise.all([category1mPromise, shop1mPromise, item1mPromise, category3mPromise, shop3mPromise, item3mPromise]);
        console.log("categoryData3m, shopData3m, itemData3m", categoryData3m, shopData3m, itemData3m);
        console.log("categoryData1m, shopData1m, itemData1m", categoryData1m, shopData1m, itemData1m)


        // 获取30天直播数据 批量跑过条请求，减少页面抓取时间
        let configData: any = {
            category_1: {
                size: categoryData1m.data.total,
                listKey: "buyer_coo_categories_analysis_infos",
                list: categoryData1m.data["buyer_coo_categories_analysis_infos"],
                promise: null
            },
            item_1: {
                size: itemData1m.data.total,
                listKey: "buyer_coo_product_analysis_infos",
                list: itemData1m.data["buyer_coo_product_analysis_infos"],
                promise: null
            },
            shop_1: {
                size: shopData1m.data.total,
                listKey: "buyer_coo_shop_analysis_infos",
                list: shopData1m.data["buyer_coo_shop_analysis_infos"],
                promise: null
            },
            category_2: {
                size: categoryData3m.data.total,
                listKey: "buyer_coo_categories_analysis_infos",
                list: categoryData3m.data["buyer_coo_categories_analysis_infos"],
                promise: null
            },
            item_2: {
                size: itemData3m.data.total,
                listKey: "buyer_coo_product_analysis_infos",
                list: itemData3m.data["buyer_coo_product_analysis_infos"],
                promise: null
            },
            shop_2: {
                size: shopData3m.data.total,
                listKey: "buyer_coo_shop_analysis_infos",
                list: shopData3m.data["buyer_coo_shop_analysis_infos"],
                promise: null
            }
        }

        console.log("configData-init", JSON.parse(JSON.stringify(configData)));
        // 采用按需请求数据，如果初次请求数据已经是全部数据就不会再请求，
        Object.keys(configData).forEach(key => {
            const { size } = configData[key];
            if (size > 10) {
                const split = key.split("_");
                const path = split[0]
                const date_type = split[1]
                configData[key].promise = portRequest(api, getLiveUrl(path), 'buyer_coo_categories_analysis_infos', tag, { ...liveParams, size, date_type });
            }
        })
        console.log("configData-Object.keys", JSON.parse(JSON.stringify(configData)));



        const promiseList: any = [];
        const keyMapList: any[] = []
        Object.keys(configData).forEach((key: any) => {
            const { promise, list, listKey } = configData[key];
            keyMapList.push({ key, listKey })
            if (promise) {
                promiseList.push(promise)
            } else {
                promiseList.push(list)
            }
        })
        const liveDataList = await Promise.all(promiseList);
        console.log("liveDataList", liveDataList);
        console.log("configData-Object.keys", configData);

        const params: any = {}
        liveDataList.forEach((item, index) => {


            const { key, listKey } = keyMapList[index];
            console.log("key", key);

            console.log("item", item);
            const list = item.data ? item.data[listKey] : item;
            const split = key.split("_");
            const path = split[0]
            const date_type = split[1]
            list.forEach((item: any) => {
                item.date_type = +date_type
            })
            if (params.hasOwnProperty(path)) {
                params[path] = [...params[path], ...list]
            } else {
                params[path] = list;
            }
        })
        console.log("params", params);
        const { category, item, shop } = params;
        // 类目
        if (category && category.length > 0) {
            // 为资源添加 标签
            const liveCategoryTags: string[] = [];
            const subLiveCategoryTags: string[] = [];
            const liveCategoryList = category.map((item: any) => {
                const { first_category_name, second_category_name } = item;
                if (!liveCategoryTags.includes(first_category_name)) {
                    liveCategoryTags.push(first_category_name)
                }
                if (!subLiveCategoryTags.includes(first_category_name)) {
                    subLiveCategoryTags.push(second_category_name)
                }
                item.avg_price = item.avg_price ? +item.avg_price.toFixed(2) : 0;
                item.sale_amount = item.sale_amount ? +item.sale_amount.toFixed(2) : 0;
                return item;
            })
            const paramsAddLiveCategoryTag = { subLiveCategoryTags, liveCategoryTags, resourceId }
            console.log("paramsAddLiveCategoryTag", paramsAddLiveCategoryTag);

            this.api.resourceTag.addLiveCategoryTag(paramsAddLiveCategoryTag)
            this.api.liveCategory.updateOrInsert({ liveCategoryList, uid, resourceId })
        }
        // 商品
        if (item && item.length > 0) {
            const liveProductList = item.map((item: any) => {
                item.price = item.price ? +item.price.toFixed(2) : 0;
                // item.sale_amount = item.sale_amount ? item.sale_amount.toFixed(2) : 0;
                return item;
            })
            this.api.liveProduct.updateOrInsert({ liveProductList, uid, resourceId })
        }

        // 店铺
        if (shop && shop.length > 0) {
            const liveShopList = shop.map((item: any) => {
                item.avg_price = item.avg_price ? +item.avg_price.toFixed(2) : 0;
                // item.sale_amount = item.sale_amount ? item.sale_amount.toFixed(2) : 0;
                return item;
            })
            this.api.liveShop.updateOrInsert({ liveShopList, uid, resourceId })
        }

        // Object.values(configData).forEach((item: any) => {
        //     const { promise } = item;
        //     if (promise) {
        //         item.list = promise.data.
        //     }
        // })
        console.log("configData-Promise.all", configData);






        // console.log("category, shop, item", { category, shop, item });
        return "ok";
    }
    async _otherCollect(form: any, data: any) {

        const { ids, table } = data;
        console.log("data", data);

        if (table && ids && table == Table.资源入库) {
            const { $Notice } = this.context;
            $Notice.warning({
                title: '请稍等',
                desc: "正在提取博主笔记数据....",
            });
            const resourceId = ids[0];
            const noteResPromise = this.notesCollect(form);
            console.log("resourceId", resourceId);

            const liveResPromise = this.liveCollect(form, resourceId);
            await Promise.all([noteResPromise, liveResPromise])
            $Notice.success({
                title: '提取成功',
                desc: "博主笔记数据提取成功，谢谢您的等待！",
            });
        }
    }

}
function getNotesPageUrl(pageNumber: number, uid: string, total: number) {
    return `https://pgy.xiaohongshu.com/api/solar/kol/dataV2/notesDetail?advertiseSwitch=1&orderType=1&pageNumber=${pageNumber}&pageSize=${total}&userId=${uid}&noteType=4&withComponent=false`
}
function getBrandUrl(noteId: string) {
    return `https://pgy.xiaohongshu.com/api/solar/note/${noteId}/detail?bizCode=`
}
function getLiveUrl(type: string) {
    return `https://pgy.xiaohongshu.com/api/draco/distributor-square/distributor/cooperative/${type}/v2`
}
function locationData() {
    let uid: any = window.location.pathname.split('/');
    uid = uid[uid.length - 1];
    let { origin, pathname } = window.location;
    let platformSite = origin + pathname;
    let site = `https://www.xiaohongshu.com/user/profile/${uid}`;
    const data = { uid, site, platformSite }
    console.log('locationData', data);
    return data;
}

function addCpeAndCpm(capability: any, price: any) {
    const CpeAndCpm: any = {
        cpe1m: 0,
        cpe3m: 0,
        cpe: 0,
        cpm1m: 0,
        cpm3m: 0,
        cpm: 0,
        rccpe1m: 0,
        rccpe3m: 0,
        rccpe: 0,
        rccpm1m: 0,
        rccpm3m: 0,
        rccpm: 0,
        cpv1m: 0,
        cpv3m: 0,
        cpv: 0
    }
    const twbjykj: number = price.图文笔记一口价
    function amendNumber(value: number, take: number = 1) {
        return value ? Number(((twbjykj / value) * 100 * take).toFixed()) : 0
    }
    const { hdzws1m, hdzws3m, hdzws, rchdzws1m, rchdzws3m, rchdzws, bgzws1m, bgzws3m, rcbgzws1m, rcbgzws3m, ydzws1m, ydzws3m, ydzws, rcydzws1m, rcydzws3m, rcydzws, zrhdzws1m, zrhdzws3m, zrrchdzws1m, zrrchdzws3m, zrbgzws1m, zrbgzws3m, zrrcbgzws1m, zrrcbgzws3m, zrydzws1m, zrydzws3m, zrrcydzws1m, zrrcydzws3m } = capability
    if (twbjykj) {
        CpeAndCpm.cpe1m = amendNumber(hdzws1m)
        CpeAndCpm.zrcpe1m = amendNumber(zrhdzws1m)
        CpeAndCpm.cpe3m = amendNumber(hdzws3m)
        CpeAndCpm.zrcpe3m = amendNumber(zrhdzws3m)
        CpeAndCpm.cpe = amendNumber(hdzws)


        CpeAndCpm.rccpe1m = amendNumber(rchdzws1m)
        CpeAndCpm.zrrccpe1m = amendNumber(zrrchdzws1m)
        CpeAndCpm.rccpe3m = amendNumber(rchdzws3m)
        CpeAndCpm.zrrccpe3m = amendNumber(zrrchdzws3m)
        CpeAndCpm.rccpe = amendNumber(rchdzws)
        CpeAndCpm.cpv1m = amendNumber(ydzws1m)
        CpeAndCpm.zrcpv1m = amendNumber(zrydzws1m)
        CpeAndCpm.cpv3m = amendNumber(ydzws3m)
        CpeAndCpm.zrcpv3m = amendNumber(zrydzws3m)
        CpeAndCpm.cpv = amendNumber(ydzws)
        CpeAndCpm.rccpv1m = amendNumber(rcydzws1m)
        CpeAndCpm.zrrccpv1m = amendNumber(zrrcydzws1m)
        CpeAndCpm.rccpv3m = amendNumber(rcydzws3m)
        CpeAndCpm.zrrccpv3m = amendNumber(zrrcydzws3m)
        CpeAndCpm.rccpv = amendNumber(rcydzws)

        CpeAndCpm.cpm1m = amendNumber(bgzws1m, 1000)
        CpeAndCpm.zrcpm1m = amendNumber(zrbgzws1m, 1000)
        CpeAndCpm.cpm3m = amendNumber(bgzws3m, 1000)
        CpeAndCpm.zrcpm3m = amendNumber(zrbgzws3m, 1000)
        CpeAndCpm.cpm = 0
        CpeAndCpm.rccpm1m = amendNumber(rcbgzws1m, 1000) > 2147483648 ? 2147483600 : amendNumber(rcbgzws1m, 1000)
        CpeAndCpm.zrrccpm1m = amendNumber(rcbgzws1m, 1000) > 2147483648 ? 2147483600 : amendNumber(zrrcbgzws1m, 1000)
        CpeAndCpm.rccpm3m = amendNumber(rcbgzws3m, 1000) > 2147483648 ? 2147483600 : amendNumber(rcbgzws3m, 1000)
        CpeAndCpm.zrrccpm3m = amendNumber(rcbgzws3m, 1000) > 2147483648 ? 2147483600 : amendNumber(zrrcbgzws3m, 1000)
        CpeAndCpm.rccpm = 0
    }
    Object.assign(capability, CpeAndCpm)
};
function tagAdjustment(tags: any[]) {
    let contentTags: string[] = [];
    let subContentTags: string[] = [];
    if (tags) {
        tags.forEach((tag) => {
            Object.keys(tag).forEach(key => {
                const subTags = tag[key];
                if (subTags instanceof Array) {
                    subTags.forEach((item) => {
                        subContentTags.push(item);
                    });
                } else if (typeof subTags == 'string') {
                    contentTags.push(subTags);
                }
            });
        });
    }
    return { contentTags, subContentTags };
}
function findMax(list: any, label: string, value: string) {
    let max = '';
    let temp = 0;
    if (Array.isArray(list)) {
        list.forEach(item => {
            const rate = item[value]
            if (temp < rate) {
                temp = rate
                max = item[label]
            }
        })
    } else {
        return {
            label: "",
            value: 0
        }
    }

    // return `${max}(${Math.ceil(temp * 100)}%)`
    return {
        label: max,
        value: Math.ceil(temp * 100)
    }
}
function fansPgyHandler(data: any) {
    let obj: any = {}
    for (let i in data) {
        if (data[i] != null) {
            obj[i] = JSON.stringify(data[i])
        }
    }
    return obj;
}
function handleFanKey(title: string, list: any) {
    list.sort(function (a: any, b: any) {
        if (a.percent < b.percent) {
            return 1;
        }
        if (a.percent > b.percent) {
            return -1;
        }
        return 0;
    })

    const results = []
    for (let i = 0; i < list.length; i++) {
        const { name, percent, desc } = list[i]
        const element: any = {
            title: `TOP${i + 1}${title}`,
            name,
            percent: (percent * 100).toFixed(2)
        }
        if (desc) {
            delete element.name
            element.desc = desc
        }
        if (i > 4) {
            break
        }
        results.push(element)
    }
    return results
};
function funSummaryMap(fansSummaryData: any, fansProfileData: any, capability: any) {
    let {
        fansIncreaseNum,
        fansGrowthRate,
        activeFansRate,
        readFansRate,
        engageFansRate,
    } = fansSummaryData;
    let {
        ages,
        cities,
        devices,
        gender,
        interests,
        provinces,
    } = fansProfileData;
    const nlfbMax = findMax(ages, 'group', 'percent');
    const csfbMax = findMax(cities, 'name', 'percent');
    const sbfbMax = findMax(devices, 'desc', 'percent');
    const yhxqMax = findMax(interests, 'name', 'percent');
    const sffbMax = findMax(provinces, 'name', 'percent');
    let { male, female } = gender

    let xbfb = ''
    if ((typeof male == 'number') && typeof (female == 'number')) {
        xbfb = male >= female ? `男性(${Math.ceil(male * 100)}%)` : `女性(${Math.ceil(female * 100)}%)`
    }
    console.log("fansGrowthRate", fansGrowthRate);

    const hxsj = {
        fsKey: nlfbMax.label + `(${nlfbMax.value}%)` + csfbMax.label + `(${csfbMax.value}%)` + sbfbMax.label + `(${sbfbMax.value}%)` + yhxqMax.label + `(${yhxqMax.value}%)` + sffbMax.label + `(${sffbMax.value}%)` + xbfb,
        fszl: fansIncreaseNum - 0,
        fslbhfd: (fansGrowthRate - 0) * 100,
        hyfszb: activeFansRate - 0,
        ydfszb: readFansRate - 0,
        hdfszb: engageFansRate - 0,
        fsMaleRate: Math.ceil(male * 100),
        fsFemaleRate: 100 - Math.ceil(male * 100),
        nlfbMax: nlfbMax.label,
        nlfbRate: nlfbMax.value,
        csfbMax: csfbMax.label,
        csfbRate: csfbMax.value,
        sbfbMax: sbfbMax.label,
        sbfbRate: sbfbMax.value,
        yhxqMax: yhxqMax.label,
        yhxqRate: yhxqMax.value,
        sffbMax: sffbMax.label,
        sffbRate: sffbMax.value,

    }
    const fsKeyJson = {
        ages: ages.map((item: any) => {
            const { percent, group } = item;
            return { percent: `${(percent * 100).toFixed(2)}`, group }
        }),
        cities: handleFanKey("城市", cities),
        devices: handleFanKey("粉丝设备", devices),
        interests: handleFanKey("用户兴趣", interests),
        provinces: handleFanKey("省份", provinces),
    }
    capability.fsKeyJson = JSON.stringify(fsKeyJson)
    Object.assign(capability, hxsj)

    return {
        粉丝画像: {
            年龄分布: ages,
            城市分布: cities,
            设备分布: devices,
            性别分布: gender,
            用户兴趣: interests,
            省份分布: provinces,
        },
    };
}
function contentPercent(noteTypeList: any) {
    if (noteTypeList) {
        noteTypeList = noteTypeList.map((item: any) => {
            let { contentTag, percent } = item;
            return {
                [contentTag + '类目占比']: percent
            };
        });
    }
    return noteTypeList;
}
function notesRateMap1m(notesDailyRate: any, noteCooperationRate: any, zrNotesDailyRate: any, zrNoteCooperationRate: any, capability: any) {
    const dailyPagePercent = notesDailyRate.pagePercentVo;
    const cooperationPagePercent = noteCooperationRate.pagePercentVo;
    const cooperateNote = {
        bgzws1m: noteCooperationRate.impMedian - 0,
        ydzws1m: noteCooperationRate.readMedian - 0,
        hdzws1m: noteCooperationRate.mEngagementNum - 0,
        zwdzl1m: noteCooperationRate.likeMedian - 0,
        zwscl1m: noteCooperationRate.collectMedian - 0,
        zwpll1m: noteCooperationRate.commentMedian - 0,
        zwfxl1m: noteCooperationRate.shareMedian - 0,
        hdl1m: noteCooperationRate.interactionRate - 0,
        spwbl1m: noteCooperationRate.videoFullViewRate - 0,
        tw3mydl1m: noteCooperationRate.picture3sViewRate - 0,
        qzbjbl1m: noteCooperationRate.thousandLikePercent - 0,
        bzbjbl1m: noteCooperationRate.hundredLikePercent - 0,
        fbbj1m: noteCooperationRate.noteNumber - 0,
        rcbgzws1m: notesDailyRate.impMedian - 0,
        rcydzws1m: notesDailyRate.readMedian - 0,
        rchdzws1m: notesDailyRate.mEngagementNum - 0,
        rczwdzl1m: notesDailyRate.likeMedian - 0,
        rczwscl1m: notesDailyRate.collectMedian - 0,
        rczwpll1m: notesDailyRate.commentMedian - 0,
        rczwfxl1m: notesDailyRate.shareMedian - 0,
        rchdl1m: notesDailyRate.interactionRate - 0,
        rcspwbl1m: notesDailyRate.videoFullViewRate - 0,
        rctw3mydl1m: notesDailyRate.picture3sViewRate - 0,
        rcqzbjbl1m: notesDailyRate.thousandLikePercent - 0,
        rcbzbjbl1m: notesDailyRate.hundredLikePercent - 0,
        rcfbbj1m: notesDailyRate.noteNumber - 0,


        zrbgzws1m: zrNoteCooperationRate.impMedian - 0,
        zrydzws1m: zrNoteCooperationRate.readMedian - 0,
        zrhdzws1m: zrNoteCooperationRate.mEngagementNum - 0,
        zrzwdzl1m: zrNoteCooperationRate.likeMedian - 0,
        zrzwscl1m: zrNoteCooperationRate.collectMedian - 0,
        zrzwpll1m: zrNoteCooperationRate.commentMedian - 0,
        zrzwfxl1m: zrNoteCooperationRate.shareMedian - 0,
        zrhdl1m: zrNoteCooperationRate.interactionRate - 0,
        zrspwbl1m: zrNoteCooperationRate.videoFullViewRate - 0,
        zrtw3mydl1m: zrNoteCooperationRate.picture3sViewRate - 0,
        zrqzbjbl1m: zrNoteCooperationRate.thousandLikePercent - 0,
        zrbzbjbl1m: zrNoteCooperationRate.hundredLikePercent - 0,
        zrfbbj1m: zrNoteCooperationRate.noteNumber - 0,

        zrrcbgzws1m: zrNotesDailyRate.impMedian - 0,
        zrrcydzws1m: zrNotesDailyRate.readMedian - 0,
        zrrchdzws1m: zrNotesDailyRate.mEngagementNum - 0,
        zrrczwdzl1m: zrNotesDailyRate.likeMedian - 0,
        zrrczwscl1m: zrNotesDailyRate.collectMedian - 0,
        zrrczwpll1m: zrNotesDailyRate.commentMedian - 0,
        zrrczwfxl1m: zrNotesDailyRate.shareMedian - 0,
        zrrchdl1m: zrNotesDailyRate.interactionRate - 0,
        zrrcspwbl1m: zrNotesDailyRate.videoFullViewRate - 0,
        zrrctw3mydl1m: zrNotesDailyRate.picture3sViewRate - 0,
        zrrcqzbjbl1m: zrNotesDailyRate.thousandLikePercent - 0,
        zrrcbzbjbl1m: zrNotesDailyRate.hundredLikePercent - 0,
        zrrcfbbj1m: zrNotesDailyRate.noteNumber - 0,
    }
    Object.assign(capability, cooperateNote)
    return {
        日常笔记: {
            // 核心表现: {
            //     曝光中位数: notesDailyRate.impMedian,
            //     阅读中位数: notesDailyRate.readMedian,
            //     互动中位数: notesDailyRate.interactionMedian,
            //     中位点赞量: notesDailyRate.likeMedian,
            //     中位收藏量: notesDailyRate.collectMedian,
            //     中位评论量: notesDailyRate.commentMedian,
            //     中位分享量: notesDailyRate.shareMedian,
            //     互动率: notesDailyRate.interactionRate,
            //     视频完播率: notesDailyRate.videoFullViewRate,
            //     图文3秒阅读率: notesDailyRate.picture3sViewRate,
            //     千赞笔记比例: notesDailyRate.thousandLikePercent,
            //     百赞笔记比例: notesDailyRate.hundredLikePercent,
            // },
            发布笔记: notesDailyRate.noteNumber,
            内容类目及占比: contentPercent(
                notesDailyRate.noteType
            ),
            合作行业: notesDailyRate.tradeNames,
            阅读量来源: dailyPagePercent
                ? {
                    发现页: dailyPagePercent.readHomefeedPercent,
                    搜索页: dailyPagePercent.readSearchPercent,
                    关注页: dailyPagePercent.readFollowPercent,
                    博主个人页: dailyPagePercent.readDetailPercent,
                    附近页: dailyPagePercent.readNearbyPercent,
                    其他: dailyPagePercent.readOtherPercent,
                }
                : '',
            曝光量来源: dailyPagePercent
                ? {
                    发现页: dailyPagePercent.impHomefeedPercent,
                    搜索页: dailyPagePercent.impSearchPercent,
                    关注页: dailyPagePercent.impFollowPercent,
                    博主个人页: dailyPagePercent.impDetailPercent,
                    附近页: dailyPagePercent.impNearbyPercent,
                    其他: dailyPagePercent.impOtherPercent,
                }
                : '',
        },
        合作笔记: {
            // 核心表现: {
            //     曝光中位数: noteCooperationRate.impMedian,
            //     阅读中位数: noteCooperationRate.readMedian,
            //     互动中位数: noteCooperationRate.interactionMedian,
            //     中位点赞量: noteCooperationRate.likeMedian,
            //     中位收藏量: noteCooperationRate.collectMedian,
            //     中位评论量: noteCooperationRate.commentMedian,
            //     中位分享量: noteCooperationRate.shareMedian,
            //     互动率: noteCooperationRate.interactionRate,
            //     视频完播率: noteCooperationRate.videoFullViewRate,
            //     图文3秒阅读率: noteCooperationRate.picture3sViewRate,
            //     千赞笔记比例: noteCooperationRate.thousandLikePercent,
            //     百赞笔记比例: noteCooperationRate.hundredLikePercent,
            // },
            发布笔记: noteCooperationRate.noteNumber,
            内容类目及占比: contentPercent(
                noteCooperationRate.noteType
            ),
            合作行业: noteCooperationRate.tradeNames,
            阅读量来源: cooperationPagePercent
                ? {
                    发现页:
                        cooperationPagePercent.readHomefeedPercent,
                    搜索页: cooperationPagePercent.readSearchPercent,
                    关注页: cooperationPagePercent.readFollowPercent,
                    博主个人页:
                        cooperationPagePercent.readDetailPercent,
                    附近页: cooperationPagePercent.readNearbyPercent,
                    其他: cooperationPagePercent.readOtherPercent,
                }
                : '',
            曝光量来源: cooperationPagePercent
                ? {
                    发现页: cooperationPagePercent.impHomefeedPercent,
                    搜索页: cooperationPagePercent.impSearchPercent,
                    关注页: cooperationPagePercent.impFollowPercent,
                    博主个人页:
                        cooperationPagePercent.impDetailPercent,
                    附近页: cooperationPagePercent.impNearbyPercent,
                    其他: cooperationPagePercent.impOtherPercent,
                }
                : '',
        },
    };
}
function notesRateMap3m(notesDailyRate: any, noteCooperationRate: any, zrNotesDailyRate: any, zrNoteCooperationRate: any, capability: any) {
    const dailyPagePercent = notesDailyRate.pagePercentVo;
    const cooperationPagePercent = noteCooperationRate.pagePercentVo;
    const cooperateNote = {
        bgzws3m: noteCooperationRate.impMedian - 0,
        ydzws3m: noteCooperationRate.readMedian - 0,
        hdzws3m: noteCooperationRate.mEngagementNum - 0,
        zwdzl3m: noteCooperationRate.likeMedian - 0,
        zwscl3m: noteCooperationRate.collectMedian - 0,
        zwpll3m: noteCooperationRate.commentMedian - 0,
        zwfxl3m: noteCooperationRate.shareMedian - 0,
        hdl3m: noteCooperationRate.interactionRate - 0,
        spwbl3m: noteCooperationRate.videoFullViewRate - 0,
        tw3mydl3m: noteCooperationRate.picture3sViewRate - 0,
        qzbjbl3m: noteCooperationRate.thousandLikePercent - 0,
        bzbjbl3m: noteCooperationRate.hundredLikePercent - 0,
        fbbj3m: noteCooperationRate.noteNumber - 0,
        rcbgzws3m: notesDailyRate.impMedian - 0,
        rcydzws3m: notesDailyRate.readMedian - 0,
        rchdzws3m: notesDailyRate.mEngagementNum - 0,
        rczwdzl3m: notesDailyRate.likeMedian - 0,
        rczwscl3m: notesDailyRate.collectMedian - 0,
        rczwpll3m: notesDailyRate.commentMedian - 0,
        rczwfxl3m: notesDailyRate.shareMedian - 0,
        rchdl3m: notesDailyRate.interactionRate - 0,
        rcspwbl3m: notesDailyRate.videoFullViewRate - 0,
        rctw3mydl3m: notesDailyRate.picture3sViewRate - 0,
        rcqzbjbl3m: notesDailyRate.thousandLikePercent - 0,
        rcbzbjbl3m: notesDailyRate.hundredLikePercent - 0,
        rcfbbj3m: notesDailyRate.noteNumber - 0,

        zrbgzws3m: zrNoteCooperationRate.impMedian - 0,
        zrydzws3m: zrNoteCooperationRate.readMedian - 0,
        zrhdzws3m: zrNoteCooperationRate.mEngagementNum - 0,
        zrzwdzl3m: zrNoteCooperationRate.likeMedian - 0,
        zrzwscl3m: zrNoteCooperationRate.collectMedian - 0,
        zrzwpll3m: zrNoteCooperationRate.commentMedian - 0,
        zrzwfxl3m: zrNoteCooperationRate.shareMedian - 0,
        zrhdl3m: zrNoteCooperationRate.interactionRate - 0,
        zrspwbl3m: zrNoteCooperationRate.videoFullViewRate - 0,
        zrtw3mydl3m: zrNoteCooperationRate.picture3sViewRate - 0,
        zrqzbjbl3m: zrNoteCooperationRate.thousandLikePercent - 0,
        zrbzbjbl3m: zrNoteCooperationRate.hundredLikePercent - 0,
        zrfbbj3m: zrNoteCooperationRate.noteNumber - 0,
        zrrcbgzws3m: zrNotesDailyRate.impMedian - 0,
        zrrcydzws3m: zrNotesDailyRate.readMedian - 0,
        zrrchdzws3m: zrNotesDailyRate.mEngagementNum - 0,
        zrrczwdzl3m: zrNotesDailyRate.likeMedian - 0,
        zrrczwscl3m: zrNotesDailyRate.collectMedian - 0,
        zrrczwpll3m: zrNotesDailyRate.commentMedian - 0,
        zrrczwfxl3m: zrNotesDailyRate.shareMedian - 0,
        zrrchdl3m: zrNotesDailyRate.interactionRate - 0,
        zrrcspwbl3m: zrNotesDailyRate.videoFullViewRate - 0,
        zrrctw3mydl3m: zrNotesDailyRate.picture3sViewRate - 0,
        zrrcqzbjbl3m: zrNotesDailyRate.thousandLikePercent - 0,
        zrrcbzbjbl3m: zrNotesDailyRate.hundredLikePercent - 0,
        zrrcfbbj3m: zrNotesDailyRate.noteNumber - 0,

    }
    Object.assign(capability, cooperateNote)
    return {
        日常笔记: {
            // 核心表现: {
            //     曝光中位数: notesDailyRate.impMedian,
            //     阅读中位数: notesDailyRate.readMedian,
            //     互动中位数: notesDailyRate.interactionMedian,
            //     中位点赞量: notesDailyRate.likeMedian,
            //     中位收藏量: notesDailyRate.collectMedian,
            //     中位评论量: notesDailyRate.commentMedian,
            //     中位分享量: notesDailyRate.shareMedian,
            //     互动率: notesDailyRate.interactionRate,
            //     视频完播率: notesDailyRate.videoFullViewRate,
            //     图文3秒阅读率: notesDailyRate.picture3sViewRate,
            //     千赞笔记比例: notesDailyRate.thousandLikePercent,
            //     百赞笔记比例: notesDailyRate.hundredLikePercent,
            // },
            发布笔记: notesDailyRate.noteNumber,
            内容类目及占比: contentPercent(
                notesDailyRate.noteType
            ),
            合作行业: notesDailyRate.tradeNames,
            阅读量来源: dailyPagePercent
                ? {
                    发现页: dailyPagePercent.readHomefeedPercent,
                    搜索页: dailyPagePercent.readSearchPercent,
                    关注页: dailyPagePercent.readFollowPercent,
                    博主个人页: dailyPagePercent.readDetailPercent,
                    附近页: dailyPagePercent.readNearbyPercent,
                    其他: dailyPagePercent.readOtherPercent,
                }
                : '',
            曝光量来源: dailyPagePercent
                ? {
                    发现页: dailyPagePercent.impHomefeedPercent,
                    搜索页: dailyPagePercent.impSearchPercent,
                    关注页: dailyPagePercent.impFollowPercent,
                    博主个人页: dailyPagePercent.impDetailPercent,
                    附近页: dailyPagePercent.impNearbyPercent,
                    其他: dailyPagePercent.impOtherPercent,
                }
                : '',
        },
        合作笔记: {
            // 核心表现: {
            //     曝光中位数: noteCooperationRate.impMedian,
            //     阅读中位数: noteCooperationRate.readMedian,
            //     互动中位数: noteCooperationRate.interactionMedian,
            //     中位点赞量: noteCooperationRate.likeMedian,
            //     中位收藏量: noteCooperationRate.collectMedian,
            //     中位评论量: noteCooperationRate.commentMedian,
            //     中位分享量: noteCooperationRate.shareMedian,
            //     互动率: noteCooperationRate.interactionRate,
            //     视频完播率: noteCooperationRate.videoFullViewRate,
            //     图文3秒阅读率: noteCooperationRate.picture3sViewRate,
            //     千赞笔记比例: noteCooperationRate.thousandLikePercent,
            //     百赞笔记比例: noteCooperationRate.hundredLikePercent,
            // },
            发布笔记: noteCooperationRate.noteNumber,
            内容类目及占比: contentPercent(
                noteCooperationRate.noteType
            ),
            合作行业: noteCooperationRate.tradeNames,
            阅读量来源: cooperationPagePercent
                ? {
                    发现页:
                        cooperationPagePercent.readHomefeedPercent,
                    搜索页: cooperationPagePercent.readSearchPercent,
                    关注页: cooperationPagePercent.readFollowPercent,
                    博主个人页:
                        cooperationPagePercent.readDetailPercent,
                    附近页: cooperationPagePercent.readNearbyPercent,
                    其他: cooperationPagePercent.readOtherPercent,
                }
                : '',
            曝光量来源: cooperationPagePercent
                ? {
                    发现页: cooperationPagePercent.impHomefeedPercent,
                    搜索页: cooperationPagePercent.impSearchPercent,
                    关注页: cooperationPagePercent.impFollowPercent,
                    博主个人页:
                        cooperationPagePercent.impDetailPercent,
                    附近页: cooperationPagePercent.impNearbyPercent,
                    其他: cooperationPagePercent.impOtherPercent,
                }
                : '',
        },
    };
}
function notesDataMap(dailyNotesData: any, cooperationNotesData: any, capability: any) {
    const data = {
        fbbj: cooperationNotesData.noteNumber - 0,
        ydzws: cooperationNotesData.readMedian - 0,
        hdzws: cooperationNotesData.mEngagementNum - 0,
        j7thyts: cooperationNotesData.activeDayInLast7 - 0,
        yy48xshfl: cooperationNotesData.responseRate - 0,
        ygyddj_tw: cooperationNotesData.pictureReadCost - 0,
        ygyddj_sp: cooperationNotesData.videoReadCost - 0,
        rcydzws: dailyNotesData.readMedian - 0,
        rchdzws: dailyNotesData.mEngagementNum - 0,
        rcj7thyts: dailyNotesData.activeDayInLast7 - 0,
        rcyy48xshfl: dailyNotesData.responseRate - 0,
        rcygyddj_tw: dailyNotesData.pictureReadCost - 0,
        rcygyddj_sp: dailyNotesData.videoReadCost - 0,
    }
    Object.assign(capability, data)
    return {
        发布笔记: dailyNotesData.noteNumber,
        内容类目及占比: contentPercent(
            dailyNotesData.noteType
        ),
        合作行业: dailyNotesData.tradeNames,
        日常笔记: {
            阅读中位数: dailyNotesData.readMedian,
            互动中位数: dailyNotesData.interactionMedian,
            近7天活跃天数: dailyNotesData.activeDayInLast7,
            邀约48小时回复率: dailyNotesData.responseRate,
            '预估阅读单价(图文)': dailyNotesData.pictureReadCost,
            '预估阅读单价(视频)': dailyNotesData.videoReadCost,
            粉丝量变化幅度: dailyNotesData.fans30GrowthRate,
        },
        合作笔记: {
            阅读中位数: cooperationNotesData.readMedian,
            互动中位数: cooperationNotesData.interactionMedian,
            近7天活跃天数: cooperationNotesData.activeDayInLast7,
            邀约48小时回复率: cooperationNotesData.responseRate,
            '预估阅读单价(图文)':
                cooperationNotesData.pictureReadCost,
            '预估阅读单价(视频)':
                cooperationNotesData.videoReadCost,
            粉丝量变化幅度: cooperationNotesData.fans30GrowthRate,
        },
    }
}