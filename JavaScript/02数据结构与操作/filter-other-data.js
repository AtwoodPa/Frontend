const row = {
    "id": 81444,
    "apply": 1,
    "applyPrice": "{\"8\": [{\"main\": true, \"prop\": \"price2\", \"label\": \"图文刊例/平台价\", \"limit\": [3, 5000]}]}",
    "name": "10月瑞特滋巧克力红书报备图文-复制",
    "kind": "正常",
    "protect": true,
    "turn": 1,
    "mediumIds": [],
    "budget": 20000,
    "ratio": 0,
    "coopMode": "报备图文",
    "periodTimes": [
        [
            "2024-10-01",
            "2024-10-31"
        ]
    ],
    "stopTime": "2024-09-19 00:00",
    "tagIds": [
        292
    ],
    "platformIds": [
        8
    ],
    "auth": "",
    "site": "",
    "files": [],
    "brief": "报备图文，美食，5k以内。",
    "status": "账号推荐",
    "recommendStatus": "报价中",
    "opId": 398240,
    "createTime": "2024-09-18 16:06",
    "version": "多轮并行"
}
const { stopTime, ...filteredRow } = row;

console.log(filteredRow)
