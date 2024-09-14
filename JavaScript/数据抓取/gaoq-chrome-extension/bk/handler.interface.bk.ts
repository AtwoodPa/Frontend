// import { Bus } from "../content-scripts/bus";
import { Table, Tag } from "./enum";

export interface Context {
    // $bus: Bus;
    $bus: any;
    $api: any;
    $resolveComponent: Function,
    $h: Function,
    $Teleport: any;
    $Suspense: any;
    formFunction: Function,
    cardFunction: Function,
    infoFunction: Function,
    drawFunction: Function,
    $Notice: any;
    $jss: any;
    tabId: string;
    signInUser: any;
    $Message: any;
    signOut: any;
    showBind: boolean;
    it: any;
    avatarMap?: any;
    dispLayList?: Array<any>;
    records: any;
    storeRecords: any;
    // render?:Function;
}

export interface TeleportProps {
    to: string | HTMLElement
    disabled?: boolean
}

export interface Options {
    gaoqId?: number;
    fromId?: any;
    fromTabId?: number;
    forGaoqu?: number;
    grab?: number;
    forDebug?: number;
    version: string;
    tag: string;
    needInstallCertPem?: boolean;
    keyword?: any;
    name?: any;
}
export interface Classes {
    title: string;
    label: string;
    mainLabel: string;
    submit: string;
    line1: string;
    site: string;
    photo: string;
}
export interface Style {
    title: Function,
    label: Function,
    mainLabel: Function,
    site: Function,
    photo: Function,
}

// export interface ClassesSearch {
//     "insert-dom": string;
// }

export interface StyleSearch {
    image: Function,
    checkbox: Function,
    info: Function,
}

export abstract class SimpleHandler {
    context: Context;
    options: Options;
    constructor(context: any, options: Options) {
        this.context = context;
        this.options = options;
        this._doSomething();
    }
    abstract _doSomething(): void;
}
const commonCss = {
    ".ivu-btn-primary": {
        backgroundColor: "#8c0776",
        color: "#ffffff",
        borderColor: "#8c0776"
    },
    ".ivu-btn-primary:hover": {
        color: "#fff",
        backgroundColor: "#a33991",
        borderColor: "#a33991",
    },
    ".ivu-btn:not([disabled]):hover": {
        textDecoration: "none"
    },
    ".ivu-btn-primary:hover, .ivu-btn-primary:active, .ivu-btn-primary.active": {
        color: " #fff"
    }
}
export abstract class SearchHandler {
    context: Context;
    options: Options;
    reactive: any;
    classes: any;
    style: StyleSearch;

    constructor(context: any, options: Options) {
        this.context = context;
        this.options = options;
        this.reactive = context.$reactive(
            {
                showModal: false,
                submitting: false,
                insertInfoList: [],
                data: [],
                title: '',
                show: false,
                type: "项目",
                storeData: [],
                loading: false,
                condition: {
                    id: null,
                    name: ""
                },
                projectColumns: [],
                projectList: []
            }
        )
        let { classes, style } = this._css();
        this.classes = classes;
        this.style = style;
        this._init();
    }
    _init() {
        this.context.dispLayList = [
            {
                label: "建联状态:",
                key: "exist",
            },
            {
                label: "刊例状态:",
                key: "publication",
            },
            {
                label: "mcn:",
                key: "mcn",
            },
            {
                label: "直联达人:",
                key: "directWise",
            },
            {
                label: "返点比例(%):",
                key: "rebate",
            },
        ]
        // this._cardView()
        this._updatePage();
        this._collectTag();

    }

    abstract _updatePage(): void;
    abstract _collectTag(): void;
    abstract _otherCss(): any;
    // 需要context里声明，资源信息插入dom的类
    _css() {
        const me = this;
        let { $jss } = this.context;
        const { classes } = $jss.createStyleSheet({
            '@global': {
                ...this._otherCss,
                "#crx-app": {
                    width: "520px"
                },
                ".insert-dom": {
                    position: "absolute",
                    width: "300px",
                    top: "0px",
                    right: "0px",
                    display: "flex",
                    justifyContent: "space-between",
                    marginRight: "10px",
                    alignItems: "center",
                    borderBottom: "1px solid rgb(231 225 225)",
                    color: "#333",
                    fontSize: "12px",
                    lineHeight: "21px",
                    padding: "0px 10px",
                    borderRadius: "10px",
                    height: "100%",
                    boxSizing: "border-box",
                },
                ".card-operation": {
                    marginTop: "5px",
                    display: "flex",
                    justifyContent: "space-around",
                },
                ".insert-header-dom": {
                    position: "absolute",
                    width: "300px",
                    top: "0px",
                    right: "0px",
                    display: "flex",
                    justifyContent: "space-between",
                    marginRight: "10px",
                    alignItems: "center",
                    padding: "0px 10px",
                },
                ".op-done": {
                    backgroundColor: "#b2f6b2"
                },
                ".op-doing": {
                    backgroundColor: "rgb(181 216 236)"
                },
                ...commonCss
            },



            item: {
                "margin": "0px 5px",
                width: "180px",
                display: "flex",
                "justify-content": "space-between"
            }
        }).attach()
        let { context } = me;
        let { $h } = context;
        let style = {
            image(component: any, src: string) {
                return $h(component, {
                    src: src,
                    fit: "contain",
                    preview: true,
                    previewList: [src],
                    initialIndex: 0,
                    width: "80px",
                    height: "80px"
                }, {
                    error() {
                        return "无"
                    }
                });
            },
            info(item: any) {
                const todoList: any = [];
                context.dispLayList!.forEach((display: any) => {
                    const { label, key } = display;
                    if (item[key]) {
                        todoList.push($h('div', { class: classes.item },
                            [$h('div', {
                                class: "label"
                            }, label),
                            $h('div', {
                                class: "value"
                            }, item[key])]))
                    }
                })
                return todoList;
            },
            checkbox(component: any, item: any, onChange: Function) {
                return $h(component, {
                    modelValue: item.checked,
                    onChange: (e: any) => {
                        console.log("onChange", e);
                        item.checked = !item.checked
                        onChange(item.checked);
                    }
                });
            },

        }
        return { classes, style };
    }
    _cardView() {
        let { columns } = this._cardMeta();
        this._makeCardFunction(columns);
    }
    _cardMeta() {
        let me = this;
        let { $resolveComponent, $Message } = this.context;
        return {
            columns: [
                {
                    type: "index",
                    align: "center",
                    width: 30,
                },
                {
                    title: "ID",
                    width: 60,
                    align: "center",
                    key: "id",
                },
                {
                    title: "项目",
                    key: "name",
                },
                {
                    title: "移除",
                    align: "center",
                    render(h: any, { row }: any) {
                        return h($resolveComponent("Button"),
                            {
                                size: 'small',
                                shape: 'circle',
                                type: 'primary',
                                icon: "md-remove",
                                onClick() {
                                    for (let i = 0, j = me.reactive.data.length; i < j; i++) {
                                        const item = me.reactive.data[i];
                                        if (item.id == row.id) {
                                            me.reactive.data.splice(i, 1);
                                            break;
                                        }
                                    }
                                }
                            });
                    },
                },
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
            ],
            projectColumns: [
                {
                    type: "index",
                    align: "center",
                    width: 30,
                },
                {
                    title: "ID",
                    width: 60,
                    align: "center",
                    key: "id",
                },
                {
                    title: "项目",
                    width: 260,
                    key: "name",
                },
                // <Icon type="ios-add-circle" />
                {
                    title: "操作",
                    align: "center",
                    render(h: any, { row }: any) {
                        return h($resolveComponent("Button"),
                            {
                                size: 'small',
                                shape: 'circle',
                                type: 'primary',
                                icon: "md-add",
                                onClick() {
                                    const { data, storeData } = me.reactive;
                                    const target = me.reactive.type == '添加项目' ? data : storeData;
                                    if (target.length == 0) {
                                        target.push(row)
                                        $Message.success({ content: "添加成功 / " + row.id });
                                    } else {
                                        const find = target.find((item: any) => item.id == row.id)
                                        if (!find) {
                                            target.push(row)
                                            $Message.success({ content: "添加成功 / " + row.id });
                                        } else {
                                            $Message.warning({ content: "无需重复添加" });
                                        }
                                    }
                                }
                            });
                    },
                },
            ]
        };
    }
    _makeCardFunction(columns: any) {
        const me = this;
        let { reactive, context } = this;
        let { $resolveComponent, $h } = context;
        this.context.cardFunction = function () {
            const Collapse = $resolveComponent("Collapse");
            const Table = $resolveComponent("Table");
            const Tabs = $resolveComponent("Tabs");
            const TabPane = $resolveComponent("TabPane");
            const Panel = $resolveComponent("Panel");
            const Button = $resolveComponent("Button");
            const Drawer = $resolveComponent("Drawer");
            const InputNumber = $resolveComponent("InputNumber");
            const Input = $resolveComponent("Input");

            return $h(Collapse, { value: "1" },
                () => $h(Panel, { name: "1" }, {
                    default() {
                        return "折叠&展开"
                    },
                    content() {
                        return [
                            $h(Tabs, {
                                modelValue: me.reactive.type,
                            },
                                () => [
                                    $h(TabPane, {
                                        label: "项目",
                                        name: "项目",
                                    },
                                        () => $h(Table, {
                                            size: "small",
                                            onSelect: me._doSelect,
                                            onSelectCancel: me._doUnSelect,
                                            onSelectAll: me._doSelectAll,
                                            onSelectAllCancel: me._doUnSelectAll,
                                            columns,
                                            data: me.reactive.data,
                                        })
                                    ),
                                    $h(TabPane, {
                                        label: "储备项目",
                                        name: "储备项目",
                                    },
                                        () => $h(Table, {
                                            size: "small",
                                            onSelect: me._doSelect,
                                            onSelectCancel: me._doUnSelect,
                                            onSelectAll: me._doSelectAll,
                                            onSelectAllCancel: me._doUnSelectAll,
                                            columns,
                                            data: me.reactive.storeData,
                                        })
                                    )
                                ]
                            ),
                            $h('div', {
                                class: "card-operation",
                            },
                                [
                                    $h(Button, {
                                        type: "primary",
                                        shape: "circle",
                                        onClick() {
                                            me.reactive.type = "添加项目"
                                            console.log("type项目添加", me.reactive.type);
                                            me.reactive.show = true;
                                        }
                                    }, () => "添加项目"),
                                    $h(Button, {
                                        type: "primary",
                                        shape: "circle",
                                        onClick() {
                                            me.reactive.type = "添加项目"
                                            console.log("type导入", me.reactive.type);
                                            me._pushResource("项目");
                                        }
                                    }, () => "导入项目"),
                                    $h(Button, {
                                        type: "primary",
                                        shape: "circle",
                                        onClick() {
                                            me.reactive.type = "添加储备项目"
                                            console.log("type储备项目添加", me.reactive.type);
                                            me.reactive.show = true;
                                        }
                                    }, () => "添加储备项目"),
                                    $h(Button, {
                                        type: "primary",
                                        shape: "circle",
                                        onClick() {
                                            me.reactive.type = "添加储备项目"
                                            console.log("type导入", me.reactive.type);
                                            me._pushResource("储备项目");
                                        }
                                    }, () => "导入储备项目"),
                                ]
                            )
                        ]
                    }
                })

            )
        }
    }
    _makeDrawFunction(columns: any) {
        const me = this;
        let { reactive, context } = this;
        let { $resolveComponent, $h } = context;
        this.context.drawFunction = function () {
            const Table = $resolveComponent("Table");
            const Button = $resolveComponent("Button");
            const Drawer = $resolveComponent("Drawer");
            const InputNumber = $resolveComponent("InputNumber");
            const Input = $resolveComponent("Input");

            return $h(context.$Teleport, { to: ".background-gradient" }, () => $h(Drawer, {
                title: reactive.type,
                placement: "left",
                closable: true,
                modelValue: me.reactive.show
            },
                () => [
                    $h('div', { class: "wrap" },
                        () => [
                            $h('div', { class: "item" },
                                () => [
                                    $h('div', { class: "label" }, () => "项目ID"),
                                    $h(InputNumber, {
                                        clearable: true,
                                        min: 0,
                                        modelValue: reactive.condition.id,
                                        style: "width: 240px"
                                    })
                                ]
                            ),
                            $h('div', { class: "item" },
                                () => [
                                    $h('div', { class: "label" }, () => "项目名称:"),
                                    $h(Input, {
                                        clearable: true,
                                        min: 0,
                                        modelValue: reactive.condition.name,
                                        placeholder: "模糊查询",
                                        style: "width: 240px"
                                    })
                                ]
                            ),
                            $h(Button, {
                                type: "primary",
                                shape: "circle",
                                icon: "ios-search",
                                onClick: () => { me._searchProject() }
                            })
                        ]
                    ),
                    $h(Table, {
                        size: "small",
                        loading: me.reactive.loading,
                        columns: me.reactive.projectColumns,
                        data: me.reactive.projectList,
                    })
                ]
            ))
        }
    }
    _checkbox() {
        this.reactive.insertHeader.checked = this.reactive.insertInfoList!.every(
            (item: any) => item.checked == true
        );
    }
    _checkboxTotal(e: boolean) {
        this.reactive.insertInfoList.forEach((item: any) => {
            item.checked = e;
        });
    }
    _pushResource(type: string) {
        console.log("pushResource", type);

    }
    async _searchProject() {
        this.reactive.loading = true;
        let res = {};
        if (this.reactive.type == '项目') {
            res = await this.context.$api.project.extensionSearch(this.reactive.condition);
        } else {
            this.reactive.$Message.warning({ content: "储备项目功能正在开发" });
        }
        const { code, data }: any = res;
        this.reactive.loading = false;
        if (code == 0) {
            this.reactive.projectList = data;
        }
    }
    private _doSelectAll(selection: any) {
        console.log("doSelectAll", selection);
        selection.forEach((item: any) => {
            let find = this.context.records.findIndex(
                (record: any) => record.id === item.id
            );
            if (find < 0) {
                if (this.reactive.type == "项目") {
                    this.context.records.push(item);
                } else {
                    this.context.storeRecords.push(item);
                }
            }
        });
        console.log("doSelectAll", this.context);
    }
    private _doUnSelectAll(selection: any) {
        console.log("doUnSelectAll", selection);
        this.context.records = selection;
        console.log("doUnSelectAll", this.context);
    }
    private _doSelect(selection: any) {
        console.log("doSelect", selection);
        this.context.records = selection;
        console.log("doSelect", selection, this.context);
    }
    private _doUnSelect(selection: any) {
        console.log("doUnSelect", selection);
        this.context.records = selection;
        console.log("doUnSelect", selection, this.context);
    }
    abstract _makeFormFunction(): void;
}
export abstract class CollectHandler {
    context: Context;
    options: Options;
    isInstallCertPem: boolean = false;
    form: any;
    reactive: any;
    classes: Classes;
    style: Style;

    constructor(context: any, options: Options) {
        this.context = context;
        this.options = options;
        this.reactive = context.$reactive(
            {
                showModal: false,
                submitting: false,
                user: '',
                data: [],
                title: '',
                infoList: [],
                infoTeleportTo: ""
            }
        )
        let { classes, style } = this._css();
        this.classes = classes;
        this.style = style;
        this._init();
    }
    _init() {
        this._cardView();
        this._autoCollect();
    }
    _css() {
        let { $jss } = this.context;
        const { classes } = $jss.createStyleSheet({
            '@global': {
                ".insert-op-info-dom": {
                    margin: "16px auto",
                    width: "260px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gridAutoFlow: "row",
                    alignItems: "center",
                    color: "rgb(153, 153, 153)",
                    backgroundColor: "rgb(255, 238, 243)",
                    fontWeight: "400",
                    fontSize: "12px",
                    lineHeight: "18px",
                    padding: "8px",
                    borderRadius: "8px",
                    gap: "5px",
                },
                ".insert-op-info-dom .item": {
                    color: "#333"
                },
                ".author-page-tab": {
                    zIndex: "10!important"
                },
                ".ivu-image": {
                    gridColumn: "2 / 5"
                },
                ...commonCss
            },
            line1: {
                textOverflow: "ellipsis",
                overflow: "hidden"
            },
            site: {
                wordBreak: "break-all"
            },
            photo: {
                width: "30px",
                height: "30px",
                borderRadius: "50%"
            },
            submit: {
                marginTop: "10px",
                width: "100%",
                '&:before': {
                    content: '"icon"'
                }
            },
            mainLabel: {
                color: "rgb(0, 0, 255)",
                fontWeight: "bold"
            },
            label: {
                color: "rgb(45, 140, 240)"
            },
            title: {
                color: "rgb(161 23 190)",
                textAlign: "center",
                borderRadius: "5px",
                backgroundColor: "#f6e5f6",
                fontWeight: 700
            }
        }).attach()
        let style = {
            title(name: string) {
                return (
                    `<div class="${classes.title}">${name}</div>`
                );
            },
            label(name: string) {
                return (
                    `<label class="${classes.label}">${name}</label>`
                );
            },
            mainLabel(name: string) {
                return (
                    `<label class="${classes.mainLabel}">${name}</label>`
                );
            },
            site(name: string) {
                return `<div class="${classes.site}">${name}</div>`;
            },
            photo(photo: string) {
                return `<img src="${photo}" class="${classes.photo}"/>`;
            },
        }
        return { classes, style };
    }

    _basicView(data: any) {
        let subList = [
            {
                span: 4,
                html: this.style.label('头像'),
            },
            {
                span: 4,
                html: this.style.photo(data.photo),
            },
            {
                span: 16,
                html: data.uid,
                className: this.classes.line1
            },
            {
                span: 4,
                html: this.style.label('昵称'),
            },
            {
                span: 4,
                html: data.name,
            },
            {
                span: 4,
                html: this.style.label('媒体号'),
            },
            {
                span: 4,
                html: data.mediaId,
            },
            {
                span: 4,
                html: this.style.label('来源'),
            },
            {
                span: 4,
                html: data.origin,
            },
            {
                span: 4,
                html: this.style.label('平台'),
            },
            {
                span: 4,
                html: data.platform,
            },
            {
                span: 4,
                html: this.style.label('地区'),
            },
            {
                span: 4,
                html: data.region,
            },
            {
                span: 4,
                html: this.style.label('IP属地'),
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
                html: this.style.label('粉丝数'),
            },
            {
                span: 4,
                html: data.fanCount,
            },
            {
                span: 4,
                html: this.style.label('获赞数'),
            },
            {
                span: 4,
                html: data.greatCount,
            },
            {
                span: 4,
                html: this.style.label('mcn'),
            },
            {
                span: 4,
                html: data.mcn,
            },
            {
                span: 4,
                html: this.style.label('主页'),
            },
            {
                span: 20,
                html: this.style.site(data.site),
            },
        ];
        return {
            align: 'middle',
            gutter: 0,
            subList,
        };
    }

    async _ifInstallCertPem() {
        if (this.isInstallCertPem || !this.options.needInstallCertPem) {
            return true;
        }
        let install = false;
        try {
            const rs = await this.context.$api.ifInstallCertPem();
            install = rs.install;
        } catch (e) {
            console.debug("ifInstallCertPem", e);
            this.context.$api.baojing({ tag: this.options.tag, message: JSON.stringify(e), site: window.location.href })
        }
        if (install) {
            this.isInstallCertPem = true;
            return true;
        } else {
            this.context.$Notice.error({
                title: '请更新插件和安装证书',
                desc: '请在OP 下载中心 中下载插件和证书，并按照教程安装',
            });
        }
        return false;
    }

    async _autoCollect() {
        let pass = await this._ifInstallCertPem();
        if (pass) {
            let { ok, data } = await this._doCollect();
            console.log('autoCollect', ok, data);
            if (ok) {
                if (this._validateAuto(data)) {
                    data.autoOpId = this.context.signInUser?.id;
                    this.form = data;
                    await this._autoServer(data);
                }
            }
        }
    }
    _makeParams(form: any): any {
        return form;
    }
    async _autoServer(form: any) {
        let { context, reactive } = this;
        let rs = await context.$api.extension.auto(this._makeParams(form));
        if (rs) {
            let { code, data, msg } = rs;
            if (code === 0) {
                const { ids, table } = data;
                if (table == Table.插件入库) {
                    let content = `待建联/${ids.join(',')}`
                    context.$Message.success({ content });
                    reactive.data[0].record = content;
                } else if (table == Table.资源入库) {
                    let content = `资源/${ids.join(',')}`
                    context.$Message.success({ content });
                    reactive.data[0].record = content;
                } else {
                    reactive.data[0].record = '🈚️';
                }
                const { tag } = this.options;
                let elClass = ""
                if (tag == Tag.Xt) {
                    elClass = ".top-info .link-index";
                } else if (tag == Tag.ByResource) {
                    elClass = ""
                }
                elClass && this._insertDom(data, elClass)
            } else {
                context.$Notice.error({
                    title: '遇到问题-_-!',
                    desc: msg,
                });
                if (code == -35) {
                    context.signOut()
                }
            }
        }
        this._ending(form);
    }
    _submitServer = async (): Promise<boolean> => {
        let { context, form, reactive } = this;
        if (context.signInUser) {
            let pass = this._validateSubmit(form);
            console.log("import-form", pass, form);
            if (pass) {
                let { id, token } = context.signInUser;
                form.opId = id;
                this._beginning(form)
                reactive.submitting = true;
                let { code, data, msg } = await context.$api.extension.import(
                    this._makeParams(form),
                    token
                );
                reactive.submitting = false;
                if (code === 0) {
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
            context.showBind = true;
        }
        return false;
    }
    async _collect() {
        if (this.context.signInUser) {
            if (!this.form) {
                let pass = await this._ifInstallCertPem();
                if (pass) {
                    let { ok, data } = await this._doCollect();
                    console.log('collect', ok, data);
                    if (ok) {
                        this.form = data;
                    }
                }
            }
            this.form.autoOpId = this.context.signInUser.id;
            this._formView(this.form);
        } else {
            this.context.showBind = true;
        }
    }
    _tryCollectTimeout = () => {
        return new Promise((resolve) => {
            this.context.it = setTimeout(() => {
                resolve(this._tryCollect());
            }, 1000);
        });
    }
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
            let { context } = this;
            const { $Message, $api } = context;
            $Message.error({ content: rs.error.message });
            $api.baojing({ tag: this.options.tag, error: rs.error.message, at: "doCollect", url: window.location.href });
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
    abstract _parser(): Promise<any>;
    _insertDom(data: any, elClass: string) {
        const me = this;
        const { context, reactive } = this;
        let { $resolveComponent, $h, $Teleport } = context;
        const { table, resourceList } = data;
        let union = '';
        const insertDom = document.createElement('div');
        let className = "insert-op-info-dom "
        let infoList: any = []
        const element = {
            label: "建联状态",
            value: ""
        }
        if (table) {
            if (table == Table.插件入库) {
                element.value = '待建联'
                infoList.push(element)
            } else {
                element.value = '已建联'
                let { directWise, publication, rebate, qyGgCode, qyWxCode, qyBdCode } = resourceList![0]
                // infoList.push(element);
                const todoList: any = [
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
                    todoList.push({
                        label: "电商:",
                        src: me.photo(qyWxCode),
                        type: 'img'
                    })
                }
                if (qyGgCode) {
                    todoList.push({
                        label: "广告:",
                        src: me.photo(qyGgCode),
                        type: 'img'
                    })
                }
                if (qyBdCode) {
                    todoList.push({
                        label: "本地:",
                        src: me.photo(qyBdCode),
                        type: 'img'
                    })
                }
                infoList = todoList
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
        insertDom.className = className;
        document.querySelector(elClass)?.before(insertDom);
        const infoTo = '.' + className
        this.reactive.infoList = infoList;
        this.reactive.infoTo = infoTo

        this.context.infoFunction = () => {
            let Image = $resolveComponent('Image');
            let Button = $resolveComponent('Button');
            const todoList: any = [];
            for (let info of reactive.infoList) {
                const { type, src, value, style } = info;
                if (type == 'img') {
                    todoList.push($h('div', { class: 'label' }, info.label))
                    todoList.push($h(Image, {
                        src, fit: "contain",
                        preview: true,
                        previewList: [src],
                        initialIndex: 0,
                    }))

                } else if (type == 'button') {
                    todoList.push($h(Button, { style, type: "primary" }, { default() { return value } }))
                } else {
                    todoList.push($h('div', { class: 'label' }, info.label))
                    todoList.push($h('div', { class: 'item' }, value))
                }
            }
            return $h($Teleport, { to: infoTo }, todoList)
        }



        console.log("infoList", infoList);
    }
    _formView(form: any) {
        let viewList = this._formMeta(form)
        this._makeFormFunction(viewList);
    }
    abstract _formMeta(form: any): any;
    _makeFormFunction(viewList: any) {
        let { context, _submitServer, reactive, classes } = this;
        let { $resolveComponent, $h, $Teleport } = context;
        // const {}
        context.formFunction = () => {
            let Row = $resolveComponent('Row');
            let Col = $resolveComponent('Col');
            let Button = $resolveComponent('Button');
            let Modal = $resolveComponent('Modal');

            // let Button = $resolveComponent('Button');
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
                    return [...viewList.map((view: any) => {
                        let { gutter, align, subList } = view;
                        return $h(Row, {
                            gutter,
                            align
                        }, subList.map((sub: any) => {
                            let { span, offset, className, html } = sub;
                            return $h(Col, { span, offset, className, innerHTML: html })
                        }))
                    }), $h(Button, { type: "primary", loading: reactive.submitting, onClick: _submitServer, class: classes.submit }, () => '添加(或更新)至OP')]
                }
            })

        }
        reactive.showModal = true;
    }
    _cardView() {
        let { columns, data } = this._cardMeta();
        this._makeCardFunction(columns, data);
    }
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
    _makeCardFunction(columns: any, data: any) {
        let { reactive, context } = this;
        let { $resolveComponent, $h } = context;
        reactive.data = data;
        this.context.cardFunction = function () {
            const Table = $resolveComponent('Table');
            const Card = $resolveComponent('Card');
            return $h(Card, {
                title() {
                    return
                }
            })
            return $h(Table, { size: 'small', columns, data: reactive.data })
        }
    }
    private photo(val: string) {
        const cdnBase = '//cdn.red.gaoq.com'
        if (val) {
            val = val.replace("dingUsed/", "").replace("ding/", "");
            return val.match(/^http|data:image|\/\//) ? val : `${cdnBase}/resource/${val}`
        }
        return null
    }
    abstract _validateAuto(form: any): boolean;
    abstract _validateSubmit(form: any): boolean;
    abstract _ending(form: any): void;
    abstract _beginning(form: any): void
}