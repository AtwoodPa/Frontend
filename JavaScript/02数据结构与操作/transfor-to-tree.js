function transformTreeOptions(data) {
    data.forEach(item => {
        if (item.type === 'tree') {
            item.options = transformOptions(item.options);
        }
    });
}

// 递归转换 options
function transformOptions(options) {
    return options.map(option => {
        let transformed = {
            title: option.text, // 将 text 改为 title
            value: option.value, // 保留原始 value 属性
        };

        if (option.children && option.children.length > 0) {
            transformed.children = transformOptions(option.children); // 递归处理子节点
        }

        return transformed;
    });
}

// 示例数据
let data = [
    {
        "question": "测试",
        "type": "tree",
        "options": [
            {
                "text": "南京",
                "value": "南京",
                "children": [
                    {
                        "text": "1",
                        "value": "南京/1"
                    },
                    {
                        "text": "2",
                        "value": "南京/2"
                    }
                ]
            },
            {
                "text": "上海",
                "value": "上海",
                "children": [
                    {
                        "text": "1",
                        "value": "上海/1"
                    },
                    {
                        "text": "2",
                        "value": "上海/2"
                    }
                ]
            }
        ],
        "inquiryType": 2,
        "questionType": false
    },
    {
        "question": "1111",
        "type": "radio",
        "options": [
            "选项1",
            "选项2"
        ],
        "inquiryType": 2,
        "questionType": false
    }
];

// 调用转换函数
transformTreeOptions(data);

console.log(JSON.stringify(data));