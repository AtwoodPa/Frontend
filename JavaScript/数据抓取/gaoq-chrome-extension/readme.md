1. https://www.xiaohongshu.com/user/profile/62af457d0000000019029459 无user-tags信息
2. https://www.xiaohongshu.com/user/profile/630dcb22000000001200cd11 user-tags 只有年龄
3. https://www.xiaohongshu.com/user/profile/62dd54ab000000001f017596 user-tags 只有region
4. https://www.xiaohongshu.com/user/profile/5d373d660000000011009eb5 user-tags 只有fieldtags
5. https://www.xiaohongshu.com/user/profile/5f53881100000000010044be user-tags 含有星座，fieldtags
6. https://www.xiaohongshu.com/user/profile/5d6d22e40000000001003318 user-tags 含有星座，region，fieldtags
7. https://www.xiaohongshu.com/user/profile/5a847f7e4eacab634b9d4f9f 英国，fieldtags


# 蒲公英
1. https://pgy.xiaohongshu.com/solar/blogger-detail/578ae7de3460947b27aad9da?track_id=kolMatch_3c9fe0a6cfc84fd8ab7392e527dd6c11 无机构
2. https://pgy.xiaohongshu.com/solar/blogger-detail/5bb81350ba9df1000172e754?track_id=kolMatch_3c9fe0a6cfc84fd8ab7392e527dd6c11
3. https://pgy.xiaohongshu.com/solar/blogger-detail/5c23b1ad000000000601b88a?track_id=kolMatch_3c9fe0a6cfc84fd8ab7392e527dd6c11 有机构

匹配结果也返回

{"data":{"chatItem":{"inactivedAt":0,"active":true,"inBlackList":false,"type":"pair","tags":[],"additionalInfo":"{\"active\":true,\"assign_time\":0,\"chat_entry_code\":\"merchant_3_1647650444995\",\"cs_provider_id\":\"53df5710b4c4d6383ae8e9a6\",\"customer_user_id\":\"5d344324000000001602c72c\",\"favorite\":false,\"first_not_replied_msg_time\":1683106065,\"has_unread_messages\":true,\"id\":\"645227f310089b00018be043\",\"im_chat_id\":\"61b86af7e7d0b146c19c215b\",\"is_in_blacklist\":false,\"is_platform_cs\":true,\"is_platform_seller\":false,\"last_message\":{\"content\":\"队长这边看到您没有回复，应该是去忙其他事情了，队长就先去帮助其他小红薯啦，感谢薯宝宝对小红书的支持，祝您生活愉快！有问题随时召唤薯队长哦~\",\"id\":\"645229b603ae5b0001a0e70f\",\"time\":1683106230},\"num_not_replied_msg\":0,\"seller_avatar\":\"https://dc.xhscdn.com/28824547f2d5f0a3e6d9ea0ddb51daf99a37942e.jpg\",\"seller_id\":\"5eb37cbf55cd8d415a046306\",\"seller_name\":\"企业号咨询\",\"staff_query_tag\":90,\"state\":\"ended\",\"status_time\":1683359403,\"unread_message_count\":5}","id":"61b86af7e7d0b146c19c215b","pairInfo":{"avatarUrl":"https://dc.xhscdn.com/28824547f2d5f0a3e6d9ea0ddb51daf99a37942e.jpg","id":"5ec34080fb9d6c0001637fe1","nickname":"企业号咨询","refSysId":"5e45061bc2510e5b13b4347d","refUserId":"5eb37cbf55cd8d415a046306","type":"official"}},"time":1683359403016},"success":true}


任务
1. //蒲公英 content tag 里面含有风格标签
2. 小红书代码抽离
3. 星图

这个做订阅者，进行订阅，往内存里面存数据和回调函数，
emit(param1: string, param2: any) {
        map[param1].foreah(cb => cb()  remve cb)
        else 
        cache[param1] = [param2];
    // this.emitArr.push(param1)
    // window[param1] = param2
},
这个做发布者，调用后去除方法及缓存
    once(param1: string, cb) {
        caches[param1] = [].forEach(cb(item))
        map[param1] = [cb];
        // setTimeout(() => {
        //     delete window[param1]
        // }, 1000)
        // return window[param1]
    }





        emit(param1: string, param2: any) {
        this.emitArr.push(param1)
        window[param1] = param2
    },
    on(param1: string) {
        setTimeout(() => {
            delete window[param1]
        }, 1000)
        return window[param1]
    },

        LegendComponent,
            ToolboxComponent,
    TitleComponent,


    import evalCore from 'chrome-inject-eval'
console.log('evalCore', evalCore)
const evil = evalCore.getEvalInstance(window);
function defaultFunction(version) {
    const regionList = [
        "北京",
        "上海",
        "广东",
        "江苏",
        "浙江",
        "重庆",
        "安徽",
        "福建",
        "甘肃",
        "广西",
        "贵州",
        "海南",
        "河北",
        "黑龙江",
        "河南",
        "湖北",
        "湖南",
        "江西",
        "吉林",
        "辽宁",
        "内蒙古",
        "宁夏",
        "青海",
        "山东",
        "山西",
        "陕西",
        "四川",
        "天津",
        "新疆",
        "西藏",
        "云南",
        "中国香港",
        "中国澳门",
        "中国台湾",
        "英国",
        "德国",
        "中国",
        "伊拉克",
        "安哥拉",
        "阿富汗",
        "阿尔巴尼亚",
        "阿尔及利亚",
        "安道尔共和国",
        "安圭拉岛",
        "安提瓜和巴布达",
        "阿根廷",
        "亚美尼亚",
        "澳大利亚",
        "奥地利",
        "阿塞拜疆",
        "巴哈马",
        "巴林",
        "孟加拉国",
        "巴巴多斯",
        "白俄罗斯",
        "比利时",
        "伯利兹",
        "贝宁",
        "百慕大群岛",
        "玻利维亚",
        "博茨瓦纳",
        "巴西",
        "文莱",
        "保加利亚",
        "布基纳法索",
        "缅甸",
        "布隆迪",
        "喀麦隆",
        "加拿大",
        "中非共和国",
        "乍得",
        "智利",
        "中国",
        "哥伦比亚",
        "刚果",
        "库克群岛",
        "哥斯达黎加",
        "古巴",
        "塞浦路斯",
        "捷克",
        "丹麦",
        "吉布提",
        "多米尼加共和国",
        "厄瓜多尔",
        "埃及",
        "萨尔瓦多",
        "爱沙尼亚",
        "埃塞俄比亚",
        "斐济",
        "芬兰",
        "法国",
        "法属圭亚那",
        "加蓬",
        "冈比亚",
        "格鲁吉亚",
        "德国",
        "加纳",
        "直布罗陀",
        "希腊",
        "格林纳达",
        "关岛",
        "危地马拉",
        "几内亚",
        "圭亚那",
        "海地",
        "洪都拉斯",
        "香港",
        "匈牙利",
        "冰岛",
        "印度",
        "印度尼西亚",
        "伊朗",
        "伊拉克",
        "爱尔兰",
        "以色列",
        "意大利",
        "牙买加",
        "日本",
        "约旦",
        "柬埔寨",
        "哈萨克斯坦",
        "肯尼亚",
        "韩国",
        "科威特",
        "吉尔吉斯坦",
        "老挝",
        "拉脱维亚",
        "黎巴嫩",
        "莱索托",
        "利比里亚",
        "利比亚",
        "列支敦士登",
        "立陶宛",
        "卢森堡",
        "澳门",
        "马达加斯加",
        "马拉维",
        "马来西亚",
        "马尔代夫",
        "马里",
        "马耳他",
        "毛里求斯",
        "墨西哥",
        "摩尔多瓦",
        "摩纳哥",
        "蒙古",
        "蒙特塞拉特岛",
        "摩洛哥",
        "莫桑比克",
        "纳米比亚",
        "瑙鲁",
        "尼泊尔",
        "荷兰",
        "新西兰",
        "尼加拉瓜",
        "尼日尔",
        "尼日利亚",
        "朝鲜",
        "挪威",
        "阿曼",
        "巴基斯坦",
        "巴拿马",
        "巴布亚新几内亚",
        "巴拉圭",
        "秘鲁",
        "菲律宾",
        "波兰",
        "法属玻利尼西亚",
        "葡萄牙",
        "波多黎各",
        "卡塔尔",
        "罗马尼亚",
        "俄罗斯",
        "圣卢西亚",
        "圣文森特岛",
        "圣马力诺",
        "圣多美和普林西比",
        "沙特阿拉伯",
        "塞内加尔",
        "塞舌尔",
        "塞拉利昂",
        "新加坡",
        "斯洛伐克",
        "斯洛文尼亚",
        "所罗门群岛",
        "索马里",
        "南非",
        "西班牙",
        "斯里兰卡",
        "苏丹",
        "苏里南",
        "斯威士兰",
        "瑞典",
        "瑞士",
        "叙利亚",
        "台湾省",
        "塔吉克斯坦",
        "坦桑尼亚",
        "泰国",
        "多哥",
        "汤加",
        "特立尼达和多巴哥",
        "突尼斯",
        "土耳其",
        "土库曼斯坦",
        "乌干达",
        "乌克兰",
        "阿拉伯联合酋长国",
        "英国",
        "美国",
        "乌拉圭",
        "乌兹别克斯坦",
        "委内瑞拉",
        "越南",
        "也门",
        "南斯拉夫",
        "津巴布韦",
        "扎伊尔",
        "赞比亚",
    ];
    const constellationList = [
        "水瓶座",
        "双鱼座",
        "白羊座",
        "金牛座",
        "双子座",
        "巨蟹座",
        "狮子座",
        "处女座",
        "天秤座",
        "天蝎座",
        "射手座",
        "摩羯座",
    ];
    function thisParseInt(text) {
        if (text) {
            text = text.replace(/[+,%]/, "");
            if (
                text.indexOf("千") > -1 ||
                text.indexOf("K") > -1 ||
                text.indexOf("k") > -1
            ) {
                text = text.replace("千", "") || text.replace("K", "");
                return Math.round(parseFloat(text) * 1000);
            }
            if (
                text.indexOf("万") > -1 ||
                text.indexOf("W") > -1 ||
                text.indexOf("w") > -1
            ) {
                text = text.replace("万", "") || text.replace("W", "");
                return Math.round(parseFloat(text) * 10000);
            }
            if (text.indexOf("亿") > -1) {
                text = text.replace("亿", "");
                return Math.round(parseFloat(text) * 100000000);
            }
            return parseInt(text);
        }
        return null;
    };
    return {
        version,
        jinritemai() {
            let target = document.querySelector("#app");
            if (!target) {
                target = document.body;
            }
            let matches = window.location.search.match(/\?id=(\d*)/);
            return {
                html: target.innerHTML,
                id: matches[1]
            };
        },
        douyinUserKbdyh() {
            let userInfo = document.querySelector('div[data-e2e="user-info"]');
            let text = userInfo.innerText;
            console.log(text);
            let match = text.match(
                /(\S*)\s*(\S*?\s+)?关注\s*(\S*)\s*粉丝\s*(\S*)\s*获赞\s*(\S*)\s*抖音号：(\S*)\s*(IP属地：\S*?\s+)?(\S*岁)?/
            );
            console.log(match);
            let [
                $0,
                name,
                kind,
                followCount,
                fanCount,
                greatCount,
                mediaId,
                ip,
                age,
            ] = match;
            return mediaId;
        },
        douyinUserZyrk() {
            /*
            二百者也\n美食自媒体\n关注\n41\n粉丝\n1192.8万\n获赞\n1.3亿\n\n抖音号：200zhy\nIP属地：四川\n\n定额探店始创者。 用二百元吃遍天下，带你看看哪里的二百最大。 不接餐饮探店广告\uD83E...\n更多
            [
            '一只小狗的美妆账号\n关注\n16\n粉丝\n3678\n获赞\n52\n\n抖音号：81637420234\n22岁',
                '一只小狗的美妆账号',
            '16', 
            '3678',
            '52', 173.4万
            '81637420234',
            '22',
            index: 0,
            input: '一只小狗的美妆账号\n关注\n16\n粉丝\n3678\n获赞\n52\n\n抖音号：81637420234\n22岁\n\n百因必有果，变美请找我！所有商品都是官方发货保真保正，大家放心去拍哈 直播时...\n更多',
            groups: undefined]*/
            let userInfo = document.querySelector('div[data-e2e="user-info"]');
            let text = userInfo.innerText;
            console.log(text);
            let match = text.match(
                /(\S*)\s*(\S*?\s+)?关注\s*(\S*)\s*粉丝\s*(\S*)\s*获赞\s*(\S*)\s*抖音号：(\S*)\s*(IP属地：\S*?\s+)?(\S*岁)?/
            );
            console.log(match);
            let [
                $0,
                name,
                kind,
                followCount,
                fanCount,
                greatCount,
                mediaId,
                ip,
                age,
            ] = match;
            if (ip) {
                ip = ip.replace("IP属地：", "");
            }
            followCount = thisParseInt(followCount);
            fanCount = thisParseInt(fanCount);
            greatCount = thisParseInt(greatCount);
            age = thisParseInt(age);
            let site = window.location.href;
            let img = document.querySelector(
                ".avatar-component-avatar-container img"
            );
            if (!img) {
                // 直播中没有.avatar-component-avatar-container
                img = userInfo.previousSibling.querySelector("img");
            }
            let photo = img.getAttribute("src");
            return {
                name,
                fanCount,
                followCount,
                greatCount,
                platform: "抖音",
                origin: "抖音",
                mediaId,
                age,
                site,
                photo,
                ip,
                kind,
                version
            };
        },
        xingtuHandler() {
            function getSplitList(className, obj) {
                let userInfo = document.querySelector(className);

                let text = userInfo.innerText;
                if (text == "") {
                    return {};
                }

                let arr = text.split(obj.trimStr);
                if (obj.flag === 1) {
                    const arr_in = [];
                    const contentTagsStartIndex = arr.indexOf("内容标签");
                    const fieldTagsStartIndex = arr.indexOf("行业标签");
                    arr_in.push(
                        arr.splice(
                            contentTagsStartIndex + 1,
                            fieldTagsStartIndex - contentTagsStartIndex - 1
                        )
                    );
                    arr_in.push(arr.splice(2, arr.length));
                    return arr_in;
                }
                if (obj.flag === 2) {
                    if (arr.length < 8) {
                        arr.splice(4, 0, "MCN");
                        arr.splice(5, 0, "");
                    }
                    return arr;
                }
                if (obj.flag === 3) {
                }
                if (obj.flag === 4) {
                    const dom = document.querySelector(".rapid-highlight");
                    const plusOrMinus =
                        dom.attributes.class.nodeValue.indexOf("increase") == -1
                            ? "-"
                            : "+";
                    const obj = {};
                    obj["星图指数"] = arr[1];
                    obj["30天环比"] = plusOrMinus + arr[2].trim();
                    obj["行业内排名(前)"] = arr[3].substr(7, arr[3].length);
                    return obj;
                }
                if (arr.length == 1 && arr[0] == "") {
                    arr = [];
                }
                if (obj.flag == 5) {
                    const obj = {};
                    obj["类别榜"] = arr[0];
                    obj["行业"] = arr[1];
                    obj["时间榜"] = arr[2];
                    obj["名次"] = arr[3].match(/(\d+)/)[0];
                    return obj;
                }
                return arr;
            }
            let [name, mediaId] = getSplitList(
                ".author-page-info .author-info",
                { trimStr: "\n", flag: 0 }
            );
            let recommendTags = getSplitList(
                ".author-page-info .author-recommend-tags",
                { trimStr: "·", flag: 5 }
            );
            let [, monthConnectCount, , monthTouchCount, , fanCount] =
                getSplitList(".author-page-info .link-index", {
                    trimStr: "\n",
                    flag: 0,
                });
            let [contentTags, fieldTags] = getSplitList(
                ".author-page-info .industry-info",
                { trimStr: "\n", flag: 1 }
            );
            let [, sex, , ip, , mcn, , introduce] = getSplitList(
                ".author-page-info .basic-info",
                { trimStr: "\n", flag: 2 }
            );
            let capability = getSplitList(".score-detail", {
                trimStr: "\n",
                flag: 4,
            });
            // followCount = thisParseInt(followCount);
            fanCount = thisParseInt(fanCount);
            monthConnectCount = thisParseInt(monthConnectCount);
            monthTouchCount = thisParseInt(monthTouchCount);
            // greatCount = thisParseInt(greatCount);
            // age = thisParseInt(age);
            let { origin, pathname } = window.location;
            let site = origin + pathname;
            let img = document.querySelector(
                ".avatar-component-avatar-container img"
            );
            if (!img) {
                // 直播中没有.avatar-component-avatar-container
                img = document.querySelector(".author-info img");
            }
            let photo = img.getAttribute("src");
            return {
                platform: "星图", //平台
                origin: "抖音", //
                photo,
                site,
                name,
                xingtuId: mediaId.match(/(\d+)/)[0],
                recommendTags,
                monthTouchCount,
                monthConnectCount,
                fanCount,
                contentTags,
                fieldTags,
                sex,
                ip,
                mcn,
                introduce,
                capability,
                version
            }
        },
        xhsHandler() {
            function extract_user_info() {
                let userInfo = document.querySelector(".user-info");
                const text = userInfo.innerText;
                const arr = text.split("\n");

                arr[1] = arr[1].replace(/(小红书号：)(\S*)/, "$2");
                arr[2] = arr[2].replace(/(IP属地：)(\S*)/, "$2");

                let flag = true;
                let testDesc = document.querySelector(".user-info .user-desc");

                if (testDesc == null) {
                    flag = false;
                }

                let length = arr.length;

                return [
                    arr[0],
                    arr[1],
                    arr[2],
                    flag ? arr[3] : "",
                    arr[length - 7],
                    arr[length - 5],
                    arr[length - 3],
                ];
            }
            function extract(className) {
                let userInfo = document.querySelector(className);
                let tempArr = ["", "", [], ""];

                if (userInfo == null) return tempArr;

                // // 未获取到dom的话，userInfo.innerText报错
                let text = "";

                try {
                    text = userInfo.innerText;
                } catch (error) {
                    alert("页面还未加载完毕，无法获取dom");
                }
                if (text == false) return tempArr;

                let trimArr = text.split("\n");
                const ageJudgment = trimArr[0].match(/(\d+)/);
                const firstElement = trimArr[0].match(/(\D+)/)[1];

                // 若 trimArr[0] 含有星座信息提取
                tempArr[3] =
                    trimArr[0].match(/(\D+)/) &
                        (trimArr[0].match(/(\D+)/)[0].length > 2)
                        ? firstElement.substr(
                            firstElement.length - 3,
                            firstElement.length
                        )
                        : "";

                if (ageJudgment) {
                    tempArr[0] = ageJudgment[1];
                    if (trimArr.length == 2) {
                        if (
                            regionAndConstellationJudgment(
                                trimArr[1],
                                regionList
                            )
                        ) {
                            tempArr[1] = trimArr[1];
                        } else {
                            tempArr[2] = [trimArr[1]];
                        }
                    } else if (trimArr.length > 2) {
                        if (
                            regionAndConstellationJudgment(
                                trimArr[1],
                                regionList
                            )
                        ) {
                            tempArr[1] = trimArr[1];
                            tempArr[2] = trimArr.splice(2, trimArr.length);
                        } else {
                            tempArr[2] = trimArr.splice(1, trimArr.length);
                        }
                    }
                } else {
                    if (
                        regionAndConstellationJudgment(
                            trimArr[0],
                            constellationList
                        )
                    ) {
                        tempArr[3] = trimArr[0].substr(
                            trimArr[0].length - 3,
                            trimArr[0].length
                        );
                        if (trimArr.length == 2) {
                            if (
                                regionAndConstellationJudgment(
                                    trimArr[1],
                                    regionList
                                )
                            ) {
                                tempArr[1] = trimArr[1];
                            } else {
                                tempArr[2] = [trimArr[1]];
                            }
                        } else if (trimArr.length > 2) {
                            if (
                                regionAndConstellationJudgment(
                                    trimArr[1],
                                    regionList
                                )
                            ) {
                                tempArr[1] = trimArr[1];
                                tempArr[2] = trimArr.splice(2, trimArr.length);
                            } else {
                                tempArr[2] = trimArr.splice(1, trimArr.length);
                            }
                        }
                    } else {
                        if (
                            regionAndConstellationJudgment(
                                trimArr[0],
                                regionList
                            )
                        ) {
                            tempArr[1] = trimArr[0];
                            if (trimArr.length > 1) {
                                tempArr[2] = trimArr.splice(1, trimArr.length);
                            }
                        } else {
                            tempArr[2] = trimArr;
                        }
                        // }
                    }
                }
                return tempArr;
            }
            function regionAndConstellationJudgment(str, arr) {
                if (str == false) return false;
                return arr.find((item) => str.indexOf(item) !== -1) ? true : false;
            }
            let [name, mediaId, ip, introduce, followCount, fanCount, greatCount] = extract_user_info()
            let [age, region, fieldTags, constellation] = extract(
                ".user-info .user-tags"
            );
            const userInfo = document.querySelector(".user-info");
            let sex = "";

            try {
                sex =
                    document.querySelector(".gender svg[class='reds-icon']")
                        .children[0].attributes["xlink:href"].nodeValue ===
                        "#female"
                        ? "女"
                        : "男";
            } catch (error) {
                sex = "";
            }
            followCount = thisParseInt(followCount);
            fanCount = thisParseInt(fanCount);
            greatCount = thisParseInt(greatCount);
            age = age == 0 ? "" : thisParseInt(age);
            let site = window.location.href;
            let img = document.querySelector(
                ".avatar-component-avatar-container img"
            );

            if (!img) {
                img = userInfo.querySelector("img");
            }
            let photo = img.getAttribute("src");
            return {
                name,
                fanCount,
                followCount,
                greatCount,
                mediaId,
                age,
                site,
                photo,
                ip,
                region,
                fieldTags,
                sex,
                platform: "小红书",
                origin: "小红书",
                constellation,
                introduce,
                version
            }
        },
        pgyHandler() {
            function tagsExtract(className) {
                let tagArr = document.querySelectorAll(className);
                if (tagArr.length == 0) return;
                const tempArr = [];
                tagArr.forEach((item) => {
                    tempArr.push(item.innerText);
                });
                return tempArr;
            }
            function extract(className, flag) {
                let userInfo = document.querySelector(className);
                let text = userInfo.innerText;
                const arr = text.split("\n");
                if (flag) {
                    if (arr.length < 6) {
                        arr.splice(2, 0, "");
                    }
                }
                return arr;
            }
            function createDataOverview() {
                const detailDataOverviewArr = document.querySelectorAll(
                    ".detail-container .detail-item"
                );
                const obj = {};
                const arr1 = detailDataOverviewArr[0].innerText.split("\n");
                const arr2 = detailDataOverviewArr[2].innerText.split("\n");

                obj[arr1[3]] = `${thisParseInt(arr1[4])}`;
                obj[arr1[8]] = `${thisParseInt(arr1[9])}`;
                obj[arr2[1]] = arr2[2] == "--" ? "" : arr2[2];

                obj[arr2[6]] = arr2[7] == "--" ? "" : arr2[7];

                return obj;
            }
            let [name, mediaId, personTags, , ip, mcn] = extract(
                ".blogger-info-cell .blogger-base-info",
                true
            );
            let contentTags = tagsExtract(
                ".blogger-info-cell .blogger-tag-list .content-tag"
            );
            const featureTags = tagsExtract(
                ".blogger-info-cell .blogger-tag-list .feature-tag"
            );
            let [, fanCount, , greatCount] = extract(
                ".blogger-info-cell .blogger-data"
            );
            const userInfo = document.querySelector(".blogger-info-cell");
            const priceArr = extract(".quote-info-cell");

            if (priceArr.length > 4) {
                priceArr.shift();
            }

            const price = {};

            for (let i = 0; i < priceArr.length; i = i + 2) {
                price[priceArr[i]] = thisParseInt(
                    priceArr[i + 1].substring(1, priceArr[i + 1].length)
                );
            }

            const sexDom = document.querySelector(
                "div[class='blogger-gender']"
            );
            let sex = "";
            try {
                sex =
                    sexDom.attributes.style.value ===
                        "background-color: rgb(255, 241, 243);"
                        ? "女"
                        : "男";
            } catch (error) {
                sex = "";
            }

            const dataOverview = createDataOverview();
            fanCount = thisParseInt(fanCount);
            greatCount = thisParseInt(greatCount);
            let site = window.location.href;
            mediaId = mediaId.substring(5, mediaId.length);
            mcn = mcn === "无机构" ? "" : mcn;
            let sitePage = site.match(/\/(\w*)\?/);
            site = `https://www.xiaohongshu.com/user/profile/${sitePage[1]}`;
            personTags = personTags.split("、");
            let img = document.querySelector(
                ".avatar-component-avatar-container img"
            );

            if (!img) {
                // 直播中没有.avatar-component-avatar-container
                img = userInfo.querySelector("img");
            }

            let photo = img.getAttribute("src");
            return {
                name,
                fanCount,
                greatCount,
                mediaId,
                personTags,
                contentTags,
                site,
                photo,
                price,
                sex,
                mcn,
                origin: "小红书",
                ip,
                platform: "蒲公英",
                dataOverview,
                featureTags,
                version
            }
        },
    }
};
let remoteHandler: any = false;

// 个页面的数据逻辑和版本号
let defaultHandler = defaultFunction('default');
export default async function () {
    // let cache = await chrome.storage.local.get('remote')
    // console.log('cache', cache)
    // if (cache && cache.hasOwnProperty('remote')) {
    //     let { version, funCode } = cache['remote'];
    //     console.log('version, funCode', version, funCode);
    //     if (!remoteHandler || remoteHandler.version !== version) {
    //         remoteHandler = evil('(' + funCode + ')("' + version + '")');
    //         console.log("remoteHandler", remoteHandler);
    //     }
    //     console.log(456);
    //     return remoteHandler;
    // } else {
    return defaultHandler;
    // }
}

verifyFp: f16a01210c98fde0a08d5884878e37e1ae5230d25dbdaef7db
fp: f16a01210c98fde0a08d5884878e37e1ae5230d25dbdaef7db
msToken: FvR75dGM92o6LPqUJgyCNJrdaglqSNt-_p2IFzSlXrfksSMUiGRdxhv0rEbq1zBEf-A-EIFDlamsmquIZq5wYAunZH6KVyJ3eGMtVySn4-kp2SCNZw_DiFyovETK488=

