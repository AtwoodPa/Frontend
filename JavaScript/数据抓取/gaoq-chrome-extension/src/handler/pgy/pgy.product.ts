import { Context, Options, CertPerm } from "../../handler/handler.interface";
import { Platform, ImportOrigin, PlatformOrigin } from "../enum";
import { formatDate, randomColor } from "../util";
import { Shop, Goods } from "../common/interface";
import { goodsImportStatusLabel, photo } from '../filter'
import { Classes, makeCss } from "../common/product.jss";
interface Reactive {
    show: boolean;
    loading: boolean;
    checked: boolean;
    updatedTime: string;
    exists: boolean;
    shop: Shop;
    goods: Goods;
    shopList: Shop[];
    goodsImportList: Goods[];
    memberMap: any;
}

export class PgyProductHandler extends CertPerm {
    reactive!: Reactive;
    classes!: Classes;
    constructor(context: Context, options: Options) {
        options.needInstallCertPem = true;
        super(context, options);
        this._init();
    }
    async _init() {
        this._css();
        await this._prepareUser();
        this._view();
        this._parse();
    }
    _css() {
        let { $jss } = this.context;
        let { classes } = makeCss($jss);
        this.classes = classes;
    }
    async _parse() {
        let { $bus, $Notice } = this.context;
        let match = window.location.search.match(/\?itemId=([^&]*)/);
        if (match) {
            let itemId = decodeURIComponent(match[1]);
            match = window.location.search.match(/\&sellerId=([^&]*)/);
            if (match) {
                let shop_id = decodeURIComponent(match[1]);
                let [itemBasic, itemData, itemImages, basicRs, intentionRs, dataRs, contactA, contactB] = await Promise.all([
                    $bus.subscribe(
                        /detail\/basic/,
                        (rs: string) => {
                            let body = $bus.parseBody(rs);
                            return body.data;
                        }),
                    $bus.subscribe(
                        /detail\/data/,
                        (rs: string) => {
                            let body = $bus.parseBody(rs);
                            return body.data;
                        }),
                    $bus.subscribe(
                        /detail\/images/,
                        (rs: string) => {
                            let body = $bus.parseBody(rs);
                            return body.data;
                        }),
                    this.api.ajax.get(`https://pgy.xiaohongshu.com/api/draco/selection-center/seller/detail/basic?seller_id=${shop_id}&pack_scense=6`),
                    this.api.ajax.get(`https://pgy.xiaohongshu.com/api/draco/selection-center/seller/detail/cooperation/intention?seller_id=${shop_id}`),
                    this.api.ajax.get(`https://pgy.xiaohongshu.com/api/draco/selection-center/seller/detail/data?seller_id=${shop_id}`),
                    this.api.ajax.get(`https://pgy.xiaohongshu.com/api/draco/selection-center/user/contact/info?seller_id=${shop_id}`),
                    this.api.ajax.post(`https://pgy.xiaohongshu.com/api/draco/selection-center/contact/info/query`, {
                        seller_id: shop_id,
                        source: "SELLER_CONTACT_INFO",
                        source_page: "/microapp/selection/product-detail"
                    })
                ]);
                this.fillProduct(itemBasic, itemData, itemImages);
                this.fillShop(basicRs.data, intentionRs.data, dataRs.data, contactA, contactB);
                this.checkExists(shop_id, itemId, true)
            } else {
                $Notice.error({
                    title: '遇到问题-_-!',
                    desc: '未能解析店铺id',
                });
            }
        }

    }
    fillProduct(basic: any, data: any, images: any) {
        let { planInfo, itemInfo } = basic.result_list[0];
        let { rate } = planInfo;
        let { itemShowSkuInfo, itemBasicInfo } = itemInfo;
        let { sku_infos } = images;
        let { sale_images } = sku_infos[0];
        let { itemId, itemImage, itemImages, itemTitle } = itemBasicInfo;
        let { finalPriceInfo } = itemShowSkuInfo;
        let { href } = window.location;
        Object.assign(this.reactive.goods, {
            aim_commission_rate: null,
            commission_rate: (rate / 100).toString(),
            price: Number(finalPriceInfo.finalPrice) * 100,
            title: itemTitle,
            product_id: itemId, // 3508437079979869058
            cover: itemImage, // 封面图 
            images: itemImages, // 轮播图，感觉可以不要
            details: sale_images.map((item: any) => item.link),
            detail_url: href,
            from_url: href,
            urgent: 0,
        });
        if (data) {
            let { total_cooperation_buyer_count, total_sale_count, total_view_count } = data;
            this.reactive.goods.day30 = {
                buyerCount: total_cooperation_buyer_count,
                saleCount: total_sale_count,
                viewCount: total_view_count
            }
        }
    }
    fillShop(basic: any, intention: any, data: any, contactA: any, contactB: any) {
        let { target_buyer } = intention || {};
        let { sellerId, sellerName, image, sellerDataInfo, sellerScore } = basic.result_list[0].sellerInfo;
        let { seller_overview_info } = data;
        let { seller_connection_info } = contactA.data;
        if (seller_connection_info) {
            let { tel, wechat, contact_person } = seller_connection_info;
            Object.assign(this.reactive.shop, {
                wx: wechat,
                phone: tel,
                person: contact_person
            })
        }
        let { contact_info } = contactB.data;
        if (contact_info) {
            let { tel, wechat } = contact_info;
            Object.assign(this.reactive.shop, {
                wx: wechat,
                phone: tel,
            })
        }
        Object.assign(this.reactive.shop, {
            shop_id: sellerId,
            shop_name: sellerName,
            shop_image: image,
            shopScore: sellerScore,
            liveOverview: seller_overview_info,
            categories: target_buyer ? target_buyer.content_categorys || [] : []
        })
        if (sellerDataInfo) {
            let { distributorNum30d, fansNum, saleQuantity } = sellerDataInfo;
            Object.assign(this.reactive.shop, {
                corp_daren_count: distributorNum30d,
                fansNum,
                saleQuantity
            })
        }
    }
    _afterLogin() {
        let { checked, shop, goods } = this.reactive;
        if (!checked) {
            let { shop_id } = shop;
            let { product_id } = goods;
            if (shop_id && product_id) {
                this.checkExists(shop_id, product_id, true);
            }
        }
    }
    checkExists = async (shop_id: string, product_id: string, updateShop: boolean = false) => {
        let { user } = this.userTabId;
        if (user) {
            let params: any = {
                opId: user.id,
                token: user.token,
                platform: Platform.小红书,
                shop_id,
                product_id
            }

            if (updateShop) {
                let {
                    shop_name,
                    shop_image,
                    corp_daren_count,
                    shopScore,
                    saleQuantity,
                    fansNum,
                    liveOverview,
                    categories,
                    wx,
                    phone,
                    person } = this.reactive.shop;
                params.shop = {
                    shop_name,
                    shop_image,
                    corp_daren_count,
                    shopScore,
                    saleQuantity,
                    fansNum,
                    liveOverview,
                    categories,
                    person
                }
                if (wx && !wx.includes('**')) {
                    params.shop.wx = wx;
                }
                if (phone && !phone.includes('**')) {
                    params.shop.phone = phone;
                }
            }
            let { code, data } = await this.api.goodsImport.checkExists(params);
            if (code == 0) {
                let { memberList, ...others } = data;
                let memberMap: any = {}
                memberList.forEach((item: any) => {
                    memberMap[item.id] = item;
                })
                Object.assign(this.reactive, {
                    ...others,
                    memberMap
                });
                this.reactive.checked = true;
            }
            return data;
        }
    }
    copyRender = (text: string) => {
        let { $h, $Copy } = this.context;
        return $h('span', {
            class: this.classes.hoverPrimary, onClick() {
                $Copy({
                    text,
                    successTip: '已复制:' + text
                })
            }
        }, text)
    }
    _view() {
        let { context, _signOut, userTabId, classes, api, checkExists, copyRender } = this;
        let { $h, $reactive, $resolveComponent, $toRaw, $Message, $Notice } = context;
        let reactive: Reactive = $reactive({
            show: true,
            loading: false,
            checked: false,
            exists: false,
            shopList: [],
            goodsImportList: [],
            memberMap: {},
            updatedTime: '',
            shop: {
                shop_id: '',
                shop_name: '',
                shop_image: '',
                platform: Platform.小红书,
                importOrigin: ImportOrigin.插件,
                platformOrigin: PlatformOrigin.蒲公英,
                corp_daren_count: null, // 月合作买手数
                shopScore: null,
                saleQuantity: null,
                fansNum: null,
                liveOverview: null,
                categories: [],
                wx: '',
                phone: '',
                person: ''
            },
            goods: {
                aim_commission_rate: null, // 谈判佣金率
                commission_rate: '', //团长佣金率 20   %
                service_rate: '',   //二级团长服务费率 1.8  %
                price: null,   // 2990  -> 29.9 售价 单位分  
                title: '',
                product_id: "", // 3508437079979869058
                cover: '', // 封面图 
                images: [], // 轮播图，感觉可以不要
                details: [], //  商品详情
                detail_url: '',
                from_url: '',
                product_highlights: '', //里面可能有联系方式
                urgent: 0,
                platform: Platform.小红书,
                importOrigin: ImportOrigin.插件,
                platformOrigin: PlatformOrigin.蒲公英,
            }
        })
        this.reactive = reactive;
        context.renderFunctionMap.door = function () {
            return reactive.show ? null : $h('img', {
                src: context.src, class: classes.trigger, onClick() {
                    reactive.show = true;
                }
            })
        }
        context.renderFunctionMap.drawer = function () {
            const Drawer = $resolveComponent('Drawer');
            const Icon = $resolveComponent('Icon');
            const Collapse = $resolveComponent('Collapse');
            const Panel = $resolveComponent('Panel');
            const Image = $resolveComponent('Image');
            const Button = $resolveComponent('Button');
            const Spin = $resolveComponent('Spin');
            const Tag = $resolveComponent('Tag');
            const Table = $resolveComponent('Table');
            const InputNumber = $resolveComponent('InputNumber');
            const Checkbox = $resolveComponent('Checkbox');
            const Result = $resolveComponent('Result');
            const Numeral = $resolveComponent('Numeral');

            let { shop, goods, checked, shopList, goodsImportList, memberMap } = reactive;
            let shopCount = shopList.length;
            return $h(Drawer, {
                width: 500,
                mask: false, modelValue: reactive.show, 'onUpdate:modelValue'(value: boolean) {
                    reactive.show = value;
                }
            }, {
                header() {
                    let todoList = [$h('img', { src: context.src/*'https://cdn.red.gaoq.com/resource/logo.png'*/, class: classes.gaoqu })]
                    if (userTabId.user) {
                        todoList.push(userTabId.user.name + '(' + userTabId.user.id + ')')
                        todoList.push($h('span', {
                            onClick: _signOut
                        },
                            [
                                $h(Icon, { type: 'md-exit', size: 13 }),
                                '登出'
                            ]))
                    } else if (userTabId.tabId) {
                        todoList.push($h('a', { href: userTabId.href, target: '_blank' }, [
                            $h(Icon, { type: 'md-contact', size: 13 }),
                            '登录'
                        ]))
                    }
                    return todoList;
                },
                default() {
                    if (userTabId.user) {
                        let todoList = [
                            $h(Collapse, {
                                modelValue: ['goodsImport', 'shop', 'live']
                            }, [
                                $h(Panel, { name: 'goodsImport' }, {
                                    content() {
                                        let todoList = [
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '价格/佣金率'),
                                                $h('span', { class: 'value' }, {
                                                    default() {
                                                        return goods.price / 100 + '￥/' + goods.commission_rate + '%';;
                                                    }
                                                })
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '谈判佣金率*'),
                                                $h('span', { class: 'value' }, [
                                                    $h(InputNumber, {
                                                        max: 100,
                                                        min: 0,
                                                        // min: goods.commission_rate ? parseInt(goods.commission_rate) + 1 : 1,
                                                        size: 'small',
                                                        modelValue: goods.aim_commission_rate,
                                                        'onUpdate:modelValue': (value: any) => { goods.aim_commission_rate = +value; },
                                                    }),
                                                    '%',
                                                    goods.aim_commission_rate ? '' : $h('span', { class: classes.error }, `谈判佣金率必填,不能小于${goods.commission_rate}%`)
                                                ]
                                                )
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '是否加急'),
                                                $h(Checkbox, {
                                                    trueValue: 1,
                                                    falseValue: 0,
                                                    class: 'value',
                                                    size: 'small',
                                                    modelValue: goods.urgent,
                                                    'onUpdate:modelValue': (value: any) => {
                                                        goods.urgent = value;
                                                    },
                                                }, '加急'),
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, 'ID'),
                                                copyRender(goods.product_id)
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '名称'),
                                                $h('span', { class: 'value' }, {
                                                    default() {
                                                        return goods.title;
                                                    }
                                                })
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '封面'),
                                                goods.cover ? $h(Image, { src: goods.cover, fit: "contain", preview: true, previewList: goods.details, class: classes.img }) : ''
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '链接'),
                                                $h('span', { class: 'value' }, {
                                                    default() {
                                                        return goods.detail_url;
                                                    }
                                                })
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '来源'),
                                                $h('span', { class: 'value' }, {
                                                    default() {
                                                        return goods.from_url;
                                                    }
                                                })
                                            ]),
                                        ]
                                        if (goodsImportList.length > 0) {
                                            todoList.unshift(
                                                $h(Table, {
                                                    data: goodsImportList,
                                                    size: 'small', columns: [
                                                        {
                                                            type: 'index',
                                                            width: 30
                                                        },
                                                        {
                                                            title: '商品',
                                                            className: classes.clearPadding,
                                                            minWidth: 130,
                                                            render(h: Function, { row }: any) {
                                                                return [
                                                                    copyRender(row.product_id)
                                                                    , '/', row.title];
                                                            }
                                                        },
                                                        // {
                                                        //     title: '店铺',
                                                        //     width: 130,
                                                        //     render(h: Function, { row }: any) {
                                                        //         return [row.shop_id, '/', row.shop_name];
                                                        //     }
                                                        // },
                                                        {
                                                            title: '谈判佣金率',
                                                            width: 70,
                                                            align: 'center',
                                                            fixed: 'right',
                                                            render(h: Function, { row }: any) {
                                                                return [(row.commission_rate || 0) + '%', '/', h('span', { class: classes.success }, row.aim_commission_rate + '%')];
                                                            }
                                                        },
                                                        {
                                                            title: '谈判状态',
                                                            width: 70,
                                                            className: classes.clearPadding,
                                                            align: 'center',
                                                            render(h: Function, { row }: any) {
                                                                return goodsImportStatusLabel(row.status);
                                                            }
                                                        },
                                                        {
                                                            title: '谈判人员',
                                                            width: 80,
                                                            className: classes.clearPadding,
                                                            align: 'center',
                                                            render(h: Function, { row }: any) {
                                                                let member = memberMap[row.zsOpId];
                                                                return member ? h('div', { class: classes.photoFlex }, [
                                                                    h('img', { src: photo(member.photo), class: 'photo' }),
                                                                    member.name
                                                                ])
                                                                    : ''
                                                            }
                                                        },
                                                        {
                                                            title: '入库时间',
                                                            width: 120,
                                                            align: 'center',
                                                            render(h: Function, { row }: any) {
                                                                return formatDate(new Date(row.createdAt));
                                                            }
                                                        }
                                                    ]
                                                }))
                                        }
                                        return $h('div', { class: classes.flexContainer }, todoList)
                                    },
                                    default() {
                                        return ['谈判商品',
                                            $h('span', { class: goodsImportList.length > 0 ? classes.info : classes.success }, goodsImportList.length > 0 ? `已存在${goodsImportList.length}个相同谈判商品` : '')
                                        ]
                                    }
                                }),
                                $h(Panel, { name: 'shop' }, {
                                    content() {
                                        let todoList = [
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, 'ID'),
                                                copyRender(shop.shop_id)
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '名称'),
                                                $h('span', { class: 'value' }, {
                                                    default() {
                                                        return shop.shop_name;
                                                    }
                                                })
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, 'Logo'),
                                                shop.shop_image ? $h(Image, { src: shop.shop_image, fit: "contain", preview: true, class: classes.img }) : ''
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '内容类目'),
                                                shop.categories.map(category => $h(Tag, { color: randomColor(), size: 'small' }, category))
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '联系人'),
                                                $h('span', { class: 'value' }, {
                                                    default() {
                                                        return shop.person;
                                                    }
                                                })
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '手机号'),
                                                $h('span', { class: 'value' }, {
                                                    default() {
                                                        return shop.phone;
                                                    }
                                                })
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '微信'),
                                                $h('span', { class: 'value' }, {
                                                    default() {
                                                        return shop.wx;
                                                    }
                                                })
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '月合作达人数'),
                                                $h('span', { class: 'value' }, {
                                                    default() {
                                                        return shop.corp_daren_count;
                                                    }
                                                })
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '粉丝数'),
                                                $h(Numeral, { value: shop.fansNum, format: "0,0" })
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '已售'),
                                                $h(Numeral, { value: shop.saleQuantity, format: "0,0" })
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '评分'),
                                                $h('span', { class: 'value' }, {
                                                    default() {
                                                        if (shop.shopScore) {
                                                            let { sellerScore, itemScore, replyRateScore, deliveryScore } = shop.shopScore;
                                                            return `店铺:${sellerScore || '...'}, 商品:${itemScore || '...'}, 咨询:${replyRateScore || '...'}, 物流:${deliveryScore || '...'}`
                                                        }
                                                        return '';
                                                    }
                                                })
                                            ]),
                                        ];
                                        if (checked) {
                                            if (shopCount > 0) {
                                                todoList.unshift(
                                                    $h(Table, {
                                                        data: shopList,
                                                        size: 'small', columns: [
                                                            {
                                                                type: 'index',
                                                                width: 30
                                                            },
                                                            {
                                                                title: '店铺',
                                                                minWidth: 130,
                                                                className: classes.clearPadding,
                                                                render(h: Function, { row }: any) {
                                                                    return [
                                                                        copyRender(row.shop_id), '/', row.shop_name];
                                                                }
                                                            },
                                                            {
                                                                title: '责任商务',
                                                                width: 100,
                                                                align: 'center',
                                                                className: classes.clearPadding,
                                                                render(h: Function, { row }: any) {
                                                                    let member = memberMap[row.zsOpId];
                                                                    return member ? $h('div', { class: classes.photoFlex }, [
                                                                        $h('img', { src: photo(member.photo), class: 'photo' }),
                                                                        member.name
                                                                    ])
                                                                        : ''
                                                                }
                                                            },
                                                            {
                                                                title: '入库时间',
                                                                width: 120,
                                                                className: classes.clearPadding,
                                                                align: 'center',
                                                                render(h: Function, { row }: any) {
                                                                    return formatDate(new Date(row.createdAt));
                                                                }
                                                            }
                                                        ]
                                                    }))
                                            }
                                        }
                                        return $h('div', { class: classes.flexContainer }, todoList)
                                    },
                                    default() {
                                        return ['店铺',
                                            $h('span', { class: shopCount > 0 ? classes.info : classes.success }, shopCount > 0 ? `已存在${shopCount}个相同店铺` : '可入库')
                                        ]
                                    }
                                }),
                                $h(Panel, { name: 'live' }, {
                                    content() {
                                        let todoList: any = []
                                        if (shop.liveOverview) {
                                            let {
                                                live_cps_goods_cnt,
                                                live_cps_goods_sell_cnt,
                                                live_cps_per_price,
                                                live_cps_relation_cnt,
                                                max_age_portrait,
                                                max_age_portrait_rate,
                                                max_customer_portrait,
                                                max_customer_portrait_rate,
                                                max_gender_portrait,
                                                max_gender_portrait_rate
                                            } = shop.liveOverview;
                                            todoList.push(
                                                $h('div', { class: 'item' }, [
                                                    $h('span', { class: 'label' }, '直播销量'),
                                                    $h(Numeral, { value: live_cps_goods_sell_cnt, format: "0,0" })
                                                ]),
                                                $h('div', { class: 'item' }, [
                                                    $h('span', { class: 'label' }, '直播客单价'),
                                                    $h(Numeral, { value: live_cps_per_price, format: "0,0.00" })
                                                ]),
                                                $h('div', { class: 'item' }, [
                                                    $h('span', { class: 'label' }, '直播商品数'),
                                                    $h(Numeral, { value: live_cps_goods_cnt, format: "0,0" })
                                                ]),
                                                $h('div', { class: 'item' }, [
                                                    $h('span', { class: 'label' }, '用户下单人群'),
                                                    $h('span', { class: 'value' }, {
                                                        default() {
                                                            return (Number(max_customer_portrait_rate) * 100).toFixed(2) + '%' + max_customer_portrait;
                                                        }
                                                    })
                                                ]),
                                                $h('div', { class: 'item' }, [
                                                    $h('span', { class: 'label' }, '年龄'),
                                                    $h('span', { class: 'value' }, {
                                                        default() {
                                                            return (Number(max_age_portrait_rate) * 100).toFixed(2) + '%' + max_age_portrait;
                                                        }
                                                    })
                                                ]),
                                                $h('div', { class: 'item' }, [
                                                    $h('span', { class: 'label' }, '性别'),
                                                    $h('span', { class: 'value' }, {
                                                        default() {
                                                            return (Number(max_gender_portrait_rate) * 100).toFixed(2) + '%' + ('1' == max_gender_portrait ? '女' : '男');
                                                        }
                                                    })
                                                ]),
                                                $h('div', { class: 'item' }, [
                                                    $h('span', { class: 'label' }, '关联直播数'),
                                                    $h('span', { class: 'value' }, {
                                                        default() {
                                                            return live_cps_relation_cnt
                                                        }
                                                    })
                                                ]),

                                            );
                                        }

                                        return $h('div', { class: classes.flexContainer }, todoList)
                                    },
                                    default() {
                                        return '30天商家数据'
                                    }
                                })
                            ]),
                            $h('div', { class: classes.buttonContainer }, $h(Button, {
                                disabled: !checked,
                                long: true, loading: reactive.loading, type: 'primary', async onClick() {
                                    if (goods.aim_commission_rate) {
                                        if (goods.commission_rate && goods.aim_commission_rate < parseInt(goods.commission_rate)) {
                                            $Notice.error({ desc: '谈判佣金率不能低于' + goods.commission_rate + '%' })
                                        } else {
                                            let shop = $toRaw(reactive.shop);
                                            if (shop.wx && shop.wx.includes('**')) {
                                                delete shop.wx;
                                            }
                                            if (shop.phone && shop.phone.includes('**')) {
                                                delete shop.phone;
                                            }
                                            reactive.loading = true;
                                            let params = {
                                                opId: userTabId.user.id,
                                                token: userTabId.user.token,
                                                shop,
                                                goods: $toRaw(goods)
                                            }
                                            let { code, data } = await api.goodsImport.import(params)
                                            if (code == 0) {
                                                if (data > 0) {
                                                    $Notice.error({
                                                        title: '无需创建谈判商品',
                                                        desc: '已存在相同的佣金率'
                                                    })
                                                } else {
                                                    $Message.success('成功创建商品谈判')
                                                }
                                            }
                                            reactive.loading = false;
                                            checkExists(shop.shop_id, goods.product_id)
                                        }

                                    } else {
                                        $Notice.error({ desc: '请先填写谈判佣金率' })
                                    }
                                }
                            }, (shopCount < 1 ? '入库' : '更新') + '店铺并创建商品谈判' + (goods.aim_commission_rate ? goods.aim_commission_rate + '%' : '')))
                        ]
                        if (!checked) {
                            todoList.push($h(Spin, { fix: true }))
                        }
                        return todoList;
                    } else {
                        return $h(Result, { type: 'warning', title: '请先登录', class: classes.marginTop }, {
                            actions() {
                                return $h(Button, {
                                    type: 'success', onClick() {
                                        window.open(userTabId.href, '_blank')
                                    }
                                }, '马上登录')
                            }
                        })
                    }
                }
            })
        }
    }

}
