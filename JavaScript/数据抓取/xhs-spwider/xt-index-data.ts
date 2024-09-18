const resp = {
    "base_resp": {
    "status_code": 0,
        "status_message": ""
},
    "cooperate_index": {
    "avg_value": 75.44,
        "link_relative_ratio": -0.0001,
        "rank": "252342",
        "rank_percent": 0.1439,
        "value": 75.45
},
    "cp_index": {
    "avg_value": 63.32,
        "link_relative_ratio": -0.0338,
        "rank": "16519",
        "rank_percent": 0.0094,
        "value": 73.49
},
    "link_convert_index": {
    "avg_value": 55.79,
        "link_relative_ratio": -0.0237,
        "rank": "8479",
        "rank_percent": 0.0048,
        "value": 88.54
},
    "link_shopping_index": {
    "avg_value": 53.88,
        "link_relative_ratio": 0.1265,
        "rank": "993",
        "rank_percent": 0.0006,
        "value": 97.22
},
    "link_spread_index": {
    "avg_value": 53.61,
        "link_relative_ratio": 0.0182,
        "rank": "1573",
        "rank_percent": 0.0009,
        "value": 95.82
},
    "link_star_index": {
    "avg_value": 56.83,
        "link_relative_ratio": 0.0187,
        "rank": "696",
        "rank_percent": 0.0004,
        "value": 86.1
}
}

interface IndexData {
    avg_value: number;
    link_relative_ratio: number;
    rank: string;
    rank_percent: number;
    value: number;
}

interface ApiResponse {
    base_resp: {
        status_code: number;
        status_message: string;
    };
    cooperate_index: IndexData;
    cp_index: IndexData;
    link_convert_index: IndexData;
    link_shopping_index: IndexData;
    link_spread_index: IndexData;
    link_star_index: IndexData;
}

const apiResponse: ApiResponse = {
    base_resp: { status_code: 0, status_message: "" },
    cooperate_index: { avg_value: 75.44, link_relative_ratio: -0.0001, rank: "252342", rank_percent: 0.1439, value: 75.45 },
    cp_index: { avg_value: 63.32, link_relative_ratio: -0.0338, rank: "16519", rank_percent: 0.0094, value: 73.49 },
    link_convert_index: { avg_value: 55.79, link_relative_ratio: -0.0237, rank: "8479", rank_percent: 0.0048, value: 88.54 },
    link_shopping_index: { avg_value: 53.88, link_relative_ratio: 0.1265, rank: "993", rank_percent: 0.0006, value: 97.22 },
    link_spread_index: { avg_value: 53.61, link_relative_ratio: 0.0182, rank: "1573", rank_percent: 0.0009, value: 95.82 },
    link_star_index: { avg_value: 56.83, link_relative_ratio: 0.0187, rank: "696", rank_percent: 0.0004, value: 86.1 },
};


// 提取所有的value
const values: number[] = [
    apiResponse.cooperate_index.value,
    apiResponse.cp_index.value,
    apiResponse.link_convert_index.value,
    apiResponse.link_shopping_index.value,
    apiResponse.link_spread_index.value,
    apiResponse.link_star_index.value,
];

console.log(values);
