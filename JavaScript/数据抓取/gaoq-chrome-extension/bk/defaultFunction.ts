export default function (version) {
    const Msg = {
        page通过content发送给background: 'page通过content发送给background',
        background通过content发送给page: 'background通过content发送给page',
        content通过background转发其他content发送给page:
            'content通过background转发其他content发送给page',
        系统通知: '系统通知',
        清理缓存: '清理缓存',
        TTS: 'TTS'
    };
    const Aim = {
        获取当前tabId: '获取当前tabId',
        通知已补丁: '通知已补丁',
        通知已复制: '通知已复制',
        通知已提取: '通知已提取',
    };
    const platformMap = {
        抖音: 9,
        小红书: 8
    }
    function patchFrom(params, from) {
        params._from = 'gaoqu extension ' + from;
        return params;
    }
    function content2Background(params = {}) {
        return new Promise(function (resolve) {
            chrome.runtime.sendMessage(params, function (data) {
                console.log('content2Background receive background ', data);
                resolve(data);
            });
        });
    }
    const For = {
        回填各平台基础数据: 1,
        获取蒲公英等级: 2,
        爬取星图等级: 3,
        爬取百应等级: 4,
        绑定小红书品牌: 5,
        绑定百应资源: 91,
        绑定星图资源: 92,
        查询百应存在资源: 911,
        查询星图存在资源: 921
    };
    const GradMode = {
        不抓额外数据: 0,
        抓取全部数据: 1,
        尽量抓取额外数据: 2
    }
    let href = window.location.href;
    if (href.indexOf('buyin.jinritemai') > -1) {
        content2Background(
            {
                title: '清理缓存文件',
                message: '已完成清理',
                msg: Msg.清理缓存,
                options: { origins: ["https://lf-c-flwb.bytetos.com", "https://lf-headquarters-speed.yhgfb-cn-static.com"] },
                dataSet: {
                    cache: true,
                    cacheStorage: true,
                    fileSystems: true,
                }
            }
        );
    }
    let whiteList = [
        'api/contact/contact_info',
        'api/author/get_author_base_info',
        'api/author/get_author_marketing_info',
        'api/author/get_author_platform_channel_info_v2',
        'api/authorStatData/authorProfile',
        'homePage/author/profile',
        'api/solar/cooperator/user/blogger',
        'api/authorStatData/salesAnalyseV2',
        'api/solar/cooperator/content/tag_tree',
        'api/solar/kol/get_select_kol_tags_config_v2',
        'api/user/author_options',
        'api/data_sp/author_video_distribution',
        'api/data_sp/get_author_spread_info',
        'api/data_sp/author_link_struct',
        'api/solar/kol/dataV3/dataSummary',
        'api/data_sp/author_touch_distribution',
        'api/solar/kol/dataV2/notesDetail',
        'api/solar/kol/dataV3/notesRate',
        'api/data_sp/author_audience_distribution',
        '/api/authorStatData/authorOverviewV2',
        'authorStatData/authorFansV2',
        'authorStatData/sellProduct',
        'api/data_sp/get_author_link_info',
        '/square_pc_api/common/square/squareConf',
        'getOtherData', // 星图主数据 获取已抓获的额外数据
        'api/authorStatData/seekAuthor',
        'gsearch/search_for_author_square',
        'publishMediaIdAnduid', // 星图其他数据 获取mediaId
        'api/gauthor/author_get_business_card_info',
        'captain_goods_pool/get_captain_goods_detail',
        "v2/user/me",
        "www.douyin.com/user/"
    ]
    chrome.storage.local.set({
        whiteList
    }, function () {
        console.log('chrome.storage.local.set callback', whiteList.length, chrome.runtime.lastError)
    });
    console.log('chrome.storage.local.set done', version, whiteList.length)
    const regionList = '北京 上海 广东 江苏 浙江 重庆 安徽 福建 甘肃 广西 贵州 海南 河北 黑龙江 河南 湖北 湖南 江西 吉林 辽宁 内蒙古 宁夏 青海 山东 山西 陕西 四川 天津 新疆 西藏 云南 香港 澳门 台湾 中国'.split(/\s+/)
    function thisParseInt(text) {
        if (typeof text === 'string') {
            text = text.replace('-', '');
        }
        if (text) {
            text = text.replace(/[+,%]/, '');
            if (
                text.indexOf('千') > -1 ||
                text.indexOf('K') > -1 ||
                text.indexOf('k') > -1
            ) {
                text = text.replace('千', '') || text.replace('K', '');
                return Math.round(parseFloat(text) * 1000);
            }
            if (
                text.indexOf('万') > -1 ||
                text.indexOf('W') > -1 ||
                text.indexOf('w') > -1
            ) {
                text = text.replace('万', '') || text.replace('W', '');
                return Math.round(parseFloat(text) * 10000);
            }
            if (text.indexOf('亿') > -1) {
                text = text.replace('亿', '');
                return Math.round(parseFloat(text) * 100000000);
            }
            return parseInt(text);
        }
        return null;
    }
    const tableMap = {
        "插件入库": "1",
        "资源入库": "2",
        '品牌入库': 3
    }
    const cdnBase = '//cdn.red.gaoq.com'

    function photo(val) {
        if (val) {
            val = val.replace("dingUsed/", "").replace("ding/", "");
            return val.match(/^http|data:image|\/\//) ? val : `${cdnBase}/resource/${val}`
        }
        return null
    }

    function getDomText(selector) {
        const dom = getDom(selector);
        return dom ? dom.innerText : '';
    }
    function getDom(selector) {
        const dom = document.querySelector(selector);
        if (!dom) {
            console.warn(`${selector} of selector is null`);
        }
        return dom;
    }
    async function portRequest(vm, url, name, tryCount = 5) {
        let response = null
        try {
            response = await vm.$api.ajax.get(url);
            console.log("url", url);
            console.log("response", response);
            const pass = response.data.hasOwnProperty(name)
            console.log("pass", pass);
            if (!pass) {
                throw new Error("data数据出错")
            }
        } catch (error) {
            if (tryCount > 0) {
                // return portRequest(vm, url, name, --tryCount)
            } else {
                vm.$api.baojing({ tag: vm.tag, error: error.message, at: `portRequest ${url}`, url: window.location.href });
            }
        }
        return response
    }
    function wait(outTime = 1500, fun) {
        return new Promise((resolve, inject) => {
            let time = 0
            const timer = setInterval(() => {
                const content = fun && fun();
                if (content) {
                    resolve(content)
                    clearInterval(timer)
                } else {
                    time += 50;
                    if (time > outTime) {
                        resolve(null)
                        clearInterval(timer);
                    }
                }
            }, 50)
        })
    }
    // 还未删除，因星图直播主页要用
    const Flag = {
        nameXtID: '星图昵称-id',
        rank: '星图榜单',
        sexContent: '星图性别-地区-mcn-介绍',
        capability: '星图商业能力',
        zhibo_featureTags: '星图直播-个人标签',
        zhibo_fanCount: '星图直播-粉丝',
        zhibo_bringGoods: '星图直播-带货数据',
        zhibo_dataOverview: '星图直播-带货能力',
        zhibo_sex: '星图直播-性别',
    };


    function jinritemaiGoodsParse(dom) {
        const regex = /url\("(.*)"\)/;
        let shopDom = dom.querySelector('.shop-component__shop-content__logo');
        let shop_logo = '';
        if (shopDom) {
            shop_logo = shopDom.style.backgroundImage.match(regex)[1];
        } else {
            shopDom = dom.querySelector(
                '.safety-wrapper__content__extra__header__icon'
            );
            if (shopDom) {
                shop_logo = shopDom.src;
            }
        }
        const images = [
            ...dom.querySelectorAll('.head-figure__media-view__content'),
        ].map((el) => el.style.backgroundImage.match(regex)[1]);
        const details = [
            ...dom.querySelectorAll('.product-big-img-list img'),
        ].map((el) => el.src);
        return {
            shop_logo,
            images,
            details,
        };
    }
    const xhsHandler = {
        dom2Data() {
            let uid = window.location.pathname.replace('/user/profile/', '');

            const userInfo = getDom('.user-info');
            let mediaId = getDomText('.user-redId').replace('小红书号：', '')
            let ip = getDomText('.user-IP').replace('IP属地：', '')
            let name = getDomText('.user-name').trim();
            let introduce = getDomText('.user-info .user-desc');
            if (introduce == '还没有简介') {
                introduce = ''
            }
            let brand = false;
            const brandDom = document.querySelector('.verify-icon .reds-icon use');
            if (brandDom) {
                const xlinkHref = brandDom.getAttribute("xlink:href")
                if (xlinkHref.includes("company")) {
                    brand = true;
                }
            }
            if (uid == '606592c1000000000100232c') {
                brand = true;
            }
            // console.log("brandDom", brandDom);
            // console.log("brandDom", brandDom.getAttribute("xlink:href"))
            // let brand = !!document.querySelector('.verify-icon');
            let countMap = {}
            for (let dom of document.querySelectorAll('.user-interactions div')) {
                let { innerText } = dom;
                if (innerText.indexOf('关注') > -1) {
                    countMap.followCount = innerText.replace('关注', '')
                } else if (innerText.indexOf('粉丝') > -1) {
                    countMap.fanCount = innerText.replace('粉丝', '')
                } else if (innerText.indexOf('获赞与收藏') > -1) {
                    countMap.greatCount = innerText.replace('获赞与收藏', '')
                }
            }
            const sexDom = getDom(".gender svg[class='reds-icon']");
            let img = getDom('.avatar-component-avatar-container img');
            let sex = '';

            if (sexDom != null) {
                sex =
                    sexDom.children[0].attributes['xlink:href'].nodeValue ===
                        '#female'
                        ? '女'
                        : '男';
            }
            if (!img) {
                img = userInfo.querySelector('img');
            }

            let photo = img.getAttribute('src');
            const data = {
                brand,
                ip,
                uid,
                sex,
                name,
                photo,
                mediaId,
                introduce,
                ...countMap
            };
            console.log('dom2Data ok', data);
            return data;
        },
        dynamicDom2Data() {
            let text = getDomText('.user-info .user-tags');
            let age = '',
                region = '',
                contentTags = [],
                personalTag = '';

            if (text) {
                let list = text.split('\n');
                const ageJudgment = list[0].match(/(\d+)/);
                const xingzuoJudgment = list[0].match(/(座)/);

                if (ageJudgment) {
                    age = ageJudgment[1];
                    if (list.length == 2) {
                        if (this.arrContainStr(list[1], regionList)) {
                            region = list[1];
                        } else {
                            contentTags = [list[1]];
                        }
                    } else if (list.length > 2) {
                        if (this.arrContainStr(list[1], regionList)) {
                            region = list[1];
                            contentTags = list.splice(2, list.length);
                        } else {
                            contentTags = list.splice(1, list.length);
                        }
                    }
                } else {
                    if (xingzuoJudgment) {
                        personalTag = list[0].substr(
                            list[0].length - 3,
                            list[0].length
                        );
                        if (list.length == 2) {
                            if (this.arrContainStr(list[1], regionList)) {
                                region = list[1];
                            } else {
                                contentTags = [list[1]];
                            }
                        } else if (list.length > 2) {
                            if (this.arrContainStr(list[1], regionList)) {
                                region = list[1];
                                contentTags = list.splice(2, list.length);
                            } else {
                                contentTags = list.splice(1, list.length);
                            }
                        }
                    } else {
                        if (this.arrContainStr(list[0], regionList)) {
                            region = list[0];
                            if (list.length > 1) {
                                contentTags = list.splice(1, list.length);
                            }
                        } else {
                            contentTags = list;
                        }
                    }
                }
                if (personalTag) {
                    contentTags.push(personalTag);
                }
            }
            let customTags = contentTags[0] ? contentTags : [];
            const data = { age, region, customTags };
            console.log('dynamicDom2Data ok', data);
            return data;
        },
        arrContainStr(str, arr) {
            return arr.find((item) => str.indexOf(item.trim()) > -1);
        }
    };
    const dyHandler = {
        dom2Data() {
            let userInfo = getDom('div[data-e2e="user-info"]');
            let text = userInfo.children[0].innerText;
            let match = text.match(/(.*)\n*(\S*)?/);
            let [$0, name, kind] = match;
            text = userInfo.children[1].innerText;
            match = text.match(/关注\s*(\S*)\s*粉丝\s*(\S*)\s*获赞\s*(\S*)\s*/);
            let [$00, followCount, fanCount, greatCount] = match;
            let introduce = ""
            if (userInfo.children[3]) {
                let introduceDom = userInfo.children[3].children[0];
                const introduceList = introduceDom.children
                console.log("length", length);
                if (introduceList.length > 1) {
                    const text = introduceList[1].innerText;
                    if (text == '更多') {
                        const mouseOverEvent = new MouseEvent('mouseover', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        introduceDom.dispatchEvent(mouseOverEvent);
                        introduce = introduceList[2].innerText;
                    }
                } else {
                    introduce = introduceDom.innerText
                }
            }
            console.log("introduce", introduce);
            let img = getDom(
                'div[data-e2e="user-detail"] .avatar-component-avatar-container img'
            );
            if (!img) {
                img = userInfo.previousSibling.querySelector('img');
            }
            console.error('????', img)
            let photo = img.getAttribute('src');
            const data = {
                name,
                kind,
                photo,
                fanCount,
                introduce,
                greatCount,
                followCount,
            };
            console.log('dom2Data ok', data);
            return data;
        },
        dynamicDom2Data() {
            let match = '';
            let text = '';
            let sex = '';
            let age = '';
            let region = '';
            let userInfo = getDom('div[data-e2e="user-info"]');
            const user3Dom = userInfo.children[2];
            text = user3Dom.innerText;
            match = text.match(/抖音号：(\S*)\s*(IP属地：\S*)?/);
            let [$000, mediaId, ip] = match;
            let ipNoneFlag = 0;
            if (!ip) {
                ip = '';
                ipNoneFlag = 1;
            } else {
                ip = ip.replace('IP属地：', '');
            }
            const customTags = [];
            const domList = user3Dom.children;
            if (domList.length > 2 - ipNoneFlag) {
                text = domList[2 - ipNoneFlag].innerText;
                match = text.match(/(\d*)[男女岁]/);
                if (match) {
                    // 男女
                    if (match[1] == '') {
                        sex = match[0];
                        // 年龄
                    } else {
                        age = match[1];
                    }
                } else {
                    match = text.match(/(\S*)·(\S*)/);
                    if (match) {
                        region = `${match[1]} ${match[2]}`;
                    } else {
                        customTags.push(text);
                    }
                }
            }
            if (domList.length > 3 - ipNoneFlag && region == '') {
                text = domList[3 - ipNoneFlag].innerText;
                match = text.match(/(\S*)·(\S*)/);
                if (match) {
                    region = `${match[1]} ${match[2]}`;
                } else {
                    customTags.push(text);
                }
            }

            if (domList.length > 4 - ipNoneFlag) {
                customTags.push(domList[4 - ipNoneFlag].innerText);
            }

            if (domList.length > 2 - ipNoneFlag && sex == '' && age != '') {
                const sexDom = domList[2 - ipNoneFlag].children[0];
                const flag = sexDom ? sexDom.getAttribute('xmlns') : '';
                if (sexDom && flag == 'http://www.w3.org/2000/svg') {
                    if (sexDom.children.length > 1) {
                        sex = '女';
                    } else {
                        sex = '男';
                    }
                }
            }
            const data = {
                ip,
                sex,
                age,
                region,
                mediaId,
                customTags,
            };
            console.log('dynamicDom2Data ok', data);
            return data;
        },
    };
    const pgyHandler = {
        locationData() {
            let uid = window.location.pathname.split('/');
            uid = uid[uid.length - 1];
            let { origin, pathname } = window.location;
            let platformSite = origin + pathname;
            let site = `https://www.xiaohongshu.com/user/profile/${uid}`;
            const data = { uid, site, platformSite }
            console.log('locationData', data);
            return data;
        },
        async basePortData(vm, uid) {
            try {
                const bloggerPromise = vm.$api.ajax.get(
                    'https://pgy.xiaohongshu.com/api/solar/cooperator/user/blogger/' +
                    uid
                );
                const [blogger] = await Promise.all([bloggerPromise])

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
                console.log("fansNum", fansNum);
                if ((fansCount != fansNum) || (fansNum == 10000) || (fansCount == 10000)) {
                    vm.$api.baojing({ tag: "蒲公英粉丝量异常", message: `fansCount:${fansCount},fansNum:${fansNum}`, site: window.location.href })
                }
                console.log("bloggerData", bloggerData);
                personalTags = personalTags || [];
                let { contentTags, subContentTags } = this.tagAdjustment(
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
                const data = {
                    mcn,
                    uid,
                    name,
                    level,
                    price,
                    contentTags,
                    featureTags,
                    sex: gender,
                    personalTags,
                    mediaId: redId,
                    subContentTags,
                    photo: headPhoto,
                    region: location,
                    fanCount: fansNum,
                    greatCount: likeCollectCountInfo,
                };
                console.log("basePortData ok", data);
                return data
            } catch (error) {
                console.log("basePortData ok", "错误");
                Map[vm.tag].ending(vm, { level: "博主主页异常" })
            }

        },
        async portData(vm, uid) {
            const dailyNotesPromise = portRequest(vm,
                `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/dataSummary?userId=${uid}&business=0`, 'noteNumber'
            );
            const cooperationNotesPromise = portRequest(vm,
                `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/dataSummary?userId=${uid}&business=1`, 'noteNumber'
            );
            // 30 天日常
            const notesDailyRatePromise = portRequest(vm,
                `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/notesRate?userId=${uid}&business=0&noteType=3&dateType=1&advertiseSwitch=1`, 'noteNumber', 'noteNumber'
            );
            const notesCooperationRatePromise = portRequest(vm,
                `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/notesRate?userId=${uid}&business=1&noteType=3&dateType=1&advertiseSwitch=1`, 'noteNumber'
            );
            // 90 天日常
            const notesDailyRateV2Promise = portRequest(vm,
                `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/notesRate?userId=${uid}&business=0&noteType=3&dateType=2&advertiseSwitch=1`, 'noteNumber'
            );
            const notesCooperationRateV2Promise = portRequest(vm,
                `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/notesRate?userId=${uid}&business=1&noteType=3&dateType=2&advertiseSwitch=1`, 'noteNumber'
            );
            // 30 天日常--自然流量
            const zrNotesDailyRatePromise = portRequest(vm,
                `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/notesRate?userId=${uid}&business=0&noteType=3&dateType=1&advertiseSwitch=0`, 'noteNumber', 'noteNumber'
            );
            const zrNotesCooperationRatePromise = portRequest(vm,
                `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/notesRate?userId=${uid}&business=1&noteType=3&dateType=1&advertiseSwitch=0`, 'noteNumber'
            );
            // 90 天日常--自然流量  
            const zrNotesDailyRateV2Promise = portRequest(vm,
                `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/notesRate?userId=${uid}&business=0&noteType=3&dateType=2&advertiseSwitch=0`, 'noteNumber'
            );
            const zrNotesCooperationRateV2Promise = portRequest(vm,
                `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/notesRate?userId=${uid}&business=1&noteType=3&dateType=2&advertiseSwitch=0`, 'noteNumber'
            );

            const fansSummaryPromise = portRequest(vm,
                `https://pgy.xiaohongshu.com/api/solar/kol/dataV3/fansSummary?userId=${uid}`, 'fansNum'
            );
            const fansProfilePromise = portRequest(vm,
                `https://pgy.xiaohongshu.com/api/solar/kol/data/${uid}/fans_profile`, 'gender'
            );
            let dataOverview = {}
            const capability = {}
            let fansMap = null

            try {
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
                    notesCooperationRateV2
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
                    notesCooperationRateV2Promise
                ]);
                console.log({
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
                    notesCooperationRateV2
                });
                if (dailyNotes && cooperationNotes && dailyNotes.data && cooperationNotes.data) {
                    dataOverview.数据概览 = this.notesDataMap(dailyNotes.data, cooperationNotes.data,
                        capability)
                }
                if (notesDailyRate && notesCooperationRate && notesDailyRate.data && notesCooperationRate.data && zrNotesDailyRate && zrNotesCooperationRate && zrNotesDailyRate.data && zrNotesCooperationRate.data) {
                    dataOverview['传播表现(30天)'] = this.notesRateMap1m(
                        notesDailyRate.data,
                        notesCooperationRate.data,
                        zrNotesDailyRate.data,
                        zrNotesCooperationRate.data,
                        capability
                    )
                }
                if (notesDailyRateV2 && notesCooperationRateV2 && notesDailyRateV2.data && notesCooperationRateV2.data && zrNotesDailyRateV2 && zrNotesCooperationRateV2 && zrNotesDailyRateV2.data && zrNotesCooperationRateV2.data) {
                    dataOverview['传播表现(90天)'] = this.notesRateMap3m(
                        notesDailyRateV2.data,
                        notesCooperationRateV2.data,
                        zrNotesDailyRateV2.data,
                        zrNotesCooperationRateV2.data,
                        capability
                    )
                }

                if (fansSummary && fansProfile && fansSummary.data && fansProfile.data) {
                    dataOverview.粉丝分析 = this.funSummaryMap(
                        fansSummary.data,
                        fansProfile.data,
                        capability
                    )
                    // fansMap = fansProfile.data
                    fansMap = this.fansPgyHandler(fansProfile.data)
                }

            } catch (error) {
                console.error(error);
            }



            const data = { dataOverview, capability, fansMap }
            console.log('portData ok', data);
            return data;
        },




        addCpeAndCpm(capability, price) {
            const CpeAndCpm = {
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
            const twbjykj = price.图文笔记一口价
            function amendNumber(value, take = 1) {
                return value ? ((twbjykj / value) * 100 * take).toFixed() - 0 : 0
            }
            const { hdzws1m, hdzws3m, hdzws, rchdzws1m, rchdzws3m, rchdzws, bgzws1m, bgzws3m, rcbgzws1m, rcbgzws3m, ydzws1m, ydzws3m, ydzws, rcydzws1m, rcydzws3m, rcydzws, zrhdzws1m, zrhdzws3m, zrrchdzws1m, zrrchdzws3m, zrbgzws1m, zrbgzws3m, zrrcbgzws1m, zrrcbgzws3m, zrydzws1m, zrydzws3m, zrrcydzws1m, zrrcydzws3m } = capability
            if (twbjykj) {
                CpeAndCpm.cpe1m = amendNumber(hdzws1m)
                CpeAndCpm.zrcpe1m = amendNumber(zrhdzws1m)
                CpeAndCpm.cpe3m = amendNumber(hdzws3m)
                CpeAndCpm.zrcpe3m = amendNumber(zrhdzws3m)
                CpeAndCpm.cpe = amendNumber(hdzws)

                // zrhdzws1m, zrhdzws3m, zrrchdzws1m, zrrchdzws3m, zrbgzws1m, zrbgzws3m, zrrcbgzws1m, zrrcbgzws3m, zrydzws1m, zrydzws3m, zrrcydzws1m, zrrcydzws3m

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
        },
        tagAdjustment(tags) {
            let contentTags = [];
            let subContentTags = [];
            if (tags) {
                tags.forEach((tag) => {
                    Object.keys(tag).forEach((key) => {
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
        },
        findMax(list, label, value) {
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
        },
        fansPgyHandler(data) {
            let obj = {}
            for (let i in data) {
                if (data[i] != null) {
                    obj[i] = JSON.stringify(data[i])
                }
            }
            return obj;
        },
        handleFanKey(title, list) {
            function compareFn(a, b) {
                if (a.percent < b.percent) {
                    return 1;
                }
                if (a.percent > b.percent) {
                    return -1;
                }
                return 0;
            }
            list.sort(compareFn)

            const results = []
            for (let i = 0; i < list.length; i++) {
                const { name, percent, desc } = list[i]
                const element = {
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
        },
        funSummaryMap(fansSummaryData, fansProfileData, capability) {
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
            const nlfbMax = this.findMax(ages, 'group', 'percent');
            const csfbMax = this.findMax(cities, 'name', 'percent');
            const sbfbMax = this.findMax(devices, 'desc', 'percent');
            const yhxqMax = this.findMax(interests, 'name', 'percent');
            const sffbMax = this.findMax(provinces, 'name', 'percent');
            let { male, female } = gender

            let xbfb = ''
            if ((typeof male == 'number') && typeof (female == 'number')) {
                xbfb = male >= female ? `男性(${Math.ceil(male * 100)}%)` : `女性(${Math.ceil(female * 100)}%)`
            }
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
                ages: ages.map(item => {
                    const { percent, group } = item;
                    return { percent: `${(percent * 100).toFixed(2)}`, group }
                }),
                cities: this.handleFanKey("城市", cities),
                devices: this.handleFanKey("粉丝设备", devices),
                interests: this.handleFanKey("用户兴趣", interests),
                provinces: this.handleFanKey("省份", provinces),
            }
            capability.fsKeyJson = JSON.stringify(fsKeyJson)
            Object.assign(capability, hxsj)

            return {
                // 核心数据: {
                //     粉丝增量: fansIncreaseNum,
                //     粉丝量变化幅度: fansGrowthRate,
                //     活跃粉丝占比: activeFansRate,
                //     阅读粉丝占比: readFansRate,
                //     互动粉丝占比: engageFansRate,
                // },
                粉丝画像: {
                    年龄分布: ages,
                    城市分布: cities,
                    设备分布: devices,
                    性别分布: gender,
                    用户兴趣: interests,
                    省份分布: provinces,
                },
            };
        },
        contentPercent(noteType) {
            let noteTypeList = noteType;
            if (noteTypeList) {
                noteTypeList = noteTypeList.map((item) => {
                    let { contentTag, percent } = item;
                    let data = {};
                    data[contentTag + '类目占比'] = percent;
                    return data;
                });
            }
            return noteTypeList;
        },
        notesRateMap1m(notesDailyRateData, notesCooperationRateData, zrNotesDailyRateData, zrNotesCooperationRateData, capability) {
            const notesDailyRate = notesDailyRateData;
            const dailyPagePercent = notesDailyRate.pagePercentVo;
            const noteCooperationRate = notesCooperationRateData;
            const cooperationPagePercent = noteCooperationRate.pagePercentVo;
            const zrNotesDailyRate = zrNotesDailyRateData;
            const zrNoteCooperationRate = zrNotesCooperationRateData;



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
                    内容类目及占比: this.contentPercent(
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
                    内容类目及占比: this.contentPercent(
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
        },
        notesRateMap3m(notesDailyRateData, notesCooperationRateData, zrNotesDailyRateData, zrNotesCooperationRateData, capability) {
            const notesDailyRate = notesDailyRateData;
            const zrNotesDailyRate = zrNotesDailyRateData;
            const dailyPagePercent = notesDailyRate.pagePercentVo;
            const noteCooperationRate = notesCooperationRateData;
            const zrNoteCooperationRate = zrNotesCooperationRateData;
            const cooperationPagePercent = noteCooperationRate.pagePercentVo;


            // const nodeTypes = ['allDaily3m', 'allJoin3m', 'natureDaily3m', 'natureJoin3m']


            // 获取不同类型的数据
            // function getSpreadContent(nodeType) {
            //     // 默认全流量合作笔记
            //     const noteContent = {}
            //     const datas = {}
            //     // node的对应关系
            //     const noteRelation = {
            //         bgzws: 'impMedian',
            //         ydzws: 'readMedian',
            //         hdzws: 'mEngagementNum',
            //         zwdzl: 'likeMedian',
            //         zwscl: 'likeMedian',
            //         zwpll: 'commentMedian',
            //         zwfxl: 'shareMedian',
            //         hdl: 'interactionRate',
            //         spwbl: 'videoFullViewRate',
            //         tw3mydl: 'picture3sViewRate',
            //         qzbjbl: 'thousandLikePercent',
            //         bzbjbl: 'hundredLikePercent',
            //         fbbj: 'noteNumber'
            //     }
            //     // notesDailyRateData, notesCooperationRateData, zrNotesDailyRateData, zrNotesCooperationRateData
            //     const noteTypeMap = {
            //         // 内容表现
            //         allDaily1m: {
            //             rang: "",
            //             habit: "daily",
            //             time: '1m',

            //         },
            //         allDaily3m: {
            //             rang: "",
            //             habit: "daily",
            //             time: '1m',
            //             data: notesDailyRateData
            //         },
            //         allJoin1m: {
            //             rang: "",
            //             habit: "",
            //             time: '1m'
            //         },
            //         allJoin3m: {
            //             rang: "",
            //             habit: "",
            //             time: '3m',
            //             data: notesCooperationRateData
            //         },
            //         natureDaily1m: {
            //             rang: "zr",
            //             habit: "daily",
            //             time: '1m'
            //         },
            //         natureDaily3m: {
            //             rang: "zr",
            //             habit: "daily",
            //             time: '3m',
            //             data: zrNotesDailyRateData
            //         },
            //         natureJoin1m: {
            //             rang: "zr",
            //             habit: "",
            //             time: '1m'
            //         },
            //         natureJoin3m: {
            //             rang: "zr",
            //             habit: "",
            //             time: '3m',
            //             data: zrNotesCooperationRateData
            //         },
            //     }



            //     if (noteTypeMap[nodeType]) {
            //         const { rang, habit, time, data } = noteTypeMap[nodeType]
            //         Object.keys(noteRelation).forEach(key => {
            //             const m = noteRelation[key]
            //             noteContent[rang + habit + key + time] = data[m]
            //         })
            //     }

            //     return noteContent;

            // };

            // const cooperateNote = {}

            // for (let index = 0; index < nodeTypes.length; index++) {
            //     cooperateNote.push(getSpreadContent(nodeTypes[index]))
            // }

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
                    内容类目及占比: this.contentPercent(
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
                    内容类目及占比: this.contentPercent(
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
        },
        notesDataMap(dailyNotesData, cooperationNotesData, capability) {
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
                内容类目及占比: this.contentPercent(
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
    };
    const pgyTagHandler = {
        async busTagsData(api) {
            const tagTreePromise = api.ajax.get('https://pgy.xiaohongshu.com/api/solar/cooperator/content/tag_tree');
            const tagsConfigV2Promise = api.ajax.get('https://pgy.xiaohongshu.com/api/solar/kol/get_select_kol_tags_config_v2');
            const [tagTreeBody, tagsConfigBody] = await Promise.all([
                tagTreePromise,
                tagsConfigV2Promise,
            ]);
            const { personalTags, featureTags } = tagsConfigBody.data;
            const contentTags = tagTreeBody.data;
            const data = {
                contentTags,
                featureTags,
                personalTags,
            };
            console.log('busTagsData ok ', data);
            return data;
        },
        dataHandle(param) {
            const contentTags = this.deconstructionTransformation(
                param.contentTags
            );
            const featureTags = this.deconstructionTransformation(
                param.featureTags
            );
            const personalTags = this.deconstructionTransformation(
                param.personalTags
            );
            const data = {
                contentTags,
                featureTags,
                personalTags,
            };
            console.log('dataHandle ok', data);
            return data;
        },
        deconstructionTransformation(list) {
            let pgyTag = [];
            list.forEach((obj) => {
                let data = {};
                if (obj['taxonomy2Tag'] != '母婴阶段') {
                    Object.keys(obj).forEach((key) => {
                        if (obj[key] instanceof Array && obj[key].length > 0) {
                            data['tags'] = obj[key];
                        }
                    });
                    if (
                        obj.hasOwnProperty('taxonomy2Tag') &&
                        typeof obj['taxonomy2Tag'] == 'string'
                    ) {
                        data['tag'] = obj['taxonomy2Tag'];
                    } else {
                        data['tag'] = obj['taxonomy1Tag'];
                    }
                    pgyTag.push(data);
                }
            });
            return pgyTag;
        },
    };
    const xtHandler = {
        locationData() {
            const clean = '抖音id修正';
            const href = location.href;
            const xtId = href.match(/\/douyin\/(\d+)/)[1];
            let { origin, pathname } = window.location;
            let platformSite = origin + pathname;
            const data = {
                xtId,
                clean,
                platformSite,
            };
            console.log('locationData ok', data);
            return data;
        },
        dom2Data() {
            let list = getDomText('.author-page-info .link-index').split('\n');
            const monthConnectCount = thisParseInt(list[1]);
            const monthTouchCount = thisParseInt(list[3]);
            const data = {
                monthTouchCount,
                monthConnectCount,
            };
            console.log('dom2Data ok', data);
            return data;
        },


        fetchData(vm, fieldId, xtId) {
            const url = `https://www.xingtu.cn/gw/api/data_sp/get_author_link_info?o_author_id=${xtId}&platform_source=1&platform_channel=1&industy_tag=${fieldId}`;
            return vm.$api.ajax.get(url);
        },
        // 
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
            const publishMediaIdAnduidPromise = bus.subscribe(/publishMediaIdAnduid/, function (res) {
                // 这里为什么不需要parse
                return res;
            })
            publishMediaIdAnduidPromise.then((res) => {
                Object.assign(resourceXt, res.data)
                console.log("resourceXt.mediaId == '0' || !resourceXt.mediaId", resourceXt.mediaId == '0' || !resourceXt.mediaId);
                if (resourceXt.mediaId == '0' || !resourceXt.mediaId) {
                    mediaIdError = true
                }
            })

            // 内容表现
            const authorContentMap = {
                authorContent1m: { url: `https://www.xingtu.cn/gw/api/data_sp/get_author_spread_info?o_author_id=${xtId}&platform_source=1&platform_channel=1&range=2&type=1&only_assign=false`, content: `近30天个人视频内容表现 提取成功` },
                authorContent3m: { url: `https://www.xingtu.cn/gw/api/data_sp/get_author_spread_info?o_author_id=${xtId}&platform_source=1&platform_channel=1&range=3&type=1&only_assign=false`, content: `近90天个人视频内容表现 提取成功` },
                authorContentXtAll1m: { url: `https://www.xingtu.cn/gw/api/data_sp/get_author_spread_info?o_author_id=${xtId}&platform_source=1&platform_channel=1&range=2&type=2&only_assign=false`, content: `近30天星图视频内容表现 提取成功` },
                authorContentXtAll3m: { url: `https://www.xingtu.cn/gw/api/data_sp/get_author_spread_info?o_author_id=${xtId}&platform_source=1&platform_channel=1&range=3&type=2&only_assign=false`, content: `近90天星图视频内容表现 提取成功` },
            }
            await wait(1500)
            for (let key of Object.keys(authorContentMap)) {
                if (!mediaIdError) {
                    try {
                        const { url, content } = authorContentMap[key];
                        // try {
                        const authorContent = await vm.$api.ajax.get(url)
                        const handleMap = {}
                        if (authorContent.hasOwnProperty("base_resp")) {
                            handleMap[key] = authorContent
                            const updateAuthorContent = this.getAuthorContent(handleMap, vm);
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

            // 星图指数
            for (let fieldId of Object.keys(fieldIdMap)) {
                if (!mediaIdError) {
                    try {
                        const { prefix } = fieldIdMap[fieldId];
                        const indexData = await this.fetchData(vm, fieldId, xtId)
                        const { link_star_index } = indexData;
                        resourceXt[prefix + "Index"] = this.getAuthorContentData(link_star_index, 'value')
                        vm.$Message.success({ content: prefix + "Index 提取成功" })
                        syncOp()
                    } catch (error) {
                        $api.baojing({ tag: "星图-行业星图指数", message: "api/data_sp/get_author_link_info", site: window.location.href })
                    }
                    await wait(2500)
                }
            }

            // 种草指数
            try {
                if (!mediaIdError) {
                    const authorBusinessCapabilitiesNoLimit = await this.fetchData(vm, 0, xtId);
                    console.log("authorBusinessCapabilitiesNoLimit", authorBusinessCapabilitiesNoLimit);
                    if (authorBusinessCapabilitiesNoLimit) {
                        const subPrefixMap = {
                            cooperate_index: "hz",//合作指数
                            cp_index: "xjb",//性价比
                            link_convert_index: "zh",//转化
                            link_shopping_index: "zc",//种草
                            link_spread_index: "cb",//传播
                            link_star_index: "xt",//星图指数
                        }
                        Object.keys(authorBusinessCapabilitiesNoLimit).forEach(key => {
                            const subPrefix = subPrefixMap[key];
                            if (subPrefix) {
                                const target = authorBusinessCapabilitiesNoLimit[key];
                                resourceXt[subPrefix + "AvgValue"] = this.getAuthorContentData(target, 'avg_value', 100)
                                resourceXt[subPrefix + "Value"] = this.getAuthorContentData(target, 'value', 100)
                                resourceXt[subPrefix + "Rank"] = this.getAuthorContentData(target, 'rank')
                                resourceXt[subPrefix + "GrowRate"] = this.getAuthorContentData(target, 'link_relative_ratio', 10000)
                                const rankRate = this.getAuthorContentData(target, 'rank_percent', 10000)
                                console.log("rankRate", rankRate);
                                console.log("target", target['rank_percent']);
                                resourceXt[subPrefix + "RankRate"] = rankRate < 0 ? -1 : rankRate
                            }
                        })
                        syncOp()
                    }
                    vm.$Message.success({ content: "商业能力（行业不限） 提取成功" })
                }
            } catch (error) {
                $api.baojing({ tag: "商业能力表现", message: "api/data_sp/get_author_link_info", site: window.location.href })
            }
            console.log("resourceXt", resourceXt)
            vm.$Message.success({ content: `谢谢，您的等待，所有数据提取成功` });

        },
        async baseBusData(vm, xtId) {
            const { bus } = vm;
            // const baseInfoPromise = vm.$api.ajax.get(
            //     `https://www.xingtu.cn/gw/api/author/get_author_base_info?o_author_id=${xtId}&platform_source=1&platform_channel=1&recommend=true&search_session_id=&need_sec_uid=true&ccc=0`
            // );
            // const marketingInfoPromise = vm.$api.ajax.get(
            //     `https://www.xingtu.cn/gw/api/author/get_author_marketing_info?o_author_id=${xtId}&platform_source=1&platform_channel=1`
            // );
            // const introducePromise = vm.$api.ajax.get(
            //     `https://www.xingtu.cn/gw/api/author/get_author_platform_channel_info_v2?platform_source=1&platform_channel=1&o_author_id=${xtId}`
            // );

            const baseInfoPromise = bus.subscribe(
                /\/api\/author\/get_author_base_info/,
                (rs) => {
                    let body = bus.parseBody(rs);
                    return body.hasOwnProperty('nick_name') ? body : false;
                }
            );
            const marketingInfoPromise = bus.subscribe(
                /\/api\/author\/get_author_marketing_info/,
                (rs) => {
                    let body = bus.parseBody(rs);
                    return body.hasOwnProperty('price_info') ? body : false;
                }
            );
            const introducePromise = bus.subscribe(
                /\/api\/author\/get_author_platform_channel_info_v2/,
                (rs) => {
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
                core_user_id,
                unique_id,
                tags_relation,
                avatar_uri,
                follower,
            } = baseInfoBody;
            console.log("basePort ok");
            const mediaId = unique_id;
            const name = nick_name;
            // const uid = core_user_id;
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
                // uid,
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
                // xtFieldIndexList,
                // promisesOrderList,
                // authorContentMap
            };
            console.log('baseBusData ok', data);
            return data;
        },
        busGetContact(bus) {
            return new Promise(async (resolve, reject) => {
                const data = {}
                setTimeout(() => {
                    resolve(data)
                }, 2000)
                let contactPromise = {}
                try {
                    // api/gauthor/author_get_business_card_info
                    contactPromise = bus.subscribe(
                        /\/api\/gauthor\/author_get_business_card_info/,
                        (rs) => {
                            console.log("author_get_business_card_info", rs);
                            let body = bus.parseBody(rs);
                            return body.hasOwnProperty('base_resp') ? body : false;
                        }
                    );
                } catch (error) {
                    vm.$Message.error({ content: "星图新增抓取数据，需重新安装插件" })
                    console.log("contactPromise", contactPromise, error);
                }
                const [
                    contact
                ] = await Promise.all([
                    contactPromise
                ]);
                console.log("contact", contact);
                if (contact) {
                    const { card_info } = contact;
                    // console.log("card_info", card_info);
                    if (card_info) {
                        const { wechat, email } = card_info
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
        },
        async busData(bus) {
            let data = {}
            const tabList = await wait(1500, () => {
                const clickDom = document.querySelector('.author-page-tab .is-top[role="tablist"]')
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
                const authorContent1mPromise = bus.subscribe(
                    /\/api\/data_sp\/get_author_spread_info/,
                    (rs) => {
                        console.log("get_author_spread_info", rs);
                        let body = bus.parseBody(rs);
                        return body.hasOwnProperty('expect_cpe') ? body : false;
                    }
                );
                // 内容类型占比
                const authorVideoDistributionPromise = bus.subscribe(
                    /\/api\/data_sp\/author_video_distribution/,
                    (rs) => {
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
                const { video_content_distribution } = authorVideoDistribution;
                tabList[1].click();
                data = {
                    authorContent1m,
                    // authorBusinessCapabilitiesNoLimit: {},
                    // authorBusinessCapabilitiesNoLimit: bus.parseBody(authorBusinessCapabilitiesNoLimit),
                    video_content_distribution,
                };
            }
            // }

            console.log('busData ok', data);
            return data;
        },
        getCpeAndCpm(target) {
            let cepAndCpmMap = {}
            if (target) {
                const { expect_cpe, expect_cpm } = target;
                if (expect_cpe) {
                    cepAndCpmMap = {
                        cpe120: this.getAuthorContentData(expect_cpe, 'cpe_1_20'),
                        cpe2160: this.getAuthorContentData(expect_cpe, 'cpe_21_60'),
                        cpe60: this.getAuthorContentData(expect_cpe, 'cpe_60'),
                    }
                }
                if (expect_cpm) {
                    cepAndCpmMap.cpm120 = this.getAuthorContentData(expect_cpm, 'cpm_1_20')
                    cepAndCpmMap.cpm2160 = this.getAuthorContentData(expect_cpm, 'cpm_21_60')
                    cepAndCpmMap.cpm60 = this.getAuthorContentData(expect_cpm, 'cpm_60')
                }
            }
            return cepAndCpmMap;
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




        // xtIndexHandle(xtFieldIndexList, promisesOrderList, fieldIdMap) {

        //     const xtIndexMap = {}
        //     if (xtFieldIndexList && xtFieldIndexList.length > 0) {
        //         xtFieldIndexList.forEach((item, index) => {

        //             const fieldId = promisesOrderList[index];
        //             const { prefix } = fieldIdMap[fieldId];
        //             const { link_star_index } = item;
        //             // Object.keys(item).forEach(key => {
        //             //     const subPrefix = subPrefixMap[key];
        //             //     if (subPrefix) {
        //             //         const target = item[key];
        //             //         map[prefix + subPrefix + "Index"] = handleValue(target, 'avg_value')
        //             //         // map[prefix + subPrefix + "Rank"] = handleValue(target, 'rank')
        //             //         // map[prefix + subPrefix + "GrowRate"] = handleValue(target, 'link_relative_ratio')
        //             //         // map[prefix + subPrefix + "RankRate"] = handleValue(target, 'rank_percent')
        //             //     }
        //             // })
        //             xtIndexMap[prefix + "Index"] = this.getAuthorContentData(link_star_index, 'value', 100)
        //             // map[prefix + "GrowRate"] = this.getAuthorContentData(link_star_index, 'link_relative_ratio')
        //             // map[prefix + "Rank"] = this.getAuthorContentData(link_star_index, 'rank')
        //             // map[prefix + "AvgValue"] = this.getAuthorContentData(link_star_index, 'avg_value')
        //         })

        //     }
        //     console.log("xtIndexMap", xtIndexMap);
        //     return xtIndexMap;
        // },
        dataHandle(
            price_info,
            tags_relation,
            industry_tags,
            monthTouchCount,
            monthConnectCount,
            busData,
            hot_list_ranks,
            // authorContentMap
        ) {
            const {
                // like_avg,
                // item_rate,
                // share_avg,
                // expect_cpe,
                // expect_cpm,
                // comment_avg,
                // avg_duration,
                // interact_rate,
                // play_over_rate,
                // authorBusinessCapabilitiesNoLimit,
                authorContent1m,
                video_content_distribution,
            } = busData;
            // console.log("{ ...authorContentMap, authorContent1m }", { ...authorContentMap, authorContent1m });
            const authorContent = this.getAuthorContent({ authorContent1m })
            // console.log("authorContent", authorContent);

            // const authorBusinessCapabilitiesNoLimitMap = {}
            // console.log("authorBusinessCapabilitiesNoLimit", authorBusinessCapabilitiesNoLimit);
            // if (authorBusinessCapabilitiesNoLimit) {
            //     const subPrefixMap = {
            //         cooperate_index: "hz",//合作指数
            //         cp_index: "xjb",//性价比
            //         link_convert_index: "zh",//转化
            //         link_shopping_index: "zc",//种草
            //         link_spread_index: "cb",//传播
            //         link_star_index: "xt",//星图指数
            //     }
            //     Object.keys(authorBusinessCapabilitiesNoLimit).forEach(key => {
            //         const subPrefix = subPrefixMap[key];
            //         if (subPrefix) {
            //             const target = authorBusinessCapabilitiesNoLimit[key];
            //             authorBusinessCapabilitiesNoLimitMap[subPrefix + "AvgValue"] = this.getAuthorContentData(target, 'avg_value', 100)
            //             authorBusinessCapabilitiesNoLimitMap[subPrefix + "Value"] = this.getAuthorContentData(target, 'value', 100)
            //             authorBusinessCapabilitiesNoLimitMap[subPrefix + "Rank"] = this.getAuthorContentData(target, 'rank')
            //             authorBusinessCapabilitiesNoLimitMap[subPrefix + "GrowRate"] = this.getAuthorContentData(target, 'link_relative_ratio', 10000)
            //             const rankRate = this.getAuthorContentData(target, 'rank_percent', 10000)
            //             authorBusinessCapabilitiesNoLimitMap[subPrefix + "RankRate"] = rankRate < 0 ? -1 : rankRate
            //         }
            //     })
            // }
            // console.log("authorBusinessCapabilitiesNoLimitMap", authorBusinessCapabilitiesNoLimitMap);


            let price = {};
            if (price_info && price_info.length > 0) {
                const priceMap = {};
                price_info.forEach((item) => {
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
            //  else {
            //     cepAndCpmMap = this.getCpeAndCpm(authorContentMap.authorContent3m)
            // }

            let subContentTags = [];
            let subFieldTags = [];
            let fieldTags = [];
            let contentTags = Object.keys(tags_relation);
            if (contentTags) {
                contentTags.forEach((item) => {
                    subContentTags = [...subContentTags, ...tags_relation[item]];
                });
            }
            if (industry_tags) {
                industry_tags.forEach((item) => {
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
                    // 作品: item_rate && item_rate.item_num.value,
                    // 播放中位数: item_rate && item_rate.play_mid.value,
                    // 播放中位比: item_rate && item_rate.play_mid.overtake,
                    // 平均点赞数: like_avg,
                    // 完播率: play_over_rate && play_over_rate.value,
                    // 完播比: play_over_rate && play_over_rate.overtake,
                    // 平均转发: share_avg,
                    // 平均播放时长: avg_duration,
                    // 平均评论: comment_avg,
                    // 互动率: interact_rate && interact_rate.value,
                    // 互动比: interact_rate && interact_rate.overtake,
                },
            };

            const rank = {};
            if (hot_list_ranks) {
                hot_list_ranks.forEach((item, index) => {
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
                // authorBusinessCapabilitiesNoLimitMap
            };
            console.log('dataHandle ok', data);
            return data;
        },
        contentTypeHandle(contentTypeList) {
            const map = {};
            contentTypeList.forEach(({ name, proportion }) => {
                map[name] = proportion;
            });
            return map;
        },
    };
    const xtTagHandler = {
        async busTagData(bus) {
            const data = await bus.subscribe(
                /\/api\/user\/author_options/,
                (rs) => {
                    let body = bus.parseBody(rs);
                    console.log("body", body);
                    return body?.data;
                }
            );
            console.log('busTagData ok ', data);
            return data;
        },
        dataHandle({ content_tag_v2, industry_tag_v2 }) {
            let contentData = this.deconstructionTransformation(content_tag_v2);
            const contentTags = contentData.tagList;
            let { tagList, tagMap } = this.deconstructionTransformation(
                industry_tag_v2
            );
            const data = {
                contentTags,
                fieldTags: tagList,
                fieldMap: tagMap,
            };
            console.log('dataHandle ok', data);
            return data;
        },
        deconstructionTransformation(tagData) {
            const tagList = [];
            const tagMap = {};
            tagData.forEach((item) => {
                const { first, second } = item;
                const tag = Object.values(first)[0];
                Object.assign(tagMap, first);
                const tags = [];
                second.forEach((inItem) => {
                    tags.push(...Object.values(inItem));
                });
                tagList.push({ tag, tags });
            });
            return { tagList, tagMap };
        },
    };
    const byHandler = {
        locationData(vm) {
            let href = window.location.href;
            const byCodeArr = href.match(/uid=(\w+)&?/);
            console.log(byCodeArr);
            const byCode = byCodeArr[1];
            console.log("byCode", byCode);
            if (!byCode) {
                vm.limitIntoOp = false;
                vm.$Notice.error({
                    title: '获取byCode失败',
                });
            }
            const platformSite =
                'https://buyin.jinritemai.com/dashboard/servicehall/daren-profile?uid=' +
                byCode;
            console.log('locationData ok', { platformSite });
            return { platformSite, byCode };
        },
        async baseBusData(vm) {
            const { bus } = vm;
            let authorProfile = null;
            try {
                authorProfile = await bus.subscribe(
                    /\/homePage\/author\/profile/,
                    (rs) => {
                        let { data } = bus.parseBody(rs);
                        console.log('from', rs.from, rs.url)
                        return data.hasOwnProperty('account_douyin') ? data : false;
                    }
                );
                const storageUid = sessionStorage.getItem('uid');
                if (storageUid) {
                    sessionStorage.removeItem('uid');
                }
            } catch (error) {
                try {
                    authorProfile = await bus.subscribe(
                        /\/api\/authorStatData\/authorProfile/,
                        (rs) => {
                            let { data } = bus.parseBody(rs);
                            return data.hasOwnProperty('account_douyin') ? data : false;
                        }
                    );
                } catch (error) {
                    const storageUid = sessionStorage.getItem('uid');
                    const href = location.href;
                    const uid = href.match(/uid=(\S*)&?/)[1];
                    if (storageUid !== uid) {
                        sessionStorage.setItem('uid', uid);
                        // location.reload();
                    }
                    console.log("error", error, href);
                }
            }
            if (authorProfile) {
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
                } = authorProfile;
                console.log("authorProfile", authorProfile);
                let mainCategory = {};
                if (product_main_type_array) {
                    product_main_type_array.map((item) => {
                        let { name, val } = item;
                        mainCategory[name] = val + '%';
                    });
                }
                const data = {
                    sex: gender == 1 ? '男' : '女',
                    site: web_homepage_url,
                    mediaId: account_douyin,
                    level: level ? 'LV' + level : level,
                    dataOverview: sale_type,
                    fanCount: thisParseInt(fans_sum),
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
        },
        async cargoAnalysisBusData(vm) {
            const { $api, tag, bus } = vm;
            let capability = {};
            let saleAnalysis = {};
            try {
                const { live_data, video_data, key_data, sale_analysis, } = await bus.subscribe(
                    /\/api\/authorStatData\/authorOverviewV2/,
                    (rs) => {
                        let body = bus.parseBody(rs);
                        return body?.data;
                    }
                );
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
                    zbzcl: thisParseInt(live_data.recommend_rate),

                    spxszb: video_data.percentage,
                    dhsps: video_data.count,
                    dhspbfl: video_data.watching_num,
                    dspxseMin: video_data.sale_low,
                    dspxseMax: video_data.sale_high,
                    spgpmMin: video_data.GPM_low,
                    spgpmMax: video_data.GPM_high,
                    spzcl: thisParseInt(video_data.recommend_rate),
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
            } catch (error) {
                console.log("error", error);
                $api.baojing({ tag, error: error.message, at: "cargoAnalysisBusData", url: window.location.href });
                return { capability, saleAnalysis };
            }
        },
        async patchShopData(vm) {
            const { $api, tag, bus } = vm
            const dom = await wait(800, () => getDom(".auxo-pagination"));
            const children = dom.children;
            let domLength = children.length

            let arr = []
            let index = 1
            if (domLength > 3) {
                for (let i = 2; i < domLength - 1; i++) {
                    wait(index * 1000, async () => {
                        children[domLength - 1].click()
                        const shops = await bus.subscribe(
                            /\/authorStatData\/sellProduct/,
                            (rs) => {
                                let body = bus.parseBody(rs);
                                return body?.data
                            }
                        );
                        arr.push(shops)
                    })
                    index++
                    console.log("index", index);
                }

            } else {

            }

            console.log("dom", dom);
            console.log("arr", arr);
        },
        async capabilityPatchData(vm) {
            const { $api, tag, bus } = vm
            let capability = {};
            const dom = await wait(800, () => getDom(".auxo-tabs-nav-list"));
            // console.log("dom", dom);
            if (dom) {
                const children = dom.children;
                console.log("children", children);
                if (children.length == 7) {
                    try {
                        children[4].click();
                        // authorStatData/authorFansV2
                        const { live_data, video_data, key_data } = await bus.subscribe(
                            /\/authorStatData\/salesAnalyseV2/,
                            (rs) => {
                                let { data } = bus.parseBody(rs);
                                return data.hasOwnProperty('video_data') ? data : false;
                            }
                        );
                        // this.patchShopData(vm);
                        // const shopResponse = await bus.subscribe(
                        //     /\/authorStatData\/sellProduct/,
                        //     (rs) => {
                        //         let body = bus.parseBody(rs);
                        //         return body.data
                        //     }
                        // );
                        // console.log("shopResponse", shopResponse);
                        // const shops = bus.parseBody(shopResponse).data;
                        // console.log("shop", shops);
                        // '平均件单价': key_data.average_price,

                        // '直播推广商品数': live_data.promotion_sum,
                        // '直播合作店铺数': live_data.cooperate_shop_num,
                        // '直播平均件单价': live_data.average_price,

                        // '视频推广商品数': video_data.promotion_sum,
                        // '视频合作店铺数': video_data.cooperate_shop_num,
                        // '视频平均件单价': video_data.average_price,
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
                    } catch (error) {
                        console.log("sellProductResponse", error);
                        $api.baojing({ tag, error: error.message, at: "doCollect", url: window.location.href });
                    }
                } else {
                    $api.baojing({ tag, error: "博主tabs列较少，请做兼容处理", at: "doCollect", url: window.location.href });
                }
            }
            console.log("capability", capability);
            return capability
        },
        async domData(vm, mediaId) {
            let capabilityPatchSecond = this.dataOverviewInfo('.daren-overview-base-basepoints');
            const patch = await this.phoneWxHandler(vm, mediaId)
            const data = { patch, capabilityPatchSecond };
            console.log("domData ok", data);
            return data
        },
        async authorFanData(vm, capability) {
            const { $api, tag, bus } = vm
            let authorFanData_dataOver = {};
            let fsKey = '';

            const dom = await wait(800, () => getDom(".auxo-tabs-nav-list"));
            console.log("dom", dom);
            if (dom) {
                const children = dom.children;
                console.log("children", children);
                if (children.length == 7) {
                    try {
                        children[3].click();
                        // authorStatData/authorFansV2
                        let { age, analysis, avg_pay_price, city_level, consumer_group, device, gender, gmv_main_cate } = await bus.subscribe(
                            /\/authorStatData\/authorFansV2/,
                            (rs) => {
                                let { data } = bus.parseBody(rs);
                                console.log("body.data.hasOwnProperty('age')", data.hasOwnProperty('age'));
                                return data.hasOwnProperty('age') ? data : false;
                            }
                        );
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
                    } catch (error) {
                        console.log("sellProductResponse", error);
                        $api.baojing({ tag, error: error.message, at: "doCollect", url: window.location.href });
                    }
                } else {
                    $api.baojing({ tag, error: "博主tabs列较少，请做兼容处理", at: "doCollect", url: window.location.href });
                }
            }
            console.log("authorFanData", authorFanData_dataOver, fsKey);
            return authorFanData_dataOver
        },
        filterProductList(product_info) {
            const productList = []
            product_info.forEach(item => {
                const { goods_sale_low, goods_sale_high, related_video_num, related_live_times, good_info } = item;
                const product = {
                    goods_sale_low, goods_sale_high, related_video_num, related_live_times, good_info
                }
                productList.push(product)
            })
            console.log("productList", productList);
            return productList;
        },
        async phoneWxHandler(vm, mediaId) {
            let phone = "";
            let wx = ""
            let dom = getDom(".daren-overview-base-contactinfo");
            if (dom) {
                const text = dom.textContent;
                let phoneMatch = text.match(/手机号(\w+)/);
                let wxMatch = text.match(/微信号(\w+)/);
                const data = {}
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
        },
        ifNeedPhoneOrWX(dom, data) {
            const text = dom.textContent
            console.log("ifNeedPhoneOrWX", text);
            if (text.includes('微信') && data.wx) {
                return true
            } else if (text.includes('手机') && data.phone) {
                return true
            } else {
                return false
            }
        },
        async getPhoneWxData(dom) {
            let phone = "";
            let wx = "";
            let text = "";
            let first = true;
            const doms = document.querySelectorAll(".daren-overview-base-contactinfo img");
            console.log("doms", doms);
            for (let i = 0, j = doms.length; i < j; i++) {
                doms[i].click();
                if (first) {
                    const submit = await wait(1500, () => document.querySelector(".auxo-modal-confirm-body-wrapper .auxo-btn-primary"));
                    console.log("submit", submit);
                    if (submit) {
                        submit.click(1500, () => document.querySelector(".auxo-modal-confirm-body-wrapper .auxo-btn-primary"));
                        await wait()
                    }
                    first = false;
                }
            }
            await wait(1000)
            text = dom.textContent;
            let phoneMatch = text.match(/手机号(\w+)/);
            let wxMatch = text.match(/微信号(\w+)/);
            phone = phoneMatch ? phoneMatch[1] : '';
            wx = wxMatch ? wxMatch[1] : '';
            const data = { phone, wx };
            console.log("getPhoneWxData", data);
            return data
        },
        jsonToArr(obj) {
            const arr = [];
            if (obj != null) {
                arr.push({ span: 24, html: '' });
                Object.keys(obj).forEach((json) => {
                    if (json == '热卖类目TOP3') {
                        arr.push({ span: 6, html: Style.label('热卖类目') });
                        arr.push({ span: 6, html: Style.label('均价') });
                        arr.push({ span: 6, html: Style.label('佣金参考') });
                        arr.push({ span: 6, html: Style.label('销售额') });
                    } else if (json == '热卖品牌TOP3') {
                        arr.push({ span: 6, html: Style.label('热卖品牌') });
                        arr.push({ span: 6, html: Style.label('均价') });
                        arr.push({ span: 12, html: Style.label('销售额') });
                    }
                    if (json != null) {
                        obj[json].forEach((item) => {
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
        },
        baseInfo(className) {
            let text = getDomText(className)
            const arr = text.split('\n')
            let contentTags = [], mcn = '', introduce = ''
            if (arr[1] != "暂无") {
                const tempArr = arr.filter(item => item.indexOf('#') != -1)
                arr.splice(1, tempArr.length, tempArr)
                contentTags = arr[1].map(item => item.slice(1))
            }
            mcn = arr[3] == "暂无" ? "" : arr[3]
            introduce = arr[5] == "暂无" ? "" : arr[5]
            return { contentTags, mcn, introduce }

        },
        dataOverviewInfo(selector) {
            let text = getDomText(selector);
            let map = {};
            let textSplitList = [];
            if (text.length > 4) {
                textSplitList = text.split('\n');
                textSplitList = textSplitList.filter(
                    (item) => !/[中高低]/.test(item)
                );
                map = {
                    dhkb: Math.ceil(textSplitList[0] * 100),
                    xyf: Math.ceil(textSplitList[2] * 100),
                    lyf: Math.ceil(textSplitList[4] * 100),
                    pjf: Math.ceil(textSplitList[6] * 100)
                }
            }
            return map;
        },
        mainCategoryInfo(className) {
            let text = getDomText(className);
            const map = {};
            let splitList = [];
            if (text.length > 4) {
                for (let i = 0, j = splitList.length; i < j; i += 2) {
                    splitList[i] == '-' && (splitList[i] = '')
                    map[splitList[i + 1]] = splitList[i]
                }
            }
            console.log("mainCategoryInfo", splitList);
            console.log("map", map);
            return map
        },
        demandInfo(className) {
            let text = getDomText(className)
            const map = {}
            let splitList = []
            if (text.length > 4) {
                splitList = splitList.filter(item => item != '')
                for (let i = 0, j = splitList.length; i < j; i += 2) {
                    splitList[i + 1][0] == '暂' && (splitList[i + 1] = '')
                    map[splitList[i]] = splitList[i + 1]
                }
            }
            return map
        },
        liveData(className) {
            let text = getDomText(className)
            const map = {}
            let splitList = []
            if (text) {

            }
        }
    };
    const byTagHandler = {
        async busTagsData(bus) {
            // https://buyin.jinritemai.com/square_pc_api/common/square/squareConf
            const data = await bus.subscribe(
                /\/common\/square\/squareConf/,
                function (rs) {
                    let body = bus.parseBody(rs);
                    return body?.data;
                }
            );
            console.log('busTagData ok ', data);
            return data;
        },
        dataHandle(res) {
            const { content_types, main_cates } = res
            const contentTags = []
            const mainCategoryTags = []
            content_types.forEach(item => {
                contentTags.push({ tag: item })
            })
            main_cates.forEach(item => {
                const { name, sub_cates } = item
                // const tags = sub_cates.map(item => item.name)
                mainCategoryTags.push({
                    tag: name
                })
            })
            console.log("main_cates", main_cates);
            const data = { byMainCategoryTags: main_cates, contentTags }
            console.log('busTagData ok ', data);

            return data;
        }
    };
    const xtSearchHandler = {
        // 准备需要添加列的信息，以头像图片名为key
        async listExtension(res, vm) {
            const { bus, $api } = vm
            console.log("获取到list body", res);
            let { authors } = res;
            const nameList = []
            const codeList = []
            // 取用粉丝数，是为了处理名字重复的问题
            const avatarMap = {}
            authors.forEach(item => {
                const { nick_name, id, avatar_uri } = item.attribute_datas;
                const match = avatar_uri.match(/aweme-avatar\/(\S+)\./);
                const key = match[1];
                nameList.push(nick_name)
                codeList.push(id)
                avatarMap[key] = {
                    // avatar:avatar_uri,
                    name: nick_name,
                    id,
                }
            })
            const params = {
                platformId: platformMap.抖音,
                key: "xtId",
                nameList,
                codeList,
                fields: "name, mediaId, xtId, publication, mcn, qyGgCode, qyWxCode, qyBdCode, directWise, rebate",
                extensionFields: "name, mediaId, xtId, mcn"
            }
            const { code, data } = await $api.resource.existList(params);
            const { resourceList, extensionImportList } = data;
            const resourceCodeMap = {};
            const resourceNameMap = {};
            const extensionImportMap = {};
            resourceList.forEach(item => {
                const { name, xtId } = item;
                resourceCodeMap[xtId] = item;
                if (!xtId) {
                    resourceNameMap[name] = item;
                }
            })
            extensionImportList.forEach(item => {
                extensionImportMap[item.xtId] = item;
            })
            console.log("extensionImportMap", extensionImportMap);
            Object.keys(avatarMap).forEach(key => {
                const { name, id } = avatarMap[key];
                avatarMap[key].checked = false;
                if (resourceCodeMap.hasOwnProperty(id)) {
                    const { publication, mcn, qyGgCode, qyWxCode, qyBdCode, directWise, rebate } = resourceCodeMap[id];
                    let qrCode = qyGgCode;
                    let qrCodeType = "广告"
                    if (!qrCode) {
                        qrCode = qyWxCode;
                        qrCodeType = "电商"
                    }
                    if (!qrCode) {
                        qrCode = qyBdCode;
                        qrCodeType = "本地生活"
                    }
                    avatarMap[key].exist = `已建联 / ${resourceCodeMap[id].id}`
                    avatarMap[key].publication = publication
                    avatarMap[key].mcn = mcn
                    avatarMap[key].resourceId = resourceCodeMap[id].id
                    avatarMap[key].qrCode = qrCode && photo(qrCode)
                    avatarMap[key].qrCodeType = qrCode && qrCodeType
                    avatarMap[key].directWise = directWise
                    avatarMap[key].rebate = rebate
                    // avatarMap[key].xtId = resourceCodeMap[id].xtId
                } else {
                    if (extensionImportMap[id]) {
                        avatarMap[key].exist = `待建联 / ${extensionImportMap[id].id}`
                        avatarMap[key].extensionImportId = extensionImportMap[id].id;
                        // const { qyGgCode } = extensionImportMap[id]
                        // avatarMap[key].qrCode = qyGgCode && photo(qyGgCode)

                    } else {
                        if (resourceNameMap.hasOwnProperty(name)) {
                            avatarMap[key].exist = `可能已建联 / ${resourceNameMap[name].id}`
                        } else {
                            avatarMap[key].exist = `未建联`
                        }
                    }
                }
            })
            console.log("avatarMap", avatarMap);
            vm.avatarMap = avatarMap;
            await this.insertDom(vm, avatarMap, resourceCodeMap, extensionImportMap);
        },
        // 资源列表中插入列信息、逻辑、样式
        async insertDom(vm, avatarMap, resourceCodeMap, extensionImportMap) {
            const authorInfoListWrapper = await wait(2000, () => document.querySelector(".author-table .author-info-list-wrapper .author-info-list"));
            const headerInfoDom = document.querySelector('.table-header .author-header');
            authorInfoListWrapper.style.width = "560px"
            headerInfoDom.style.width = "560px"
            headerInfoDom.style.position = "relative"
            vm.teleportHeader = {
                el: ".table-header .author-header",
                name: "op信息"
            }
            const infoDomList = authorInfoListWrapper.children;
            const teleportList = [];
            for (let i = 0; i < infoDomList.length; i++) {
                const infoDom = infoDomList[i];
                const imgSrc = infoDom.querySelector(".user-avatar-image").getAttribute("src");
                console.log("imgSrc", imgSrc);
                const key = Object.keys(avatarMap).find(key => imgSrc.includes(key));
                const { exist, publication, mcn, qyGgCode, id } = avatarMap[key];
                const dataXtId = infoDom.getAttribute("data-xtId");
                if (!dataXtId || (dataXtId && !resourceCodeMap.hasOwnProperty(dataXtId))) {
                    infoDom.setAttribute("data-xtId", id);
                    infoDom.style.position = 'relative'
                    if (resourceCodeMap[id]) {
                        avatarMap[key].class = "op-done"
                    }
                    if (extensionImportMap[id]) {
                        avatarMap[key].class = "op-doing"
                    }
                    const teleport = { qs: `.author-info[data-xtid="${id}"]`, ...avatarMap[key] }
                    teleportList.push(teleport)
                }
            }
            vm.teleportList = teleportList;
            console.log("vm", vm);
        },
        // async insertDom(avatarMap) {
        //     console.log("avatarMap", avatarMap);
        //     const containerInsrtDiv = document.createElement("div");
        //     containerInsrtDiv.className = "data-list hide-scrollbar insert-dom"
        //     containerInsrtDiv.style = "border-radius: 10px;margin-right:10px" //background-color: #ffeef3;
        //     // containerInsrtDiv.style = 'width: 160px;'

        //     const authorInfoListWrapper = await wait(2000, () => document.querySelector(".author-table .author-info-list-wrapper .author-info-list"));
        //     const createdInsertDom = document.querySelector(".author-table .insert-dom");
        //     const infoDomList = authorInfoListWrapper.children;

        //     if (createdInsertDom) {
        //         const insertDomList = createdInsertDom.children;
        //         for (let i = 0; i < infoDomList.length; i++) {
        //             const infoDom = infoDomList[i];
        //             const imgSrc = infoDom.querySelector(".user-avatar-image").getAttribute("src");
        //             console.log("imgSrc", imgSrc);
        //             const key = Object.keys(avatarMap).find(key => imgSrc.includes(key))
        //             console.log("key", key);
        //             console.dir(infoDom);
        //             const insertDom = insertDomList[i]
        //             insertDom.className = key;
        //             insertDom.style = `height:${infoDom.offsetHeight}px;display:flex;
        //             flex-shrink: 0;
        //             align-items: center;
        //             border-bottom: 1px solid rgb(231 225 225);
        //             color: #333;
        //             font-family: OPPOSans-Cloak;
        //             font-weight: 700;
        //             font-size: 12px;
        //             line-height: 21px;
        //             `;
        //             // const qrCodeDom = insertDom.querySelector(".insert-qrCode");
        //             const cellDom1 = insertDom.querySelector(".insert-exsit");
        //             const cellDom2 = insertDom.querySelector(".insert-select");
        //             insertDom.style.paddingLeft = "5px"
        //             if (key) {
        //                 const { exist, publication, mcn, qyGgCode } = avatarMap[key];
        //                 // if (exist != "否") {
        //                 //     insertDom.style.backgroundColor = "#b2f6b2"
        //                 //     insertDom.style.borderRadius = "10px"
        //                 //     cellDom1.style = "width:120px;color: #a66237;"
        //                 //     innerHTML += '<br/>' + "刊例状态：" + (publication || "暂未设置") + '<br/>' + "机构：" + (mcn || "--");
        //                 // } else {
        //                 //     cellDom1.style = "width:120px;"
        //                 // }
        //                 let innerHTML = "建联状态：" + exist;
        //                 insertDom.style.borderRadius = "10px"
        //                 cellDom1.style = "width:120px;color: #a66237;"
        //                 if (exist.includes("待建联")) {
        //                     insertDom.style.backgroundColor = "rgb(181 216 236)"
        //                     innerHTML += '<br/>' + "机构：" + (mcn || "--");
        //                 } else if (exist.includes("已建联")) {
        //                     insertDom.style.backgroundColor = "#b2f6b2"
        //                     // qrCodeDom.src = photo(qyGgCode)
        //                     innerHTML += '<br/>' + "刊例状态：" + (publication || "暂未设置") + '<br/>' + "机构：" + (mcn || "--");
        //                 }
        //                 cellDom1.innerHTML = innerHTML;
        //             } else {
        //                 cellDom1.textContent = "否";
        //             }
        //             // cellDom2.innerHTML = `<input type='checkbox' class='select-input' id='${key}'/>`;
        //             cellDom2.innerHTML = '';
        //             const selectInput = document.createElement("input");
        //             selectInput.type = "checkbox";
        //             selectInput.className = "select-input";
        //             selectInput.id = key;
        //             selectInput.addEventListener("click", xtSearchHandler.selectClick)
        //             cellDom2.appendChild(selectInput);
        //         }
        //         xtSearchHandler.selectClick();
        //     } else {
        //         const tableHeaderAuthor = document.querySelector(".author-table .table-header .author-header");
        //         const headerExistDom = document.createElement("div");
        //         const headerselectDom = document.createElement("div");
        //         headerExistDom.style = "width:120px;color:#999;padding-left:5px"
        //         headerselectDom.style = "width:60px;color:#999;padding-left:5px"
        //         const totalSelect = document.createElement("input");
        //         totalSelect.type = "checkbox";
        //         totalSelect.className = "total-select-input select-input";

        //         totalSelect.addEventListener("click", xtSearchHandler.totalSelectClick)


        //         headerselectDom.appendChild(totalSelect)
        //         headerExistDom.textContent = "OP资源"
        //         tableHeaderAuthor.after(headerselectDom)
        //         tableHeaderAuthor.after(headerExistDom)
        //         for (let i = 0; i < infoDomList.length; i++) {
        //             const infoDom = infoDomList[i];
        //             console.dir(infoDom);
        //             const rowDom = document.createElement("div");
        //             rowDom.className = "author-data insert-dom"
        // rowDom.style = `height:${infoDom.offsetHeight}px;display:flex;
        // flex-shrink: 0;
        // align-items: center;
        // border-bottom: 1px solid rgb(231 225 225);
        // color: #333;
        // font-family: OPPOSans-Cloak;
        // font-weight: 700;
        // font-size: 12px;
        // line-height: 21px;`
        //             const imgSrc = infoDom.querySelector(".user-avatar-image").getAttribute("src");
        //             console.log("imgSrc", imgSrc);
        //             const key = Object.keys(avatarMap).find(key => imgSrc.includes(key))
        //             console.log("key", key);

        //             const qrCodeDom = document.createElement("img");
        //             const cellDom1 = document.createElement("div");
        //             const cellDom2 = document.createElement("div");
        //             cellDom1.className = "indice-item insert-exsit "
        //             cellDom2.className = "indice-item insert-select "
        //             cellDom2.id = key
        //             cellDom1.style = "width:120px;"
        //             cellDom2.style = "width:40px;"
        //             rowDom.style.paddingLeft = "5px"
        //             if (key) {
        //                 const { exist, publication, mcn, qyGgCode } = avatarMap[key]
        //                 let innerHTML = "建联状态：" + exist;
        //                 if (exist != "未建联") {
        //                     rowDom.style.borderRadius = "10px"
        //                     cellDom1.style = "width:120px;color: #a66237;"
        //                     if (exist.includes("待建联")) {
        //                         rowDom.style.backgroundColor = "rgb(181 216 236)"
        //                         innerHTML += '<br/>' + "机构：" + (mcn || "--");
        //                     } else {
        //                         rowDom.style.backgroundColor = "#b2f6b2"
        //                         // qrCodeDom.src = photo(qyGgCode)
        //                         innerHTML += '<br/>' + "刊例状态：" + (publication || "暂未设置") + '<br/>' + "机构：" + (mcn || "--");
        //                     }
        //                 }
        //                 cellDom1.innerHTML = innerHTML;
        //             } else {
        //                 cellDom1.textContent = "否"
        //             }
        //             // cellDom1.textContent = key
        //             //     ? avatarMap[key].exist : "否";
        //             const selectInput = document.createElement("input");
        //             selectInput.type = "checkbox";
        //             selectInput.className = "select-input";
        //             selectInput.id = key;
        //             selectInput.addEventListener("click", xtSearchHandler.selectClick)
        //             cellDom2.appendChild(selectInput);

        //             // cellDom2.innerHTML = `<input type='checkbox' class='select-input' id='${key}'/>`;

        //             // rowDom.appendChild(qrCodeDom);
        //             rowDom.appendChild(cellDom1);
        //             rowDom.appendChild(cellDom2);
        //             containerInsrtDiv.appendChild(rowDom);
        //         }

        //         const tableDody = document.querySelector(".author-table .author-info-list-wrapper");
        //         tableDody.after(containerInsrtDiv)
        //     }

        // },
        // 资源全选按钮逻辑
        totalSelectClick() {
            const totalSelect = document.querySelector(".total-select-input");
            const checked = totalSelect.checked;
            const selectInputList = document.querySelectorAll(".insert-select .select-input");
            for (let selectInput of selectInputList) {
                selectInput.checked = checked;
            }
        },
        // 资源单选按钮逻辑
        selectClick() {
            let checked = true
            const selectInputList = document.querySelectorAll(".insert-select .select-input");
            for (let selectInput of selectInputList) {
                if (!selectInput.checked) {
                    checked = false;
                    break;
                }
            }
            console.log("checked", checked);
            const totalSelect = document.querySelector(".total-select-input");
            totalSelect.checked = checked;
        }
    }

    // const jinritemaiCooperationProductHandler
    function tryCollectTimeout(vm, handler) {
        return new Promise(function (resolve) {
            vm.it = setTimeout(function () {
                resolve(tryCollect(vm, handler));
            }, 1000);
        });
    }
    async function ifDebug(vm, fun) {
        if (vm.forDebug) {
            return fun(vm)
        } else {
            try {
                const data = await fun(vm);
                console.log('data', fun, data)
                return data
            } catch (e) {
                return { _catch: e }
            }
        }
    }
    async function tryCollect(vm, handler) {
        let data = await ifDebug(vm, handler)
        if (data._catch) {
            return {
                ok: false,
                error: data._catch,
            };
        } else {
            return {
                ok: true,
                data,
            };
        }
    }

    const labelMap = {
        brand: '品牌',
        category: '类目',
        average_price: '均价',
    };
    /*
     * @param object
     * 可以深度遍历 param 属性值为对象数组、对象的数据结构转为array
     *  */
    function objectToList(viewObject) {
        let viewList = [];
        if (viewObject != null && judgeDataType(viewObject) === 'Object') {
            Object.keys(viewObject).forEach((item) => {
                const value = viewObject[item];
                if (judgeDataType(value) === 'Object') {
                    viewList.push({ span: 24, html: Style.mainLabel(item) });
                    let deepViewList = objectToList(value);
                    viewList = [...viewList, ...deepViewList];
                } else if (
                    judgeDataType(value) === 'Array' &&
                    value &&
                    value.length > 0
                ) {
                    if (value[0] instanceof Object) {
                        value.forEach((item) => {
                            let deepViewList = objectToList(item);
                            viewList = [...viewList, ...deepViewList];
                        });
                    } else {
                        console.log('objectToList');
                        viewList.push({ span: 24, html: '' });
                        viewList.push({ span: 4, html: Style.label(item) });
                        viewList.push({
                            span: 20,
                            html: viewObject[item].join(','),
                        });
                    }
                } else {
                    viewList.push({ span: 4, html: Style.label(item) });
                    viewList.push({ span: 4, html: viewObject[item] });
                }
            });
        }
        return viewList;
    }
    function judgeDataType(data) {
        return Object.prototype.toString.call(data).slice(8, -1);
    }
    async function doCollect(vm, handler) {
        let rs = await tryCollect(vm, handler);
        console.log('tryCollect', rs);
        if (!rs.ok) {
            let tryCount = 1;
            let maxCount = 5;
            while (tryCount < maxCount) {
                rs = await tryCollectTimeout(vm, handler);
                console.log('tryCollectTimeout', tryCount, rs);
                if (rs.ok) {
                    tryCount = maxCount;
                } else {
                    tryCount++;
                }
            }
        }
        if (!rs.ok) {
            // let error = JSON.stringify(rs.error);
            // vm.$Message.error({ content: error });
            const { $Message, $api, tag } = vm
            $Message.error({ content: rs.error.message });
            $api.baojing({ tag, error: rs.error.message, at: "doCollect", url: window.location.href });
        }
        return rs;
    }
    async function collectNotesAndFans(pack, vm) {
        console.log("vm.noNeedOth", vm.gradMode);
        if ((vm.tag === Tag.Pgy) && (vm.gradMode == GradMode.抓取全部数据)) {
            function getNotesPageUrl(pageNumber, uid) {
                return `https://pgy.xiaohongshu.com/api/solar/kol/dataV2/notesDetail?advertiseSwitch=1&orderType=1&pageNumber=${pageNumber}&pageSize=8&userId=${uid}&noteType=4&withComponent=false`
            }
            function getBrandUrl(noteId) {
                return `https://pgy.xiaohongshu.com/api/solar/note/${noteId}/detail?bizCode=`
            }
            const { mediaId, uid, origin, platform, fansMap } = pack;
            vm.$Notice.warning({
                title: '请稍等',
                desc: "正在提取博主笔记数据....",
            });
            let params = {
                mediaId, uid, origin, platform, fansMap
                // notesCollectList: pack.notesList,
                // mediaId: pack.mediaId,
                // uid: pack.uid,
                // origin: pack.origin,
                // platform: pack.platform,
                // fansMap: pack.fansMap
            }
            // try {
            if (vm.$api.notesCollect.addOrUpdate && vm.$api.fansPgy.addOrUpdate) {
                // 无需等待
                vm.$api.fansPgy.addOrUpdate(params)
                let notes = [];
                const pageSize = 8;
                const { data } = await portRequest(vm, getNotesPageUrl(1, uid), 'list');
                if (data) {
                    const { list, total } = data;
                    notes = list;
                    if (total > pageSize) {
                        const loop = Math.ceil(total / pageSize)
                        for (let i = 1; i < loop; i++) {
                            console.log("pageSize", i + 1);
                            const { data } = await portRequest(vm, getNotesPageUrl(i + 1, uid), 'list');
                            notes = [...notes, ...data.list]
                        }
                    }
                }
                console.log("notes1", notes);
                if (notes.length > 0) {
                    for (let note of notes) {
                        const { isAdvertise, isVideo, noteId } = note;
                        note.isAdvertise = isAdvertise ? 1 : 0
                        note.isVideo = isVideo ? 1 : 0
                        if (isAdvertise) {
                            const { code, data } = await portRequest(vm, getBrandUrl(noteId), 'reportBrandUserId');
                            note.brandXhsCode = data.reportBrandUserId
                        }
                    }
                }
                console.log("notes2", notes);
                params.notesCollectList = notes
                await vm.$api.notesCollect.addOrUpdate(params)

            } else {
                await vm.$api.ajax.post('/notesCollect/addOrUpdate', params)
                await vm.$api.ajax.post('/fansPgy/addOrUpdate', params)
            }
            vm.$Notice.success({
                title: '提取成功',
                desc: "博主笔记数据提取成功，谢谢您的等待！",
            });
            // } catch {
            //     vm.$api.baojing({ mediaId:pack.mediaId, error: `收集${pack.mediaId}的粉丝和笔记数据出错`, at: "doCollectNotesAndFans" });
            // }
        }



    }
    async function autoServer(vm, pack) {
        if (!pack.mediaId || !pack.version) {
            vm.$Notice.error({
                title: '遇到问题-_-!',
                desc: '数据不完备',
            });
        } else {
            let tryTime = 5;
            let rs = false;
            while (tryTime > 0) {
                try {
                    rs = await vm.$api.extension.auto(pack);
                    tryTime = 0;
                } catch (e) {
                    tryTime--;
                }
            }
            if (rs) {
                let { code, data, msg } = rs;
                if (code === 0) {
                    const { ids, table, resourceList } = data;
                    vm.table = table;
                    if (table == tableMap.插件入库) {
                        vm.data[0].record = `待建联 / ${ids.toString()}`;
                        vm.exist = true;
                        if (!vm.fromTabId) {
                            collectNotesAndFans(pack, vm)
                        }
                    } else if (table == tableMap.资源入库) {
                        vm.$Message.success({ content: `已更新至op / ${ids.toString()}` });
                        vm.exist = true;
                        vm.resourceId = ids[0]
                        vm.resourceList = resourceList;
                        vm.data[0].record = new Date().format('MM-dd hh:mm:ss');
                        if (!vm.fromTabId) {
                            collectNotesAndFans(pack, vm)
                        }
                    } else if (table == tableMap.品牌入库) {
                        vm.$Message.success({ content: '已更新至op' });
                        vm.exist = true;
                        vm.data[0].record = new Date().format('MM-dd hh:mm:ss');
                    } else {
                        vm.data[0].record = '🈚️';
                        vm.exist = false;
                    }
                } else {
                    vm.$Notice.error({
                        title: '遇到问题-_-!',
                        desc: msg,
                    });
                    if (code == -35) {
                        vm.signOut()
                    }
                }
            }
        }
    }
    const Style = {
        title(name) {
            return (
                '<div style="color:rgb(161 23 190);text-align: center;border-radius: 5px;background-color: #f6e5f6;font-weight: 700;">' +
                name +
                '</div>'
            );
        },
        label(name) {
            return (
                '<label style="color:rgb(45, 140, 240);">' + name + '</label>'
            );
        },
        mainLabel(name) {
            return (
                '<label style="color:rgb(0, 0, 255);font-weight:bold">' +
                name +
                '</label>'
            );
        },
        site(name) {
            return '<div class="site">' + name + '</div>';
        },
        photo(photo) {
            return `<img src="${photo}" class="photo"/>`;
        },
    };
    const Tag = {
        Xhs: '小红书',
        Dy: '抖音',
        Pgy: '蒲公英',
        Xt: '星图',
        JinritemaiGoods: '精选联盟-商品',
        JinritemaiResource: '精选联盟-直播',
        JinritemaiCooperationProduct: '精选联盟-合作商品',
        XtSearch: '星图搜索页'
    };
    const CommonView = {
        basic(data) {
            let subList = [
                {
                    span: 4,
                    html: Style.label('头像'),
                },
                {
                    span: 4,
                    html: Style.photo(data.photo),
                },
                {
                    span: 16,
                    html: data.uid,
                    className: 'line-1'
                },
                {
                    span: 4,
                    html: Style.label('昵称'),
                },
                {
                    span: 4,
                    html: data.name,
                },
                {
                    span: 4,
                    html: Style.label('抖音号'),
                },
                {
                    span: 4,
                    html: data.mediaId,
                },
                {
                    span: 4,
                    html: Style.label('来源'),
                },
                {
                    span: 4,
                    html: data.origin,
                },
                {
                    span: 4,
                    html: Style.label('平台'),
                },
                {
                    span: 4,
                    html: data.platform,
                },
                {
                    span: 4,
                    html: Style.label('地区'),
                },
                {
                    span: 4,
                    html: data.region,
                },
                {
                    span: 4,
                    html: Style.label('IP属地'),
                },
                {
                    span: 4,
                    html: data.ip,
                },
                {
                    span: 4,
                    html: Style.label('关注数'),
                },
                {
                    span: 4,
                    html: data.followCount,
                },
                {
                    span: 4,
                    html: Style.label('粉丝数'),
                },
                {
                    span: 4,
                    html: data.fanCount,
                },
                {
                    span: 4,
                    html: Style.label('获赞数'),
                },
                {
                    span: 4,
                    html: data.greatCount,
                },
                {
                    span: 4,
                    html: Style.label('mcn'),
                },
                {
                    span: 20,
                    html: data.mcn,
                },
                {
                    span: 4,
                    html: Style.label('主页'),
                },
                {
                    span: 20,
                    html: Style.site(data.site),
                },
            ];
            return {
                align: 'middle',
                gutter: 0,
                subList,
            };
        },
    };
    const Map = {};
    Map[Tag.JinritemaiGoods] = {
        data() {
            return [
                {
                    desc: '提取',
                },
            ];
        },
        parser() {
            let matches = window.location.search.match(/\?id=(\d*)/);
            let dom = document.querySelector('#app');
            if (!dom) {
                dom = document.body;
            }
            let id = matches[1];
            let error;
            let todo = dom.querySelector('.detail-banned_shop-text');
            if (todo) {
                error = todo.textContent.trim();
            } else {
                todo = dom.querySelector('.detail-abnormal__shop__text');
                if (todo) {
                    error = todo.textContent.trim();
                }
            }
            if (error) {
                return { id, error };
            } else {
                let data = jinritemaiGoodsParse(dom);
                if (data.details.length <= 0) {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            data = jinritemaiGoodsParse(dom);
                            resolve({
                                id,
                                ...data,
                            });
                        }, 2000);
                    });
                }
                return Promise.resolve({
                    id,
                    ...data,
                });
            }
        },
        ending({ tag, fromTabId, fromId }, data) {
            if (fromTabId && fromTabId > 0) {
                const { id, error } = data
                return content2Background(
                    patchFrom(
                        {
                            id,
                            error,
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

            }
        },
        async submitServer(vm, pack) {
            let { error } = pack
            if (error) {
                vm.$Message.error({ content: error });
            } else {
                let { code, data } = await vm.$api.extension.patchGoods(pack);
                if (code == 0) {
                    vm.$Message.success({ content: '已自动更新' });
                    vm.data[0].record =
                        new Date().format('MM-dd hh:mm:ss') +
                        data.nModified;
                }
            }
        }
    };
    Map[Tag.Xhs] = {
        data(vm) {
            const { fromTabId, forGaoqu } = vm;
            let todoList = [
                {
                    desc: '更新',
                    record: '',
                },
                {
                    desc: '入库',
                },
            ];
            if (fromTabId && forGaoqu == For.回填各平台基础数据) {
                todoList.push({
                    desc: '提取',
                });
            }
            return todoList;
        },
        begining(vm, { brand }) {
            if (brand && !vm.patchIsBrand) {
                vm.patchIsBrand = true;
                const { forGaoqu, gaoqId } = vm;
                if (forGaoqu == For.绑定小红书品牌) {
                    vm.data.push({
                        desc: '绑定',
                        record: gaoqId,
                        forGaoqu
                    })
                }
            }
        },
        ending({ tag, fromTabId, forGaoqu, fromId }, data) {
            if (fromTabId && fromTabId > 0 && forGaoqu == For.回填各平台基础数据) {
                let { mediaId } = data;
                window.navigator.clipboard.writeText(mediaId);
                content2Background(
                    patchFrom(
                        {
                            title: '小红书号：' + mediaId + '已复制',
                            message: '请返回op页进行粘贴',
                            msg: Msg.系统通知,
                        },
                        tag
                    )
                );
                return content2Background(
                    patchFrom(
                        {
                            data,
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
        },
        async parser(vm) {
            let {
                fanCount,
                greatCount,
                followCount,
                uid,
                ...others
            } = xhsHandler.dom2Data();
            let guest = false;
            if (fanCount.indexOf('W') > -1 || fanCount.indexOf('w') > -1 || greatCount.indexOf('W') > -1 || greatCount.indexOf('w') > -1) {
                guest = true;
                vm.$Notice.warning({
                    title: '请先登录小红书',
                    desc: '未登录小红书账号，获取粉丝、获赞与收藏会有偏差，粉丝、获赞与收藏将不会更新',
                    duration: 5
                });
            }

            let { age, region, customTags } = xhsHandler.dynamicDom2Data();
            let oldFanCount = fanCount;
            let site = window.location.origin + window.location.pathname;

            followCount = thisParseInt(followCount);
            fanCount = thisParseInt(fanCount);
            greatCount = thisParseInt(greatCount);
            age = age == 0 ? '' : thisParseInt(age);
            // if (fanCount == 10000) {
            //     vm.$api.baojing({ tag: "小红书粉丝量异常", message: `fansCount:${fanCount},oldFanCount:${oldFanCount}`, site: window.location.href })
            // }

            const data = {
                ...others,
                age,
                uid,
                site,
                guest,
                region,
                version,
                fanCount,
                pass: true,
                greatCount,
                customTags,
                followCount,
                origin: '小红书',
                platform: '小红书',
            };
            console.log('data cleaning ok', data);
            return data;
        },
        view(data) {
            return [
                CommonView.basic(data),
                {
                    align: 'middle',
                    gutter: 0,
                    subList: [
                        {
                            span: 4,
                            html: Style.label('介绍'),
                        },
                        {
                            span: 20,
                            html: data.introduce,
                        },
                        {
                            span: 4,
                            html: Style.label('标签'),
                        },
                        {
                            span: 20,
                            html: data.customTags.join(','),
                        },
                        {
                            span: 4,
                            html: Style.label('性别'),
                        },
                        {
                            span: 4,
                            html: data.sex,
                        },
                        {
                            span: 4,
                            html: Style.label('年龄'),
                        },
                        {
                            span: 4,
                            html: data.age,
                        },
                    ],
                },
            ];
        },
    };
    Map[Tag.Dy] = {
        data(vm) {
            const { fromTabId, forGaoqu } = vm;
            let todoList = [
                {
                    desc: '更新',
                    record: '',
                },
                {
                    desc: '入库',
                },
            ];
            if (fromTabId && forGaoqu == For.回填各平台基础数据) {
                todoList.push({
                    desc: '提取',
                });
            }
            return todoList;
        },
        parser() {
            let {
                name,
                kind,
                photo,
                fanCount,
                introduce,
                greatCount,
                followCount,
            } = dyHandler.dom2Data();
            let {
                ip,
                sex,
                age,
                region,
                mediaId,
                customTags,
            } = dyHandler.dynamicDom2Data();
            let site = window.location.origin + window.location.pathname;
            const match = site.match(/https:\/\/www.douyin.com\/user\/(\S+)/);
            let uid = match[1];
            if (kind) {
                customTags = [...customTags, ...kind.split('、')];
            }
            followCount = thisParseInt(followCount);
            fanCount = thisParseInt(fanCount);
            greatCount = thisParseInt(greatCount);
            age = age == '' ? '' : thisParseInt(age);
            let data = {
                ip,
                age,
                sex,
                uid,
                name,
                site,
                photo,
                region,
                mediaId,
                version,
                fanCount,
                introduce,
                greatCount,
                customTags,
                followCount,
                origin: '抖音',
                platform: '抖音',
            };
            return Promise.resolve(data);
        },
        view(data) {
            return [
                CommonView.basic(data),
                {
                    align: 'middle',
                    gutter: 0,
                    subList: [
                        {
                            span: 4,
                            html: Style.label('标签'),
                        },
                        {
                            span: 20,
                            html: data.customTags.join(','),
                        },
                        {
                            span: 4,
                            html: Style.label('介绍'),
                        },
                        {
                            span: 20,
                            html: data.introduce,
                        },
                        {
                            span: 4,
                            html: Style.label('性别'),
                        },
                        {
                            span: 4,
                            html: data.sex,
                        },
                        {
                            span: 4,
                            html: Style.label('年龄'),
                        },
                        {
                            span: 4,
                            html: data.age,
                        },
                    ],
                },
            ];
        },
        ending({ tag, fromTabId, forGaoqu, fromId }, data) {
            if (fromTabId && fromTabId > 0 && forGaoqu == For.回填各平台基础数据) {
                let { mediaId } = data;
                window.navigator.clipboard.writeText(mediaId);
                content2Background(
                    patchFrom(
                        {
                            title: '抖音号：' + mediaId + '已复制',
                            message: '请返回op页进行粘贴',
                            msg: Msg.系统通知,
                        },
                        tag
                    )
                );
                return content2Background(
                    patchFrom(
                        {
                            data,
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
    };
    Map[Tag.Pgy] = {
        data() {
            return [
                {
                    desc: '更新',
                    record: '',
                },
                {
                    desc: '入库',
                },
            ];
        },
        async parser(vm) {
            let { uid, site, platformSite } = pgyHandler.locationData();
            console.log("vm", vm);
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
                subContentTags } = await pgyHandler.basePortData(vm, uid)
            let { dataOverview, capability, fansMap } = await pgyHandler.portData(vm, uid);
            pgyHandler.addCpeAndCpm(capability, price)
            console.log("dataOverview", dataOverview);
            const data = {
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
                version,
                fanCount,
                greatCount,
                contentTags,
                featureTags,
                dataOverview,
                capability,
                platformSite,
                personalTags,
                subContentTags,
                origin: '蒲公英',
                platform: '小红书',
                fansMap
            }
            console.log("dataOverview", JSON.stringify(data));
            return data;
        },
        view(data) {
            const priceSubList = objectToList(data.price);
            return [
                CommonView.basic(data),
                {
                    align: 'middle',
                    gutter: 0,
                    subList: [
                        {
                            span: 4,
                            html: Style.label('介绍'),
                        },
                        {
                            span: 20,
                            html: data.introduce,
                        },
                        {
                            span: 4,
                            html: Style.label('性别'),
                        },
                        {
                            span: 4,
                            html: data.sex,
                        },
                        {
                            span: 4,
                            html: Style.label('蒲公英等级'),
                        },
                        {
                            span: 4,
                            html: data.pgyLevel,
                        },
                        ...priceSubList,
                        {
                            span: 24,
                            html: Style.title('标签'),
                        },
                        {
                            span: 4,
                            html: Style.label('一级内容类目'),
                        },
                        {
                            span: 20,
                            html: data.contentTags
                                ? data.contentTags.join(',')
                                : '',
                        },
                        {
                            span: 4,
                            html: Style.label('二级内容类目'),
                        },
                        {
                            span: 20,
                            html: data.subContentTags
                                ? data.subContentTags.join(',')
                                : '',
                        },
                        {
                            span: 4,
                            html: Style.label('内容特征'),
                        },
                        {
                            span: 20,
                            html: data.featureTags
                                ? data.featureTags.join(',')
                                : '',
                        },
                        {
                            span: 4,
                            html: Style.label('特色人设'),
                        },
                        {
                            span: 20,
                            html: data.personalTags
                                ? data.personalTags.join(',')
                                : '',
                        },
                    ],
                },
            ];
        },
        async ending(vm, data) {
            const { tag, gaoqId, fromId, fromTabId, forGaoqu } = vm
            if ((fromTabId && fromTabId > 0 && forGaoqu == For.获取蒲公英等级) && gaoqId) {
                await collectNotesAndFans(data, vm)
                return content2Background(
                    patchFrom(
                        {
                            id: gaoqId,
                            res: data ? data.level : '博主不存在或网络错误',
                            toTabId: fromTabId,
                            toId: fromId,
                            data,
                            msg:
                                Msg.content通过background转发其他content发送给page,
                            aim: Aim.通知已补丁,
                            closeTab: true,
                        },
                        tag
                    )
                );
            } else if ((fromTabId && fromTabId > 0 && forGaoqu == For.回填各平台基础数据) && fromId) {
                let { mediaId } = data;
                content2Background(
                    patchFrom(
                        {
                            title: '小红书号：' + mediaId + '已复制',
                            message: '请返回op页进行粘贴',
                            msg: Msg.系统通知,
                        },
                        tag
                    )
                );
                return content2Background(
                    patchFrom(
                        {
                            data,
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

        },
        stringifyMap(form) {
            const { price, dataOverview, capability } = form
            form.price = JSON.stringify(price);
            form.dataOverview = JSON.stringify(dataOverview);
            form.capability = JSON.stringify(capability);
        }
    };
    Map[Tag.Xt] = {
        data() {
            return [
                {
                    desc: '更新',
                    record: '',
                },
                {
                    desc: '入库',
                },
            ];
        },
        getZhiBoInfoMap(selector, option) {
            let userInfo = document.querySelector(selector);
            const obj = {};
            if (userInfo) {
                const content = userInfo.innerText;
                let arr = content.split('\n');
                if (Flag.zhibo_dataOverview == option.flag) {
                    for (let i = 0, j = arr.length; i < j; i += 2) {
                        const key = arr[i + 1];
                        if (arr[i].indexOf('小时') !== -1) {
                            let num = arr[i].match(/(\S+)小时/)[1];
                            obj[key] = parseFloat(num) * 60;
                        } else if (arr[i].indexOf('分钟') !== -1) {
                            let num = arr[i].match(/(\S+)分钟/)[1];
                            obj[key] = parseFloat(num);
                        } else if (arr[i].indexOf('%') !== -1) {
                            let num = arr[i].match(/(\S+)%/)[1];
                            obj[key] = parseFloat(num);
                        } else if (arr[i] == '-') {
                            obj[key] = '';
                        } else {
                            obj[key] = thisParseInt(arr[i]);
                        }
                    }
                }

                if (Flag.zhibo_bringGoods == option.flag) {
                    for (let i = 2, j = arr.length; i < j; i += 2) {
                        obj[arr[i + 1]] = arr[i];
                    }
                }
            }
            return obj;
        },
        getZhiBoInfoList(selector, option) {
            let userInfo = document.querySelector(selector);
            let arr = [];
            if (Flag.zhibo_sex == option.flag) {
                const flag = userInfo
                    .getAttribute('class')
                    .indexOf('svg-icon-male-2');
                return flag == -1 ? '女' : '男';
            }
            if (userInfo != null) {
                const content = userInfo.innerText;
                if (Flag.zhibo_fanCount == option.flag) {
                    const str = content.match(/粉丝数(\S+)/)[1];
                    return str;
                }
                arr = content.split('\n');
                if (Flag.zhibo_featureTags == option.flag && arr[0] == '暂无标签') {
                    return arr;
                }
            }
            return arr;
        },
        //     collectOtherData() {
        //         ...
        //     mediaId + platformId
        //         ...
        //     listner('resourceId', function () { })
        // },
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
        async collectMainData(vm, locationData) {
            const { bus } = vm
            let mediaId = '';
            let uid = '';
            let shortId = '';
            let secUid = '';
            let mcn = '';
            let fanCount = '';
            let sex = '';
            let photo = '';
            let price = {};
            let data = {};
            let customTags = [];
            const { clean, xtId, platformSite } = locationData
            const page = document.querySelector(
                '.author-base-info .other-author-pages'
            );
            if (page == null) {
                vm.resourceXt = {}
                const {
                    mcn,
                    // uid,
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
                } = await xtHandler.baseBusData(vm, xtId);
                const match = site.match(/https:\/\/www.douyin.com\/user\/(\S+)/);
                let uid = match[1];

                const busData = await xtHandler.busData(bus);

                const busGetContact = await xtHandler.busGetContact(bus);

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
                    version,
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
                } = xtHandler.dom2Data();
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
                    // authorBusinessCapabilitiesNoLimitMap
                } = xtHandler.dataHandle(
                    price_info,
                    tags_relation,
                    industry_tags,
                    monthTouchCount,
                    monthConnectCount,
                    busData,
                    hot_list_ranks,
                    // authorContentMap
                );
                // 处理星图指数
                // const xtIndexMap = xtHandler.xtIndexHandle(xtFieldIndexList, promisesOrderList, vm.fieldIdMap)
                data.rank = rank;
                data.price = price;
                data.fieldTags = fieldTags;
                data.contentTags = contentTags;
                data.patch = busGetContact;
                data.dataOverview = { ...dataOverview, ...busGetContact };
                data.subContentTags = subContentTags;
                data.subFieldTags = subFieldTags;
                // 将capability 数据直接传给 collectOtherData 方法
                // collectOtherData 方法 每收集一次数据都会同步到 vm.resourceXt
                // collectOtherData 方法 异步时 库内会在extension_import或者resouce表里面存在该资源，collectOtherData 方法按批次量更新
                const publishMediaIdAnduid = {
                    url: "publishMediaIdAnduid",
                    data: {
                        mediaId,
                        bloggerId: uid,
                        ...cepAndCpmMap,
                        ...authorContent
                    }
                }
                bus.publish(JSON.stringify(publishMediaIdAnduid))
                console.log("done publish", publishMediaIdAnduid);
                // const resourceXt = vm.resourceXt || {}
                // data.capability = { ...cepAndCpmMap, ...authorContent, ...resourceXt };
                // const resourceXt = vm.resourceXt || {}
                data.capability = vm.resourceXt;

            } else {
                const pageInnerText = page.innerText.trim();
                if (pageInnerText == '抖音直播主页') {
                    console.log('this is 抖音直播主页');
                    const userInfo = document.querySelector(
                        '.author-base-info .card-panel-body'
                    );
                    const content = userInfo.innerText;
                    const arr = content.split('\n');
                    const length = arr.length;
                    let [, name, , region] = arr;
                    let fieldTags = [];
                    if (arr[length - 4].trim() == '擅长行业') {
                        fieldTags = arr[length - 3].split('、');
                    }
                    let featureTags = this.getZhiBoInfoList(
                        '.author-base-info .author-content-style-tags',
                        { flag: '星图直播-个人标签' }
                    );
                    fanCount = this.getZhiBoInfoList('.author-base-info .datas', {
                        flag: '星图直播-粉丝',
                    });
                    let bringGoodsCategory = this.getZhiBoInfoMap(
                        '.author-base-info .main-category-wrap',
                        { flag: '星图直播-带货数据' }
                    );
                    let dataOverview = this.getZhiBoInfoMap(
                        '.middle-margin-top .card-panel-body .key-data',
                        { flag: '星图直播-带货能力' }
                    );
                    sex = this.getZhiBoInfoList(
                        '.author-base-info .id-gender-location .svg-icon',
                        { flag: '星图直播-性别' }
                    );
                    let img = document.querySelector(
                        '.author-base-info .user-avatar-image'
                    );
                    photo = img.getAttribute('src');
                    fanCount = thisParseInt(fanCount);
                    customTags = [...fieldTags, ...featureTags];
                    data = {
                        site,
                        platformSite,
                        name,
                        mediaId,
                        mcn,
                        region,
                        fanCount,
                        customTags,
                        bringGoodsCategory,
                        dataOverview,
                        photo,
                        origin: '星图',
                        platform: '抖音',
                        sex,
                        version,
                        shortId,
                        secUid,
                        uid,
                        clean,
                        price,
                    };
                }
            }
            return data;
        },
        async parser(vm) {
            const me = Map[Tag.Xt]
            const locationData = xtHandler.locationData();
            // if (vm.forGaoqu) {
            //     const data = await me.collectMainData(vm, locationData);
            //     await me.collectOtherData(vm, locationData.xtId);
            //     return data;
            // } else {
            //     me.collectOtherData(vm, locationData.xtId);
            return me.collectMainData(vm, locationData);
            // }

        },
        view(data) {
            const priceSubList = objectToList(data.price);
            const dataOverviewSubList = objectToList(data.dataOverview);
            const capabilityList = objectToList(data.capability);
            const rankList = objectToList(data.rank);
            return [
                CommonView.basic(data),
                {
                    align: 'middle',
                    gutter: 0,
                    subList: [
                        {
                            span: 4,
                            html: Style.label('介绍'),
                        },
                        {
                            span: 20,
                            html: data.introduce
                                ? Style.site(data.introduce)
                                : '',
                        },
                        {
                            span: 4,
                            html: Style.label('能力'),
                        },
                        {
                            span: 20,
                            html: data.capability
                                ? Object.values(data.capability).join(',')
                                : '',
                        },
                        {
                            span: 4,
                            html: Style.label('等级'),
                        },
                        {
                            span: 8,
                            html: data.level,
                        },
                        {
                            span: 4,
                            html: Style.label('一级内容标签'),
                        },
                        {
                            span: 8,
                            html: data.contentTags.join(','),
                        },
                        {
                            span: 4,
                            html: Style.label('二级内容标签'),
                        },
                        {
                            span: 8,
                            html: data.subContentTags.join(','),
                        },
                        {
                            span: 4,
                            html: Style.label('一级行业标签'),
                        },
                        {
                            span: 8,
                            html: data.fieldTags.join(','),
                        },
                        {
                            span: 4,
                            html: Style.label('二级行业标签'),
                        },
                        {
                            span: 8,
                            html: data.subFieldTags.join(','),
                        },
                        {
                            span: 4,
                            html: Style.label('性别'),
                        },
                        {
                            span: 8,
                            html: data.sex,
                        },
                        {
                            span: 24,
                            html: Style.title('数据'),
                        },
                        ...capabilityList,
                        ...dataOverviewSubList,
                        ...rankList,
                        {
                            span: 24,
                            html: Style.title('价格'),
                        },
                        ...priceSubList,
                    ],
                },
            ];
        },
        ending({ tag, gaoqId, fromTabId, forGaoqu, fromId }, data) {
            if (fromTabId && gaoqId && fromTabId > 0 && forGaoqu == For.爬取星图等级) {
                return content2Background(
                    patchFrom(
                        {
                            id: gaoqId,
                            res: data.mediaId && data.mediaId.length < 2 ? "博主不存在或网络错误" : data.level,
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
            } else if ((fromTabId && fromTabId > 0 && forGaoqu == For.回填各平台基础数据) && fromId) {
                let { mediaId } = data;
                content2Background(
                    patchFrom(
                        {
                            title: '抖音号：' + mediaId + '已复制',
                            message: '请返回op页进行粘贴',
                            msg: Msg.系统通知,
                        },
                        tag
                    )
                );
                return content2Background(
                    patchFrom(
                        {
                            data,
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
        },
        insertDom(vm) {
            console.log("vm", vm);
            let union = '';
            const insertDom = document.createElement('div');
            let className = "insert-op-info-dom "
            let teleportList = []
            const element = {
                label: "建联状态",
                value: ""
            }
            if (vm.table) {
                if (vm.table == tableMap.插件入库) {
                    element.value = '待建联'
                    teleportList.push(element)
                } else {
                    element.value = '已建联'
                    let { directWise, publication, rebate, qyGgCode, qyWxCode, qyBdCode } = vm.resourceList[0]
                    // teleportList.push(element);
                    const todoList = [
                        element,
                        {
                            label: "直联达人:",
                            value: union || directWise == undefined ? "--" : directWise,
                            type: 'text'
                        },
                        {
                            label: "刊例状态:",
                            value: publication || "--",
                            type: 'text'
                        },
                        {
                            label: "返点比例:",
                            value: (rebate || "--") + '%',
                            type: 'text'
                        },
                    ]
                    if (qyWxCode) {
                        todoList.push({
                            label: "电商:",
                            src: photo(qyWxCode),
                            type: 'img'
                        })
                    }
                    if (qyGgCode) {
                        todoList.push({
                            label: "广告:",
                            src: photo(qyGgCode),
                            type: 'img'
                        })
                    }
                    if (qyBdCode) {
                        todoList.push({
                            label: "本地:",
                            src: photo(qyBdCode),
                            type: 'img'
                        })
                    }
                    teleportList = todoList
                }
            } else {
                element.value = '未建联'
                teleportList.push(element)
            }

            teleportList.push({
                type: "button",
                value: "待开发",
                cb: () => {
                    console.log("待开发1");
                },
                style: "grid-column: 1 / 3"
            })
            teleportList.push({
                type: "button",
                value: "待开发",
                cb: () => {
                    console.log("待开发2");
                },
                style: "grid-column: 3 / 5;"
            })
            insertDom.className = className;
            document.querySelector(".top-info .link-index").before(insertDom);
            vm.teleportTo = '.' + className
            vm.teleportList = teleportList
            console.log("vm", vm);
            // insertDom.style = `margin: 16px auto;
            // width:260px;
            // display:grid;
            // grid-auto-rows: 1fr 1fr 1fr 1fr;
            // grid-auto-rows: auto;
            // grid-auto-flow: row;
            // align-items: center;
            // color: #999;
            // font-weight: 400;
            // font-size: 12px;
            // line-height: 18px;
            // background-color: #ffeef3;
            // padding: 8px;
            // border-radius: 8px;
            // gap: 5px 5px;`
            // if (vm.table) {
            //     if (vm.table == tableMap.插件入库) {
            //         union = '待建联'
            //         resource = {}
            //     } else {
            //         union = '已建联'
            //         resource = vm.resourceList[0]
            //     }
            // } else {
            //     union = '未建联'
            //     resource = {}
            // }
            // const { directWise, publication, rebate, qyGgCode, qyWxCode, qyBdCode } = resource;
            // if (qyWxCode) { }
            // let innerHTML = `
            //     <div>建联状态:</div>
            //     <div style="color: #333;">${union || "--"}</div>
            //     <div>直联达人:</div>
            //     <div style="color: #333;">${directWise == undefined ? "--" : (directWise ? '是' : '否')}</div>
            //     <div>刊例状态:</div>
            //     <div style="color: #333;">${publication || "--"}</div>
            //     <div>返点比例:</div>
            //     <div style="color: #333;">${rebate || "--"}%</div>

            // `
            // if (qyWxCode) {
            //     innerHTML += `<div>电商二维码:</div><img style="grid-column: 2 / 5;" src="${photo(qyWxCode)}" />`
            // }
            // if (qyGgCode) {
            //     innerHTML += `<div>广告二维码:</div><img style="grid-column: 2 / 5;" src="${photo(qyGgCode)}" />`
            // }
            // if (qyBdCode) {
            //     innerHTML += `<div>本地二维码:</div><img style="grid-column: 2 / 5;" src="${photo(qyBdCode)}" />`
            // }
            // insertDom.innerHTML = innerHTML;
            // const button1 = document.createElement('button');
            // const button2 = document.createElement('button');
            // button1.style = `grid-column: 1 / 3;
            // width: 120px;
            // background-color: var(--xt-primary-color);
            // border-color: var(--xt-primary-color);
            // color: #fff;
            // height: 30px;
            // border-radius: 10px;
            // font-size: 13px;`
            // button2.style = `grid-column: 3 / 5;
            // width: 120px;
            // background-color: var(--xt-primary-color);
            // border-color: var(--xt-primary-color);
            // color: #fff;
            // height: 30px;
            // border-radius: 10px;
            // font-size: 13px;`
            // button1.textContent = "待开发"
            // button2.textContent = "待开发"
            // insertDom.appendChild(button1)
            // insertDom.appendChild(button2)



        },
        stringifyMap(form) {
            const { rank, price, capability, dataOverview } = form
            form.rank = JSON.stringify(rank);
            form.price = JSON.stringify(price);
            form.capability = JSON.stringify(capability);
            form.dataOverview = JSON.stringify(dataOverview);
        }
    };
    Map[Tag.JinritemaiCooperationProduct] = {
        data() {
            return [
                {
                    desc: '更新',
                    record: '',
                },
                {
                    desc: '入库',
                },
            ];
        },
        async parser(vm) {
            let data = await vm.bus.subscribe(
                /get_captain_goods_detail/,
                function (rs) {
                    let body = vm.bus.parseBody(rs);
                    return body.data;
                })
            console.error("get_captain_goods_detail", data);
            return data;
        }
    };
    Map[Tag.JinritemaiResource] = {
        data() {
            return [
                {
                    desc: '更新',
                    record: '',
                },
                {
                    desc: '入库',
                },
            ];
        },
        async validate(vm) {
            let install = false;
            if (vm.$api.ifInstallCertPem) {
                try {
                    const rs = await vm.$api.ifInstallCertPem();
                    install = rs.install;
                } catch (e) {
                    console.error("ifInstallCertPem", e);
                    const { $api, tag } = vm
                    $api.baojing({ tag, message: JSON.stringify(e), site: window.location.href })
                }
            }
            if (install) {
                return true;
            } else {
                vm.$Notice.error({
                    title: '请更新插件和安装证书',
                    desc: '请在OP 下载中心 中下载插件和证书，并按照教程安装',
                });
            }
            return false;
        },
        async parser(vm) {
            let uid = ""
            const { platformSite, byCode } = byHandler.locationData(vm);
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
            } = await byHandler.baseBusData(vm);
            if (site) {
                const match = site.match(/https:\/\/www.douyin.com\/user\/(\S+)/);
                uid = match[1];
            }

            const capability = await byHandler.cargoAnalysisBusData(vm);
            const authorFanData_dataOver = await byHandler.authorFanData(vm, capability)
            const capabilityPatch = await byHandler.capabilityPatchData(vm)
            const { patch, capabilityPatchSecond } = await byHandler.domData(vm, mediaId)
            let data = {
                origin: '百应',
                platform: '抖音',
                name,
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
                version,
                capability: { ...capabilityPatch, ...capability, ...capabilityPatchSecond },
                sex,
                platformSite,
                level,
                uid
            };
            console.log("json", data);
            return data
        },
        view(data) {
            const mainCategoryList = objectToList(data.mainCategory);
            const demandList = objectToList(data.demand);
            const saleAnalysisList = byHandler.jsonToArr(data.saleAnalysis);
            return [
                CommonView.basic(data),
                {
                    align: 'middle',
                    gutter: 0,
                    subList: [
                        {
                            span: 4,
                            html: Style.label('介绍'),
                        },
                        {
                            span: 20,
                            html: data.introduce,
                        },
                        {
                            span: 4,
                            html: Style.label('性别'),
                        },
                        {
                            span: 8,
                            html: data.sex,
                        },
                        {
                            span: 4,
                            html: Style.label('粉丝'),
                        },
                        {
                            span: 8,
                            html: data.fanCount,
                        },
                        {
                            span: 4,
                            html: Style.label('等级'),
                        },
                        {
                            span: 8,
                            html: data.level,
                        },
                        {
                            span: 4,
                            html: Style.label('机构'),
                        },
                        {
                            span: 8,
                            html: data.mcn,
                        },
                        { span: 24, html: '' },
                        {
                            span: 4,
                            html: Style.label('内容标签'),
                        },
                        {
                            span: 20,
                            html: data.contentTags.join(',') || '',
                        },
                        ...demandList,
                        ...mainCategoryList,
                        { span: 24, html: Style.title('带货分析') },
                        ...saleAnalysisList,
                    ],
                },
            ];
        },
        begining(vm, { brand }) {
            ;
            const { forGaoqu, gaoqId } = vm;
            if (forGaoqu == For.绑定百应资源) {
                vm.data.push({
                    desc: '绑定',
                    record: gaoqId,
                    forGaoqu
                })
            }

        },
        ending({ tag, gaoqId, fromTabId, forGaoqu, fromId }, data) {
            if (fromTabId && gaoqId && fromTabId > 0 && forGaoqu == For.爬取百应等级) {
                return content2Background(
                    patchFrom(
                        {
                            id: gaoqId,
                            res: data.level == null ? '博主不存在或网络错误' : 'LV0',
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
            } else if ((fromTabId && fromTabId > 0 && forGaoqu == For.回填各平台基础数据) && fromId) {
                let { mediaId } = data;
                content2Background(
                    patchFrom(
                        {
                            title: '抖音号：' + mediaId + '已复制',
                            message: '请返回op页进行粘贴',
                            msg: Msg.系统通知,
                        },
                        tag
                    )
                );
                return content2Background(
                    patchFrom(
                        {
                            data,
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
        },
        stringifyMap(form) {
            const { demand, mainCategory, capability, dataOverview, saleAnalysis } = form
            form.capability = JSON.stringify(capability);
            form.saleAnalysis = JSON.stringify(saleAnalysis);
            form.demand = JSON.stringify(demand);
            form.mainCategory = JSON.stringify(mainCategory);
            form.dataOverview = JSON.stringify(dataOverview);
        }
    };
    Map[Tag.XtSearch] = {
        persistenceSubscribe(vm) {
            vm.bus.watch(
                /\/api\/gsearch\/search_for_author_square/,
                (rs) => {
                    let body = vm.bus.parseBody(rs);
                    return body;
                },
                (res) => {
                    xtSearchHandler.listExtension(res, vm)
                }
            )
        }
    }
    const hack = {
        version,
        judgeTag(vm) {
            let href = window.location.href;
            let match = href.match(/[&?]gradMode=(\d*)/);
            console.log("match", match);
            vm.gradMode = match ? +match[1] : GradMode.抓取全部数据;
            console.log("vm.gradMode", vm.gradMode);
            match = href.match(/[&?]fromTabId=(\d*)/);
            vm.fromTabId = match ? +match[1] : 0;
            match = href.match(/[?&]gaoqId=(\d*)/);
            vm.gaoqId = match ? +match[1] : 0;
            match = href.match(/[?&]forGaoqu=(\d*)/);
            vm.forGaoqu = match ? +match[1] : 0;
            match = href.match(/[?&]forDebug=(\d*)/);
            vm.forDebug = match ? +match[1] : 0;
            match = href.match(/[?&]fromId=([a-z]*)/);
            vm.fromId = match ? match[1] : 0;
            let tag = 0;
            if (/https:\/\/www\.douyin\.com\/user\//.test(href)) {
                tag = Tag.Dy;
            } else if (
                /https:\/\/www\.xiaohongshu\.com\/user\/profile/.test(href)
            ) {
                tag = Tag.Xhs;
            } else if (
                /https:\/\/pgy\.xiaohongshu\.com\/solar\/pre-trade\/blogger-detail\//.test(
                    href
                ) ||
                /https:\/\/pgy\.xiaohongshu\.com\/solar\//.test(href)
            ) {
                tag = Tag.Pgy;
            } else if (/https:\/\/www\.xingtu\.cn\/ad\/creator\/author\/douyin/.test(href)) {
                tag = Tag.Xt;
            } else if (
                /https:\/\/buyin\.jinritemai\.com\/dashboard\/servicehall/.test(
                    href
                )
            ) {
                tag = Tag.JinritemaiResource;
            } else if (/https:\/\/haohuo\.jinritemai\.com\//.test(href)) {
                tag = Tag.JinritemaiGoods;

            } else if (/https:\/\/buyin\.jinritemai\.com\/dashboard\/goodsCooperation/.test(href)) {
                tag = Tag.JinritemaiCooperationProduct;
            } else if (/https:\/\/www\.xingtu\.cn\/ad\/creator\/market/.test(href)) {
                tag = Tag.XtSearch;
            }
            console.log('judgeTag', tag);
            return tag;
        },
        columns(vm) {
            return [
                {
                    type: 'index',
                    align: 'center',
                    width: 30,
                },
                {
                    title: '功能',
                    width: 60,
                    align: 'center',
                    key: 'desc',
                },
                {
                    title: '操作',
                    align: 'center',
                    render(h, { row }) {
                        if (
                            ['更新', '提取'].includes(row.desc)
                        ) {
                            if (row.record) {
                                return h(
                                    'span',
                                    { class: 'active' },
                                    row.record
                                );
                            } else {
                                return h(
                                    'span',
                                    { class: 'active' },
                                    '静默开启'
                                );
                            }
                        } else if (['入库'].includes(row.desc)) {
                            return h(vm.resolveComponent('Button'), {
                                icon: 'md-locate',
                                size: 'small',
                                onClick() {
                                    hack.triggerCollect(vm);
                                },
                            });
                        } else if (['绑定'].includes(row.desc) && [For.绑定小红书品牌].includes(row.forGaoqu)) {
                            return h(vm.resolveComponent('Button'), {
                                icon: 'md-swap',
                                size: 'small',
                                onClick() {
                                    hack.prepareXhsBindBrand(vm);
                                },
                            });
                        } else if (['绑定'].includes(row.desc) && [For.绑定百应资源].includes(row.forGaoqu)) {
                            return h(vm.resolveComponent('Button'), {
                                icon: 'md-swap',
                                size: 'small',
                                onClick() {
                                    hack.prepareBindingBy(vm)
                                },
                            });
                        }
                    },
                },
            ];
        },
        data(vm) {
            const { data } = Map[vm.tag];
            return data(vm);
        },
        keySubmit(vm, key) {
            if (key === '绑定品牌') {
                hack.doBindBrand(vm)
            }
            console.log("KEY", key);
            if (key == '绑定百应资源') {
                hack.doBindResource(vm)
            }
        },
        async submit(vm) {
            if (!vm.throttle) {
                if (!(vm.limitIntoOp === false)) {
                    if (vm.signInUser) {
                        let form = vm._form;
                        console.log("import-form", form);
                        let pass = true;
                        const { fanCount, platform, brand } = form;
                        if (['小红书', '蒲公英'].includes(platform)) {
                            if ((fanCount < 5000) && !brand && "63fc2548000000002901430b" == form.bloggerId) {
                                pass = false
                            }
                        }
                        if (pass) {
                            form.opId = vm.signInUser.id;
                            vm.throttle = true
                            let { code, data, msg } = await vm.$api.extension.import(
                                form,
                                vm.signInUser.token
                            );
                            vm.throttle = false
                            if (code === 0) {
                                let { content, type } = data;
                                if (type === 'success') {
                                    vm.$Message.success({ content });
                                    vm.data[0].record = content
                                    // new Date().format(
                                    //     'yyyy-MM-dd hh:mm:ss'
                                    // );
                                    collectNotesAndFans(form, vm)
                                } else if (type == 'warning') {
                                    vm.$Notice.warning({
                                        title: '请注意',
                                        desc: content,
                                    });
                                } else {
                                    vm.$Notice.error({
                                        title: '请注意',
                                        desc: content,
                                        duration: 6,
                                    });
                                }
                                vm.showCollect = false;
                            } else {
                                vm.$Notice.error({
                                    title: '遇到问题-_-!',
                                    desc: msg,
                                });
                            }
                        } else {
                            vm.$Notice.warning({
                                title: '粉丝量低',
                                desc: '小红书、蒲公英粉丝量不低于5000才可入库',
                            });
                        }

                    } else {
                        vm.showBind = true;
                    }
                } else {
                    vm.$Notice.error({
                        title: '获取code失败',
                    });
                }
            } else {
                vm.$Notice.warning({
                    title: '请注意',
                    desc: '入库请求已发送，等待响应，请勿多次点击',
                });
            }

        },
        async triggerCollect(vm) {
            if (vm.signInUser) {
                vm.triggerCollectflag = true
                let ok = await hack.collect(vm, 'trigger');
                console.log('ok', ok)
                vm.showCollect = ok;
            } else {
                vm.showBind = true;
            }
        },
        async collect(vm, from) {
            const { separateData, validate, parser, view, ending, begining, submitServer, stringifyMap, insertDom } = Map[vm.tag];
            console.log("separateData", separateData);
            if (!validate || await validate(vm)) {
                // preData && await preData(vm);
                if (from == 'auto') {
                    vm.from = "auto"
                    let pack = await doCollect(vm, parser);
                    console.log('pack', pack);
                    if (pack.ok) {
                        let { data } = pack;
                        data.autoOpId = vm.signInUser.id;
                        begining && begining(vm, data)
                        stringifyMap && stringifyMap(data);
                        if (submitServer) {
                            await submitServer(vm, data);
                        } else {
                            await autoServer(vm, data);
                        }
                        ending && await ending(vm, data);
                        insertDom && await insertDom(vm, data);
                    }
                } else {
                    delete vm.from
                    let pack = await doCollect(vm, parser);
                    console.log('doCollect', pack);
                    if (pack.ok) {
                        let data = pack.data;
                        vm.version = version;
                        vm.title = `${data.brand ? '品牌' : '资源'}基本信息(${version})`;
                        vm._form = data;
                        vm.viewList = view(data);
                        stringifyMap && stringifyMap(vm._form);
                    }
                }
                return true;
            }
            return false;
        }
    };
    // 收集标签
    Object.assign(hack, {
        detectTagData(data, key) {
            console.log(data[key]);
            let flag = false;
            for (let item of data[key]) {
                if (item.tags && (item.tags.length > 0)) {
                    flag = true
                    break;
                }
            }
            return flag
        },
        // 这里 pgyTagsSubmit 并不单单用于pgy页面的标签提取，因为修改函数名需要用户重新安装插件，故先将就此名
        async collectTags(bus, api, evil) {
            let href = window.location.href;
            if (/https:\/\/pgy\.xiaohongshu\.com\/solar\//.test(href)) {
                const data = await pgyTagHandler.busTagsData(api);
                const tag = pgyTagHandler.dataHandle(data);
                console.log('tag', tag);
                const detectContentTags = this.detectTagData(tag, 'contentTags')
                const detectFeatureTags = this.detectTagData(tag, 'featureTags')
                const detectPersonalTags = this.detectTagData(tag, 'personalTags')
                detectPersonalTags && detectFeatureTags && detectContentTags && await api.extension.pgyTag(tag);
            } else if (/https:\/\/www\.xingtu\.cn\/ad\//.test(href)) {
                const data = await xtTagHandler.busTagData(bus);
                const tag = xtTagHandler.dataHandle(data);
                const detectContentTags = this.detectTagData(tag, 'contentTags')
                const detectFieldTags = this.detectTagData(tag, 'fieldTags')
                console.log('tag', tag);
                detectFieldTags && detectContentTags && await api.extension.xtTag(tag);
            } else if (/https:\/\/buyin\.jinritemai\.com\/dashboard\/servicehall\/daren-square/.test(href)) {
                // https://buyin.jinritemai.com/dashboard/servicehall/daren-square
                const res = await byTagHandler.busTagsData(bus);
                const tag = byTagHandler.dataHandle(res);
                // const detectMainCategoryTags = this.detectTagData(tag, 'mainCategoryTags')
                await api.extension.byTag(tag);
            }
        }
    });
    // //搜索项目列表
    // Object.assign(hack,{

    // })

    // 搜索页与op联动
    Object.assign(hack, {
        updatePage(vm) {
            const { persistenceSubscribe } = Map[vm.tag]
            vm.showList = true;
            console.log("Map[vm.tag]", Map[vm.tag]);
            console.log("vm.tag", vm.tag);
            persistenceSubscribe && persistenceSubscribe(vm)
        },
        async searchProject(vm) {
            vm.loading = true;
            let res = {};
            if (vm.type == '项目') {
                res = await vm.$api.project.extensionSearch(vm.condition);
            } else {
                vm.$Message.warning({ content: "储备项目功能正在开发" });
            }
            const { code, data } = res;
            vm.loading = false;
            if (code == 0) {
                vm.projectList = data;
            }
        },
        //<Icon type="md-add-circle" />
        projectColumns(vm) {
            vm.columns = [
                {
                    type: "index",
                    align: "center",
                    width: 30,
                },
                {
                    title: "ID",
                    width: 60,
                    align: "center",
                    key: "id",
                },
                {
                    title: "项目",
                    key: "name",
                },
                {
                    title: "移除",
                    align: "center",
                    render(h, { row }) {
                        return h(vm.resolveComponent("Button"),
                            {
                                size: 'small',
                                shape: 'circle',
                                type: 'primary',
                                icon: "md-remove",
                                onClick() {
                                    for (let i = 0, j = vm.data.length; i < j; i++) {
                                        const item = vm.data[i];
                                        if (item.id == row.id) {
                                            vm.data.splice(i, 1);
                                            break;
                                        }
                                    }
                                }
                            });
                    },
                },
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
            ]
            vm.projectColumns = [
                {
                    type: "index",
                    align: "center",
                    width: 30,
                },
                {
                    title: "ID",
                    width: 60,
                    align: "center",
                    key: "id",
                },
                {
                    title: "项目",
                    width: 260,
                    key: "name",
                },
                // <Icon type="ios-add-circle" />
                {
                    title: "操作",
                    align: "center",
                    render(h, { row }) {
                        return h(vm.resolveComponent("Button"),
                            {
                                size: 'small',
                                shape: 'circle',
                                type: 'primary',
                                icon: "md-add",
                                onClick() {
                                    const { data, storeData } = vm;
                                    const target = vm.type == '项目' ? data : storeData;
                                    if (target.length == 0) {
                                        target.push(row)
                                        vm.$Message.success({ content: "添加成功 / " + row.id });
                                    } else {
                                        const find = target.find(item => item.id == row.id)
                                        if (!find) {
                                            target.push(row)
                                            vm.$Message.success({ content: "添加成功 / " + row.id });
                                        } else {
                                            vm.$Message.warning({ content: "无需重复添加" });
                                        }
                                    }
                                }
                            });
                    },
                },
            ]
        },
        async pushResource(vm) {
            const { teleportList, signInUser, $Message, tag, records } = vm;
            if (!(signInUser && signInUser.id)) {
                $Message.warning({ content: "请先登录微信" });
                return
            }
            const projectIdList = [];
            const resourceIdList = [];
            const extensionImportIdList = [];
            const resourceInfoList = [];
            for (let teleport of teleportList) {
                const { checked, resourceId, extensionImportId, name, id } = teleport;
                if (checked) {
                    if (resourceId) {
                        resourceIdList.push(resourceId);
                    } else if (extensionImportId) {
                        extensionImportIdList.push(extensionImportId)
                    } else {
                        resourceInfoList.push({
                            name,
                            xtId: id
                        })
                    }
                }
            }
            for (let record of records) {
                projectIdList.push(record.id)
            }
            const params = {
                resourceIdList,
                extensionImportIdList,
                resourceInfoList,
                opId: signInUser.id,
                origin: tag,
                projectIdList
            }
            const res = await vm.$api.projectResource.extensionBatchAdd(params);
            console.log("res", res);
        },
        async pushResourceStore(vm) {
            vm.$Message.warning({ content: "储备项目功能正在开发" });
        }
    })
    // todo delete
    hack.pgyTagsSubmit = hack.collectTags;
    // 收集小红书蓝v
    Object.assign(hack, {
        xhsBindBrand() {
            let match = window.location.search.match(/[&?]fromTabId=(\d*)/);
            const fromTabId = match ? +match[1] : 0;
            match = window.location.search.match(/[&?]forGaoqu=(\d*)/);
            const forGaoqu = match ? +match[1] : 0;
            match = window.location.search.match(/[&?]gaoqId=(\d*)/);
            const gaoqId = match ? +match[1] : 0;
            console.log(fromTabId, forGaoqu, gaoqId, For)
            function patchForGaoquFromTabId(dom) {
                if (dom && dom.tagName.toLowerCase() == 'a') {
                    dom.href = dom.href + `?forGaoqu=${forGaoqu}&fromTabId=${fromTabId}&gaoqId=${gaoqId}`
                }
            }
            console.log('For.绑定小红书品牌 == forGaoqu && fromTabId && gaoqId', For.绑定小红书品牌 == forGaoqu && fromTabId && gaoqId)
            if (For.绑定小红书品牌 == forGaoqu && fromTabId && gaoqId) {
                let todoList = document.querySelectorAll('.content-container .channel');
                for (let todo of todoList) {
                    if (todo.innerText.trim() === '用户') {
                        todo.click();
                        break;
                    }
                }
                setTimeout(function () {
                    let vList = document.querySelectorAll('.verify-icon')
                    console.log('vList', vList)
                    for (let v of vList) {
                        let parent = v.parentNode;
                        patchForGaoquFromTabId(parent)
                        while (parent && !parent.classList.contains('user-list-item')) {
                            parent = parent.parentNode;
                            patchForGaoquFromTabId(parent)
                        }
                        if (parent) {
                            parent.style = 'background-color: #19be6b';
                        }
                    }
                }, 2000)
            }
        },
        async prepareXhsBindBrand(vm) {
            if (vm.signInUser) {
                let ok = await hack.collect(vm, 'trigger');
                console.log('prepareXhsBindBrand', ok)
                vm.showBrand = ok;
                let { code, data } = await vm.$api.brand.fetch({
                    brandId: vm.gaoqId,
                    opId: vm.signInUser.id,
                    token: vm.signInUser.token
                });
                if (code == 0) {
                    vm.brand = data;
                }
            } else {
                vm.showBind = true;
            }
        },
        async doBindBrand(vm) {
            if (vm.signInUser) {
                let form = vm._form;
                form.opId = vm.signInUser.id;
                vm.bindingBrand = true
                let { code, data, msg } = await vm.$api.brand.bind({
                    brandId: vm.brand.id,
                    token: vm.signInUser.token,
                    extensionImport: form,
                }
                );
                if (code === 0) {
                    let { content, type } = data;
                    if (type === 'success') {
                        vm.$Message.success({ content });
                        vm.data[2].record = new Date().format(
                            'yyyy-MM-dd hh:mm:ss'
                        );
                    } else if (type == 'warning') {
                        vm.$Notice.warning({
                            title: '请注意',
                            desc: content,
                        });
                    } else {
                        vm.$Notice.error({
                            title: '请注意',
                            desc: content,
                            duration: 6,
                        });
                    }
                } else {
                    vm.$Notice.error({
                        title: '遇到问题-_-!',
                        desc: msg,
                    });
                }
                vm.bindingBrand = false;
            } else {
                vm.showBind = true;
            }
        }

    })
    //资源跳转百应广场
    Object.assign(hack, {
        async byBindResource(bus, api) {
            let match = window.location.search.match(/[&?]fromTabId=(\d*)/);
            const fromTabId = match ? +match[1] : 0;
            match = window.location.search.match(/[&?]forGaoqu=(\d*)/);
            const forGaoqu = match ? +match[1] : 0;
            match = window.location.search.match(/[&?]gaoqId=(\d*)/);
            const gaoqId = match ? +match[1] : 0;
            match = window.location.search.match(/[&?]fromId=([a-z]*)/);
            const fromId = match ? match[1] : 0;
            match = window.location.search.match(/\?keyword=([^&]*)/);
            const keyword = match ? decodeURIComponent(match[1]) : 0;
            if (keyword != 0 && forGaoqu == For.绑定百应资源) {
                let it = setInterval(() => {
                    let input = document.querySelector(".index__selectorAutoComplete___1Qfjc .auxo-input-group-wrapper .auxo-input")
                    console.log("input", input);
                    if (input) {
                        clearInterval(it)
                        input.value = keyword;
                        var eventInput = new InputEvent('input', {
                            'bubbles': true
                        })
                        input.dispatchEvent(eventInput)
                        let search = document.querySelector(".index__selectorAutoComplete___1Qfjc .auxo-input-group-addon .auxo-input-search-button")
                        search.click()

                        setTimeout(() => {
                            let parent = document.querySelector(".auxo-sp-infinit-container")
                            console.log("parent", parent);
                            parent.addEventListener("click", async function (event) {
                                // 处理点击事件的逻辑
                                console.log("event", event);
                                event.stopPropagation();
                                event.preventDefault();
                                let dom = event.target;
                                try {
                                    while (dom && !dom.classList.contains('daren-card')) {
                                        dom = dom.parentNode;
                                    }
                                    if (dom) {
                                        console.log('dom', dom)
                                        let uid = dom.getAttribute('data-item-uid')
                                        let aTag = document.createElement('a')
                                        aTag.href = "https://buyin.jinritemai.com/dashboard/servicehall/daren-profile?uid=" + uid + '&fromTabId=' + fromTabId + '&forGaoqu=' + forGaoqu + '&gaoqId=' + gaoqId
                                        aTag.target = "_blank"
                                        aTag.click()
                                    }
                                } catch (e) {
                                    console.error(e)
                                }
                            });
                        }, 2000)
                    }
                }, 500)
            }
            if (keyword && forGaoqu == For.查询百应存在资源) {
                let it = setInterval(async () => {
                    let input = document.querySelector(".index__selectorAutoComplete___1Qfjc .auxo-input-group-wrapper .auxo-input")
                    console.log("input", input);
                    if (input) {
                        clearInterval(it)
                        await wait(500);
                        console.log("keyword", keyword);
                        input.value = keyword
                        var eventInput = new InputEvent('input', {
                            'bubbles': true
                        })
                        input.dispatchEvent(eventInput)
                        // let search = await wait(5000, () => { return document.querySelector(".index__selectorAutoComplete___1Qfjc .auxo-input-group-addon .auxo-input-search-button") })
                        let search = document.querySelector(".index__selectorAutoComplete___1Qfjc .auxo-input-group-addon .auxo-input-search-button")
                        console.log("search", search);
                        let str = "api\\/authorStatData\\/seekAuthor\\?type=2&page=1&refresh=true&req_source=0&query=" + encodeURIComponent(keyword)
                        const regex = new RegExp(str)
                        console.log("search", regex);
                        const resultPromise = bus.subscribe(
                            regex,
                            function (rs) {
                                let body = bus.parseBody(rs);
                                console.log("body", body);
                                return body.data.hasOwnProperty('list') ? body.data : false;
                            }
                        );
                        search.click()
                        const result = await resultPromise;
                        console.log("result", result);
                        let { list } = result;
                        let data = {
                            jump: false,
                            byCode: ''
                        }
                        let hit = list ? list[0] : false;
                        if (hit && hit.author_base && hit.author_base.aweme_id == keyword) {
                            data.byCode = hit.author_base.uid
                        } else {
                            data.jump = true
                        }
                        // console.log('hit', data, hit, list)
                        content2Background(
                            patchFrom(
                                {
                                    title: '抖音号：' + keyword + '已复制',
                                    message: '请返回op页进行粘贴',
                                    msg: Msg.系统通知,
                                },

                            )
                        );
                        return content2Background(
                            patchFrom(
                                {
                                    data,
                                    toTabId: fromTabId,
                                    toId: fromId,
                                    msg:
                                        Msg.content通过background转发其他content发送给page,
                                    aim: Aim.通知已提取,
                                    closeTab: true,
                                },
                            )
                        );

                    }
                }, 500)
            }
        },
        async prepareBindingBy(vm) {
            if (vm.signInUser) {
                let ok = await hack.collect(vm, 'trigger');
                vm.showBindingBy = ok;
                let { code, data } = await vm.$api.resource.fetch({
                    resourceId: vm.gaoqId,
                    opId: vm.signInUser.id,
                    token: vm.signInUser.token
                });
                if (code == 0) {
                    vm.resource = data;
                }
            } else {
                vm.showBind = true;
            }
        },
        async doBindResource(vm) {
            if (vm.signInUser) {
                let form = vm._form;
                form.opId = vm.signInUser.id;
                vm.bindingBy = true
                let { code, data, msg } = await vm.$api.resource.bind({
                    resourceId: vm.gaoqId,
                    token: vm.signInUser.token,
                    extensionImport: form,
                }
                );
                if (code === 0) {
                    let { content, type } = data;
                    if (type === 'success') {
                        vm.$Message.success({ content });
                        vm.data[2].record = new Date().format(
                            'yyyy-MM-dd hh:mm:ss'
                        );
                    } else if (type == 'warning') {
                        vm.$Notice.warning({
                            title: '请注意',
                            desc: content,
                        });
                    } else {
                        vm.$Notice.error({
                            title: '请注意',
                            desc: content,
                            duration: 6,
                        });
                    }
                } else {
                    vm.$Notice.error({
                        title: '遇到问题-_-!',
                        desc: msg,
                    });
                }
                vm.bindingBy = false;
            } else {
                vm.showBind = true;
            }
        }
    })
    //跳转星图广场
    Object.assign(hack, {
        searchByMediaId(bus, api) {
            let match = window.location.search.match(/[&?]fromTabId=(\d*)/);
            const fromTabId = match ? +match[1] : 0;
            match = window.location.search.match(/[&?]forGaoqu=(\d*)/);
            const forGaoqu = match ? +match[1] : 0;
            match = window.location.search.match(/[&?]gaoqId=(\d*)/);
            const gaoqId = match ? +match[1] : 0;
            match = window.location.search.match(/[&?]fromId=([a-z]*)/);
            const fromId = match ? match[1] : 0;
            match = window.location.search.match(/\?keyword=([^&]*)/);
            const keyword = match ? decodeURIComponent(match[1]) : 0;
            match = window.location.search.match(/[&?]name=([^&]*)/)
            const name = match ? decodeURIComponent(match[1]) : 0;
            console.log("forGaoqu", forGaoqu);
            if (keyword && name && forGaoqu == For.查询星图存在资源) {
                let it = setInterval(async () => {
                    let input = document.querySelector(".market-search-top-bar .search .search-input .el-input__inner")
                    if (input) {
                        clearInterval(it)
                        input.value = keyword;
                        var eventInput = new InputEvent('input', {
                            bubbles: true,
                        })
                        input.dispatchEvent(eventInput)
                        let bar = document.querySelector(".market-search-top-bar")
                        bar.click()
                        let { authors } = await bus.subscribe(
                            /api\/gsearch\/search_for_author_square/,
                            (rs) => {
                                let body = bus.parseBody(rs);
                                return body;
                            }
                        );
                        let data = { jump: false, xtId: '' }
                        let hit = authors ? authors[0] : false;
                        if (hit && hit.attribute_datas.nick_name == name) {
                            data.xtId = hit.star_id
                        } else {
                            data.jump = true
                        }
                        console.log('hit', fromId, data, hit, name, authors)
                        content2Background(
                            patchFrom(
                                {
                                    title: '抖音号：' + name + '已复制',
                                    message: '请返回op页进行粘贴',
                                    msg: Msg.系统通知,
                                },

                            )
                        );
                        return content2Background(
                            patchFrom(
                                {
                                    data,
                                    toTabId: fromTabId,
                                    toId: fromId,
                                    msg:
                                        Msg.content通过background转发其他content发送给page,
                                    aim: Aim.通知已提取,
                                    closeTab: true,
                                },
                            )
                        );
                    }
                }, 500)

            }
        }
    })
    // 抖音笔记跳转用户首页
    hack.douyinNote2User = function () {
        let match = window.location.search.match(/[&?]fromTabId=(\d*)/);
        const fromTabId = match ? +match[1] : 0;
        match = window.location.search.match(/[&?]forGaoqu=(\d*)/);
        const forGaoqu = match ? +match[1] : 0;
        console.log(fromTabId, forGaoqu, For)
        if (For.回填各平台基础数据 == forGaoqu && fromTabId) {
            let todoList = document.querySelectorAll('div[data-e2e="user-info"] a');
            for (var i = 0; i < todoList.length; i++) {
                let todo = todoList[i];
                let { href } = todo;
                if (/www\.douyin\.com\/user\/.*/.test(href)) {
                    window.location.href = href + '?fromTabId=' + fromTabId + '&forGaoqu=' + forGaoqu;
                }
            }
        }
    }
    return hack;
}