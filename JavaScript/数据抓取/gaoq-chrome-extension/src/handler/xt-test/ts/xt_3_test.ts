// @ts-ignore
const connectUsersBody: ConnectUsersBody = {
    "author_link_type": "种草",
    "base_resp": {
        "status_code": 0,
        "status_message": ""
    },
    "link_struct": {
        "1": {
            proportion: 0.37791532985409215,
            same_industry_median: 8513311,
            value: 78694280
        },
        "2": {
            proportion: 0.35027846196336365,
            same_industry_median: 6048686,
            value: 72939384
        },
        "3": {
            proportion: 0.2717980202222833,
            same_industry_median: 1634050,
            value: 56597200
        },
        "4": {
            proportion: 0.000008187960260913843,
            same_industry_median: 752,
            value: 1705
        },
        "5": {
            rank_percent: 0.0001,
            relative_ratio: 2.9562,
            value: 208232569
        }
    }
};

// 获取第五个子项的 value
const monthlyConnectedUsers = (connectUsersBody.link_struct['5'] as any).value;

// 使用 reduce 获取最大 proportion 和对应的 value
// @ts-ignore
const { value: maxValue } = Object.values(connectUsersBody.link_struct)
    .slice(0, 4)
    .reduce((acc, item) => {
        // @ts-ignore
        return item.proportion > acc.proportion ? { proportion: item.proportion, value: item.value } : acc;
    }, { proportion: -Infinity, value: 0 });

// 计算月深度用户数
const monthlyDeepUsers = monthlyConnectedUsers - maxValue;

console.log("月深度用户数:", monthlyDeepUsers);
