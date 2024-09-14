
import { Context, Options, CertPerm } from "./handler.interface";
import { makeCss, Render } from "./handler.search.jss"
import { Msg, Aim } from "./enum"
import { isBusinessSupervisor } from "./perm"
export interface Reactive {
    submitting: boolean;
    resourceList: any[];
    data: any[];
    title: string;
    show: boolean;
    type: string;
    storeData: any[];
    loading: boolean;
    condition: any;
    projectList: any[];
    storeProjectList: any[];
    columns: any[];
    addColumns: any[];
    records: any[];
    storeRecords: any[];
    avatarMap: any;
    insertHeader: any;
    autoImportList: any[];
    needImportProject: boolean;
    importDetail: any;
    importDetailShow: boolean;
}
export abstract class SearchHandler extends CertPerm {
    reactive!: Reactive;
    classes: any;
    render!: Render;

    constructor(context: Context, options: Options) {
        super(context, options);
        this._init();
    }
    async _init() {
        this._css();
        await this._prepareUser();
        this._view();
        if (this.userTabId.user) {
            this._updatePage();
        } else {
            this.context.$Notice.error({
                title: '请先登录插件',
                desc: '登录插件后才能正常使用',
            });
        }
        // this._updatePage();
        this._collectTag();
    }

    abstract _updatePage(): void;
    abstract _collectTag(): void;
    abstract _otherCss(): any;
    // 需要context里声明，资源信息插入dom的类
    _css() {
        let { $jss, $h } = this.context;
        const othersCss = this._otherCss();
        let { classes, render } = makeCss($jss, othersCss, $h);
        this.classes = classes;
        this.render = render;
    }
    _cardMeta() {
        let me = this;
        let { $resolveComponent, $Message } = this.context;
        const columns = [
            {
                type: "index",
                align: "center",
                width: 30,
            },
            {
                title: "ID",
                width: 100,
                align: "center",
                key: "id",
            },
            {
                title: "项目",
                key: "name",
            },
            {
                title: "移除",
                width: 100,
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
                                me.reactive.records = [];
                                me.reactive.storeRecords = [];
                                console.log("this", me);

                            }
                        });
                },
            },
            {
                type: 'selection',
                width: 60,
                align: 'center'
            },
        ]
        const addColumns = [
            {
                type: "index",
                align: "center",
                width: 30,
            },
            {
                title: "ID",
                width: 100,
                align: "center",
                key: "id",
            },
            {
                title: "项目",
                key: "name",
            },
            // <Icon type="ios-add-circle" />
            {
                title: "操作",
                width: 100,
                align: "center",
                render(h: any, { row }: any) {
                    return h($resolveComponent("Button"),
                        {
                            size: 'small',
                            shape: 'circle',
                            type: 'primary',
                            icon: "md-add",
                            onClick() {
                                const { data, storeData, type } = me.reactive;
                                const target = type == '项目' ? data : storeData;
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
        return { columns, addColumns }
    }
    _afterLogin(): void {
        this._updatePage();
    }
    async _view() {
        const { columns, addColumns } = this._cardMeta();
        let me = this;
        let { context, _signOut, classes, userTabId, render } = this;
        let { $resolveComponent, $h, $Message, $Teleport } = context;
        let reactive = context.$reactive(
            {
                submitting: false,
                resourceList: [],
                insertHeader: null,
                data: [],
                title: '',
                show: false,
                type: "项目",
                storeData: [],
                loading: false,
                condition: {
                    id: null,
                    name: "",
                    page: {
                        size: 50, total: 0, current: 1
                    }
                },
                projectList: [],
                storeProjectList: [],
                columns,
                addColumns,
                records: [],
                storeRecords: [],
                importDetail: null,
                importDetailShow: false
            }
        )
        this.reactive = reactive;
        this.context.renderFunctionMap.card = function () {
            const Collapse = $resolveComponent("Collapse");
            const Table = $resolveComponent("Table");
            const Tabs = $resolveComponent("Tabs");
            const TabPane = $resolveComponent("TabPane");
            const Panel = $resolveComponent("Panel");
            const Button = $resolveComponent("Button");
            const Card = $resolveComponent("Card");
            const Icon = $resolveComponent("Icon");
            // const Input = $resolveComponent("Input");
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
                    return $h(Collapse, { modelValue: "1" },
                        () => $h(Panel, { name: "1" }, {
                            default() {
                                return "折叠&展开"
                            },
                            content() {
                                return [
                                    $h(Tabs, {
                                        animated: false,
                                        modelValue: reactive.type,
                                        'onUpdate:modelValue': (name: any) => reactive.type = name
                                    },
                                        () => [
                                            $h(TabPane, {
                                                label: "项目",
                                                name: "项目",
                                            },
                                                () => $h(Table, {
                                                    size: "small",
                                                    columns,
                                                    data: reactive.data,
                                                    onOnSelect(selection: any) {
                                                        me._doSelect(selection);
                                                    },
                                                    onOnSelectCancel(selection: any) {
                                                        me._doUnSelect(selection);
                                                    },
                                                    onOnSelectAll(selection: any) {
                                                        me._doSelectAll(selection);
                                                    },
                                                    onOnSelectAllCancel(selection: any) {
                                                        me._doUnSelectAll(selection);
                                                    },
                                                })
                                            ),
                                            $h(TabPane, {
                                                label: "储备项目",
                                                name: "储备项目",
                                            },
                                                () => $h(Table, {
                                                    size: "small",
                                                    onOnSelect(selection: any) {
                                                        me._doSelect(selection);
                                                    },
                                                    onOnSelectCancel(selection: any) {
                                                        me._doUnSelect(selection);
                                                    },
                                                    onOnSelectAll(selection: any) {
                                                        me._doSelectAll(selection);
                                                    },
                                                    onOnSelectAllCancel(selection: any) {
                                                        me._doUnSelectAll(selection);
                                                    },
                                                    columns,
                                                    data: me.reactive.storeData,
                                                })
                                            )
                                        ]
                                    ),
                                    $h('div', {
                                        class: classes.cardOperation,
                                    },
                                        [
                                            $h(Button, {
                                                type: "primary",
                                                shape: "circle",
                                                onClick() {
                                                    reactive.show = true;
                                                }
                                            }, () => "添加项目"),
                                            $h(Button, {
                                                type: "primary",
                                                shape: "circle",
                                                onClick() {
                                                    me._pushResource();

                                                }
                                            }, () => "导入" + reactive.type),
                                            $h(Button, {
                                                type: "primary",
                                                shape: "circle",
                                                onClick() {
                                                    me._batchImport();

                                                }
                                            }, () => "批量入库")
                                        ]
                                    )
                                ]
                            }
                        })
                    )
                }
            })
        }
        this.context.renderFunctionMap.draw = function () {
            const Table = $resolveComponent("Table");
            const Button = $resolveComponent("Button");
            const Drawer = $resolveComponent("Drawer");
            const InputNumber = $resolveComponent("InputNumber");
            const Input = $resolveComponent("Input");
            const Tabs = $resolveComponent("Tabs");
            const TabPane = $resolveComponent("TabPane");


            return $h(Drawer, {
                title: "添加" + reactive.type,
                placement: "left",
                width: "650px",
                closable: true,
                modelValue: me.reactive.show,
                'onUpdate:modelValue': (show: any) => me.reactive.show = show
            },
                () => [
                    $h('div', { class: classes.opWrapper }, [
                        $h('div', { class: classes.search }, [
                            $h('div', { class: classes.opItem }, [
                                $h('div', { class: classes.opLabel }, "项目ID"),
                                $h(InputNumber, {
                                    clearable: true,
                                    min: 0,
                                    onOnEnter() {
                                        me._searchProject();
                                    },
                                    modelValue: reactive.condition.id,
                                    'onUpdate:modelValue': (id: any) => reactive.condition.id = id,
                                    style: "width: 240px"
                                })
                            ]
                            ),
                            $h('div', { class: classes.opItem }, [
                                $h('div', { class: classes.opLabel }, "项目名称:"),
                                $h(Input, {
                                    clearable: true,
                                    min: 0,
                                    onOnEnter() {
                                        me._searchProject();
                                    },
                                    modelValue: reactive.condition.name,
                                    placeholder: "模糊查询",
                                    'onUpdate:modelValue': (name: any) => reactive.condition.name = name,
                                    style: "width: 240px"
                                })
                            ]
                            )
                        ]),
                        $h('div', { class: classes.opts }, $h(Button, {
                            type: "primary",
                            shape: "circle",
                            icon: "ios-search",
                            onClick: () => { me._searchProject() }
                        }))

                    ]
                    ),

                    $h(Tabs, {
                        animated: false,
                        modelValue: me.reactive.type,
                        'onUpdate:modelValue': (name: any) => me.reactive.type = name
                    },
                        () => [
                            $h(TabPane, {
                                label: "项目",
                                name: "项目",
                            },
                                () => $h(Table, {
                                    size: "small",
                                    loading: me.reactive.loading,
                                    columns: me.reactive.addColumns,
                                    data: me.reactive.projectList,
                                })
                            ),
                            $h(TabPane, {
                                label: "储备项目",
                                name: "储备项目",
                            },
                                () => $h(Table, {
                                    size: "small",
                                    loading: me.reactive.loading,
                                    columns: me.reactive.addColumns,
                                    data: me.reactive.storeProjectList,
                                })
                            )
                        ]
                    ),

                ]
            )
        }

        this.context.renderFunctionMap.info = () => {
            let Image = $resolveComponent('Image');
            let Checkbox = $resolveComponent('Checkbox');
            if (this.reactive.resourceList.length > 0) {
                const { resourceList, insertHeader } = this.reactive
                const todoList: any = []
                // 表body列
                resourceList?.forEach((item: any) => {
                    console.log("teleport", item);

                    todoList.push($h($Teleport, { to: item.qs }, $h('div', { class: `${classes.insertDom} ${classes[item.class]}` }, [render.image(Image, item.qrCode), $h('div', null, render.info(item)),
                    render.checkbox(Checkbox, item, () => { this._checkbox() })])))
                })
                // 表header列
                todoList.push($h($Teleport, { to: insertHeader.to },
                    $h('div', { class: classes.insertHeaderDom },
                        [$h('div', null, insertHeader.name), render.checkbox(Checkbox, insertHeader, (e: boolean) => { this._checkboxTotal(e) })])))
                return todoList;
            }

        }
        // {
        //     "76258": {
        //         "extensionImportIdList": [
        //             {
        //                 "209552": "导入成功"
        //             },
        //             {
        //                 "209553": "导入成功"
        //             },
        //             {
        //                 "209554": "导入成功"
        //             }
        //         ]
        //     }

        this.context.renderFunctionMap.modal = () => {
            const Modal = $resolveComponent('Modal');
            return $h(Modal, {
                title: "导入项目详情",
                modelValue: this.reactive.importDetailShow,
                'onUpdate:modelValue': (show: any) => this.reactive.importDetailShow = show,
            }, {
                default: () => [...Object.keys(me.reactive.importDetail || []).map((key: any) => {
                    const todoList = []
                    if (key && me.reactive.importDetail[key]) {
                        console.log("me.reactive.importDetail[key]", JSON.stringify(me.reactive.importDetail[key]));

                        todoList.push($h('div', { class: classes["import-detail"] }, this.selfCall(() => {
                            const typeList = [];
                            const { extensionImportMap, resourceMap } = me.reactive.importDetail[key];
                            console.log("extensionImportMap, resourceMap", extensionImportMap, resourceMap);
                            if (extensionImportMap || resourceMap) {
                                typeList.push($h('div', { class: classes["import-project-title"] }, `项目${key}(ID)导入资源详情`));

                                if (resourceMap) {
                                    typeList.push($h('div', {}, this.selfCall(() => {
                                        const detailList: any[] = []
                                        Object.keys(resourceMap).map((key: any) => {
                                            detailList.push($h('span', { class: classes["import-project-resource-detail"] }, `资源${key}(ID):${resourceMap[key]}`))
                                        })
                                        return detailList;
                                    })))
                                }
                                if (extensionImportMap) {
                                    typeList.push($h('div', {}, this.selfCall(() => {
                                        const detailList: any[] = []
                                        Object.keys(extensionImportMap).map((key: any) => {
                                            detailList.push($h('span', { class: classes["import-project-extension-detail"] }, `待建联${key}(ID):${extensionImportMap[key]}`))
                                        })
                                        return detailList;
                                    })))
                                }

                            }

                            return typeList;
                        })))
                    }
                    return todoList;
                })]
            }


            )
        }

    }
    _onVisibleChange(e: any) {
        console.log("e", e);

    }
    selfCall(back: Function) {
        return back();
    }
    _checkbox() {
        this.reactive.insertHeader.checked = this.reactive.resourceList!.every(
            (item: any) => item.checked == true
        );
    }
    _checkboxTotal(e: boolean) {
        this.reactive.resourceList.forEach((item: any) => {
            item.checked = e;
        });
    }
    async _pushResource() {
        const { context, reactive } = this;
        const { type, resourceList } = reactive;
        const targetKey = type == "项目" ? "records" : "storeRecords";
        const { $Message } = context;
        const target = reactive[targetKey];

        if (target.length > 0) {
            console.log("resourceList", resourceList);

            const selected = resourceList.find((item: any) => item.checked)
            console.log("selected", selected);
            if (selected) {
                const resource = resourceList.find((item: any) => item.exist.includes("未建联") && item.checked)

                if (resource) {
                    this.reactive.needImportProject = true;
                    this._batchImport();
                } else {
                    this._importResourceToProject()
                }
            } else {
                $Message.warning({ content: "未选中资源，无法导入" });
            }
        } else {
            $Message.warning({ content: "未选中" + type + "，无法导入" });
        }
    }

    async _importResourceToProject() {
        const { context, reactive, options, userTabId, api } = this;
        const { records, resourceList } = reactive;
        const { $Message } = context;
        reactive.needImportProject = false;

        const projectIdList = [];
        const resourceIdList = [];
        const extensionImportIdList = [];
        for (let resource of resourceList) {
            const { checked, resourceId, extensionImportId, name, id } = resource;
            if (checked) {
                if (resourceId) {
                    resourceIdList.push(resourceId);
                } else if (extensionImportId) {
                    if (extensionImportId == 1) {
                        this.api.baojing({ tag: this.options.tag, message: JSON.stringify(resource), site: window.location.href })
                    }
                    extensionImportIdList.push(extensionImportId)
                }
            }
        }
        for (let record of records) {
            projectIdList.push(record.id)
        }
        if (resourceIdList.length > 0 || extensionImportIdList.length > 0) {
            const params = {
                resourceIdList,
                extensionImportIdList,
                opId: userTabId.user.id,
                isBusinessSupervisor: isBusinessSupervisor(userTabId.user),
                // businessSupervisor: true,
                origin: options.tag,
                projectIdList
            }
            const res = await api.projectResource.extensionBatchAdd(params);
            console.log("res", res);
            const { code, data } = res;
            if (code == 0) {
                this.reactive.importDetail = data;
                this.reactive.importDetailShow = true;
                $Message.success({ content: "导入成功" });
            }
        }


    }


    async _batchImport() {
        const { reactive, userTabId } = this;
        const { tabId } = userTabId;
        const { resourceList } = reactive;
        const autoImportList: any = [];
        for (let i = 0; i < resourceList.length; i++) {
            const { exist, checked, id } = resourceList[i];
            if (exist.includes("未建联") && checked) {
                autoImportList.push({ index: i, xtId: id, });
            }
        }
        chrome.runtime.onMessage.addListener((params, sender, sendResponse) => {
            console.log(this.options.tag, 'onMessage', params)
            // 发送方postMessage如果只有一个参数，默认是local
            // window.postMessage(JSON.stringify(params), 'http://op.gaoq.com');
            this._onMessage(params)
        })
        if (autoImportList.length > 0) {
            this.reactive.autoImportList = autoImportList;
            this._autoPatchNext();
        } else {
            this.context.$Message.warning({ content: "未选中资源，无法批量抓取" });
        }
    }

    _onMessage(e: any) {
        console.log("_onMessage", e);
        const { aim, msg, res } = e;
        if (Msg.content通过background转发其他content发送给page == msg && Aim.通知已入库 == aim) {
            const { data, form, error } = res;
            if (error) {
                this.context.$Message.warning({ content: error.message });
            } else {
                this._updateResourceList(form, data);
            }
        }
    }
    abstract _autoPatchNext(): void;
    abstract _updateResourceList(from: any, data: any): void;
    async _searchProject() {
        let res = {};
        if (this.reactive.type == '项目') {
            this.reactive.loading = true;
            res = await this.api.project.extensionSearch(this.reactive.condition);
            this.reactive.loading = false;
        } else {
            this.context.$Message.warning({ content: "储备项目功能正在开发" });
        }
        const { code, data }: any = res;
        if (code == 0) {
            this.reactive.projectList = data;
        }
    }
    private _doSelectAll(selection: any) {
        console.log("doSelectAll", selection);
        selection.forEach((item: any) => {
            let find = this.reactive.records.findIndex(
                (record: any) => record.id === item.id
            );
            if (find < 0) {
                if (this.reactive.type == "项目") {
                    this.reactive.records.push(item);

                } else {
                    this.reactive.storeRecords.push(item);
                }
            }
        });
        console.log("doSelectAll", this.reactive);
    }
    private _doUnSelectAll(selection: any) {
        console.log("doUnSelectAll", selection);
        if (this.reactive.type == "项目") {
            this.reactive.records = selection;
        } else {
            this.reactive.storeRecords = selection;
        }
        console.log("doUnSelectAll", this.reactive);
    }
    private _doSelect(selection: any) {
        console.log("this", this);
        console.log("doSelect", selection);
        if (this.reactive.type == "项目") {
            this.reactive.records = selection;
        } else {
            this.reactive.storeRecords = selection;
        }
        console.log("doSelect", selection, this.reactive);
    }
    private _doUnSelect(selection: any) {
        console.log("doUnSelect", selection);
        if (this.reactive.type == "项目") {
            this.reactive.records = selection;
        } else {
            this.reactive.storeRecords = selection;
        }
        console.log("doUnSelect", selection, this.reactive);
    }
}