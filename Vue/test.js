data()
{ // 定义动态验证函数
    const validateIfHoldRoi = (field) => (rule, value, callback) => {
// 如果 holdRoi 为 true 且字段值为空，触发错误
        if (this.patch.holdRoi && (!value || value.length === 0)) {
            callback(new Error(`当开启"保ROI"时，${field}为必填项`));
        } else {
            callback();
// 验证通过
        }
    };
    return {
        patch: {
            holdRoi: false, roi: [],
// 假设 RangeAdapter 的值是数组形式（如 [min, max]）
            roiScreenshotList: [] // 上传组件返回的数组
        },
        rules: {
            roi: [{validator: validateIfHoldRoi('可保ROI比例'), trigger: 'change'}],
            roiScreenshotList: [{validator: validateIfHoldRoi('ROI承诺截图'), trigger: 'change'}]
        }
    };
}