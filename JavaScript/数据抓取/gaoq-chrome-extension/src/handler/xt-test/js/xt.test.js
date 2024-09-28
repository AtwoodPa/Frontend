const oldCollectOtherData = {
    async parser(vm) {
        const me = Map[Tag.Xt]
        const locationData = xtHandler.locationData();
        if (vm.forGaoqu) {
            const data = await me.collectMainData(vm, locationData);
            await me.collectOtherData(vm, locationData.xtId);
            return data;
        } else {
            return me.collectOtherData(vm, locationData.xtId);
        // return me.collectMainData(vm, locationData);
        }

    },
    //
    async collectOtherData(vm, xtId) {
        console.log("vm.triggerCollectflag", vm.triggerCollectflag);
        const { $api } = vm
        if (!vm.triggerCollectflag) {
            if ($api.resourceXt) {
                const fieldLimit = [{ label: "美妆", prefix: "mz" }, { label: "3C及电器", prefix: "scjdq" }, { label: "食品饮料", prefix: "spyl" }, { label: "汽车", prefix: "qc" }, { label: "母婴宠物", prefix: "mycw" }, { label: "服装配饰", prefix: "fzps" }, { label: "家居建材", prefix: "jjjc" }, { label: "出行旅游", prefix: "cxly" }]
                // const { code, data } = await vm.$api.ajax.get('https://wxapp.gaoq.com/extension/xt/fieldTag')
                const { code, data } = await vm.$api.extension.xtFieldTag()
                const xtFieldIdMap = {}
                if (code == 0) {
                    console.log(JSON.parse(data));
                    const { fieldMap } = JSON.parse(data)
                    for (let key in fieldMap) {
                        const value = fieldMap[key]
                        const field = fieldLimit.find(item => item.label === value)
                        if (field) {
                            xtFieldIdMap[key] = field
                        }
                    }
                }
                console.log("fieldIdMap", xtFieldIdMap);
                await xtHandler.manyPortSimpleHandle(vm, xtFieldIdMap, xtId)
            } else {
                vm.$Notice.warning({
                    title: '不是最新新版插件',
                    desc: "无法使用新功能-抓取星图商业能力、数据概览。请更新插件",
                });
            }
        }
        // vm.fieldIdMap = xtFieldIdMap
    },
    async manyPortSimpleHandle(vm, fieldIdMap, xtId) {
        let resourceExisit = true; //用于首次判断 该资源建联状态 已入库、待建联、未建联（插件没有入库过）
        const { $api, bus } = vm;
        const resourceXt = vm.resourceXt
        let mediaIdError = false;
        // 分批次同步数据到op ，接口中拿到一份数据就会掉此方法一次
        async function syncOp() {
            if (resourceXt.mediaId && resourceXt.bloggerId && resourceExisit) {
                const { code, data } = await vm.$api.resourceXt.makeBymediaIdAndBloggerId(resourceXt)
                if (code == 0) {
                    const { extensionImportNum, resourceNum } = data;
                    if (extensionImportNum === 0 && resourceNum === 0) {
                        resourceExisit = false;
                        console.log("this a resource is noExists in the OP");
                    }
                }
            }
        }
        // 在这里订阅 拿到bloggerId和mediaId 如果为空则博主页有问题。
        const publishMediaIdAnduidPromise = bus.subscribe(/publishMediaIdAnduid/, (res) => {
            return true
        })
        publishMediaIdAnduidPromise.then((res) => {
            Object.assign(resourceXt, res.data)
            console.log("resourceXt.mediaId == '0' || !resourceXt.mediaId", resourceXt.mediaId == '0' || !resourceXt.mediaId);
            if (resourceXt.mediaId == '0' || !resourceXt.mediaId) {
                mediaIdError = true
            }
        })

        // 1.内容表现
        const authorContentMap = {
            authorContentXtAll1m: { url: `https://www.xingtu.cn/gw/api/data_sp/get_author_spread_info?o_author_id=${xtId}&platform_source=1&platform_channel=1&range=2&type=2&only_assign=true`, content: `近30天星图视频内容表现 提取成功` },
            authorContentXtAll3m: { url: `https://www.xingtu.cn/gw/api/data_sp/get_author_spread_info?o_author_id=${xtId}&platform_source=1&platform_channel=1&range=3&type=2&only_assign=true`, content: `近90天星图视频内容表现 提取成功` },
        }
        await wait(1500)
        // 数据概览 - 内容表现
        for (let key of Object.keys(authorContentMap)) {
            if (!mediaIdError) {
                try {
                    const { url, content } = authorContentMap[key];
                    // try {
                    const authorContent = await vm.$api.ajax.get(url)
                    const handleMap = {}
                    if (authorContent.hasOwnProperty("base_resp")) {
                        handleMap[key] = authorContent
                        const updateAuthorContent = this.getAuthorContent(handleMap);
                        Object.assign(resourceXt, updateAuthorContent)
                        vm.$Message.success({ content })

                        syncOp()
                    }
                } catch (error) {
                    $api.baojing({ tag: "内容表现", message: "api/data_sp/get_author_spread_info", site: window.location.href })
                }
                await wait(2000)
            }
        }
        // 2.最新15个视频表现柱状图 个人视频、星图视频
        const latestVideoBarChartMap = {
            authorVideoSelfAll: { url: `https://www.xingtu.cn/gw/api/author/get_author_show_items_v2?o_author_id=${xtId}&platform_source=1&platform_channel=1&limit=10&only_assign=true&flow_type=0`, content: "最新15个视频表现柱状图-个人视频 提取成功" },
            authorVideoXtAll: { url: `https://www.xingtu.cn/gw/api/author/get_author_show_items_v2?o_author_id=${xtId}&platform_source=1&platform_channel=1&limit=10&only_assign=true&flow_type=0`, content: "最新15个视频表现柱状图-星图视频 提取成功" },
        }
        for (let key of Object.keys(latestVideoBarChartMap)) {
            if (!mediaIdError) {
                try {
                    const { url, content } = latestVideoBarChartMap[key];
                    const authorVideoSelfAll = await vm.$api.ajax.get(url);
                    const handleMap = {}
                    handleMap[key] = authorVideoSelfAll;
                    const updateAuthorContent = this.getAuthorContent(handleMap, vm);
                    Object.assign(resourceXt, updateAuthorContent);
                    vm.$Message.success({ content });

        } catch (error) {
                    $api.baojing({ tag: "最新15个视频表现柱状图", message: "api/author/get_author_show_items_v2", site: window.location.href })
                }
            }
        }

        // 星图指数
        // for (let fieldId of Object.keys(fieldIdMap)) {
        //     if (!mediaIdError) {
        //         try {
        //             const { prefix } = fieldIdMap[fieldId];
        //             const indexData = await this.fetchData(vm, fieldId, xtId)
        //             const { link_star_index } = indexData;
        //             resourceXt[prefix + "Index"] = this.getAuthorContentData(link_star_index, 'value')
        //             vm.$Message.success({ content: prefix + "Index 提取成功" })
        //             syncOp()
        //         } catch (error) {
        //             $api.baojing({ tag: "星图-行业星图指数", message: "api/data_sp/get_author_link_info", site: window.location.href })
        //         }
        //         await wait(2500)
        //     }
        // }

        // 种草指数
        // try {
        //     if (!mediaIdError) {
        //         const authorBusinessCapabilitiesNoLimit = await this.fetchData(vm, 0, xtId);
        //         console.log("authorBusinessCapabilitiesNoLimit", authorBusinessCapabilitiesNoLimit);
        //         if (authorBusinessCapabilitiesNoLimit) {
        //             const subPrefixMap = {
        //                 cooperate_index: "hz",//合作指数
        //                 cp_index: "xjb",//性价比
        //                 link_convert_index: "zh",//转化
        //                 link_shopping_index: "zc",//种草
        //                 link_spread_index: "cb",//传播
        //                 link_star_index: "xt",//星图指数
        //             }
        //             Object.keys(authorBusinessCapabilitiesNoLimit).forEach(key => {
        //                 const subPrefix = subPrefixMap[key];
        //                 if (subPrefix) {
        //                     const target = authorBusinessCapabilitiesNoLimit[key];
        //                     resourceXt[subPrefix + "AvgValue"] = this.getAuthorContentData(target, 'avg_value', 100)
        //                     resourceXt[subPrefix + "Value"] = this.getAuthorContentData(target, 'value', 100)
        //                     resourceXt[subPrefix + "Rank"] = this.getAuthorContentData(target, 'rank')
        //                     resourceXt[subPrefix + "GrowRate"] = this.getAuthorContentData(target, 'link_relative_ratio', 10000)
        //                     const rankRate = this.getAuthorContentData(target, 'rank_percent', 10000)
        //                     console.log("rankRate", rankRate);
        //                     console.log("target", target['rank_percent']);
        //                     resourceXt[subPrefix + "RankRate"] = rankRate < 0 ? -1 : rankRate
        //                 }
        //             })
        //             syncOp()
        //         }
        //         vm.$Message.success({ content: "商业能力（行业不限） 提取成功" })
        //     }
        // } catch (error) {
        //     $api.baojing({ tag: "商业能力表现", message: "api/data_sp/get_author_link_info", site: window.location.href })
        // }

        console.log("resourceXt", resourceXt)
        vm.$Message.success({ content: `谢谢，您的等待，所有数据提取成功` });

    },



    getAuthorContent(target) {
        const authorContent = {}
        const authorContentMap = {
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
                const { prefix, suffix } = authorContentMap[key]
                const item = target[key];
                if (item) {
                    const { play_over_rate, interact_rate, item_rate } = target[key]
                    authorContent[prefix + "wblOvertake" + suffix] = this.getAuthorContentData(play_over_rate, "overtake")
                    authorContent[prefix + "wblValue" + suffix] = this.getAuthorContentData(play_over_rate, "value")
                    authorContent[prefix + "hdlOvertake" + suffix] = this.getAuthorContentData(interact_rate, "overtake")
                    authorContent[prefix + "hdlValue" + suffix] = this.getAuthorContentData(interact_rate, "value")
                    if (item_rate) {
                        const { play_mid, item_num } = item_rate
                        authorContent[prefix + "bflzwsOvertake" + suffix] = this.getAuthorContentData(play_mid, "overtake")
                        authorContent[prefix + "bflzwsValue" + suffix] = this.getAuthorContentData(play_mid, "value")
                    }
                    authorContent[prefix + "fbzp" + suffix] = this.getAuthorContentData(item, "item_num")
                    authorContent[prefix + "pjsc" + suffix] = this.getAuthorContentData(item, "avg_duration")
                    authorContent[prefix + "pjdz" + suffix] = this.getAuthorContentData(item, "like_avg")
                    authorContent[prefix + "pjpl" + suffix] = this.getAuthorContentData(item, "comment_avg")
                    authorContent[prefix + "pjzf" + suffix] = this.getAuthorContentData(item, "share_avg")
                }
            }
        })

        return authorContent;
    },


    getAuthorContentData(target, key, multiplier = 1) {
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
    },
}
