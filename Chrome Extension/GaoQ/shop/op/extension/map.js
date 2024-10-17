export const ImportStateValue = {
    待完善: 0,
    待审核: 1,
    已通过: 2,
    未通过: 3,
};
export const ActiveStateList = [ImportStateValue.待完善, ImportStateValue.待审核, ImportStateValue.未通过]
export const Grab = {
    不抓额外数据: 0,
    抓取全部数据: 1,
    尽量抓取额外数据: 2
}
export const ImportState = [
    {
        label: "待完善",
        value: 0,
    },
    {
        label: "待审核",
        value: 1,
    },
    {
        label: "已通过",
        value: 2,
    },
    {
        label: "未通过",
        value: 3,
    },
];
export const PlatformLabel = {
    8: '小红书',
    9: '抖音',
    10: 'B站',
    11: '微博',
    13: '快手',
    16: '知乎',
};

export const PlatformValue = {
    '小红书': 8,
    '抖音': 9,
    'B站': 10,
    '微博': 11,
    '快手': 13,
    '知乎': 16,
};

export function platformLabel(key) {
    return PlatformLabel[key];
}
export const ImportStateAudit = [
    // {
    //     label: '待完善',
    //     value: 0
    // },
    {
        label: "待审核",
        value: 1,
    },
    {
        label: "已通过",
        value: 2,
    },
    {
        label: "未通过",
        value: 3,
    },
];

export function importState(val) {
    return ImportState[val].label;
}
export function importStateAudit(val) {
    return ImportStateAudit[val].label;
}
export const HandOverTypeValue = {
    指定人员: 1,
    MRT随机人员: 2,
    兼职MRT随机人员: 3,
    本人认领: 4,
};
export const HandOverTypeLabel = {
    1: "指定人员",
    2: "MRT随机人员",
    3: "兼职MRT随机人员",
    4: "本人认领",
};
export function handOverTypeLabel(val) {
    return HandOverTypeLabel[val];
}
export const ImportTemplate = [
    {
        label: "广告",
        value: 1,
    },
    {
        label: "电商",
        value: 2,
    },
    {
        label: "本地生活",
        value: 3,
    },
];
export const ImportTemplateValue = {
    广告: 1,
    电商: 2,
    本地生活: 3
}
export const ImportTemplateLabel = {};
ImportTemplate.forEach((item) => {
    ImportTemplateLabel[item.value] = item.label;
});
export function importTemplateLabel(val) {
    return ImportTemplateLabel[val];
}
export const McnList = ["告趣", "西优", "律动", "荔兹", "晴领", "星启"];

export const PriceMap = {
    蒲公英: {
        图文笔记一口价: "price2",
        视频笔记一口价: "price4",
    },
    星图: {
        "1-20s视频": "price2",
        "21-60s视频": "price4",
        "60s以上视频": "price6",
    },
};


export const Msg = {
    page通过content发送给background: "page通过content发送给background",
    page发送给content: 'page发送给content',
    background通过content发送给page: "background通过content发送给page",
    content通过background转发其他content发送给page:
        "content通过background转发其他content发送给page",
    content发送给background: 'content发送给background',
    content发送给page: 'content发送给page',
    background发送给content: 'background发送给content'
};
export const Aim = {
    环境检测: "环境检测",
    获取当前tabId: "获取当前tabId",
    通知已补丁: "通知已补丁",
    通知已提取: "通知已提取",
    设置插件认证码: '设置插件认证码',
    清除插件认证码: '清除插件认证码',
    关闭当前并跳转tab: '关闭当前并跳转tab',
    系统通知: '系统通知',
    清理缓存: '清理缓存',
    TTS: 'TTS',
    Cookie: 'Cookie',
    SetCookies: 'SetCookies',
    获取版本信息: '获取版本信息'
};

export function patchFrom(params, from) {
    params._from = "gaoqu page " + from;
    return params;
}

export const Tag = {
    Empty: '未识别的tag',
    Xhs: '小红书',
    XhsSearch: '小红书检索',
    XhsProduct: '小红书商品',
    Dy: '抖音',
    Pgy: '蒲公英',
    PgySearch: '蒲公英检索',
    PgyProduct: '蒲公英商品',
    Xt: '星图',
    ByResource: '精选联盟-直播',
    ByProductHaohuo: '百应商品(好货)',
    ByProduct: '百应商品',
    XtSearch: '星图搜索页',
    BySearch: '百应搜索页',
    OP: 'OP前端开发或测试环境',
    Popup: 'popup'
};
export const For = {
    回填基础数据: 1,
    获取蒲公英等级: 2,
    爬取星图等级: 3,
    爬取百应等级: 4,
    绑定小红书品牌: 5,
    绑定百应资源: 91,
    绑定星图资源: 92,
    查询百应存在资源: 911,
    查询星图存在资源: 921,
    检测是否登录: 922,
    验证简介: 923,
    爬取百应店铺ID: 717
};

export function getForByOrigin(origin) {
    switch (origin) {
        case '蒲公英': return For.获取蒲公英等级;
        case '星图': return For.爬取星图等级;
        case '百应': return For.爬取百应等级;
    }
    throw '未识别的origin' + origin
}

export const TagValue = {
    一级内容类目: 1,
    二级内容类目: 2,
    内容特征: 3,
    特色人设: 4,
    一级行业: 5,
    二级行业: 6,
    一级主推类目: 7,
    一级带货类目: 8,
    二级带货类目: 9,
};
export const TagLabel = {
    1: "一级内容类目",
    2: "二级内容类目",
    3: "内容特征",
    4: "特色人设",
    5: "一级行业",
    6: "二级行业",
    7: "一级主推类目",
    8: "一级带货类目",
    9: "二级带货类目",
};

export const by粉丝群体 = [
    {
        label: "小镇青年居多",
        value: "小镇青年",
    },
    {
        label: "小镇中老年居多",
        value: "小镇中老年",
    },
    {
        label: "genz居多",
        value: "genz",
    },
    {
        label: "精致妈妈居多",
        value: "精致妈妈",
    },
    {
        label: "新锐白领居多",
        value: "新锐白领",
    },
    {
        label: "资深中产居多",
        value: "资深中产",
    },
    {
        label: "都市银发居多",
        value: "都市银发",
    },
    {
        label: "都市蓝领居多",
        value: "都市蓝领",
    },
];

export const by粉丝性别 = [
    {
        label: "男性居多",
        value: "男性",
    },
    {
        label: "女性居多",
        value: "女性",
    },
];

export const pgy粉丝性别 = [
    {
        label: "男性居多",
        value: "男性",
    },
    {
        label: "女性居多",
        value: "女性",
    },
];

export const by粉丝地区 = [
    {
        label: "一线城市居多",
        value: "新一线城市",
    },
    {
        label: "二线城市居多",
        value: "二线城市",
    },
    {
        label: "三线城市居多",
        value: "三线城市",
    },
    {
        label: "四线城市居多",
        value: "四线城市",
    },
    {
        label: "五线城市居多",
        value: "五线城市",
    },
];

export const by粉丝年龄 = [
    {
        label: "18-23岁居多",
        value: "18-23岁",
    },
    {
        label: "24-30岁居多",
        value: "24-30岁",
    },
    {
        label: "31-40岁居多",
        value: "31-40岁",
    },
    {
        label: "41-50岁居多",
        value: "41-50岁",
    },
    {
        label: "大于50岁居多",
        value: "50岁以上",
    },
];

export const pgy粉丝年龄 = [
    {
        label: "小于18岁居多",
        value: "<18",
    },
    {
        label: "18-24岁居多",
        value: "18-24",
    },
    {
        label: "25-34岁居多",
        value: "25-34",
    },
    {
        label: "35-44岁居多",
        value: "35-44",
    },
    {
        label: "大于44岁居多",
        value: ">44",
    },
];

export const xt粉丝年龄 = [
    {
        label: "18-23岁居多",
        value: "18-23",
    },
    {
        label: "24-30岁居多",
        value: "24-30",
    },
    {
        label: "31-40岁居多",
        value: "31-40",
    },
    {
        label: "41-50岁居多",
        value: "41-50",
    },
    {
        label: "大于50岁居多",
        value: "50+",
    },
];

export const xt设备品牌 = [
    {
        label: "苹果居多",
        value: "iPhone",
    },
    {
        label: "华为居多",
        value: "华为",
    },
    {
        label: "小米居多",
        value: "小米",
    },
    {
        label: "VIVO居多",
        value: "vivo",
    },
    {
        label: "OPPO居多",
        value: "oppo",
    },
    {
        label: "其他",
        value: "其他",
    },
];

export const xt八大人群 = [
    {
        label: "Z世代",
        value: "Z世代",
    },
    {
        label: "小镇青年",
        value: "小镇青年",
    },
    {
        label: "新锐白领",
        value: "新锐白领",
    },
    {
        label: "精致妈妈",
        value: "精致妈妈",
    },
    {
        label: "都市蓝领",
        value: "都市蓝领",
    },
    {
        label: "小镇中老年",
        value: "小镇中老年",
    },
    {
        label: "资深中产",
        value: "资深中产",
    },
    {
        label: "都市银发",
        value: "都市银发",
    },
];

export const OriginValue = {
    蒲公英: 1,
    百应: 2,
    星图: 3,
    小红书: 4,
    抖音: 5
};


export const OriginLabel = {
    1: "蒲公英",
    2: "百应",
    3: "星图",
    4: "小红书",
    5: '抖音'
};

export function platformOriginLabel(key) {
    return OriginLabel[key]
}

export const ExtensionOrigin = Object.values(OriginLabel);

export const ExtensionOriginList = Object.entries(OriginValue).map(item => {
    return {
        label: item[0],
        value: item[1]
    }
})


export const urgentList = [
    {
        label: "项目加急",
        value: 2
    },
    {
        label: "普通加急",
        value: 1
    },
    {
        label: "否",
        value: 0
    }
]

export const urgentLabel = {
    0: "否",
    1: "普通加急",
    2: "项目加急",
}
export const urgentValue = {
    "否": 0,
    "普通加急": 1,
    "项目加急": 2,
}

export function tagValue2Class(val) {
    if (TagValue.一级内容类目 == val) {
        return "theme-first-content";
    } else if (TagValue.二级内容类目 == val) {
        return "theme-second-content";
    } else if (TagValue.内容特征 == val) {
        return "theme-first-feature";
    } else if (TagValue.特色人设 == val) {
        return "theme-first-personal";
    } else if (TagValue.一级行业 == val) {
        return "theme-first-field";
    } else if (TagValue.二级行业 == val) {
        return "theme-second-field";
    } else if (TagValue.一级主推类目 == val) {
        return "theme-first-category";
    } else if (TagValue.一级带货类目 == val) {
        return "theme-first-live-category";
    } else if (TagValue.二级带货类目 == val) {
        return "theme-first-second-category";
    }
    return "";
}
export function tagList2Map(tagList) {
    const pgyContentTags = [];
    const pgySubContentTags = [];
    const pgyPersonalTags = [];
    const pgyFeatureTags = [];
    const pgyLiveCategoryTags = [];
    const pgySubLiveCategoryTags = [];
    const xtContentTags = [];
    const xtSubContentTags = [];
    const xtFieldTags = [];
    const xtSubFieldTags = [];
    const byContentTags = [];
    const byCategoryTags = [];

    if (tagList) {
        tagList.forEach((item) => {
            const { origin, kind } = item;
            if (OriginValue.蒲公英 == origin) {
                if (TagValue.一级内容类目 == kind) {
                    pgyContentTags.push(item);
                } else if (TagValue.二级内容类目 == kind) {
                    pgySubContentTags.push(item);
                } else if (TagValue.内容特征 == kind) {
                    pgyFeatureTags.push(item);
                } else if (TagValue.特色人设 == kind) {
                    pgyPersonalTags.push(item);
                } else if (TagValue.一级带货类目 == kind) {
                    pgyLiveCategoryTags.push(item);
                } else if (TagValue.二级带货类目 == kind) {
                    pgySubLiveCategoryTags.push(item);
                }
            } else if (OriginValue.星图 == origin) {
                if (TagValue.一级内容类目 == kind) {
                    xtContentTags.push(item);
                } else if (TagValue.二级内容类目 == kind) {
                    xtSubContentTags.push(item);
                } else if (TagValue.一级行业 == kind) {
                    xtFieldTags.push(item);
                } else if (TagValue.二级行业 == kind) {
                    xtSubFieldTags.push(item);
                }
            } else if (OriginValue.百应 == origin) {
                if (TagValue.一级内容类目 == kind) {
                    byContentTags.push(item);
                } else if (TagValue.一级主推类目 == kind) {
                    byCategoryTags.push(item);
                }
            }
        });
    }

    return {
        pgyContentTags,
        pgySubContentTags,
        pgyPersonalTags,
        pgyFeatureTags,
        xtContentTags,
        xtSubContentTags,
        xtFieldTags,
        xtSubFieldTags,
        byContentTags,
        byCategoryTags,
        pgySubLiveCategoryTags,
        pgyLiveCategoryTags
    };
}
function pushIfNotEmpty(todoList, targetList) {
    if (targetList && targetList.length) {
        todoList.push(targetList);
    }
}
export function tagList2Group(tagList) {
    let {
        pgyContentTags,
        pgySubContentTags,
        pgyPersonalTags,
        pgyFeatureTags,
        xtContentTags,
        xtSubContentTags,
        xtFieldTags,
        xtSubFieldTags,
        byContentTags,
        byCategoryTags,
    } = tagList2Map(tagList);
    let groupList = [];
    pushIfNotEmpty(groupList, pgyContentTags);
    pushIfNotEmpty(groupList, pgySubContentTags);
    pushIfNotEmpty(groupList, pgyFeatureTags);
    pushIfNotEmpty(groupList, pgyPersonalTags);
    pushIfNotEmpty(groupList, xtContentTags);
    pushIfNotEmpty(groupList, xtSubContentTags);
    pushIfNotEmpty(groupList, xtFieldTags);
    pushIfNotEmpty(groupList, xtSubFieldTags);
    pushIfNotEmpty(groupList, byCategoryTags);
    pushIfNotEmpty(groupList, byContentTags);
    return groupList;
}

export function tagLabel(value) {
    return TagLabel[value];
}
export function originLabel(value) {
    return OriginLabel[value];
}
export function tagValue(value) {
    return TagValue[value];
}

export function spiderLink(origin, uid) {
    if (origin == Tag.Pgy) {
        return "https://pgy.xiaohongshu.com/solar/pre-trade/blogger-detail/" + uid;
    } else if (origin == Tag.Xt) {
        return "https://www.xingtu.cn/ad/creator/author/douyin/" + uid + "/1";
    } else if (origin == Tag.Dy) {
        return "https://www.douyin.com/user/" + uid;
    } else if (origin == Tag.ByResource) {
        return "https://buyin.jinritemai.com/dashboard/servicehall/daren-profile?uid=" + uid;
    } else if (origin == Tag.Xhs) {
        return "https://www.xiaohongshu.com/user/profile/" + uid;
    } else if (origin == Tag.XtSearch) {
        return `https://www.xingtu.cn/ad/creator/market`;
    } else if (origin == Tag.BySearch) {
        return `https://buyin.jinritemai.com/dashboard/servicehall/daren-square`
    } else if (origin == Tag.PgySearch) {
        return `https://pgy.xiaohongshu.com/solar/pre-trade/note/kol?contentTab=1`
    }
}

export function type2KindOrigin(type) {
    if (type == "星图类目") {
        return {
            kind: TagValue.一级内容类目,
            subKind: TagValue.二级内容类目,
            origin: OriginValue.星图,
        };
    } else if (type == "星图行业") {
        return {
            kind: TagValue.一级行业,
            subKind: TagValue.二级行业,
            origin: OriginValue.星图,
        };
    } else if (type == "蒲公英类目") {
        return {
            kind: TagValue.一级内容类目,
            subKind: TagValue.二级内容类目,
            origin: OriginValue.蒲公英,
        };
    } else if (type == "蒲公英合作类目") {
        return {
            kind: TagValue.一级带货类目,
            subKind: TagValue.二级带货类目,
            origin: OriginValue.蒲公英,
        };
    } else if (type == "蒲公英特征") {
        return {
            kind: "",
            subKind: TagValue.内容特征,
            origin: OriginValue.蒲公英,
        };
    } else if (type == "蒲公英人设") {
        return {
            kind: "",
            subKind: TagValue.特色人设,
            origin: OriginValue.蒲公英,
        };
    } else if (type == "百应主推") {
        return {
            kind: TagValue.一级主推类目,
            subKind: "",
            origin: OriginValue.百应,
        };
    } else if (type == "百应类目") {
        return {
            kind: TagValue.一级内容类目,
            subKind: "",
            origin: OriginValue.百应,
        };
    }
    return {};
}
function fillOneTypeTags(tags, subTags, allTags) {
    for (let i of tags) {
        let temp = allTags.find((item) => item.tag == i);
        if (!temp) continue;
        let allSubTag = temp.tags;
        if (!allSubTag) continue;
        let intersection = (subTags || []).filter((item) => allSubTag.indexOf(item) !== -1);
        if (intersection.length == 0) {
            if (subTags) subTags.push(...allSubTag);
            else {
                subTags = allSubTag;
            }
        }
    }
}

export function autoFillSubTags(form) {
    let {
        contentTags,
        subContentTags,
        personalTags,
        featureTags,
        fieldTags,
        subFieldTags,
        mainCategory,
    } = form;
    console.log('autoFillSubTags', form, personalTags, featureTags);
    if (form.origin == "星图") {
        fieldTags && fillOneTypeTags(fieldTags, subFieldTags, window.G.xtTag.fieldTags);
        contentTags && fillOneTypeTags(contentTags, subContentTags, window.G.xtTag.contentTags);
    }
    if (form.origin == "蒲公英") {
        contentTags && fillOneTypeTags(contentTags, subContentTags, window.G.pgyTag.contentTags);
    }

    return {
        contentTags,
        subContentTags,
        personalTags,
        featureTags,
        fieldTags,
        subFieldTags,
        mainCategory,
    };
}
