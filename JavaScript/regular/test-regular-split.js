// const url = "https://www.xiaohongshu.com/goods-detail/67b454699759260001a77869";
//  https://www.xiaohongshu.com/goods-detail/67b454699759260001a77869?xsec_token=XBk6O6HDCp643zMnPQhHszALvD8ZVGFIvo8K4Ng7Bt-m4=&xsec_source=app_share&instation_link=xhsdiscover%3A%2F%2Fgoods_detail%2F67b454699759260001a77869%3Ftrade_ext%3DeyJjaGFubmVsSW5mbyI6bnVsbCwiZHNUb2tlbkluZm8iOm51bGwsInNoYXJlTGluayI6Imh0dHBzOi8vd3d3LnhpYW9ob25nc2h1LmNvbS9nb29kcy1kZXRhaWwvNjdiNDU0Njk5NzU5MjYwMDAxYTc3ODY5P2FwcHVpZD02MzQ3OGZhYzAwMDAwMDAwMTkwMWU5YWEiLCJsaXZlSW5mbyI6bnVsbCwic2hvcEluZm8iOm51bGwsImdvb2RzTm90ZUluZm8iOm51bGwsImNoYXRJbmZvIjpudWxsLCJzZWFyY2hJbmZvIjpudWxsLCJwcmVmZXIiOm51bGx9%26rn%3Dtrue&share_id=a54881c7b42d49c193724ee1abf2a600&share_channel=wechat
const url = "https://www.xiaohongshu.com/goods-detail/67b454699759260001a77869?xsec_token=XBk6O6HDCp643zMnPQhHszALvD8ZVGFIvo8K4Ng7Bt-m4=&xsec_source=app_share&instation_link=xhsdiscover%3A%2F%2Fgoods_detail%2F67b454699759260001a77869%3Ftrade_ext%3DeyJjaGFubmVsSW5mbyI6bnVsbCwiZHNUb2tlbkluZm8iOm51bGwsInNoYXJlTGluayI6Imh0dHBzOi8vd3d3LnhpYW9ob25nc2h1LmNvbS9nb29kcy1kZXRhaWwvNjdiNDU0Njk5NzU5MjYwMDAxYTc3ODY5P2FwcHVpZD02MzQ3OGZhYzAwMDAwMDAwMTkwMWU5YWEiLCJsaXZlSW5mbyI6bnVsbCwic2hvcEluZm8iOm51bGwsImdvb2RzTm90ZUluZm8iOm51bGwsImNoYXRJbmZvIjpudWxsLCJzZWFyY2hJbmZvIjpudWxsLCJwcmVmZXIiOm51bGx9%26rn%3Dtrue&share_id=a54881c7b42d49c193724ee1abf2a600&share_channel=wechat";

// 匹配 goods-detail/ 后第一个问号前的所有字符
const regex = /goods-detail\/([^?]+)/; // 匹配 goods-detail/ 后第一个问号前的所有字符
// const regex = /goods-detail\/([^/]+)/; // 匹配 goods-detail/ 后第一个问号前的所有字符
const match = url.match(regex);
const goodsId = match ? match[1] : null;
console.log(goodsId); // 输出：67b454699759260001a77869

// https://pgy.xiaohongshu.com/microapp/selection/product-detail?itemId=64ecc482a7e68a00012a2ee8
// https://pgy.xiaohongshu.com/microapp/selection/product-detail?itemId=5fd9d7c679a6f51b4119ad28&planId=6554929c3ad9870001cbf51a&sellerId=59edd3f3bb06cd646a359227&planType=2
// const url = "https://pgy.xiaohongshu.com/microapp/selection/product-detail?itemId=5fd9d7c679a6f51b4119ad28&planId=6554929c3ad9870001cbf51a&sellerId=59edd3f3bb06cd646a359227&planType=2";
// const regex = /itemId=([^&]+)/; // 匹配 itemId= 后的所有字符
// const match = url.match(regex);
// const goodsId = match? match[1] : null;
// console.log(goodsId);

// 封装工具类，处理两种链接

// 同时查找product_id和skuIds
// { $or: [{product_id: '67b454699759260001a77869'}, {skuIds: {$in:['67b454699759260001a77869']}}] }
const goods = await this.goodsService._findOne(
    { $or: [{product_id: productId}, {skuIds: {$in:[productId]}}] }
);
if (goods) {
    product_id = goods.product_id;
}
