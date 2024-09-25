import { Table, Grab } from "./enum";
import { Context, Options, CertPerm } from "./handler.interface";
import { tryDo } from "./util"
import { photo } from "./filter";
import { makeCss, Classes, Render } from './handler.collect.jss'

/**
 * 数据项
 */
export interface DataItem {
    desc: string; // 描述
    record?: string; // 记录，可选  用于存储特定的数据
}

/**
 * 响应式状态
 * showModal: 控制模态框的显示状态。
 * submitting: 提交过程中的状态指示（是否正在提交）。
 * data: 存储多个 DataItem 的数组。
 * title: 模态框的标题。
 * viewList: 存储视图列表的信息。
 * infoList: 额外的信息列表。
 */
export interface Reactive {
    showModal: boolean;
    submitting: boolean;
    data: DataItem[],
    title: string,
    viewList: any[],
    infoList: any[]
}

/**
 * CollectHandler抽象类
 * 主要用于 处理数据的收集和管理，特别是用户交互的逻辑
 */
export abstract class CollectHandler extends CertPerm {
    form: any;
    reactive!: Reactive;
    it: any;
    classes!: Classes;
    render!: Render;

    /**
     * 构造方法 * 初始化
     * 接受上下文和选项参数，并初始化一些变量
     * @param context
     * @param options
     * @protected
     */
    protected constructor(context: Context, options: Options) {
        super(context, options);
        this._init().then(r => {

        });
    }

    /**
     * 初始化操作
     */
    async _init() {
        /**
         * 检查环境是否满足条件
         *
         * 1、检查是否安装了证书
         */
        let pass = await this._checkEnv();
        if (pass) {
            // 初始化CSS样式
            this._css();
            // 准备用户信息
            await this._prepareUser();
            // 初始化视图
            this._view().then(r => {

            });
            // console.log("init-user", JSON.stringify(this.userTabId.user));
            // console.log("init-token", JSON.stringify(this.userTabId.user.token));
            // 检测用户是否登录
            if (this.userTabId.user) {
                // 自动收集数据
                await this._autoCollect();
            } else {
                this.context.$Notice.error({
                    title: '请先登录插件',
                    desc: '登录插件后才能正常使用',
                });
            }
        }
    }

    /**
     * 初始化CSS样式
     * 生成样式类和渲染函数
     */
    _css() {
        let { $jss } = this.context;
        let { classes, render } = makeCss($jss);
        this.classes = classes;
        this.render = render;
    }

    /**
     * 初始化基础视图
     * @param data
     */
    _basicView(data: any) {
        let subList = [
            {
                span: 4,
                html: this.render.label('头像'),
            },
            {
                span: 4,
                html: this.render.photo(data.photo),
            },
            {
                span: 16,
                html: data.uid,
                className: this.classes.line1
            },
            {
                span: 4,
                html: this.render.label('昵称'),
            },
            {
                span: 4,
                html: data.name,
            },
            {
                span: 4,
                html: this.render.label('媒体号'),
            },
            {
                span: 4,
                html: data.mediaId,
            },
            {
                span: 4,
                html: this.render.label('来源'),
            },
            {
                span: 4,
                html: data.origin,
            },
            {
                span: 4,
                html: this.render.label('平台'),
            },
            {
                span: 4,
                html: data.platform,
            },
            {
                span: 4,
                html: this.render.label('地区'),
            },
            {
                span: 4,
                html: data.region,
            },
            {
                span: 4,
                html: this.render.label('IP属地'),
            },
            {
                span: 4,
                html: data.ip,
            },
            // {
            //     span: 4,
            //     html: Style.label('关注数'),
            // },
            // {
            //     span: 4,
            //     html: data.followCount,
            // },
            {
                span: 4,
                html: this.render.label('粉丝数'),
            },
            {
                span: 4,
                html: data.fanCount,
            },
            {
                span: 4,
                html: this.render.label('获赞数'),
            },
            {
                span: 4,
                html: data.greatCount,
            },
            {
                span: 4,
                html: this.render.label('mcn'),
            },
            {
                span: 4,
                html: data.mcn,
            },
            {
                span: 4,
                html: this.render.label('主页'),
            },
            {
                span: 20,
                html: this.render.site(data.site),
            },
        ];
        return {
            align: 'middle',
            gutter: 0,
            subList,
        };
    }

    /**
     * 自动收集数据
     */
    async _autoCollect() {
        // 自动收集数据，调用 _doCollect 获取数据。
        let { ok, data } = await this._doCollect();
        console.log('autoCollect', ok, data);
        if (ok) {
            // 验证数据有效性，如果有效则调用 _autoServer 提交数据
            if (this._validateAuto(data)) {
                console.log("this.reactive.user", this.userTabId.user);
                data.autoOpId = this.userTabId.user?.id;
                this.form = data;
                // 调用 _autoServer 提交数据到服务器。
                await this._autoServer(data);
            }
        } else {
            // 博主页异常的时候，也要调回
            this._ending(data || {});
        }
    }

    _makeParams(form: any): any {
        return form;
    }

    /**
     *
     * @param form
     */
    async _autoServer(form: any) {
        let { context, options, reactive, api, userTabId } = this;
        // 打印用户token
        // auto-token 0a4afa4162d54a24a272638e39d44eab
        console.log("auto-token", userTabId.user.token);

        // 提交数据到服务器
        let params = this._makeParams(form);
        this._beforeAuto(params);// 这个暂时未实现
        let rs = await api.extension.auto(params);
        if (rs) {
            let { code, data, msg } = rs;
            if (code === 0) {
                console.log("path", options.grab == Grab.抓取全部数据);
                console.log("options.grab", options.grab);
                console.log("Grab.抓取全部数据", Grab.抓取全部数据);

                if (options.grab == Grab.抓取全部数据) {
                    await this._afterAuto(form, data);
                } else {
                    this._afterAuto(form, data);
                }
                const { ids, table } = data;
                if (table == Table.插件入库) {
                    let content = `待建联/${ids.join(',')}`
                    context.$Message.success({ content });
                    reactive.data[0].record = content;
                } else if (table == Table.资源入库) {
                    let content = `资源/${ids.join(',')}`
                    context.$Message.success({ content });
                    reactive.data[0].record = content;
                } else if (table == Table.品牌入库) {
                    let content = `品牌/${ids.join(',')}`
                    reactive.data[0].record = content;
                } else {
                    reactive.data[0].record = '🈚️';
                }
            } else {
                context.$Notice.error({
                    title: '遇到问题-_-!',
                    desc: msg,
                });
                if (code == -35) {
                    this._signOut()
                }
            }
            this._ending(params);
        }
    }
    _submitServer = async (): Promise<boolean> => {
        let { context, form, reactive, userTabId, api } = this;
        if (userTabId.user) {
            let pass = this._validateSubmit(form);
            console.log("import-form", pass, form);
            if (pass) {
                let { id, token } = userTabId.user;
                form.opId = id;
                this._beforeSubmit(form)
                reactive.submitting = true;
                let { code, data, msg } = await api.extension.import(
                    this._makeParams(form),
                    token
                );
                reactive.submitting = false;
                if (code === 0) {
                    this._afterSubmit(form, data);
                    let { content, type } = data;
                    if (type === 'success') {
                        context.$Message.success({ content });
                        reactive.data[0].record = content;
                        reactive.showModal = false;
                        return true;
                    } else if (type == 'warning') {
                        context.$Notice.warning({
                            title: '请注意',
                            desc: content,
                        });
                    } else {
                        context.$Notice.error({
                            title: '请注意',
                            desc: content,
                            duration: 6,
                        });
                    }
                } else {
                    context.$Notice.error({
                        title: '遇到问题-_-!',
                        desc: msg,
                    });
                }
            }
            this._ending(form);
        } else {
            context.$Message.success('请先登录')
        }
        return false;
    }
    async _collect() {
        if (this.userTabId.user) {
            if (!this.form) {
                let { ok, data } = await this._doCollect();
                console.log('collect', ok, data);
                if (ok) {
                    this.form = data;
                }
            }
            this.form.autoOpId = this.userTabId.user.id;
            this.reactive.viewList = this._formMeta(this.form);
            this.reactive.showModal = true;
        } else {
            this.context.$Message.success('请先登录')
        }
    }
    _tryCollectTimeout = () => {
        return new Promise((resolve) => {
            this.it = setTimeout(() => {
                resolve(this._tryCollect());
            }, 1000);
        });
    }

    /**
     * 数据采集
     *
     */
    async _doCollect() {
        let rs: any = await this._tryCollect();
        console.log('tryCollect', rs);
        if (!rs.ok) {
            let tryCount = 1;
            let maxCount = 5;
            while (tryCount < maxCount) {
                rs = await this._tryCollectTimeout();
                console.log('tryCollectTimeout', tryCount, rs);
                if (rs.ok) {
                    tryCount = maxCount;
                } else {
                    tryCount++;
                }
            }
        }
        if (!rs.ok) {
            // let { context, api } = this;
            // const { $Message} = context;
            this.context.$Message.error({ content: "获取数据异常" });
            // api.baojing({ tag: this.options.tag, error: rs.error.message, at: "doCollect", url: window.location.href });
        }
        return rs;
    }

    async _tryCollect() {
        if (this.options.forDebug) {
            let data = await this._parser();
            return {
                ok: true,
                data,
            };
        } else {
            try {
                let data = await this._parser();
                return {
                    ok: true,
                    data,
                };
            } catch (error) {
                return {
                    ok: false,
                    error,
                };
            }
        }
    }

    /**
     * 自动采集
     */
    abstract _parser(): Promise<any>;
    _cardMeta() {
        let me = this;
        let { $resolveComponent } = this.context;
        return {
            columns: [
                {
                    type: 'index',
                    align: 'center',
                    width: 30,
                },
                {
                    title: '功能',
                    width: 60,
                    align: 'center',
                    key: 'desc',
                },
                {
                    title: '操作',
                    align: 'center',
                    render(h: Function, params: any) {
                        let { desc, record } = params.row;
                        if ('更新' == desc) {
                            return h(
                                'span',
                                { class: 'active' },
                                {
                                    default() {
                                        return record || '静默开启'
                                    }
                                }
                            );
                        } else if ('入库' == desc) {
                            return h($resolveComponent('Button'), {
                                icon: 'md-locate',
                                size: 'small',
                                onClick() {
                                    me._collect();
                                },
                            });
                        }
                    },
                },
            ],
            data: [
                {
                    desc: '更新',
                    record: '',
                },
                {
                    desc: '入库',
                },
            ]
        };
    }

    /**
     * 表单
     * @param form
     */
    abstract _formMeta(form: any): any;

    _afterLogin(): void {
        this._autoCollect();
    }

    /**
     * 视图生成
     * 定义多个渲染函数用于生成UI组件
     *  1、card：显示用户信息和数据表格
     *  2、form：显示用户提交数据的Modal（模态框）
     */
    async _view() {
        let { context, classes, _submitServer, _signOut, userTabId } = this;
        let { columns, data } = this._cardMeta();
        let { $resolveComponent, $h, $Teleport } = context;
        let reactive: Reactive = context.$reactive(
            {
                showModal: false,
                submitting: false,
                data,
                title: '',
                viewList: [],
                infoList: [],
                total: 8
            }
        )
        this.reactive = reactive;
        context.renderFunctionMap.card = function () {
            const Table = $resolveComponent('Table');
            const Card = $resolveComponent('Card');
            const Icon = $resolveComponent('Icon');
            return $h(Card, {}, {
                title() {
                    let todoList = [$h('img', { src: context.src/*'https://cdn.red.gaoq.com/resource/logo.png'*/, class: classes.gaoqu })]
                    if (userTabId.user) {
                        todoList.push(userTabId.user.name + '(' + userTabId.user.id + ')')
                    }
                    return todoList;
                },
                extra() {
                    if (userTabId.user) {
                        return $h('div', {
                            onClick: _signOut
                        },
                            [
                                $h(Icon, { type: 'md-exit', size: 13 }),
                                '登出'
                            ])
                    } else if (userTabId.tabId) {
                        return $h('a', { href: userTabId.href, target: '_blank' }, [
                            $h(Icon, { type: 'md-contact', size: 13 }),
                            '登录'
                        ])
                    }
                },
                default() {
                    return $h(Table, { size: 'small', columns, data: reactive.data })
                }
            })
        }
        context.renderFunctionMap.form = function () {
            let Row = $resolveComponent('Row');
            let Col = $resolveComponent('Col');
            let Button = $resolveComponent('Button');
            let Modal = $resolveComponent('Modal');
            return $h(Modal, {
                modelValue: reactive.showModal,
                "onUpdate:modelValue"(val: boolean) {
                    reactive.showModal = val;
                },
                draggable: true,
                scrollable: true,
                footerHide: true,
                mask: false,
                width: 800,
            }, {
                header() {
                    return reactive.title;
                },
                default() {
                    return [...reactive.viewList.map((view: any) => {
                        let { gutter, align, subList } = view;
                        return $h(Row, {
                            gutter,
                            align
                        }, () => subList.map((sub: any) => {
                            let { span, offset, className, html } = sub;
                            return $h(Col, { span, offset, className, innerHTML: html })
                        }))
                    }), $h(Button, { type: "primary", loading: reactive.submitting, onClick: _submitServer, class: classes.submit }, () => '添加(或更新)至OP')]
                }
            })
        }
        const elClass = this._getElClass();
        if (elClass) {
            const insertDom = document.createElement('div');
            const infoToClassName = classes.insertOpInfoDom;
            insertDom.className = infoToClassName;
            console.log("elClass", elClass);
            const elDom: any = await tryDo(4000, () => document.querySelector(elClass))
            elDom?.before(insertDom);
            context.renderFunctionMap.info = function () {
                let Image = $resolveComponent('Image');
                let Button = $resolveComponent('Button');
                const todoList: any = [];
                for (let info of reactive.infoList) {
                    const { type, src, value, style } = info;
                    if (type == 'img') {
                        todoList.push($h('div', { class: classes.insertLabel }, info.label))
                        todoList.push($h(Image, {
                            src, fit: "contain",
                            preview: true,
                            previewList: [src],
                            initialIndex: 0,
                        }))

                    } else if (type == 'button') {
                        todoList.push($h(Button, { style, type: "primary" }, { default() { return value } }))
                    } else {
                        todoList.push($h('div', { class: classes.insertLabel }, info.label))
                        todoList.push($h('div', { class: classes.insertItem }, value))
                    }
                }
                return $h($Teleport, { to: '.' + infoToClassName }, todoList)
            }
        }

    }
    _beforeSubmit(form: any): void {

    }
    _afterSubmit(form: any, data: any): Promise<void> {
        this._insertDom(data)
        return this._otherCollect(form, data);
    }
    _beforeAuto(form: any): void {
    }
    _afterAuto(form: any, data: any): Promise<void> {
        this._insertDom(data);
        return this._otherCollect(form, data);
    }
    _insertDom(data: any) {
        const elClass = this._getElClass();
        if (elClass) {
            const { table, resourceList } = data;
            let union = '';
            let infoList: any = []
            const element = {
                label: "建联状态",
                value: ""
            }
            console.log(data);

            if (table) {
                if (table == Table.插件入库) {
                    element.value = '待建联'
                    infoList.push(element)
                } else {
                    element.value = '已建联'
                    let { directWise, publication, rebate, qyGgCode, qyWxCode, qyBdCode } = resourceList![0]
                    infoList = [
                        element,
                        {
                            label: "直联达人:",
                            value: union || directWise == undefined ? "--" : directWise,
                            type: 'text'
                        },
                        {
                            label: "刊例状态:",
                            value: publication || "--",
                            type: 'text'
                        },
                        {
                            label: "返点比例:",
                            value: (rebate || "--") + '%',
                            type: 'text'
                        },
                    ]
                    if (qyWxCode) {
                        infoList.push({
                            label: "电商:",
                            src: photo(qyWxCode),
                            type: 'img'
                        })
                    }
                    if (qyGgCode) {
                        infoList.push({
                            label: "广告:",
                            src: photo(qyGgCode),
                            type: 'img'
                        })
                    }
                    if (qyBdCode) {
                        infoList.push({
                            label: "本地:",
                            src: photo(qyBdCode),
                            type: 'img'
                        })
                    }
                }
            } else {
                element.value = '未建联'
                infoList.push(element)
            }

            infoList.push({
                type: "button",
                value: "待开发",
                cb: () => {
                    console.log("待开发1");
                },
                style: "grid-column: 1 / 3"
            })
            infoList.push({
                type: "button",
                value: "待开发",
                cb: () => {
                    console.log("待开发2");
                },
                style: "grid-column: 3 / 5;"
            })
            this.reactive.infoList = infoList;

            console.log("infoList", infoList);
        }

    }
    _otherCollect(form: any, data: any) {
        console.debug('void otherCollect')
        return Promise.resolve();
    }

    /**
     * 获取当前组件的class
     */
    _getElClass(): string {
        return "";
    }
    abstract _validateAuto(form: any): boolean;
    abstract _validateSubmit(form: any): boolean;
    abstract _ending(form: any): void;
}