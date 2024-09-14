import { formatDate } from '../util';
import { Options, CertPerm, Context } from './../handler.interface';
import { makeCss, Classes } from '../common/product.jss';
import { ImportOrigin, Platform, PlatformOrigin, Tag } from '../enum';
import { promotionProductStatusLabel, goodsImportStatusLabel, photo } from '../filter'
import { Shop, Goods } from '../common/interface';

interface Reactive {
    show: boolean;
    loading: boolean;
    shop: Shop;
    goods: Goods;
    checked: boolean;
    shopList: Shop[];
    goodsList: Goods[];
    goodsImportList: any[];
    memberMap: any;
}


export abstract class BaseHandler extends CertPerm {
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
    abstract _parse(): void;
    _css() {
        let { $jss } = this.context;
        let { classes } = makeCss($jss);
        this.classes = classes;
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
        let { context, _signOut, userTabId, classes, api, options, checkExists, copyRender } = this;
        let { $h, $reactive, $resolveComponent, $toRaw, $Message, $Notice } = context;
        let reactive: Reactive = $reactive({
            show: true,
            loading: false,
            shopList: [],
            goodsList: [],
            goodsImportList: [],
            memberMap: {},
            checked: false,
            shop: {
                shop_id: null,
                shop_name: '',
                shop_image: '',
                shop_exper_score: null
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
                urgent: 0
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
            const Table = $resolveComponent('Table');
            const Spin = $resolveComponent('Spin');
            const InputNumber = $resolveComponent('InputNumber');
            const Checkbox = $resolveComponent('Checkbox');
            const Result = $resolveComponent('Result');


            let { shopList, goodsImportList, shop, checked, goods, goodsList, memberMap } = reactive;
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
                                modelValue: ['shop', 'goods', 'goodsImport']
                            }, [
                                $h(Panel, { name: 'goodsImport' }, {
                                    content() {
                                        let todoList = [
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
                                                    goods.aim_commission_rate ? '' : $h('span', { class: classes.error }, `谈判佣金率必填` + (goods.commission_rate ? `,不能小于${goods.commission_rate}%` : ''))
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
                                        if (options.tag == Tag.ByProduct) {
                                            todoList.unshift($h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '价格/佣金率'),
                                                $h('span', { class: 'value' }, {
                                                    default() {
                                                        return goods.price / 100 + '￥/' + goods.commission_rate + '%';;
                                                    }
                                                })
                                            ]))
                                            todoList.push($h('div', { class: 'item' }, [
                                                $h('span', { class: 'label' }, '二级团长费率'),
                                                $h('span', { class: 'value' }, {
                                                    default() {
                                                        return goods.service_rate + '%'
                                                    }
                                                })
                                            ]),
                                                $h('div', { class: 'item' }, [
                                                    $h('span', { class: 'label' }, '介绍'),
                                                    $h('span', { class: 'value' }, {
                                                        default() {
                                                            return goods.product_highlights
                                                        }
                                                    })
                                                ]),)
                                        }
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
                                                            minWidth: 130,
                                                            className: classes.clearPadding,
                                                            render(h: Function, { row }: any) {
                                                                return [copyRender(row.product_id), '/', row.title];
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
                                                            className: classes.clearPadding,
                                                            width: 120,
                                                            align: 'center',
                                                            render(h: Function, { row }: any) {
                                                                return goodsImportStatusLabel(row.status);
                                                            }
                                                        },
                                                        {
                                                            title: '谈判人员',
                                                            className: classes.clearPadding,
                                                            width: 100,
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
                                                            className: classes.clearPadding,
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
                                $h(Panel, { name: 'goods' }, {
                                    content() {
                                        return $h(Table, {
                                            data: goodsList,
                                            size: 'small',
                                            columns: [
                                                {
                                                    type: 'index',
                                                    width: 30
                                                },
                                                {
                                                    title: '店铺',
                                                    // align: 'center',
                                                    className: classes.clearPadding,
                                                    minWidth: 110,
                                                    render(h: Function, { row }: any) {
                                                        return [copyRender(row.shop_id), '/', row.shop_name];
                                                    }
                                                },
                                                {
                                                    title: '活动',
                                                    // align: 'center',
                                                    className: classes.clearPadding,
                                                    minWidth: 110,
                                                    render(h: Function, { row }: any) {
                                                        return [row.activity_id, '/', row.activity_name];
                                                    }
                                                },
                                                {
                                                    title: '推广/商品状态',
                                                    // align: 'center',
                                                    className: classes.clearPadding,
                                                    width: 90,
                                                    render(h: Function, { row }: any) {
                                                        return promotionProductStatusLabel(row);
                                                    }
                                                },
                                                {
                                                    title: '推广时间',
                                                    align: 'center',
                                                    className: classes.clearPadding,
                                                    width: 80,
                                                    render(h: Function, { row }: any) {
                                                        // return [row.activity_start_time + '~' + row.activity_end_time, h('div', row.promotion_start_time + '~' + row.promotion_end_time)];
                                                        return [row.promotion_start_time, h('div', row.promotion_end_time)]
                                                    }
                                                },
                                                {
                                                    title: '佣金率',
                                                    align: 'center',
                                                    width: 60,
                                                    fixed: 'right',
                                                    render(h: Function, { row }: any) {
                                                        return [row.price / 100 + '￥', h('div', row.activity_cos_ratio / 100 + '%')];
                                                    }
                                                }
                                            ]
                                        })
                                    },
                                    default() {
                                        return '精选商品'
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
                                }),
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
                platform: Platform.抖音,
                shop_id,
                product_id
            }

            if (updateShop) {
                let {
                    shop_name,
                    shop_image,
                    shop_exper_score,
                    month_sale,
                    corp_daren_count,
                    corp_captain_count,
                    views,
                    avt_commission_rate,
                    avg_service_rate } = this.reactive.shop;
                params.shop = {
                    shop_name,
                    shop_image,
                    shop_exper_score,
                    month_sale,
                    corp_daren_count,
                    corp_captain_count,
                    views,
                    avt_commission_rate,
                    avg_service_rate
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
}
export class ByProductHandler extends BaseHandler {
    async _parse() {
        let { context } = this;
        let { $bus } = context;
        let pack = await $bus.subscribe(
            /get_captain_goods_detail/,
            (rs: string) => {
                let body = $bus.parseBody(rs);
                return body.data;
            })
        let { pc_product_detail, commission_rate, month_sale, corp_daren_count, corp_captain_count, views, service_rate, avt_commission_rate, avg_service_rate } = pack;
        let { shop_id, shop_name, shop_image, shop_exper_score, title, product_id, cover, images, big_imgs, detail_url, product_highlights, price } = pc_product_detail;
        shop_id = shop_id + '';
        Object.assign(this.reactive.shop, {
            platform: Platform.抖音,
            importOrigin: ImportOrigin.插件,
            platformOrigin: PlatformOrigin.百应,
            shop_id,
            shop_name,
            shop_image,
            shop_exper_score,
            month_sale,
            corp_daren_count,
            corp_captain_count,
            views,
            avt_commission_rate,
            avg_service_rate
        });
        Object.assign(this.reactive.goods, {
            platform: Platform.抖音,
            importOrigin: ImportOrigin.插件,
            platformOrigin: PlatformOrigin.百应,
            commission_rate,
            service_rate,
            title,
            product_id,
            cover,
            images,
            details: big_imgs,
            detail_url,
            product_highlights,
            price,
            from_url: window.location.href
        });
        return this.checkExists(shop_id, product_id, true);
    }

}

