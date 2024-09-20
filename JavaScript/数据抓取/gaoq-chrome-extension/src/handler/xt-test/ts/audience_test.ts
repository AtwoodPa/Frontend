// 定义接口
interface Distribution {
    distribution_key: string;
    distribution_value: string;
}

interface AudienceData {
    description: string;
    distribution_list: Distribution[];
    image: string[];
    origin_type: number;
    type: number;
    type_display: string;
}

interface AudienceResponse {
    base_resp: {
        status_code: number;
        status_message: string;
    };
    distributions: AudienceData[];
    last_update_time: string;
}

// 示例数据
// @ts-ignore
const data: AudienceResponse = {
        "base_resp": {
            "status_code": 0,
            "status_message": ""
        },
        "distributions": [
            {
                "description": "分布最多的3个省份广东(13%),江苏(7%),浙江(7%)",
                "distribution_list": [
                    {
                        "distribution_key": "北京",
                        "distribution_value": "3759649"
                    },
                    {
                        "distribution_key": "安徽",
                        "distribution_value": "9054067"
                    },
                    {
                        "distribution_key": "河南",
                        "distribution_value": "12585635"
                    },
                    {
                        "distribution_key": "内蒙古",
                        "distribution_value": "2034893"
                    },
                    {
                        "distribution_key": "河北",
                        "distribution_value": "7296424"
                    },
                    {
                        "distribution_key": "甘肃",
                        "distribution_value": "1884072"
                    },
                    {
                        "distribution_key": "山东",
                        "distribution_value": "11579130"
                    },
                    {
                        "distribution_key": "新疆",
                        "distribution_value": "2950664"
                    },
                    {
                        "distribution_key": "海南",
                        "distribution_value": "1812604"
                    },
                    {
                        "distribution_key": "陕西",
                        "distribution_value": "5408049"
                    },
                    {
                        "distribution_key": "广东",
                        "distribution_value": "25496169"
                    },
                    {
                        "distribution_key": "湖南",
                        "distribution_value": "8225369"
                    },
                    {
                        "distribution_key": "吉林",
                        "distribution_value": "1523117"
                    },
                    {
                        "distribution_key": "湖北",
                        "distribution_value": "8102403"
                    },
                    {
                        "distribution_key": "浙江",
                        "distribution_value": "14580400"
                    },
                    {
                        "distribution_key": "香港",
                        "distribution_value": "187088"
                    },
                    {
                        "distribution_key": "重庆",
                        "distribution_value": "4157342"
                    },
                    {
                        "distribution_key": "辽宁",
                        "distribution_value": "3167271"
                    },
                    {
                        "distribution_key": "江苏",
                        "distribution_value": "15344471"
                    },
                    {
                        "distribution_key": "贵州",
                        "distribution_value": "4588065"
                    },
                    {
                        "distribution_key": "宁夏",
                        "distribution_value": "710411"
                    },
                    {
                        "distribution_key": "澳门",
                        "distribution_value": "47462"
                    },
                    {
                        "distribution_key": "福建",
                        "distribution_value": "6789278"
                    },
                    {
                        "distribution_key": "天津",
                        "distribution_value": "1751088"
                    },
                    {
                        "distribution_key": "广西",
                        "distribution_value": "6309210"
                    },
                    {
                        "distribution_key": "黑龙江",
                        "distribution_value": "1740518"
                    },
                    {
                        "distribution_key": "上海",
                        "distribution_value": "4427854"
                    },
                    {
                        "distribution_key": "台湾",
                        "distribution_value": "162370"
                    },
                    {
                        "distribution_key": "西藏",
                        "distribution_value": "663288"
                    },
                    {
                        "distribution_key": "江西",
                        "distribution_value": "6319093"
                    },
                    {
                        "distribution_key": "山西",
                        "distribution_value": "3531194"
                    },
                    {
                        "distribution_key": "青海",
                        "distribution_value": "514309"
                    },
                    {
                        "distribution_key": "四川",
                        "distribution_value": "10269835"
                    },
                    {
                        "distribution_key": "云南",
                        "distribution_value": "5974216"
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
                "description": "分布最多的1个城市广州(12%)",
                "distribution_list": [
                    {
                        "distribution_key": "杭州",
                        "distribution_value": "3043801"
                    },
                    {
                        "distribution_key": "重庆",
                        "distribution_value": "4157342"
                    },
                    {
                        "distribution_key": "东莞",
                        "distribution_value": "3330640"
                    },
                    {
                        "distribution_key": "苏州",
                        "distribution_value": "3420039"
                    },
                    {
                        "distribution_key": "广州",
                        "distribution_value": "4658873"
                    },
                    {
                        "distribution_key": "北京",
                        "distribution_value": "3759649"
                    },
                    {
                        "distribution_key": "武汉",
                        "distribution_value": "2863457"
                    },
                    {
                        "distribution_key": "成都",
                        "distribution_value": "4022330"
                    },
                    {
                        "distribution_key": "上海",
                        "distribution_value": "4427853"
                    },
                    {
                        "distribution_key": "深圳",
                        "distribution_value": "4220066"
                    }
                ],
                "image": [
                    "广州居多"
                ],
                "origin_type": 8,
                "type": 256,
                "type_display": "城市分布"
            },
            {
                "description": "一线居多,占比28%",
                "distribution_list": [
                    {
                        "distribution_key": "五线",
                        "distribution_value": "24079111"
                    },
                    {
                        "distribution_key": "四线",
                        "distribution_value": "31931376"
                    },
                    {
                        "distribution_key": "二线",
                        "distribution_value": "37850231"
                    },
                    {
                        "distribution_key": "三线",
                        "distribution_value": "45034170"
                    },
                    {
                        "distribution_key": "一线",
                        "distribution_value": "56332051"
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
                "description": "分布最多的3个兴趣随拍(65%),社会时政(5%),二次元(5%)",
                "distribution_list": [
                    {
                        "distribution_key": "随拍",
                        "distribution_value": "107380565"
                    },
                    {
                        "distribution_key": "社会时政",
                        "distribution_value": "9666361"
                    },
                    {
                        "distribution_key": "二次元",
                        "distribution_value": "9643101"
                    },
                    {
                        "distribution_key": "游戏",
                        "distribution_value": "9485310"
                    },
                    {
                        "distribution_key": "亲子",
                        "distribution_value": "8728085"
                    },
                    {
                        "distribution_key": "体育",
                        "distribution_value": "6737785"
                    },
                    {
                        "distribution_key": "美食",
                        "distribution_value": "6464441"
                    },
                    {
                        "distribution_key": "电视剧",
                        "distribution_value": "4965890"
                    }
                ],
                "image": [
                    "随拍,社会时政,二次元居多"
                ],
                "origin_type": 6,
                "type": 64,
                "type_display": "兴趣分布"
            },
            {
                "description": "Z世代居多,占比22%",
                "distribution_list": [
                    {
                        "distribution_key": "精致妈妈",
                        "distribution_value": "4704809"
                    },
                    {
                        "distribution_key": "新锐白领",
                        "distribution_value": "30848746"
                    },
                    {
                        "distribution_key": "小镇青年",
                        "distribution_value": "35744368"
                    },
                    {
                        "distribution_key": "都市蓝领",
                        "distribution_value": "23577069"
                    },
                    {
                        "distribution_key": "Z世代",
                        "distribution_value": "39627361"
                    },
                    {
                        "distribution_key": "资深中产",
                        "distribution_value": "14907450"
                    },
                    {
                        "distribution_key": "都市银发",
                        "distribution_value": "12478401"
                    },
                    {
                        "distribution_key": "小镇中老年",
                        "distribution_value": "17786017"
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
                "description": "31到40岁居多,占比33%",
                "distribution_list": [
                    {
                        "distribution_key": "50+",
                        "distribution_value": "19184860"
                    },
                    {
                        "distribution_key": "41-50",
                        "distribution_value": "27101808"
                    },
                    {
                        "distribution_key": "18-23",
                        "distribution_value": "31431954"
                    },
                    {
                        "distribution_key": "24-30",
                        "distribution_value": "43687324"
                    },
                    {
                        "distribution_key": "31-40",
                        "distribution_value": "60846795"
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
                "description": "男性居多,占比82%",
                "distribution_list": [
                    {
                        "distribution_key": "female",
                        "distribution_value": "35024493"
                    },
                    {
                        "distribution_key": "male",
                        "distribution_value": "160117728"
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
                "description": "苹果手机占比27%, 消费能力较好",
                "distribution_list": [
                    {
                        "distribution_key": "其他",
                        "distribution_value": "18936702"
                    },
                    {
                        "distribution_key": "红米",
                        "distribution_value": "8406165"
                    },
                    {
                        "distribution_key": "荣耀",
                        "distribution_value": "21694524"
                    },
                    {
                        "distribution_key": "oppo",
                        "distribution_value": "22777429"
                    },
                    {
                        "distribution_key": "iPhone",
                        "distribution_value": "54565158"
                    },
                    {
                        "distribution_key": "小米",
                        "distribution_value": "11949552"
                    },
                    {
                        "distribution_key": "华为",
                        "distribution_value": "32298179"
                    },
                    {
                        "distribution_key": "vivo",
                        "distribution_value": "24599230"
                    }
                ],
                "image": [
                    "苹果手机较多"
                ],
                "origin_type": 3,
                "type": 8,
                "type_display": "设备品牌分布"
            }
        ],
        "last_update_time": "1726819699"
    }
;

// 存储对象
const audienceByPeopleType: Record<string, string> = {};
const audienceByAge: Record<string, string> = {};
const audienceByGender: Record<string, string> = {};
const audienceByDevice: Record<string, string> = {};
const audienceByRegion: Record<string, string> = {};

// 数据解析函数
function parseAudienceData(data: AudienceResponse) {
    data.distributions.forEach(distribution => {
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
            case '城市分布':
                distribution.distribution_list.forEach(item => {
                    audienceByRegion[item.distribution_key] = item.distribution_value;
                });
                break;
            default:
                console.warn(`未处理的分布类型: ${distribution.type_display}`);
        }
    });
}

// 执行解析
parseAudienceData(data);

// 输出结果
console.log("八大人群占比:", audienceByPeopleType);
console.log("观众年龄:", audienceByAge);
console.log("观众性别:", audienceByGender);
console.log("观众设备品牌:", audienceByDevice);
console.log("观众地域:", audienceByRegion);
