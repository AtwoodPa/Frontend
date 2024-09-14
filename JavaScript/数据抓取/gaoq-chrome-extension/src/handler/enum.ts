// export enum Msg {
//     page通过content发送给background = 'page通过content发送给background',
//     background通过content发送给page = 'background通过content发送给page',
//     content通过background转发其他content发送给page =
//     'content通过background转发其他content发送给page',
//     content发送给background = 'content发送给background',
//     background发送给content = 'background发送给content'
// };

// export enum Aim {
//     获取当前tabId = '获取当前tabId',
//     设置插件认证码 = '设置插件认证码',
//     通知已补丁 = '通知已补丁',
//     通知已复制 = '通知已复制',
//     通知已提取 = '通知已提取',
//     获取Cookie = '获取Cookie',
//     系统通知 = '系统通知',
//     清理缓存 = '清理缓存',
//     TTS = 'TTS',
//     Cookie = 'Cookie'
// };
export enum Msg {
    page通过content发送给background = 'page通过content发送给background',
    page发送给content = 'page发送给content',
    background通过content发送给page = 'background通过content发送给page',
    content通过background转发其他content发送给page = "content通过background转发其他content发送给page",
    content发送给background = 'content发送给background',
    content发送给page = 'content发送给page',
    background发送给content = 'background发送给content'
}
// 非content与background通信的携带信息
export enum Aim {
    环境检测 = "环境检测",
    获取当前tabId = '获取当前tabId',
    通知已补丁 = '通知已补丁',
    通知已提取 = '通知已提取',
    设置插件认证码 = '设置插件认证码',
    关闭当前并跳转tab = '关闭当前并跳转tab',
    系统通知 = '系统通知',
    通知已入库 = '通知已入库',
    清理缓存 = '清理缓存',
    TTS = 'TTS',
    Cookie = 'Cookie',
    获取版本信息 = '获取版本信息'
}
export enum PlatformMap {
    抖音 = 9,
    小红书 = 8
}

// 还未删除，因星图直播主页要用
export enum Flag {
    nameXtID = '星图昵称-id',
    rank = '星图榜单',
    sexContent = '星图性别-地区-mcn-介绍',
    capability = '星图商业能力',
    zhibo_featureTags = '星图直播-个人标签',
    zhibo_fanCount = '星图直播-粉丝',
    zhibo_bringGoods = '星图直播-带货数据',
    zhibo_dataOverview = '星图直播-带货能力',
    zhibo_sex = '星图直播-性别',
};

export enum For {
    回填基础数据 = 1,
    获取蒲公英等级 = 2,
    爬取星图等级 = 3,
    爬取百应等级 = 4,
    绑定小红书品牌 = 5,
    绑定百应资源 = 91,
    绑定星图资源 = 92,
    主页自动入库 = 101,
    查询百应存在资源 = 911,
    查询星图存在资源 = 921,
    检测是否登录 = 922,
    验证简介 = 923,
};

export enum Grab {
    不抓额外数据 = 0,
    抓取全部数据 = 1,
    尽量抓取额外数据 = 2
}

export enum Table {
    插件入库 = '1',
    资源入库 = '2',
    品牌入库 = '3'
}

export enum Label {
    brand = '品牌',
    category = '类目',
    average_price = '均价',
};

export enum Tag {
    Empty = '未识别的tag',
    Xhs = '小红书',
    XhsSearch = '小红书检索',
    XhsProduct = '小红书商品',
    Dy = '抖音',
    Pgy = '蒲公英',
    PgySearch = '蒲公英检索',
    PgyProduct = '蒲公英商品',
    Xt = '星图',
    ByResource = '精选联盟-直播',
    ByProductHaohuo = '百应商品(好货)',
    ByProduct = '百应商品',
    XtSearch = '星图搜索页',
    XtLogin = '星图重定向登录页',//就是跳转搜索页后因为未登录，重定向导登录页
    BySearch = '百应搜索页',
    OP = 'OP前端开发或测试环境',
    Popup = 'popup'
};

export const SiteMap = {
    星图: "https://www.xingtu.cn/ad/creator/author/douyin/"
}

export enum ImportOrigin {
    插件 = 0,
    橱窗高佣 = 1,
    池内48小时GMV超1w = 3,
}

export enum PlatformOrigin {
    蒲公英 = 1,
    百应 = 2,
    星图 = 3,
    小红书 = 4,
    抖音 = 5,
    好货 = 12,
}

export enum Platform {
    小红书 = 8,
    抖音 = 9
}

export const dispLayList = [
    {
        label: "建联状态:",
        key: "exist",
    },
    {
        label: "刊例状态:",
        key: "publication",
    },
    {
        label: "mcn:",
        key: "mcn",
    },
    {
        label: "直联达人:",
        key: "directWise",
    },
    {
        label: "返点比例(%):",
        key: "rebate",
    },
]

