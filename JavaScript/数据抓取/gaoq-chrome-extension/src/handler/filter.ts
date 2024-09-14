const cdnBase = '//cdn.red.gaoq.com'
export function photo(val: string) {
    if (val) {
        val = val.replace("dingUsed/", "").replace("ding/", "");
        return val.match(/^http|data:image|\/\//) ? val : `${cdnBase}/resource/${val}`
    }
    return null
}

export const ProductStatusLabel: any = {
    0: '待审核',
    1: '推广中',
    2: '申请未通过',
    3: '合作已终止',
    6: '合作已到期'
}
export const PromotionStatusLabel: any = {
    1: '终止推广',
    2: '开启推广',
    3: '商家关闭', // 商家关闭推广计划
    4: '商品下架',
    6: '平台治理关闭',
    99: '商家删除',
    [-1000]: '未查到商品'
}

export function promotionProductStatusLabel(item: any) {
    let a, b;
    if (item && item.promotion_status) {
        let { promotion_status } = item;
        a = PromotionStatusLabel[promotion_status];
    }

    if (item && item.status) {
        let { status } = item
        b = ProductStatusLabel[status];
    }

    if (a || b) {
        return `${a || '_'}/${b || '_'}`
    } else {
        return "";
    }
}

export const GoodsImportStatusLabel: any = {
    0: '待认领',
    1: '待谈判',
    2: '待审核',
    3: '已通过',
    4: '未通过'
}

export function goodsImportStatusLabel(val: any) {
    return GoodsImportStatusLabel[val];
}
export function text2Int(text: any) {
    if (typeof text === 'string') {
        text = text.replace('-', '');
    }
    if (text) {
        text = text.replace(/[+,%]/, '');
        if (
            text.indexOf('千') > -1 ||
            text.indexOf('K') > -1 ||
            text.indexOf('k') > -1
        ) {
            text = text.replace('千', '') || text.replace('K', '');
            return Math.round(parseFloat(text) * 1000);
        }
        if (
            text.indexOf('万') > -1 ||
            text.indexOf('W') > -1 ||
            text.indexOf('w') > -1
        ) {
            text = text.replace('万', '') || text.replace('W', '');
            return Math.round(parseFloat(text) * 10000);
        }
        if (text.indexOf('亿') > -1) {
            text = text.replace('亿', '');
            return Math.round(parseFloat(text) * 100000000);
        }
        return parseInt(text);
    }
    return null;
}