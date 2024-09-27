import {Context, Options} from "../handler.interface";
import {For, Msg, Aim, Grab} from "../enum";
import {CollectHandler} from '../handler.collect'
import {content2Background, patchFrom} from "../bridge";
import {objectToList, tryDo, getDomText, getAuthorContentData, portRequest} from "../util";
import {text2Int} from "../filter";

export class XtResourceHandler extends CollectHandler {
    constructor(context: Context, option: Options) {
        super(context, option);
    }

    _getElClass() {
        return ".top-info .link-index";
    }

    async _parser() {
        const {grab} = this.options
        if(grab && grab == Grab.抓取全部数据){
            const mainDataPromise = this.collectMainData();
            const contentShowPromise = this.collectContextShowDataFromApiGet(mainData.xtId)
            const otherDataPromise = this.collectOtherData();
            const [mainData, otherData,contentShowData] = await Promise.all([mainDataPromise, otherDataPromise, contentShowPromise]);
            return mainData;
        }else{
            const mainData = await this.collectMainData();
            // 1、内容表现
            this.collectContextShowDataFromApiGet(mainData.xtId)
            // 2、最新15个视频表现柱状图
            // 3、受众标签类型
            // 4、星图指数筛选条件
            this.collectOtherData();
            return mainData;
        }


        const {
            platform,
            origin,
            photo,
            site,
            platformSite,
            name,
            fanCount,
            sex,
            region,
            mcn,
            introduce,
            version,
            uid,
            shortId,
            secUid,
            clean,
            mediaId,
            level,
            xtId,
            rank,
            price,
            fieldTags,
            contentTags,
            patch,
            dataOverview,
            subContentTags,
            subFieldTags,
            capability
        } = await this.collectMainData();// 原基础数据

        // 额外数据 - 240925
        // 1、内容表现
        const resultAuthorContent = await this.collectContextShowDataFromApiGet(xtId);
        // 2、最新15个视频表现柱状图
        // 3、受众标签类型
        // 4、星图指数筛选条件
        const otherData = await this.collectOtherData();
        const form = {
            platform,
            origin,
            photo,
            site,
            platformSite,
            name,
            fanCount,
            sex,
            region,
            mcn,
            introduce,
            version,
            uid,
            shortId,
            secUid,
            clean,
            mediaId,
            level,
            xtId,
            rank,
            price,
            fieldTags,
            contentTags,
            patch,
            dataOverview,
            subContentTags,
            subFieldTags,
            capability,
            resultAuthorContent,
            otherData
        }
        console.log("===== get xt original resource data ====\n", form);
        return form;
    }

    _formMeta(form: any) {
        let {options, reactive} = this;
        reactive.title = `资源基本信息(${options.version})`;
        const priceSubList = objectToList(form.price, this.render);
        const dataOverviewSubList = objectToList(form.dataOverview, this.render);
        const capabilityList = objectToList(form.capability, this.render);
        const rankList = objectToList(form.rank, this.render);
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
                        html: form.introduce
                            ? this.render.site(form.introduce)
                            : '',
                    },
                    {
                        span: 4,
                        html: this.render.label('能力'),
                    },
                    {
                        span: 20,
                        html: form.capability
                            ? Object.values(form.capability).join(',')
                            : '',
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
                        html: this.render.label('一级内容标签'),
                    },
                    {
                        span: 8,
                        html: form.contentTags.join(','),
                    },
                    {
                        span: 4,
                        html: this.render.label('二级内容标签'),
                    },
                    {
                        span: 8,
                        html: form.subContentTags.join(','),
                    },
                    {
                        span: 4,
                        html: this.render.label('一级行业标签'),
                    },
                    {
                        span: 8,
                        html: form.fieldTags.join(','),
                    },
                    {
                        span: 4,
                        html: this.render.label('二级行业标签'),
                    },
                    {
                        span: 8,
                        html: form.subFieldTags.join(','),
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
                        span: 24,
                        html: this.render.title('数据'),
                    },
                    ...capabilityList,
                    ...dataOverviewSubList,
                    ...rankList,
                    {
                        span: 24,
                        html: this.render.title('价格'),
                    },
                    ...priceSubList,
                ],
            },
        ];
    }

    _makeParams(form: any) {
        const {rank, price, capability, dataOverview, ...others} = form
        return {
            ...others,
            rank: JSON.stringify(rank),
            price: JSON.stringify(price),
            capability: JSON.stringify(capability),
            dataOverview: JSON.stringify(dataOverview)
        }
    }

    _validateSubmit(form: any) {
        return true;
    }

    async _ending(form: any) {
        const {tag, gaoqId, fromTabId, forGaoqu, fromId} = this.options;
        if (fromTabId && gaoqId && fromTabId > 0 && forGaoqu == For.爬取星图等级) {
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
        } else if (fromTabId && fromTabId > 0 && forGaoqu == For.主页自动入库) {
            console.log("this", this);

            let {id, token} = this.userTabId.user;
            form.opId = id;
            console.log("token", token);

            let res: any = {};
            let error = null;
            try {
                res = await this.api.extension.import(
                    form,
                    token
                );
            } catch (e) {
                error = e;
            }
            return content2Background(
                patchFrom(
                    {
                        id: gaoqId,
                        res: {form, data: res.data, error},
                        toTabId: fromTabId,
                        toId: fromId,
                        msg:
                        Msg.content通过background转发其他content发送给page,
                        aim: Aim.通知已入库,
                        closeTab: true,
                    },
                    tag
                )
            );
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

    async collectMainData() {
        let mediaId = '';
        let uid = '';
        let shortId = '';
        let secUid = '';
        let mcn = '';
        let fanCount = '';
        let sex = '';
        let photo = '';
        let price = {};
        let data: any = {};
        let customTags = [];
        const {clean, xtId, platformSite} = this.locationData();
        const page = document.querySelector(
            '.author-base-info .other-author-pages'
        );
        if (page == null) {
            // 短视频博主主页
            // this.context.resourceXt = {}
            const {
                mcn,
                uid,
                sex,
                site,
                name,
                level,
                photo,
                secUid,
                region,
                shortId,
                mediaId,
                fanCount,
                introduce,
                price_info,
                industry_tags,
                tags_relation,
                hot_list_ranks, //rank
                // xtFieldIndexList,
                // promisesOrderList,
                // authorContentMap
            } = await this.baseBusData();
            const publishMediaIdAnduid = {
                url: "publishMediaIdAnduid",
                data: {
                    mediaId,
                    bloggerId: uid,
                    // ...cepAndCpmMap,
                    // ...authorContent
                }
            }
            const busData = await this.busData();
            const busGetContact: any = await this.busGetContact();
            data = {
                platform: '抖音',
                origin: '星图',
                photo,
                site,
                platformSite,
                name,
                fanCount,
                sex,
                region,
                mcn,
                introduce,
                version: this.options.version,
                uid,
                shortId,
                secUid,
                clean,
                mediaId,
                level,
                xtId,
            };
            const {
                monthTouchCount,
                monthConnectCount,
            } = this.dom2Data();
            const {
                rank,
                price,
                fieldTags,
                contentTags,
                subFieldTags,
                dataOverview,
                subContentTags,
                cepAndCpmMap,
                authorContent,
            } = this.dataHandle(
                price_info,
                tags_relation,
                industry_tags,
                monthTouchCount,
                monthConnectCount,
                busData,
                hot_list_ranks,
            );
            data.rank = rank;
            data.price = price;
            data.fieldTags = fieldTags;
            data.contentTags = contentTags;
            data.patch = busGetContact;
            data.dataOverview = {...dataOverview, ...busGetContact};
            data.subContentTags = subContentTags;
            data.subFieldTags = subFieldTags;
            data.capability = {...cepAndCpmMap, ...authorContent};
            // 将capability 数据直接传给 collectOtherData 方法
            // collectOtherData 方法 每收集一次数据都会同步到 vm.resourceXt
            // collectOtherData 方法 异步时 库内会在extension_import或者resouce表里面存在该资源，collectOtherData 方法按批次量更新

            // bus.publish(JSON.stringify(publishMediaIdAnduid))
            // console.log("done publish", publishMediaIdAnduid);
            // data.capability = vm.resourceXt;
        }
        return data;

    }

    locationData() {
        const clean = '抖音id修正';
        const href = location.href;
        const xtId = href.match(/\/douyin\/(\d+)/)![1];
        let {origin, pathname} = window.location;
        let platformSite = origin + pathname;
        const data = {
            xtId,
            clean,
            platformSite,
        };
        console.log('locationData ok', data);
        return data;
    }

    async baseBusData() {
        const bus = this.context.$bus;
        const baseInfoPromise: any = bus.subscribe(
            /\/api\/author\/get_author_base_info/,
            (rs: any) => {
                let body = bus.parseBody(rs);
                return body.hasOwnProperty('nick_name') ? body : false;
            }
        );
        const marketingInfoPromise: any = bus.subscribe(
            /\/api\/author\/get_author_marketing_info/,
            (rs: any) => {
                let body = bus.parseBody(rs);
                return body.hasOwnProperty('hot_list_ranks') ? body : false;
            }
        );
        const introducePromise: any = bus.subscribe(
            /\/api\/author\/get_author_platform_channel_info_v2/,
            (rs: any) => {
                let body = bus.parseBody(rs);
                return body.hasOwnProperty('self_intro') ? body : false;
            }
        );

        const [
            baseInfoBody,
            marketInfoBody,
            introduceBody,

        ] = await Promise.all([
            baseInfoPromise,
            marketingInfoPromise,
            introducePromise,
        ]);
        const {
            grade,
            mcn_name,
            id,
            gender,
            nick_name,
            province,
            city,
            sec_uid,
            short_id,
            // core_user_id,
            unique_id,
            tags_relation,
            avatar_uri,
            follower,
        } = baseInfoBody;
        console.log("basePort ok", {baseInfoBody, marketInfoBody, introduceBody});
        const mediaId = unique_id;
        const name = nick_name;
        const shortId = short_id;
        const secUid = sec_uid;
        const mcn = mcn_name;
        const photo = avatar_uri;
        const sex = 1 == gender ? '男' : '女';
        const site = 'https://www.douyin.com/user/' + secUid;
        let region = province + ' ' + city;
        region = region ? region.trim() : region;
        let level = 'LV' + grade; //星图等级
        const {
            price_info,
            industry_tags,
            hot_list_ranks,
        } = marketInfoBody;
        const data = {
            mcn,
            uid: secUid,
            sex,
            site,
            name,
            level,
            photo,
            secUid,
            region,
            shortId,
            mediaId,
            price_info,
            tags_relation,
            industry_tags,
            hot_list_ranks,
            fanCount: follower,
            introduce: introduceBody.self_intro,
        };
        console.log('baseBusData ok', data);
        return data;
    }

    async busData() {
        const bus = this.context.$bus;
        let data = {}
        const tabList: any = await tryDo(1500, () => {
            const clickDom = document.querySelector('.page-right .card-panel .is-top[role="tablist"]')
            if (clickDom) {
                const tabList = clickDom.children;
                if (tabList && tabList[2]) {
                    return tabList
                }
            }
            return false
        });

        if (tabList && tabList[2]) {
            console.log("tabList[2]", 1);
            tabList[2].click();
            // 预期cpm cpe
            const authorContent1mPromise: any = bus.subscribe(
                /\/api\/data_sp\/get_author_spread_info/,
                (rs: any) => {
                    console.log("get_author_spread_info", rs);
                    let body = bus.parseBody(rs);
                    return body.hasOwnProperty('expect_cpe') ? body : false;
                }
            );
            // 内容类型占比
            const authorVideoDistributionPromise: any = bus.subscribe(
                /\/api\/data_sp\/author_video_distribution/,
                (rs: any) => {
                    let body = bus.parseBody(rs);
                    return body.hasOwnProperty('video_content_distribution') ? body : false;
                }
            );

            const [
                authorContent1m,
                authorVideoDistribution,
            ] = await Promise.all([
                authorContent1mPromise,
                authorVideoDistributionPromise,
            ]);
            const {video_content_distribution} = authorVideoDistribution;
            tabList[1].click();
            data = {
                authorContent1m,
                // authorBusinessCapabilitiesNoLimit: {},
                // authorBusinessCapabilitiesNoLimit: bus.parseBody(authorBusinessCapabilitiesNoLimit),
                video_content_distribution,
            };
        }

        console.log('busData ok', data);
        return data;
    }

    async busGetContact() {
        const {$bus, $Message} = this.context;
        return new Promise(async (resolve, reject) => {
            const data: any = {}
            setTimeout(() => {
                resolve(data)
            }, 2000)
            let contactPromise: any = {}
            try {
                // api/gauthor/author_get_business_card_info
                contactPromise = $bus.subscribe(
                    /\/api\/gauthor\/author_get_business_card_info/,
                    (rs: any) => {
                        console.log("author_get_business_card_info", rs);
                        let body = $bus.parseBody(rs);
                        return body.hasOwnProperty('base_resp') ? body : false;
                    }
                );
            } catch (error) {
                $Message.error({content: "星图新增抓取数据，需重新安装插件"})
                console.log("contactPromise", contactPromise, error);
            }
            const [
                contact
            ] = await Promise.all([
                contactPromise
            ]);
            console.log("contact", contact);
            if (contact) {
                const {card_info} = contact;
                // console.log("card_info", card_info);
                if (card_info) {
                    const {wechat, email} = card_info
                    // let wx = card_info.contact
                    // console.log("card_info.contact", card_info.contact);
                    data.wxId = wechat
                    if (email) {
                        data.email = email
                    }
                }
            }
            console.log("contact", data);
            resolve(data)
        })
    }

    dom2Data() {
        let list = getDomText('.author-page-info .link-index').split('\n');
        const monthConnectCount = text2Int(list[1]);
        const monthTouchCount = text2Int(list[3]);
        const data = {
            monthTouchCount,
            monthConnectCount,
        };
        console.log('dom2Data ok', data);
        return data;
    }

    dataHandle(
        price_info: any,
        tags_relation: any,
        industry_tags: any,
        monthTouchCount: any,
        monthConnectCount: any,
        busData: any,
        hot_list_ranks: any,
    ) {
        const {
            authorContent1m,
            video_content_distribution,
            // last15VideoBody,
            // xtIndexBody,
            // connectUsersBody,
            // audiencePortraitBody,
            // fansPortraitBody
        } = busData;
        console.log("authorContent1m", authorContent1m);

        const authorContent = this.getAuthorContent({authorContent1m})
        let price = {};
        if (price_info && price_info.length > 0) {
            const priceMap: any = {};
            price_info.forEach((item: any) => {
                if (item.price) {
                    priceMap[item.desc] = item.price;
                }
            });
            price = priceMap;
        }

        let videoContentType = {}
        if (video_content_distribution) {
            videoContentType = this.contentTypeHandle(
                video_content_distribution
            );
        }
        let cepAndCpmMap = {}
        if (authorContent1m) {
            cepAndCpmMap = this.getCpeAndCpm(authorContent1m)
        }

        let subContentTags: any = [];
        let subFieldTags: any = [];
        let fieldTags: any = [];
        let contentTags = Object.keys(tags_relation);
        if (contentTags) {
            contentTags.forEach((item) => {
                subContentTags = [...subContentTags, ...tags_relation[item]];
            });
        }
        if (industry_tags) {
            industry_tags.forEach((item: any) => {
                const arr = item.split('-');
                subFieldTags.push(arr[1]);
                if (!fieldTags.includes(arr[0])) {
                    fieldTags.push(arr[0]);
                }
            });
        }


        const dataOverview = {
            内容类型分析: videoContentType,
            数据概览: {
                月连接用户数: monthConnectCount,
                月深度用户数: monthTouchCount,
            },
        };

        const rank: any = {};
        if (hot_list_ranks) {
            hot_list_ranks.forEach((item: any, index: any) => {
                const {
                    hot_list_name,
                    industry_name,
                    rank_level,
                    period,
                } = item;
                const rankElement = {
                    类别榜: hot_list_name,
                    行业: industry_name,
                    时间榜: period,
                    名次: rank_level,
                };
                const key = 'rank' + index;
                rank[key] = rankElement;
            });
        }
        console.log("cepAndCpmMap", cepAndCpmMap);

        const data = {
            rank,
            price,
            fieldTags,
            contentTags,
            subFieldTags,
            dataOverview,
            cepAndCpmMap,
            subContentTags,
            authorContent,
        };
        console.log('dataHandle ok', data);
        return data;
    }

    getAuthorContent(target: any) {
        const authorContent: any = {}
        const authorContentMap: any = {
            authorContent1m: {
                prefix: "gr",
                suffix: '1m'
            },
            authorContent3m: {
                prefix: "gr",
                suffix: '3m'
            },
            authorContentXtAll1m: {
                prefix: "xtAll",
                suffix: '1m'
            },
            authorContentXtAll3m: {
                prefix: "xtAll",
                suffix: '3m'
            }
        }


        // zrrcfbbj3m: zrNotesDailyRate.noteNumber - 0,

        Object.keys(target).forEach(key => {
            if (authorContentMap[key]) {
                const {prefix, suffix} = authorContentMap[key]
                const item = target[key];
                if (item) {
                    const {play_over_rate, interact_rate, item_rate} = target[key]
                    authorContent[prefix + "wblOvertake" + suffix] = getAuthorContentData(play_over_rate, "overtake")
                    authorContent[prefix + "wblValue" + suffix] = getAuthorContentData(play_over_rate, "value")
                    authorContent[prefix + "hdlOvertake" + suffix] = getAuthorContentData(interact_rate, "overtake")
                    authorContent[prefix + "hdlValue" + suffix] = getAuthorContentData(interact_rate, "value")
                    if (item_rate) {
                        const {play_mid, item_num} = item_rate
                        authorContent[prefix + "bflzwsOvertake" + suffix] = getAuthorContentData(play_mid, "overtake")
                        authorContent[prefix + "bflzwsValue" + suffix] = getAuthorContentData(play_mid, "value")
                    }
                    authorContent[prefix + "fbzp" + suffix] = getAuthorContentData(item, "item_num")
                    authorContent[prefix + "pjsc" + suffix] = getAuthorContentData(item, "avg_duration")
                    authorContent[prefix + "pjdz" + suffix] = getAuthorContentData(item, "like_avg")
                    authorContent[prefix + "pjpl" + suffix] = getAuthorContentData(item, "comment_avg")
                    authorContent[prefix + "pjzf" + suffix] = getAuthorContentData(item, "share_avg")
                }
            }
        })

        return authorContent;
    }

    getAuthorContentData(target: any, key: any, multiplier = 1) {
        if (target) {
            const value = target[key];
            if (value) {
                if (typeof value == "number") {
                    return Math.ceil(value * multiplier)
                } else {
                    return Math.ceil(Number(value) * multiplier)
                }
            } else if (value === 0) {
                return value
            }
        }
        return null;
    }

    contentTypeHandle(contentTypeList: any) {
        const map: any = {};
        contentTypeList.forEach((item: any) => {
            const {name, proportion} = item;
            map[name] = proportion;
        });
        return map;
    }

    getCpeAndCpm(target: any) {
        let cepAndCpmMap: any = {}
        if (target) {
            const {expect_cpe, expect_cpm} = target;
            if (expect_cpe) {
                cepAndCpmMap = {
                    cpe120: getAuthorContentData(expect_cpe, 'cpe_1_20'),
                    cpe2160: getAuthorContentData(expect_cpe, 'cpe_21_60'),
                    cpe60: getAuthorContentData(expect_cpe, 'cpe_60'),
                }
            }
            if (expect_cpm) {
                cepAndCpmMap.cpm120 = getAuthorContentData(expect_cpm, 'cpm_1_20')
                cepAndCpmMap.cpm2160 = getAuthorContentData(expect_cpm, 'cpm_21_60')
                cepAndCpmMap.cpm60 = getAuthorContentData(expect_cpm, 'cpm_60')
            }
        }
        return cepAndCpmMap;
    }
    private async portRequest(url: string, attribute: string) {
        let response = null
        try {
            response = await this.api.ajax.get(url);
            console.log("url", url);
            console.log("response", response);
            const pass = response.hasOwnProperty(attribute)
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

    /**
     * 抓取内容表现数据
     * @private
     */
    private async collectContextShowDataFromApiGet(xtId: any) {
        const resultAuthorContent: any = {}
        const authorContentXtUrl1m = (xt_id: string) =>
            `https://www.xingtu.cn/gw/api/data_sp/get_author_spread_info?o_author_id=${xt_id}&platform_source=1&platform_channel=1&range=2&type=2&only_assign=true`;

        const authorContentXtUr3m = (xt_id: string) =>
            `https://www.xingtu.cn/gw/api/data_sp/get_author_spread_info?o_author_id=${xt_id}&platform_source=1&platform_channel=1&range=3&type=2&only_assign=true`;

        const authorContentXtUrl1mPromise = await this.portRequest(authorContentXtUrl1m(xtId), "base_resp");
        const authorContentXtUrl3mPromise = await this.portRequest(authorContentXtUr3m(xtId), "base_resp");
        const [xt1m, xt3m] = await Promise.all([authorContentXtUrl1mPromise, authorContentXtUrl3mPromise]);
        const totalData: any = { xt1m, xt3m };

        const authorContentMap: any = {
            xt1m: {
                prefix: "xtAll",
                suffix: '1m'
            },
            xt3m: {
                prefix: "xtAll",
                suffix: '3m'
            },
        };

        Object.keys(totalData).forEach((key: string) => {
            const data = totalData[key];
            const {prefix, suffix} = authorContentMap[key]
            const handleMap: any = {};
            if (data.hasOwnProperty("base_resp")){
                handleMap[key] = data;
                const {play_over_rate, interact_rate, item_rate} = handleMap[key]
                resultAuthorContent[prefix + "wblOvertake" + suffix] = getAuthorContentData(play_over_rate, "overtake")
                resultAuthorContent[prefix + "wblValue" + suffix] = getAuthorContentData(play_over_rate, "value")
                resultAuthorContent[prefix + "hdlOvertake" + suffix] = getAuthorContentData(interact_rate, "overtake")
                resultAuthorContent[prefix + "hdlValue" + suffix] = getAuthorContentData(interact_rate, "value")
                if (item_rate) {
                    const {play_mid} = item_rate
                    resultAuthorContent[prefix + "bflzwsOvertake" + suffix] = getAuthorContentData(play_mid, "overtake")
                    resultAuthorContent[prefix + "bflzwsValue" + suffix] = getAuthorContentData(play_mid, "value")
                }
                resultAuthorContent[prefix + "fbzp" + suffix] = getAuthorContentData(data, "item_num")
                resultAuthorContent[prefix + "pjsc" + suffix] = getAuthorContentData(data, "avg_duration")
                resultAuthorContent[prefix + "pjdz" + suffix] = getAuthorContentData(data, "like_avg")
                resultAuthorContent[prefix + "pjpl" + suffix] = getAuthorContentData(data, "comment_avg")
                resultAuthorContent[prefix + "pjzf" + suffix] = getAuthorContentData(data, "share_avg")
            }
        });

        return resultAuthorContent;
    }

    getLast15VideoData(totalData: any){
        const resultLast15Video :any = {};

        if (totalData){
            Object.keys(totalData).forEach((key: string) => {
                console.log("totalData",totalData[key], key)
                if (totalData[key]){
                    // bf
                    resultLast15Video[key+ "BfMin"] = totalData[key].bf.min
                    resultLast15Video[key+ "BfMax"] = totalData[key].bf.max
                    resultLast15Video[key+ "BfAvg"] = totalData[key].bf.avg
                    resultLast15Video[key+ "BlSpBfbValue"] = totalData[key].blspbfbvalue
                    // dz
                    resultLast15Video[key+ "DzMin"] = totalData[key].dz.min
                    resultLast15Video[key+ "DzMax"] = totalData[key].dz.max
                    resultLast15Video[key+ "DzAvg"] = totalData[key].dz.avg
                    // pl
                    resultLast15Video[key+ "PlMin"] = totalData[key].pl.min
                    resultLast15Video[key+ "PlMax"] = totalData[key].pl.max
                    resultLast15Video[key+ "PlAvg"] = totalData[key].pl.avg
                    // zf
                    resultLast15Video[key+ "ZfMin"] = totalData[key].zf.min
                    resultLast15Video[key+ "ZfMax"] = totalData[key].zf.max
                    resultLast15Video[key+ "ZfAvg"] = totalData[key].zf.avg
                }
            })
        }
        return resultLast15Video;
    }
    /**
     * 订阅获取其他数据
     *
     * 2最新15个视频表现柱状图  tabList[2]
     * 3受众标签类型
     * 4星图指数筛选条件
     * @private
     */
    private async collectOtherData() {
        const bus = this.context.$bus;

        let resultData : any = {}
        let resultLast15Video: any = {}
        let resultConnectNums: any = {}
        let resultPortrait: any = {}
        let resultIndexValue: any = {}
        const tabList: any = await tryDo(1500, () => {
            const clickDom = document.querySelector('.page-right .card-panel .is-top[role="tablist"]')
            if (clickDom) {
                const tabList = clickDom.children;
                if (tabList && tabList[2]) {
                    return tabList
                }
            }
            return false
        });
        if (tabList && tabList[1]) {
            console.log("tabList[1].click", 1)
            await this.delay(1000, 10000);
            tabList[1].click();
            const authorContentShowPromise: any = bus.subscribe(
                /\/api\/author\/get_author_show_items_v2/,
                (rs: any) => {
                    let body = bus.parseBody(rs);
                    return body.hasOwnProperty('base_resp') ? body : false;
                }
            );
            const [ authorContentShowBody ] = await Promise.all([authorContentShowPromise]);
            console.log("collectOtherData ok => authorContentShowBody", authorContentShowBody);
        }
        // tab2内容表现 最新15个视频表现柱状图
        if (tabList && tabList[2]) {
            console.log("tabList[2].click", 2)
            await this.delay(1000, 10000);
            tabList[2].click();
            // 最新15个视频表现柱状图
            const last15VideoPromise: any = bus.subscribe(
                /\/api\/author\/get_author_show_items_v2/,
                (rs: any) => {
                    let body = bus.parseBody(rs);
                    return body.hasOwnProperty('base_resp') ? body : false;
                }
            );
            let videoTotalData = {};
            const [last15VideoBody] = await Promise.all([last15VideoPromise]);
            console.log("collectOtherData ok => last15VideoBody", last15VideoBody);
            const { latest_item_info, latest_star_item_info } = last15VideoBody;

            const calculateMin = (arr: number[]): number => Math.min(...arr);
            const calculateMax = (arr: number[]): number => Math.max(...arr);
            const calculateAverage = (arr: number[]): number => arr.reduce((a, b) => a + b, 0) / arr.length;
            const collectStats = (label: string, data: number[]) => {
                return {
                    min: calculateMin(data).toFixed(2),
                    max: calculateMax(data).toFixed(2) ,
                    avg: calculateAverage(data).toFixed(2)
                };
            };
            // 计算爆量视频百分比
            const calculateHotVideoPercentage = (isHotCount: number, totalCount: number): string => {
                const percentage = (isHotCount / totalCount) * 100;
                return percentage.toFixed(2);
            };

            const processVideoStats = (videoInfo: any[], label: string) => {
                const plays = videoInfo.map(video => video.play / 10000);
                const likes = videoInfo.map(video => video.like / 10000);
                const comments = videoInfo.map(video => video.comment / 10000);
                const shares = videoInfo.map(video => video.share / 10000);
                const isHotCount = videoInfo.filter(video => video.is_hot).length;

                const stats = {
                    bf: collectStats("播放量", plays),
                    dz: collectStats("点赞量", likes),
                    pl: collectStats("评论量", comments),
                    zf: collectStats("转发量", shares),
                    blspbfbvalue: calculateHotVideoPercentage(isHotCount, videoInfo.length)
                };

                videoTotalData[label] = stats;
            };

            // 处理个人视频数据
            processVideoStats(latest_item_info, "gr");
            // 处理星图视频数据
            processVideoStats(latest_star_item_info, "xtAll");
            // 落库数据
            resultLast15Video = this.getLast15VideoData(videoTotalData)
        }
        // tab3 连接用户 连接用户分布、连接用户画像
        if (tabList && tabList[3]) {
            console.log("tabList[3].click()",3)
            tabList[3].click();
            await this.delay(1000, 10000);
            await tryDo(3000, () => {
                const element = document.querySelector('.star-footer-protocol-record');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' }); // 平滑滚动到元素
                    console.log("Scrolled to .star-footer-protocol-record");
                } else {
                    console.error(".star-footer-protocol-record 未找到");
                }
            });
            const radioGroup: any = await tryDo(1500, () => {
                const radioGroupDom = document.querySelector('.page-right .tabs-content .title-wrapper .el-radio-group[data-btm="type-select"]');

                if (radioGroupDom) {
                    const radioButtons = radioGroupDom.children;
                    if (radioButtons && radioButtons.length > 0) {
                        return radioButtons;
                    }
                }
                return false;
            });
            radioGroup[1].click();
            // 受众标签类型 - 连接用户数
            const connectUsersPromise: any = bus.subscribe(
                /\/api\/data_sp\/author_link_struct/,
                (rs: any) => {
                    let body = bus.parseBody(rs);
                    return body.hasOwnProperty('base_resp') ? body : false;
                }
            );
            // 受众标签类型 - 连接用户画像 - 观众画像
            const audiencePortraitPromise: any = bus.subscribe(
                /\/api\/data_sp\/author_audience_distribution/,
                (rs: any) => {
                    let body = bus.parseBody(rs);
                    return body.hasOwnProperty('base_resp') ? body : false;
                }
            );
            // 受众标签类型 - 连接用户画像 - 粉丝画像
            const fansPortraitPromise: any = bus.subscribe(
                /\/api\/data_sp\/get_author_fans_distribution/,
                (rs: any) => {
                    let body = bus.parseBody(rs);
                    return body.hasOwnProperty('base_resp') ? body : false;
                }
            );
            const [ connectUsersBody,
                audiencePortraitBody,
                fansPortraitBody] = await Promise.all([connectUsersPromise, audiencePortraitPromise, fansPortraitPromise]);
            // 3、受众标签类型相关数据
            const { link_struct } = connectUsersBody;
            resultConnectNums = {
                yljyhs: link_struct['5'].value,  // 月连接用户数
                //TODO 月粉丝增长量 - 待定 240920
                ljConnectNum: link_struct['1'].value,  // 了解
                xqConnectNum: link_struct['2'].value,  // 兴趣
                xhConnectNum: link_struct['3'].value,  // like
                zsConnectNum: link_struct['4'].value   // 追随
            };
            const { value: maxValue } = Object.values(link_struct)
                .slice(0, 4)
                .reduce((acc, item) => item.proportion > acc.proportion ? item : acc, { proportion: -Infinity, value: 0 });
            resultConnectNums.ysdyhs = resultConnectNums.yljyhs - maxValue;
            // 观众画像数据
            const audienceByPeopleType: Record<string, string> = {};
            const audienceByAge: Record<string, string> = {};
            const audienceByGender: Record<string, string> = {};
            const audienceByDevice: Record<string, string> = {};
            const audienceByProvinceRegion: Record<string, string> = {};
            const audienceByCityRegion: Record<string, string> = {};
            audiencePortraitBody.distributions.forEach(distribution => {
                switch (distribution.type_display) {
                    case '八大人群分布':
                        distribution.distribution_list.forEach(item => {
                            audienceByPeopleType[item.distribution_key] = item.distribution_value;
                        });
                        break;
                    case '年龄分布':
                        distribution.distribution_list.forEach(item => {
                            audienceByAge[item.distribution_key] = item.distribution_value;
                        });
                        break;
                    case '性别分布':
                        distribution.distribution_list.forEach(item => {
                            const genderKey = item.distribution_key === 'male' ? '男性' : '女性';
                            audienceByGender[genderKey] = item.distribution_value;
                        });
                        break;
                    case '设备品牌分布':
                        distribution.distribution_list.forEach(item => {
                            audienceByDevice[item.distribution_key] = item.distribution_value;
                        });
                        break;
                    case '省份分布':
                        distribution.distribution_list.forEach(item => {
                            audienceByProvinceRegion[item.distribution_key] = item.distribution_value;
                        });
                        break;
                    case '城市分布':
                        distribution.distribution_list.forEach(item => {
                            audienceByCityRegion[item.distribution_key] = item.distribution_value;
                        });
                        break;
                    default:
                        console.warn(`未处理的分布类型: ${distribution.type_display}`);
                }
            });
            resultPortrait["bdrqRatio"] = audienceByPeopleType
            resultPortrait["gzAge"] = audienceByAge
            resultPortrait["gzSex"] = audienceByGender
            resultPortrait["gzDevice"] = audienceByDevice
            resultPortrait["gzAreaProvince"] = audienceByProvinceRegion
            resultPortrait["gzAreaCity"] = audienceByCityRegion
            // 粉丝画像
            const ageDistribution: Record<string, string> = {};
            const genderDistribution: Record<string, string> = {};
            const deviceBrandDistribution: Record<string, string> = {};
            const provinceDistribution: Record<string, string> = {};// 粉丝地域分布 - 省份分布
            const cityDistribution: Record<string, string> = {};
            fansPortraitBody.distributions.forEach(distribution => {
                switch (distribution.type_display) {
                    case '年龄分布':
                        distribution.distribution_list.forEach(item => {
                            ageDistribution[item.distribution_key] = item.distribution_value;
                        })
                        break;
                    case '性别分布':
                        distribution.distribution_list.forEach(item => {
                            genderDistribution[item.distribution_key] = item.distribution_value;
                        })
                        break;
                    case '设备品牌分布':
                        distribution.distribution_list.forEach(item => {
                            deviceBrandDistribution[item.distribution_key] = item.distribution_value;
                        })
                        break;
                    case '省份分布':
                        distribution.distribution_list.forEach(item => {
                            provinceDistribution[item.distribution_key] = item.distribution_value;
                        })
                        break;
                    case '城市分布':
                        distribution.distribution_list.forEach(item => {
                            cityDistribution[item.distribution_key] = item.distribution_value;
                        })
                        break;
                    default:
                        break;
                }
            });
            resultPortrait["fsAge"] = ageDistribution
            resultPortrait["fsSex"] = genderDistribution
            resultPortrait["fsDevice"] = deviceBrandDistribution
            resultPortrait["fsAreaProvince"] = provinceDistribution
            resultPortrait["fsAreaCity"] = cityDistribution
        }

        //tab4 商业能力 星图指数
        if (tabList && tabList[4]) {
            console.log("tabList[4].click()",4);
            await this.delay(1000, 10000);
            tabList[4].click();
            // 星图指数
            const xtIndexPromise: any = bus.subscribe(
                /\/api\/data_sp\/get_author_link_info/,
                (rs: any) => {
                    let body = bus.parseBody(rs);
                    return body.hasOwnProperty('base_resp') ? body : false;
                }
            );
            const [ xtIndexBody ] = await Promise.all([xtIndexPromise]);
            // 4、星图指数数据
            resultIndexValue = {
                syHzIndex : xtIndexBody.cooperate_index.value,
                syXjbIndex : xtIndexBody.cp_index.value,
                syZhIndex : xtIndexBody.link_convert_index.value,
                syZcIndex : xtIndexBody.link_shopping_index.value,
                syCbIndex : xtIndexBody.link_spread_index.value,
                syXtIndex : xtIndexBody.link_star_index.value,
            }
        }
        resultData = {
            resultLast15Video,
            resultConnectNums,
            resultPortrait,
            resultIndexValue
        }
        console.log("collectOtherData ok => resultData", resultData);
        return resultData;
    }

    /**
     * 延迟执行
     * @param min 最短时间
     * @param max 最长时间
     * @private
     */
    async delay(min: number, max: number) {
        const targetTime = Math.random() * (max - min) + min;  // 生成随机延迟时间
        console.log("延迟执行  targetTime", targetTime)
        return tryDo(targetTime, () => {
            // 每次执行回调检查当前是否已经满足延迟时间
            const currentTime = performance.now();  // 用 performance.now() 获取更精确的时间
            return currentTime >= targetTime;
        });
    };


}


