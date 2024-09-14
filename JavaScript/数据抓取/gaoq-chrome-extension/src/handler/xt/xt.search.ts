import { Context, Options, CertPerm } from "../handler.interface";
import { SearchHandler } from '../handler.search'
import { PlatformMap, SiteMap, For, Msg, Aim } from "../enum";
import { content2Background, patchFrom } from "../bridge";
import { tryDo, detectTagData } from "../util";
import { photo } from "../filter";

export function getXtSearchHandler(context: Context, options: Options) {
    console.log("options.forGaoqu", options.forGaoqu);

    if (options.forGaoqu == For.查询星图存在资源) {
        return new XtCheckExistsHandler(context, options);
    } else if (options.forGaoqu == For.检测是否登录) {
        return new CheckLoginHandler(context, options);
    } else {
        return new XtSearchHandler(context, options)
    }
}

export class CheckLoginHandler extends CertPerm {
    constructor(context: Context, options: Options) {
        super(context, options);
        this._init();
    }

    async _init() {
        let pageLogin = false;
        // window.onbeforeunload = () => {
        //     const { fromTabId, tag } = this.options
        //     window.onbeforeunload = null;
        //     if (!pageLogin) {
        //         return content2Background(
        //             patchFrom(
        //                 {
        //                     tag,
        //                     content: "星图未登录",
        //                     pass: false,
        //                     toTabId: fromTabId,
        //                     msg:
        //                         Msg.content通过background转发其他content发送给page,
        //                     aim: Aim.环境检测,
        //                     closeTab: true,
        //                 },
        //                 "星图插件环境检测"
        //             )
        //         );
        //     }

        // };
        let login = await this._checkEnv();
        let content = "星图环境检测正常";
        // 测试是否登录
        if (login) {
            // 确定登录后再验证是否登录星图
            pageLogin = await this.doSomething()
        } else {
            content = "插件未登录"
        }
        if (login && pageLogin) {
            const { fromTabId, tag } = this.options
            return content2Background(
                patchFrom(
                    {
                        tag,
                        content,
                        pass: pageLogin,
                        toTabId: fromTabId,
                        msg:
                            Msg.content通过background转发其他content发送给page,
                        aim: Aim.环境检测,
                        closeTab: true,
                    },
                    "星图插件环境检测"
                )
            );
        }

    }
    async doSomething() {
        let xtLogin = false;
        const { context } = this;
        let { authors } = await context.$bus.subscribe(
            /api\/gsearch\/search_for_author_square/,
            (rs: any) => {
                let body = context.$bus.parseBody(rs);
                return body;
            }
        );
        if (authors && authors.length > 0) {
            xtLogin = true;
        }
        return xtLogin;
    }

}

export class XtCheckExistsHandler extends CertPerm {
    constructor(context: Context, options: Options) {
        super(context, options);
        this.doSomething();
    }
    doSomething(): void {
        const { keyword, fromTabId, fromId, gaoqId, name } = this.options
        const { $bus } = this.context
        if (keyword && name) {
            let it = setInterval(async () => {
                console.log("subscribeList", JSON.parse(JSON.stringify($bus.getSubscribeList())));
                let input: any = document.querySelector(".search-input-new .search-input-inner input")
                if (input) {
                    clearInterval(it)
                    input.value = keyword;
                    var eventInput = new InputEvent('input', {
                        bubbles: true,
                    })
                    input.dispatchEvent(eventInput)
                    let bar: any = document.querySelector(".market-search-top-bar")
                    bar.click()
                    // 因为 页面初始化的是时候 有一次请求/api\/gsearch\/search_for_author_square/，自己点击搜索又是一次，可能点击太快后直接搜索，订阅不到点击的搜索
                    await tryDo(800, () => { });
                    let { authors }: any = await $bus.subscribe(
                        /api\/gsearch\/search_for_author_square/,
                        (rs: any) => {
                            let body = $bus.parseBody(rs);
                            return body;
                        }
                    );

                    let data = { jump: false, xtId: '' }
                    let hit = authors ? authors[0] : false;
                    if (hit) {
                        const nick_name = hit.attribute_datas.nick_name;
                        console.log("nick_name.includes(name)||name.includes(nick_name)", nick_name.includes(name) || name.includes(nick_name));

                        if (nick_name.includes(name) || name.includes(nick_name)) {
                            data.xtId = hit.star_id
                        } else {
                            data.jump = true
                        }
                    }

                    console.log('hit', fromId, data, hit, name, authors)
                    return content2Background(
                        patchFrom(
                            {
                                id: gaoqId,
                                data,
                                toTabId: fromTabId,
                                toId: fromId,
                                msg:
                                    Msg.content通过background转发其他content发送给page,
                                aim: Aim.通知已提取,
                                closeTab: true,
                            },
                            "查询星图存在资源"
                        )
                    );
                }
            }, 500)

        }
    }
}
export class XtSearchHandler extends SearchHandler {
    constructor(context: Context, options: Options) {
        super(context, options);
    }
    _otherCss() {
        return {
            '.author-info-list': {
                width: '500px'
            }
        }
    }
    async _collectTag() {
        const { $bus } = this.context;
        const data = await this.busTagData($bus);
        const tag = this.dataHandle(data);
        const detectContentTags = detectTagData(tag, 'contentTags')
        const detectFieldTags = detectTagData(tag, 'fieldTags')
        console.log('tag', tag);
        detectFieldTags && detectContentTags && await this.api.extension.xtTag(tag);
    }
    _updatePage() {
        const { $bus } = this.context;
        const reg: RegExp = /\/api\/gsearch\/search_for_author_square/;
        const filter: Function = (res: any) => {
            let body = $bus.parseBody(res);
            return body;
        }
        const callback: Function = (res: any) => {
            this.listExtension(res);
        }
        $bus.watch(reg, filter, callback)
    }
    // _makeFormFunction() {
    //     let { context, reactive, classes, render } = this;
    //     let { $resolveComponent, $h, $Teleport } = context;
    //     const { resourceList, insertHeader } = reactive
    //     context.renderFunctionMap.info = () => {
    //         let Image = $resolveComponent('Image');
    //         let Checkbox = $resolveComponent('Checkbox');
    //         const todoList: any = []
    //         // 表body列
    //         resourceList?.forEach((item: any) => {
    //             console.log("teleport", item);

    //             todoList.push($h($Teleport, { to: item.qs }, $h('div', { class: `${classes.insertDom} ${classes[item.class]}` }, [render.image(Image, item.qrCode), $h('div', null, render.info(item)),
    //             render.checkbox(Checkbox, item, () => { this._checkbox() })])))
    //         })
    //         // 表header列
    //         todoList.push($h($Teleport, { to: insertHeader.to },
    //             $h('div', { class: classes.insertHeaderDom },
    //                 [$h('div', null, insertHeader.name), render.checkbox(Checkbox, insertHeader, (e: boolean) => { this._checkboxTotal(e) })])))
    //         return todoList;
    //     }
    // }
    _autoPatchNext() {
        const { context, reactive } = this;
        const { autoImportList, needImportProject } = reactive
        const autoImport = reactive.autoImportList.find((item: any) => item.imported == undefined);
        if (autoImport) {
            let url = `${SiteMap.星图}${autoImport.xtId}?forGaoqu=${For.主页自动入库}&fromTabId=${this.userTabId.tabId}`
            window.open(url)
        } else {
            if (needImportProject) {
                this._importResourceToProject();
            }
        }
    }
    _updateResourceList(form: any, data: any) {
        const { xtId } = form;
        const { content } = data;
        const { context, reactive } = this;
        const { autoImportList, resourceList } = reactive
        const match = content.match(/(\d+)/);
        const extensionImportId = match[1];
        const autoImport = autoImportList.find((item: any) => item.xtId == xtId);
        const { index } = autoImport;
        autoImport.imported = true;
        resourceList[index].extensionImportId = extensionImportId;
        resourceList[index].exist = `待建联 / ${extensionImportId}`;
        resourceList[index].class = `op-doing`;
        this._autoPatchNext();
    }
    async listExtension(res: any) {
        console.log("获取到list body", res);
        let { authors } = res;
        const nameList: any = []
        const codeList: any = []
        // 取用粉丝数，是为了处理名字重复的问题
        const avatarMap: any = {}
        authors.forEach((item: any) => {
            const { nick_name, id, avatar_uri } = item.attribute_datas;
            const match = avatar_uri.match(/aweme-avatar\/(\S+)\./);
            const key = match[1];
            nameList.push(nick_name)
            codeList.push(id)
            avatarMap[key] = {
                name: nick_name,
                id,
            }
        })
        const params = {
            platformId: PlatformMap.抖音,
            key: "xtId",
            // nameList,
            codeList,
            fields: "name, mediaId, xtId, publication, mcn, qyGgCode, qyWxCode, qyBdCode, directWise, rebate",
            extensionFields: "name, mediaId, xtId, mcn"
        }
        const { code, data } = await this.api.resource.existList(params);
        const { resourceList, extensionImportList } = data;
        const resourceCodeMap: any = {};
        // const resourceNameMap: any = {};
        const extensionImportMap: any = {};
        resourceList.forEach((item: any) => {
            const { name, xtId } = item;
            resourceCodeMap[xtId] = item;
            // if (!xtId) {
            //     resourceNameMap[name] = item;
            // }
        })
        extensionImportList.forEach((item: any) => {
            if (item.id == 1) {
                this.api.baojing({ tag: this.options.tag, message: JSON.stringify(item), site: window.location.href })
            }
            extensionImportMap[item.xtId] = item;
        })
        Object.keys(avatarMap).forEach(key => {
            const { name, id } = avatarMap[key];
            avatarMap[key].checked = false;
            if (resourceCodeMap.hasOwnProperty(id)) {
                const { publication, mcn, qyGgCode, qyWxCode, qyBdCode, directWise, rebate } = resourceCodeMap[id];
                let qrCode = qyGgCode;
                let qrCodeType = "广告"
                if (!qrCode) {
                    qrCode = qyWxCode;
                    qrCodeType = "电商"
                }
                if (!qrCode) {
                    qrCode = qyBdCode;
                    qrCodeType = "本地生活"
                }
                avatarMap[key].exist = `已建联 / ${resourceCodeMap[id].id}`
                avatarMap[key].publication = publication
                avatarMap[key].mcn = mcn
                avatarMap[key].resourceId = resourceCodeMap[id].id
                avatarMap[key].qrCode = qrCode && photo(qrCode)
                avatarMap[key].qrCodeType = qrCode && qrCodeType
                avatarMap[key].directWise = directWise
                avatarMap[key].rebate = rebate
            } else {
                if (extensionImportMap[id]) {
                    avatarMap[key].exist = `待建联 / ${extensionImportMap[id].id}`
                    avatarMap[key].extensionImportId = extensionImportMap[id].id;

                } else {
                    // if (resourceNameMap.hasOwnProperty(name)) {
                    //     avatarMap[key].exist = `可能已建联 / ${resourceNameMap[name].id}`
                    // } else {
                    avatarMap[key].exist = `未建联`
                    // }
                }
            }
        })
        this.reactive.avatarMap = avatarMap;
        console.log("avatarMap", avatarMap);

        await this.insertDom(avatarMap, resourceCodeMap, extensionImportMap);
    }
    // 资源列表中插入列信息、逻辑、样式
    async insertDom(avatarMap: any, resourceCodeMap: any, extensionImportMap: any) {
        const authorInfoListWrapper: any = await tryDo(2000, () => document.querySelector(".author-table .author-info-list-wrapper .author-info-list"));
        this.reactive.insertHeader = {
            to: ".table-header .author-header",
            name: "op信息",
            checked: false
        }
        const xtInfoDom: any = await tryDo(2000, () => authorInfoListWrapper.querySelectorAll(".lazy-load"))
        const resourceList = [];
        console.log("xtInfoDom", xtInfoDom);
        console.log("xtInfoDom", xtInfoDom.length);

        for (let i = 0; i < xtInfoDom.length; i++) {
            const infoDomList: any = await tryDo(6000, () => {
                console.log("xtInfoDom[i].children", xtInfoDom[i].children);
                return xtInfoDom[i].children;
                // const infoDomList: any = xtInfoDom[i].children;
                // if (infoDomList.length >= 4) {
                //     return infoDomList;
                // }
            })

            console.log("infoDomLst", infoDomList.length);

            for (let x = 0; x < infoDomList.length; x++) {
                const infoDom = infoDomList[x]
                let imgDom = infoDom.querySelector(".user-avatar-image")
                // 页面更新，dom采用懒加载，等待dom加载完毕逻辑
                if (!imgDom) {
                    imgDom = await tryDo(8000, () => {
                        const xtInfoDom: any = document.querySelector(".author-table .author-info-list-wrapper .author-info-list .lazy-load")
                        const img = xtInfoDom.children[i].children[x].querySelector(".user-avatar-image")
                        console.log("img", img);
                        return img
                    }
                    )
                }
                const imgSrc = imgDom.getAttribute("src");
                const key: any = Object.keys(avatarMap).find(key => imgSrc.includes(key));
                const { id } = avatarMap[key];
                const dataXtId = infoDom.getAttribute("data-xtId");
                if (!dataXtId || (dataXtId && (resourceCodeMap.hasOwnProperty(dataXtId) || extensionImportMap.hasOwnProperty(dataXtId)))) {
                    if (resourceCodeMap[id]) {
                        avatarMap[key].class = "op-done"
                    }
                    if (extensionImportMap[id]) {
                        avatarMap[key].class = "op-doing"
                    }
                }
                infoDom.setAttribute("data-xtId", id);
                infoDom.style.position = 'relative'
                const teleport = { qs: `.author-info[data-xtid="${id}"]`, ...avatarMap[key] }
                resourceList.push(teleport)
            }

        }
        this.reactive.resourceList = resourceList;
        console.log("this.context", this.context);
        console.log("this.reactive", this.reactive);
    }
    async busTagData($bus: any) {
        const data = await $bus.subscribe(
            /\/api\/user\/author_options/,
            (rs: any) => {
                let body = $bus.parseBody(rs);
                console.log("body", body);
                return body?.data;
            }
        );
        console.log('busTagData ok ', data);
        return data;
    }
    dataHandle({ content_tag_v2, industry_tag_v2 }: any) {
        let contentData = this.deconstructionTransformation(content_tag_v2);
        const contentTags = contentData.tagList;
        let { tagList, tagMap } = this.deconstructionTransformation(
            industry_tag_v2
        );
        const data = {
            contentTags,
            fieldTags: tagList,
            fieldMap: tagMap,
        };
        console.log('dataHandle ok', data);
        return data;
    }
    deconstructionTransformation(tagData: any) {
        const tagList: any = [];
        const tagMap: any = {};
        tagData.forEach((item: any) => {
            const { first, second }: any = item;
            const tag = Object.values(first)[0];
            Object.assign(tagMap, first);
            const tags: any = [];
            second.forEach((inItem: any) => {
                tags.push(...Object.values(inItem));
            });
            tagList.push({ tag, tags });
        });
        return { tagList, tagMap };
    }

}