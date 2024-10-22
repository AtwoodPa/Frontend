// 原始对象
const originalObj = {
    withBindingInfo: false,
    withTag: false,
    withBy: true,
    withPgy: true,
    byFields: "pjjdj, cjxseMin, cjxseMax",
    pgyFields: null,
    lastCooperated: null,
    filter: [],
    sort: "优先显示最近签约",
    favorIds: [],
    name: "",
    kpi: "",
    pgyContentTags: [],
    byFsFemaleRateRange: [null, null],
    byFsMaleRateRange: [10, null],
    bgzws1mRange: [100, 200],
    pgyLiveCategoryTags: null
    // 其他字段...
};

// 过滤出值不为空的键值对
const filteredObj = Object.fromEntries(
    Object.entries(originalObj).filter(([key, value]) => {
        if (Array.isArray(value)) {
            return value.some(v => v !== null && v !== undefined); // 检查数组中的非空元素
        }
        return value !== null && value !== undefined && value !== "";
    })
);

console.log(filteredObj);