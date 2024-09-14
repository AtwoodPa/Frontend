export interface ShopScore {
    deliveryScore: string;
    itemScore: string;
    replyRateScore: string;
    sellerScore: string;
}
export interface LiveOverview {
    live_cps_goods_cnt: number;
    live_cps_goods_sell_cnt: number;
    live_cps_per_price: number;
    live_cps_relation_cnt: number;
    max_age_portrait: string;
    max_age_portrait_rate: string;
    max_customer_portrait: string;
    max_customer_portrait_rate: string;
    max_gender_portrait: string; // 1 == 女
    max_gender_portrait_rate: string;
}
export interface Shop {
    shop_id: string;
    shop_name: string;
    shop_image: string;
    platform: number;
    importOrigin: number;
    platformOrigin: number;
    corp_daren_count: number; // 月合作买手数
    month_sale: number;

    //  百应用
    shop_exper_score: any;
    corp_captain_count: number;
    views: number;
    avt_commission_rate: string;
    avg_service_rate: string;

    shopScore: ShopScore;
    saleQuantity: number;
    fansNum: number;
    liveOverview: LiveOverview;
    wx: string;
    phone: string;
    person: string;
    categories: string[];
}
interface Day30 {
    buyerCount: number;
    saleCount: number;
    viewCount: number;
}

export interface Goods {
    aim_commission_rate: number;
    commission_rate: string;
    service_rate: string;
    price: number;
    title: string;
    product_id: string;
    cover: string;
    images: string[];
    details: string[];
    detail_url: string;
    from_url: string;
    product_highlights: string;
    urgent: number;
    platform: number;
    importOrigin: number;
    platformOrigin: number;
    day30: Day30;
}