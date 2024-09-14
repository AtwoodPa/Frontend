import { content2Background } from "./bridge";
import { ByProductHandler } from "./by/by.product";
import { getByHaohuoHandler } from './haohuo/haohuo.product';
import { getPgySearchHandler } from "./pgy/pgy.search";
import { PgyResourceHandler } from "./pgy/pgy.resource";
import { PgyProductHandler } from "./pgy/pgy.product";
import { XtResourceHandler } from "./xt/xt.resource";
import { getXtSearchHandler } from "./xt/xt.search";
import { ByResourceHandler } from "./by/by.resource";
import { getBySearchHandler } from "./by/by.search";
import { DyResourceHandler } from "./douyin/douyin.resource";
import { Grab, Tag, Aim, Msg } from "./enum";
import { GaoquIndexHandler } from "./gaoqu/gaoqu";
import { PopupHandler } from "./popup/popup.html";
import { getXhsResourceHandler } from "./xhs/xhs.resource";
import { XhsSearchHandler } from "./xhs/xhs.search";
import { XhsProductHandler } from "./xhs/xhs.product";
import { PgyCookieWatcher } from './pgy/pgy.cookie.watcher'
import { Context, Options } from "./handler.interface";
console.log("12345abcde");// 不能删除分割代码
export default function (version: string) {
    let whiteList = [
        'api/solar/user/info',
        'api/contact/contact_info',
        'api/author/get_author_base_info',
        'api/author/get_author_marketing_info',
        'api/author/get_author_platform_channel_info_v2',
        'api/authorStatData/authorProfile',
        'homePage/author/profile',
        'api/solar/cooperator/user/blogger',
        'api/authorStatData/salesAnalyseV2',
        "solar/cooperator/blogger/v2",
        'api/solar/cooperator/content/tag_tree',
        'api/solar/kol/get_select_kol_tags_config_v2',
        'api/user/author_options',
        'api/data_sp/author_video_distribution',
        'api/data_sp/get_author_spread_info',
        'api/data_sp/author_link_struct',
        'api/solar/kol/dataV3/dataSummary',
        'api/data_sp/author_touch_distribution',
        'draco/distributor-square/distributor/cooperative',
        'api/solar/kol/dataV2/notesDetail',
        'api/solar/kol/dataV3/notesRate',
        'api/data_sp/author_audience_distribution',
        "api/draco/selection-center/seller/detail/basic",
        "api/draco/selection-center/seller/detail/data",
        "api/draco/selection-center/seller/detail/cooperation/intention",
        "api/draco/selection-center/item/detail/basic",
        "api/draco/selection-center/item/detail/data",
        "api/draco/selection-center/item/detail/images",
        "api/store/jpd/main",
        'api/authorStatData/authorOverviewV2',
        'authorStatData/authorFansV2',
        'authorStatData/sellProduct',
        'api/data_sp/get_author_link_info',
        'square_pc_api/common/square/squareConf',
        'getOtherData', // 星图主数据 获取已抓获的额外数据
        'api/authorStatData/seekAuthor',
        'gsearch/search_for_author_square',
        'publishMediaIdAnduid', // 星图其他数据 获取mediaId
        'api/gauthor/author_get_business_card_info',
        'captain_goods_pool/get_captain_goods_detail',
        'shop/promotion/pack/h5/',
        "v2/user/me",
        "www.douyin.com/user/",
        "api/demander/grade_info",
        "api/solar/user/info"
    ]
    // 当whiteList发生变化了，则打开下面代码
    let whiteListChanged = false;
    if (whiteListChanged) {
        let reloadKey = 'whiteListChanged.' + version;
        chrome.storage.local.get({ reloadKey }).then(rs => {
            if (rs.reloadKey) {
                // 说明reload过了，whiteList已经生效了
            } else {
                chrome.storage.local.set({
                    reloadKey
                }, function () {
                    console.log(`chrome.storage.local.set ${reloadKey} callback`);
                    window.location.reload()
                });
            }
        });
    }

    chrome.storage.local.set({
        whiteList
    }, function () {
        console.log('chrome.storage.local.set whiteList callback', whiteList.length, chrome.runtime.lastError)
    });
    console.log('chrome.storage.local.set done', version, whiteList.length)
    let { href } = window.location;
    let useSdkGlue = href.indexOf('buyin.jinritemai') > -1 || href.indexOf('www.douyin.com') > -1
    if (useSdkGlue) {
        content2Background(
            {
                title: '告趣',
                message: '缓存文件已清理',
                msg: Msg.content发送给background,
                aim: Aim.清理缓存,
                options: { origins: ["https://lf-c-flwb.bytetos.com", "https://lf-headquarters-speed.yhgfb-cn-static.com"] },
                dataSet: {
                    cache: true,
                    cacheStorage: true,
                    fileSystems: true,
                }
            }
        );
    }

    let options: Options = { version, tag: Tag.Empty };
    let match = href.match(/[&?]grab=(\d*)/);
    options.grab = match ? +match[1] : Grab.尽量抓取额外数据;
    match = href.match(/[&?]fromTabId=(\d*)/);
    options.fromTabId = match ? +match[1] : 0;
    match = href.match(/[?&]gaoqId=(\d*)/);
    options.gaoqId = match ? +match[1] : 0;
    match = href.match(/[?&%26]forGaoqu=(\d*)/);
    options.forGaoqu = match ? +match[1] : 0;
    match = href.match(/[?&]forDebug=(\d*)/);
    options.forDebug = match ? +match[1] : 0;
    match = href.match(/[?&]fromId=([a-z\d]*)/);
    options.fromId = match ? match[1] : 0;
    match = href.match(/[?&]closeTabIds=([\d,]*)/);
    options.closeTabIds = match ? match[1].split(',').map(item => parseInt(item)) : [];
    match = window.location.search.match(/\?keyword=([^&]*)/);
    options.keyword = match ? decodeURIComponent(match[1]) : 0;
    match = window.location.search.match(/[&?]name=([^&]*)/)
    options.name = match ? decodeURIComponent(match[1]) : 0;

    let context: Context = window['_context']
    console.log('context', context, options, href)
    // chrome-extension://adgdpkfmjcopkackgpghlpjboimlkinh/popup.html
    if (/chrome-extension:\/\/.*\/popup\.html/.test(href)) {
        options.tag = Tag.Popup;
        return new PopupHandler(context, options);
    }
    else if (/http:\/\/op\.gaoq\.com\//.test(
        href
    ) ||
        /http:\/\/localhost:8088\//.test(href)) {
        options.tag = Tag.OP;
        return new GaoquIndexHandler(context, options);
    } else if (/https:\/\/www\.douyin\.com\/user\//.test(href)) {
        options.tag = Tag.Dy;
        return new DyResourceHandler(context, options);
    } else if (/https:\/\/www\.xiaohongshu\.com\/search_result/.test(href)) {
        options.tag = Tag.XhsSearch;
        return new XhsSearchHandler(context, options);
    } else if (/https:\/\/www\.xiaohongshu\.com\/goods-detail/.test(href)) {
        options.tag = Tag.XhsProduct;
        return new XhsProductHandler(context, options);
    } else if (
        /https:\/\/www\.xiaohongshu\.com\/user\/profile/.test(href)
    ) {
        options.tag = Tag.Xhs;
        return getXhsResourceHandler(context, options);
    } else if (/https:\/\/pgy\.xiaohongshu\.com/.test(href)) {
        new PgyCookieWatcher(context, options);
        if (/solar\/pre-trade\/blogger-detail\//.test(href)) {
            options.tag = Tag.Pgy;
            return new PgyResourceHandler(context, options);
        } else if (/solar\/pre-trade\/note\/kol/.test(href)) {
            options.tag = Tag.PgySearch;
            return getPgySearchHandler(context, options);
        } else if (/microapp\/selection\/product-detail/.test(href)) {
            options.tag = Tag.PgyProduct;
            return new PgyProductHandler(context, options);
        }
    } else if (/https:\/\/www\.xingtu\.cn\/ad\/creator\/author\/douyin/.test(href)) {
        options.tag = Tag.Xt;
        return new XtResourceHandler(context, options);
    } else if (
        /https:\/\/buyin\.jinritemai\.com\/dashboard\/servicehall\/daren-profile/.test(
            href
        )
    ) {
        options.tag = Tag.ByResource;
        return new ByResourceHandler(context, options);
    } else if (
        /https:\/\/buyin\.jinritemai\.com\/dashboard\/servicehall\/daren-square/.test(
            href
        )
    ) {
        options.tag = Tag.BySearch;
        return getBySearchHandler(context, options);
    } else if (/https:\/\/haohuo\.jinritemai\.com\/ecommerce\/trade\/detail/.test(href)) {
        options.tag = Tag.ByProductHaohuo;
        return getByHaohuoHandler(context, options);
    } else if (/https:\/\/buyin\.jinritemai\.com\/dashboard\/goodsCooperation/.test(href)) {
        debugger;
        options.tag = Tag.ByProduct;
        return new ByProductHandler(context, options);
    } else if (/https:\/\/www\.xingtu\.cn\/ad\/creator\/market/.test(href)) {
        options.tag = Tag.XtSearch;
        return getXtSearchHandler(context, options);
    }
    // else if (/https:\/\/pgy\.xiaohongshu\.com\/microapp\/selection\/shop-detail/.test(href)) {
    //     return new PgyShopHandler(context, options);
    // }
}