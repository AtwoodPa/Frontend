interface DistributionItem {
    distribution_key: string;
    distribution_value: string;
}

interface FanData {
    description: string;
    distribution_list: DistributionItem[];
    type_display: string;
}

interface FanAnalytics {
    distributions: FanData[];
}

// 存储对象
const ageDistribution: Record<string, string> = {};
const genderDistribution: Record<string, string> = {};
const deviceBrandDistribution: Record<string, string> = {};
const regionDistribution: Record<string, string> = {};

// @ts-ignore
// @ts-ignore
const data: FanAnalytics = {
        "base_resp": {
            "status_code": 0,
            "status_message": ""
        },
        "distributions": [
            {
                "description": "31到40岁居多,占比39%",
                "distribution_list": [
                    {
                        "distribution_key": "31-40",
                        "distribution_value": "1887530"
                    },
                    {
                        "distribution_key": "41-50",
                        "distribution_value": "501071"
                    },
                    {
                        "distribution_key": "其他",
                        "distribution_value": "675806"
                    },
                    {
                        "distribution_key": "24-30",
                        "distribution_value": "1190892"
                    },
                    {
                        "distribution_key": "18-23",
                        "distribution_value": "848645"
                    },
                    {
                        "distribution_key": "50+",
                        "distribution_value": "404963"
                    }
                ],
                "image": [
                    "31到40岁居多"
                ],
                "origin_type": 1,
                "type": 2,
                "type_display": "年龄分布"
            },
            {
                "description": "分布最多的1个城市上海(13%)",
                "distribution_list": [
                    {
                        "distribution_key": "广州",
                        "distribution_value": "136917"
                    },
                    {
                        "distribution_key": "深圳",
                        "distribution_value": "126573"
                    },
                    {
                        "distribution_key": "北京",
                        "distribution_value": "112980"
                    },
                    {
                        "distribution_key": "重庆",
                        "distribution_value": "103521"
                    },
                    {
                        "distribution_key": "成都",
                        "distribution_value": "101890"
                    },
                    {
                        "distribution_key": "长沙",
                        "distribution_value": "100794"
                    },
                    {
                        "distribution_key": "杭州",
                        "distribution_value": "93778"
                    },
                    {
                        "distribution_key": "上海",
                        "distribution_value": "144995"
                    },
                    {
                        "distribution_key": "东莞",
                        "distribution_value": "91253"
                    },
                    {
                        "distribution_key": "苏州",
                        "distribution_value": "101421"
                    }
                ],
                "image": [
                    "上海居多"
                ],
                "origin_type": 8,
                "type": 256,
                "type_display": "城市分布"
            },
            {
                "description": "分布最多的3个省份广东(13%),江苏(9%),浙江(7%)",
                "distribution_list": [
                    {
                        "distribution_key": "宁夏",
                        "distribution_value": "17410"
                    },
                    {
                        "distribution_key": "湖北",
                        "distribution_value": "222012"
                    },
                    {
                        "distribution_key": "山东",
                        "distribution_value": "376050"
                    },
                    {
                        "distribution_key": "贵州",
                        "distribution_value": "81164"
                    },
                    {
                        "distribution_key": "辽宁",
                        "distribution_value": "99384"
                    },
                    {
                        "distribution_key": "广东",
                        "distribution_value": "713181"
                    },
                    {
                        "distribution_key": "北京",
                        "distribution_value": "112979"
                    },
                    {
                        "distribution_key": "天津",
                        "distribution_value": "53669"
                    },
                    {
                        "distribution_key": "西藏",
                        "distribution_value": "10123"
                    },
                    {
                        "distribution_key": "黑龙江",
                        "distribution_value": "56320"
                    },
                    {
                        "distribution_key": "安徽",
                        "distribution_value": "234649"
                    },
                    {
                        "distribution_key": "河南",
                        "distribution_value": "313957"
                    },
                    {
                        "distribution_key": "湖南",
                        "distribution_value": "273373"
                    },
                    {
                        "distribution_key": "香港",
                        "distribution_value": "10980"
                    },
                    {
                        "distribution_key": "上海",
                        "distribution_value": "144995"
                    },
                    {
                        "distribution_key": "台湾",
                        "distribution_value": "14386"
                    },
                    {
                        "distribution_key": "福建",
                        "distribution_value": "191475"
                    },
                    {
                        "distribution_key": "甘肃",
                        "distribution_value": "46920"
                    },
                    {
                        "distribution_key": "吉林",
                        "distribution_value": "48988"
                    },
                    {
                        "distribution_key": "海南",
                        "distribution_value": "36852"
                    },
                    {
                        "distribution_key": "青海",
                        "distribution_value": "11957"
                    },
                    {
                        "distribution_key": "山西",
                        "distribution_value": "108148"
                    },
                    {
                        "distribution_key": "云南",
                        "distribution_value": "116018"
                    },
                    {
                        "distribution_key": "浙江",
                        "distribution_value": "410130"
                    },
                    {
                        "distribution_key": "四川",
                        "distribution_value": "242097"
                    },
                    {
                        "distribution_key": "澳门",
                        "distribution_value": "2664"
                    },
                    {
                        "distribution_key": "江苏",
                        "distribution_value": "485321"
                    },
                    {
                        "distribution_key": "广西",
                        "distribution_value": "126798"
                    },
                    {
                        "distribution_key": "内蒙古",
                        "distribution_value": "63198"
                    },
                    {
                        "distribution_key": "陕西",
                        "distribution_value": "148110"
                    },
                    {
                        "distribution_key": "河北",
                        "distribution_value": "193869"
                    },
                    {
                        "distribution_key": "新疆",
                        "distribution_value": "66091"
                    },
                    {
                        "distribution_key": "重庆",
                        "distribution_value": "103521"
                    },
                    {
                        "distribution_key": "江西",
                        "distribution_value": "164553"
                    }
                ],
                "image": [
                    "广东,江苏,浙江居多"
                ],
                "origin_type": 2,
                "type": 4,
                "type_display": "省份分布"
            },
            {
                "description": "一线居多,占比31%",
                "distribution_list": [
                    {
                        "distribution_key": "四线",
                        "distribution_value": "839980"
                    },
                    {
                        "distribution_key": "三线",
                        "distribution_value": "1204540"
                    },
                    {
                        "distribution_key": "五线",
                        "distribution_value": "495736"
                    },
                    {
                        "distribution_key": "二线",
                        "distribution_value": "1071918"
                    },
                    {
                        "distribution_key": "一线",
                        "distribution_value": "1688992"
                    }
                ],
                "image": [
                    "一线居多"
                ],
                "origin_type": 5,
                "type": 32,
                "type_display": "城市等级分布"
            },
            {
                "description": "男性居多,占比87%",
                "distribution_list": [
                    {
                        "distribution_key": "male",
                        "distribution_value": "4820204"
                    },
                    {
                        "distribution_key": "female",
                        "distribution_value": "688713"
                    }
                ],
                "image": [
                    "男性居多"
                ],
                "origin_type": 0,
                "type": 1,
                "type_display": "性别分布"
            },
            {
                "description": "苹果手机占比24%, 消费能力较好",
                "distribution_list": [
                    {
                        "distribution_key": "vivo",
                        "distribution_value": "645720"
                    },
                    {
                        "distribution_key": "红米",
                        "distribution_value": "274391"
                    },
                    {
                        "distribution_key": "其他",
                        "distribution_value": "849867"
                    },
                    {
                        "distribution_key": "小米",
                        "distribution_value": "377170"
                    },
                    {
                        "distribution_key": "iPhone",
                        "distribution_value": "1344459"
                    },
                    {
                        "distribution_key": "oppo",
                        "distribution_value": "568496"
                    },
                    {
                        "distribution_key": "华为",
                        "distribution_value": "880757"
                    },
                    {
                        "distribution_key": "荣耀",
                        "distribution_value": "572633"
                    }
                ],
                "image": [
                    "苹果手机较多"
                ],
                "origin_type": 3,
                "type": 8,
                "type_display": "设备品牌分布"
            },
            {
                "description": "分布最多的3个兴趣随拍(51%),游戏(12%),体育(9%)",
                "distribution_list": [
                    {
                        "distribution_key": "社会时政",
                        "distribution_value": "340993"
                    },
                    {
                        "distribution_key": "二次元",
                        "distribution_value": "315846"
                    },
                    {
                        "distribution_key": "剧情",
                        "distribution_value": "190154"
                    },
                    {
                        "distribution_key": "亲子",
                        "distribution_value": "184202"
                    },
                    {
                        "distribution_key": "美食",
                        "distribution_value": "181521"
                    },
                    {
                        "distribution_key": "随拍",
                        "distribution_value": "2453411"
                    },
                    {
                        "distribution_key": "游戏",
                        "distribution_value": "613082"
                    },
                    {
                        "distribution_key": "体育",
                        "distribution_value": "458883"
                    }
                ],
                "image": [
                    "随拍,游戏,体育居多"
                ],
                "origin_type": 6,
                "type": 64,
                "type_display": "兴趣分布"
            },
            {
                "description": "Z世代居多,占比26%",
                "distribution_list": [
                    {
                        "distribution_key": "新锐白领",
                        "distribution_value": "1033599"
                    },
                    {
                        "distribution_key": "资深中产",
                        "distribution_value": "399651"
                    },
                    {
                        "distribution_key": "Z世代",
                        "distribution_value": "1313679"
                    },
                    {
                        "distribution_key": "精致妈妈",
                        "distribution_value": "82135"
                    },
                    {
                        "distribution_key": "都市蓝领",
                        "distribution_value": "642564"
                    },
                    {
                        "distribution_key": "都市银发",
                        "distribution_value": "205748"
                    },
                    {
                        "distribution_key": "小镇中老年",
                        "distribution_value": "318000"
                    },
                    {
                        "distribution_key": "小镇青年",
                        "distribution_value": "946338"
                    }
                ],
                "image": [
                    "Z世代居多"
                ],
                "origin_type": 10,
                "type": 1024,
                "type_display": "八大人群分布"
            },
            {
                "description": "",
                "distribution_list": [
                    {
                        "distribution_key": "100-200",
                        "distribution_value": "324406"
                    },
                    {
                        "distribution_key": "50-100",
                        "distribution_value": "527609"
                    },
                    {
                        "distribution_key": "200-500",
                        "distribution_value": "162322"
                    },
                    {
                        "distribution_key": "500以上",
                        "distribution_value": "69663"
                    },
                    {
                        "distribution_key": "0-50",
                        "distribution_value": "1327044"
                    }
                ],
                "image": [
                    ""
                ],
                "origin_type": 12,
                "type": 4096,
                "type_display": "客单价分布"
            },
            {
                "description": "",
                "distribution_list": [
                    {
                        "distribution_key": "其他",
                        "distribution_value": "935288"
                    },
                    {
                        "distribution_key": "食品饮料",
                        "distribution_value": "487581"
                    },
                    {
                        "distribution_key": "智能家居",
                        "distribution_value": "341787"
                    },
                    {
                        "distribution_key": "服饰内衣",
                        "distribution_value": "252223"
                    },
                    {
                        "distribution_key": "个护家清",
                        "distribution_value": "205178"
                    },
                    {
                        "distribution_key": "3C数码家电",
                        "distribution_value": "191524"
                    }
                ],
                "image": [
                    ""
                ],
                "origin_type": 11,
                "type": 2048,
                "type_display": "消费品类分布"
            }
        ],
        "last_update_time": "1726819699"
    }
;
function extractFansData(data :FanAnalytics) {
    data.distributions.forEach(distribution => {
        const list = distribution.distribution_list.map(item => ({
            key: item.distribution_key,
            value: parseInt(item.distribution_value, 10)
        }));

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
            case '城市分布': // 或者你可以用"城市分布"或其他地理位置
                distribution.distribution_list.forEach(item => {
                    regionDistribution[item.distribution_key] = item.distribution_value;
                })
                break;
            default:
                break;
        }
    });

    // return result;
}
extractFansData(data);
// 提取不同分类的数据
// const ageDistribution = data.distributions.find(d => d.type_display === "年龄分布");
// const genderDistribution = data.distributions.find(d => d.type_display === "性别分布");
// const deviceDistribution = data.distributions.find(d => d.type_display === "设备品牌分布");
// const regionDistribution = data.distributions.find(d => d.type_display === "城市分布");

// 进行分类存储
// const fanAges = ageDistribution ? ageDistribution.distribution_list : [];
// const fanGenders = genderDistribution ? genderDistribution.distribution_list : [];
// const fanDevices = deviceDistribution ? deviceDistribution.distribution_list : [];
// const fanRegions = regionDistribution ? regionDistribution.distribution_list : [];

console.log("粉丝年龄分布:", ageDistribution);
console.log("粉丝性别分布:", genderDistribution);
console.log("粉丝设备品牌分布:", deviceBrandDistribution);
console.log("粉丝地域分布:", regionDistribution);
