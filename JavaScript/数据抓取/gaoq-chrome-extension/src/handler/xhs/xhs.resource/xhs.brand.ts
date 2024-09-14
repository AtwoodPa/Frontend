import { CertPerm, Context, Options } from "../../handler.interface";
import { makeCss, Classes } from "./xhs.brand.jss";
import { Msg, Aim } from "../../enum";
import { content2Background, patchFrom } from "../../bridge";
import { extractor } from "./index";
interface Brand {
    id: number;
    name: string;
}
interface Form {
    photo: string;
    uid: string;
    name: string;
    mediaId: string;
    origin: string;
    platform: string;
    fanCount: number;
    greatCount: number;
    site: string;
    introduce: string;
}
interface Reactive {
    show: boolean;
    brand: Brand;
    form: Form;
    loading: boolean;
}
export class XhsBrandHandler extends CertPerm {
    classes!: Classes;
    reactive!: Reactive;
    constructor(context: Context, options: Options) {
        super(context, options);
        this.init();
    }
    async init() {
        this.css();
        await this._prepareUser();
        this.view();
        this.parse();
        this.prepareXhsBindBrand();
    }
    css() {
        let { $jss } = this.context;
        let { classes } = makeCss($jss);
        this.classes = classes;
    }
    _afterLogin(): void {
        this.prepareXhsBindBrand();
    }
    parse() {
        let data = extractor.parser();
        data.version = this.options.version;
        this.reactive.form = data;
    }
    async prepareXhsBindBrand() {
        if (this.userTabId.user) {
            let { code, data } = await this.api.brand.fetch({
                brandId: this.options.gaoqId,
                opId: this.userTabId.user.id,
                token: this.userTabId.user.token
            });
            if (code == 0) {
                this.reactive.brand = data;
            }
        }
    }
    view() {
        let { context, _signOut, userTabId, classes, api, options } = this;
        let { $h, $reactive, $resolveComponent, $toRaw, $Modal, $Notice } = context;
        let reactive: Reactive = $reactive({
            show: true,
            loading: false,
            brand: {
                id: null,
                name: '',
            },
            form: {
                photo: '',
                uid: '',
                name: '',
                mediaId: '',
                origin: '',
                platform: '',
                fanCount: 0,
                greatCount: 0,
                site: '',
                introduce: '',
                version: ''
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
                    let todoList = [
                        $h(Collapse, {
                            modelValue: ['brand', 'form']
                        }, [
                            $h(Panel, { name: 'brand' }, {
                                content() {
                                    let todoList = [
                                        $h('div', { class: 'item' }, [
                                            $h('span', { class: 'label' }, 'ID'),
                                            $h('span', { class: 'value' }, {
                                                default() {
                                                    return reactive.brand.id;
                                                }
                                            })
                                        ]),
                                        $h('div', { class: 'item' }, [
                                            $h('span', { class: 'label' }, '名称'),
                                            $h('span', { class: 'value' }, {
                                                default() {
                                                    return reactive.brand.name;
                                                }
                                            })
                                        ])
                                    ];

                                    return $h('div', { class: classes.flexContainer }, todoList)
                                },
                                default() {
                                    return 'OP品牌'
                                }
                            }),
                            $h(Panel, { name: 'form' }, {
                                content() {
                                    let todoList = [
                                        $h('div', { class: 'item' }, [
                                            $h('span', { class: 'label' }, 'Logo'),
                                            reactive.form.photo ? $h(Image, { src: reactive.form.photo, fit: "contain", width: '200px' }) : ''
                                        ]),
                                        $h('div', { class: 'item' }, [
                                            $h('span', { class: 'label' }, 'UID'),
                                            $h('span', { class: 'value' }, {
                                                default() {
                                                    return reactive.form.uid
                                                }
                                            })
                                        ]),
                                        $h('div', { class: 'item' }, [
                                            $h('span', { class: 'label' }, '媒体ID'),
                                            $h('span', { class: 'value' }, {
                                                default() {
                                                    return reactive.form.mediaId;
                                                }
                                            })
                                        ]),
                                        $h('div', { class: 'item' }, [
                                            $h('span', { class: 'label' }, '名称'),
                                            $h('span', { class: 'value' }, {
                                                default() {
                                                    return reactive.form.name;
                                                }
                                            })
                                        ]),
                                        $h('div', { class: 'item' }, [
                                            $h('span', { class: 'label' }, '链接'),
                                            $h('span', { class: 'value' }, {
                                                default() {
                                                    return reactive.form.site;
                                                }
                                            })
                                        ]),
                                        // $h('div', { class: 'item' }, [
                                        //     $h('span', { class: 'label' }, '来源'),
                                        //     $h('span', { class: 'value' }, {
                                        //         default() {
                                        //             return reactive.form.origin;
                                        //         }
                                        //     })
                                        // ]),
                                        $h('div', { class: 'item' }, [
                                            $h('span', { class: 'label' }, '平台'),
                                            $h('span', { class: 'value' }, {
                                                default() {
                                                    return reactive.form.platform;
                                                }
                                            })
                                        ]),
                                        $h('div', { class: 'item' }, [
                                            $h('span', { class: 'label' }, '粉丝数'),
                                            $h('span', { class: 'value' }, {
                                                default() {
                                                    return reactive.form.fanCount;
                                                }
                                            })
                                        ]),
                                        $h('div', { class: 'item' }, [
                                            $h('span', { class: 'label' }, '赞藏数'),
                                            $h('span', { class: 'value' }, {
                                                default() {
                                                    return reactive.form.greatCount;
                                                }
                                            })
                                        ]),
                                    ]
                                    return $h('div', { class: classes.flexContainer }, todoList)
                                },
                                default() {
                                    return '抓取信息'
                                }
                            }),
                        ]),
                        $h('div', { class: classes.buttonContainer }, $h(Button, {
                            disabled: !userTabId.user,
                            long: true, loading: reactive.loading, type: 'primary', async onClick() {
                                reactive.loading = true;
                                let extensionImport = $toRaw(reactive.form);
                                extensionImport.opId = userTabId.user.id;
                                let params = {
                                    brandId: reactive.brand.id,
                                    token: userTabId.user.token,
                                    extensionImport
                                }
                                let { code, data, msg } = await api.brand.bind(params)
                                if (code == 0) {
                                    $Modal.confirm({
                                        title: '绑定或更新成功',
                                        content: '返回品牌内页',
                                        onOk() {
                                            const { tag, fromTabId, fromId, forGaoqu, closeTabIds } = options;
                                            return content2Background(
                                                patchFrom(
                                                    {
                                                        toTabId: fromTabId,
                                                        toId: fromId,
                                                        forGaoqu,
                                                        msg:
                                                            Msg.content通过background转发其他content发送给page,
                                                        aim: Aim.通知已补丁,
                                                        closeTab: true,
                                                        closeTabIds
                                                    },
                                                    tag
                                                )
                                            );
                                        }
                                    })

                                } else {
                                    $Notice.error({ title: msg })
                                }
                                reactive.loading = false;
                            }
                        }, userTabId.user ? '绑定' : '请先登录插件'))
                    ]
                    return todoList;
                }
            })
        }
    }
}