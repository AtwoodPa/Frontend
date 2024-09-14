import { sleep } from '../util';
import { Options, Context, CertPerm } from './../handler.interface';
import { For, Msg, Aim, ImportOrigin, PlatformOrigin, Platform } from '../enum';
import { BaseHandler } from "../by/by.product";
import { content2Background, patchFrom } from '../bridge';
export function getByHaohuoHandler(context: Context, options: Options) {
    if (For.回填基础数据 == options.forGaoqu) {
        return new HanhuoProductFillHandler(context, options);
    } else {
        return new HanhuoProductHandler(context, options);
    }
}

const extractor = {
    async parse(context: Context) {
        let { $bus } = context;
        let product_id = '';
        let detail_url = window.location.href;
        let match = window.location.search.match(/id=(\d*)&?/);
        if (match) {
            product_id = match[1];
        }
        let body = await $bus.subscribe(
            /shop\/promotion\/pack\/h5/,
            (rs: string) => {
                let body = $bus.parseBody(rs);
                return body;
            });
        let { promotion_h5, fallback_page } = body;
        if (fallback_page && fallback_page.show) {
            return {
                product_id,
                error: fallback_page.text || '商品不存在'
            }
        }
        let { basic_info_data, shop_info, comment_data, product_support_info_data } = promotion_h5;
        let { shop_name, shop_logo, shop_id } = shop_info.basic_info;
        let { title_info } = basic_info_data;
        let { title } = title_info;
        let { shop_extra_comment } = comment_data;
        if (shop_extra_comment) {
            let { title_bar } = shop_extra_comment;
            if (title_bar.link) {
                match = title_bar.link.match(/shop_id=(\d*)&?/);
                if (match) {
                    shop_id = match[1];
                }
            }
        }
        console.log("shop_id", shop_id);

        if (!shop_id && product_support_info_data) {
            let todoList = product_support_info_data.safety_content?.safety_popup_content;
            if (todoList) {
                todoList.forEach((todo: any) => {
                    let url: string = todo.url;
                    if (url) {
                        let find = url.split('&').find(item => item.indexOf('url=') == 0)
                        if (find) {
                            url = decodeURIComponent(find.replace('url=', ''));
                            console.log('shop_id', url);
                            if (url) {
                                find = url.split('&').find(item => item.indexOf('biz_params=') == 0)
                                if (find) {
                                    url = decodeURIComponent(find.replace('biz_params=', ''));
                                    console.log('shop_id', url);
                                    if (url) {
                                        try {
                                            let json = JSON.parse(url);
                                            shop_id = json.shop_id;
                                            console.log('shop_id', shop_id);
                                        } catch (e) {
                                            console.error(e)
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
            }
        }
        return {
            shop_id: `${shop_id}`, shop_name, shop_logo,
            title, product_id, detail_url
        }
    },
    async parseDom() {
        await sleep(2000);
        let images: string[] = []
        document.querySelectorAll('.head-figure__media-view__content').forEach((dom: any) => {
            let match = dom.style.backgroundImage.match(/url\("(.*)"\)/)
            if (match) {
                images.push(match[1]);
            }
        });
        let details: string[] = [];
        document.querySelectorAll('.product-big-img-list__every-img').forEach((dom: any) => {
            console.log('dom.src', dom.src)
            details.push(dom.src);
        })
        let cover = images[0]
        return { images, details, cover }
    }

}

class HanhuoProductFillHandler extends CertPerm {
    constructor(context: Context, options: Options) {
        super(context, options);
        this.doSomething();
    }
    async doSomething() {
        let { context, api } = this;
        let { $resolveComponent, $h } = context;
        context.renderFunctionMap.spin = function () {
            let Spin = $resolveComponent('Spin');
            let Modal = $resolveComponent('Modal');
            return $h(Modal, {
                modelValue: true,
                width: 360,
                footerHide: true,
                title: '商品信息'
            }, {
                default() {
                    return $h(Spin, { fix: true }, '提取中...');
                }
            })
        }

        let { error, shop_id, shop_name, shop_logo, title, product_id, detail_url } = await extractor.parse(this.context);
        if (error) {
            let { fromTabId, tag } = this.options;
            content2Background(
                patchFrom(
                    {
                        id: product_id,
                        toTabId: fromTabId,
                        error,
                        msg:
                            Msg.content通过background转发其他content发送给page,
                        aim: Aim.通知已补丁,
                        closeTab: true,
                    },
                    tag
                )
            );
        } else {
            let { images, details, cover } = await extractor.parseDom();
            let { code, data } = await api.goods.extensionPatch({
                product_id,
                shop_logo,
                images,
                details
            });
            if (code == 0) {
                let { fromTabId, tag } = this.options;
                content2Background(
                    patchFrom(
                        {
                            id: product_id,
                            toTabId: fromTabId,
                            modifiedCount: data?.modifiedCount,
                            msg:
                                Msg.content通过background转发其他content发送给page,
                            aim: Aim.通知已补丁,
                            closeTab: true,
                        },
                        tag
                    )
                );
            }
        }

    }
}
class HanhuoProductHandler extends BaseHandler {
    async _parse() {
        let { shop_id, shop_name, shop_logo, title, product_id, detail_url } = await extractor.parse(this.context);
        this._parseDom();
        Object.assign(this.reactive.shop, {
            platform: Platform.抖音,
            importOrigin: ImportOrigin.插件,
            platformOrigin: PlatformOrigin.好货,
            shop_id,
            shop_name,
            shop_image: shop_logo
        });
        Object.assign(this.reactive.goods, {
            platform: Platform.抖音,
            importOrigin: ImportOrigin.插件,
            platformOrigin: PlatformOrigin.好货,
            title,
            product_id,
            detail_url,
            from_url: window.location.href
        });
        return this.checkExists(shop_id, product_id);
    }

    async _parseDom() {
        let pack = await extractor.parseDom();
        Object.assign(this.reactive.goods, pack);
    }

}