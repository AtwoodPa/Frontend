import { Context, Options, CertPerm } from "../../handler/handler.interface";
import { Platform, ImportOrigin, PlatformOrigin } from "../enum";
import { formatDate, text2number } from "../util";
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

export class XhsProductHandler extends CertPerm {
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
        let match = window.location.href.match(/\/goods-detail\/([^?]*)/);
        if (match) {
            let itemId = decodeURIComponent(match[1]);
            let { template_data } = await $bus.subscribe(
                /jpd\/main/,
                (rs: string) => {
                    let body = $bus.parseBody(rs);
                    return body.data;
                });
            let { sellerH5, descriptionMain, carouselH5, priceH5, graphicDetailsV4 } = template_data[0];
            this.fillProduct(descriptionMain, carouselH5, priceH5, graphicDetailsV4);
            this.fillShop(sellerH5);
            this.checkExists(this.reactive.shop.shop_id, itemId, true)
        } else {
            $Notice.error({
                title: '遇到问题-_-!',
                desc: '未能解析商品id',
            });
        }
    }
    fillProduct(descriptionMain: any, carouselH5: any, priceH5: any, graphicDetailsV4: any) {
        let { name, itemId } = descriptionMain;
        let { images } = carouselH5;

        let { href } = window.location;
        let { highlightPrice } = priceH5;
        images = images.map((item: any) => item.url)
        Object.assign(this.reactive.goods, {
            aim_commission_rate: null,
            commission_rate: '',
            price: highlightPrice * 100,
            title: name,
            product_id: itemId, // 3508437079979869058
            cover: images[0], // 封面图 
            images: images, // 轮播图，感觉可以不要
            details: graphicDetailsV4.images.map((item: any) => item.url),
            detail_url: href,
            from_url: href,
            urgent: 0,
        });
    }
    fillShop(data: any) {
        // salesVolume 已售5661
        // sellerScore 4.73
        // fansAmount 粉丝数 6万
        // grade 4.5
        let { id, name, logo, salesVolume, sellerScore, fansAmount, grade } = data;
        Object.assign(this.reactive.shop, {
            shop_id: id,
            shop_name: name,
            shop_image: logo,
            // shopScore: sellerScore,
            saleQuantity: text2number(salesVolume.replace('已售', '').trim()),
            fansNum: text2number(fansAmount.replace('粉丝数', '').trim())
        })
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
                } = this.reactive.shop;
                params.shop = {
                    shop_name,
                    shop_image,
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
        let { $h, $reactive, $resolveComponent, $toRaw, $Message, $Notice, $Copy } = context;
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
                platformOrigin: PlatformOrigin.小红书,
                // corp_daren_count: null, // 月合作买手数
                // shopScore: null,
                // saleQuantity: null,
                // fansNum: null,
                // liveOverview: null,
                // categories: [],
                // wx: '',
                // phone: '',
                // person: ''
            },
            goods: {
                aim_commission_rate: null, // 谈判佣金率
                commission_rate: '', //团长佣金率 20   %
                // service_rate: '',   //二级团长服务费率 1.8  %
                price: null,   // 2990  -> 29.9 售价 单位分  
                title: '',
                product_id: "", // 3508437079979869058
                cover: '', // 封面图 
                images: [], // 轮播图，感觉可以不要
                details: [], //  商品详情
                detail_url: '',
                from_url: '',
                // product_highlights: '', //里面可能有联系方式
                urgent: 0,
                platform: Platform.小红书,
                importOrigin: ImportOrigin.插件,
                platformOrigin: PlatformOrigin.小红书,
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
                                modelValue: ['goodsImport', 'shop']
                            }, [
                                $h(Panel, { name: 'goodsImport' }, {
                                    content() {
                                        let todoList = [
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '价格'),
                                                $h('span', { class: 'value' }, {
                                                    default() {
                                                        return goods.price / 100 + '￥';;
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
                                                    goods.aim_commission_rate ? '' : $h('span', { class: classes.error }, `谈判佣金率必填`)
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
                                                                    copyRender(row.product_id), '/', row.title];
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
                                                            className: classes.clearPadding,
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
                                                $h('span', { class: 'label' }, '粉丝数'),
                                                $h(Numeral, { value: shop.fansNum, format: "0,0" })
                                            ]),
                                            $h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '已售'),
                                                $h(Numeral, { value: shop.saleQuantity, format: "0,0" })
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
                                                                className: classes.clearPadding,
                                                                minWidth: 130,
                                                                render(h: Function, { row }: any) {
                                                                    return [
                                                                        copyRender(row.shop_id), '/', row.shop_name];
                                                                }
                                                            },
                                                            {
                                                                title: '责任商务',
                                                                width: 100,
                                                                className: classes.clearPadding,
                                                                align: 'center',
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
                                })
                            ]),
                            $h('div', { class: classes.buttonContainer }, $h(Button, {
                                disabled: !checked,
                                long: true, loading: reactive.loading, type: 'primary', async onClick() {
                                    if (goods.aim_commission_rate) {
                                        if (goods.commission_rate && goods.aim_commission_rate < parseInt(goods.commission_rate)) {
                                            $Notice.error({ desc: '谈判佣金率不能低于' + goods.commission_rate + '%' })
                                        } else {
                                            reactive.loading = true;
                                            let params = {
                                                opId: userTabId.user.id,
                                                token: userTabId.user.token,
                                                shop: $toRaw(reactive.shop),
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
