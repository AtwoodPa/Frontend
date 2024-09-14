import { Context, Options, CertPerm } from "../handler.interface";
import { SearchHandler } from '../handler.search'
import { For, Msg, Aim } from "../enum";
import { content2Background, patchFrom } from "../bridge";
import { sleep } from "../util";

export function getBySearchHandler(context: Context, options: Options) {
    if (options.forGaoqu == For.绑定百应资源) {
        return new ByBindResourceHandler(context, options);
    } else if (options.forGaoqu == For.查询百应存在资源) {
        return new ByCheckExistsHandler(context, options);
    } else if (options.forGaoqu == For.检测是否登录) {
        return new CheckLoginHandler(context, options);
    } else {
        return new BySearchHandler(context, options)
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
        //                     content: "百应未登录",
        //                     pass: false,
        //                     toTabId: fromTabId,
        //                     msg:
        //                         Msg.content通过background转发其他content发送给page,
        //                     aim: Aim.环境检测,
        //                     closeTab: true,
        //                 },
        //                 "百应插件环境检测"
        //             )
        //         );
        //     }

        // };
        let login = await this._checkEnv();
        let content = "百应环境检测正常";
        console.log("login", login);

        // 测试是否登录
        if (login) {
            // 确定登录后再验证是否登录星图
            pageLogin = await this.doSomething()
        } else {
            content = "插件未登录"
        }
        console.log("pageLogin", pageLogin);

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
                    "百应插件环境检测"
                )
            );
        }

    }
    async doSomething() {
        let pageLogin = false;
        const { context } = this;
        let data: any = await context.$bus.subscribe(
            /api\/authorStatData\/seekAuthor/,
            (rs: any) => {
                let body = context.$bus.parseBody(rs);
                return body;
            }
        );
        console.log("doSomething", data);

        if (data.data?.event_track_log_id) {
            pageLogin = true;
        }
        return pageLogin;
    }
}

export class ByBindResourceHandler extends CertPerm {
    constructor(context: Context, options: Options) {
        super(context, options);
        this.doSomething();
    }
    doSomething(): void {
        const { keyword, forGaoqu, fromTabId, gaoqId } = this.options
        if (keyword) {
            let it = setInterval(() => {
                let input: any = document.querySelector(".index__selectorAutoComplete___1Qfjc .auxo-input-group-wrapper .auxo-input")
                console.log("input", input);
                if (input) {
                    clearInterval(it)
                    input.value = keyword;
                    var eventInput = new InputEvent('input', {
                        'bubbles': true
                    })
                    input.dispatchEvent(eventInput)
                    let search: any = document.querySelector(".index__selectorAutoComplete___1Qfjc .auxo-input-group-addon .auxo-input-search-button")
                    search.click()

                    setTimeout(() => {
                        let parent: any = document.querySelector(".auxo-sp-infinit-container")
                        console.log("parent", parent);
                        parent.addEventListener("click", async function (event: any) {
                            // 处理点击事件的逻辑
                            console.log("event", event);
                            event.stopPropagation();
                            event.preventDefault();
                            let dom = event.target;
                            try {
                                while (dom && !dom.classList.contains('daren-card')) {
                                    dom = dom.parentNode;
                                }
                                if (dom) {
                                    console.log('dom', dom)
                                    let uid = dom.getAttribute('data-item-uid')
                                    let aTag = document.createElement('a')
                                    aTag.href = "https://buyin.jinritemai.com/dashboard/servicehall/daren-profile?uid=" + uid + '&fromTabId=' + fromTabId + '&forGaoqu=' + forGaoqu + '&gaoqId=' + gaoqId
                                    aTag.target = "_blank"
                                    aTag.click()
                                }
                            } catch (e) {
                                console.error(e)
                            }
                        });
                    }, 2000)
                }
            }, 500)
        }
    }
}
export class ByCheckExistsHandler extends CertPerm {
    constructor(context: Context, options: Options) {
        super(context, options);
        this.doSomething();
    }
    doSomething(): void {
        const { keyword, fromTabId, fromId } = this.options
        const { $bus } = this.context
        if (keyword) {
            let it = setInterval(async () => {
                let input: any = document.querySelector(".index__selectorAutoComplete___1Qfjc .auxo-input-group-wrapper .auxo-input")
                console.log("input", input);
                if (input) {
                    clearInterval(it)
                    await sleep(500);
                    console.log("keyword", keyword);
                    input.value = keyword
                    var eventInput = new InputEvent('input', {
                        'bubbles': true
                    })
                    input.dispatchEvent(eventInput)
                    // let search = await wait(5000, () => { return document.querySelector(".index__selectorAutoComplete___1Qfjc .auxo-input-group-addon .auxo-input-search-button") })
                    let search: any = document.querySelector(".index__selectorAutoComplete___1Qfjc .auxo-input-group-addon .auxo-input-search-button")
                    console.log("search", search);
                    let str = "api\\/authorStatData\\/seekAuthor\\?type=2&page=1&refresh=true&req_source=0&query=" + encodeURIComponent(keyword)
                    const regex = new RegExp(str)
                    console.log("search", regex);
                    const resultPromise = $bus.subscribe(
                        regex,
                        function (rs: any) {
                            let body = $bus.parseBody(rs);
                            console.log("body", body);
                            return body.data.hasOwnProperty('list') ? body.data : false;
                        }
                    );
                    search.click()
                    const result: any = await resultPromise;
                    console.log("result", result);
                    let { list } = result;
                    let data = {
                        jump: false,
                        byCode: ''
                    }
                    let hit = list ? list[0] : false;
                    if (hit && hit.author_base && hit.author_base.aweme_id == keyword) {
                        data.byCode = hit.author_base.uid
                    } else {
                        data.jump = true
                    }
                    return content2Background(
                        patchFrom(
                            {
                                data,
                                toTabId: fromTabId,
                                toId: fromId,
                                msg:
                                    Msg.content通过background转发其他content发送给page,
                                aim: Aim.通知已提取,
                                closeTab: true,
                            },
                            "查询百应存在资源"
                        )
                    );

                }
            }, 500)
        }
    }
}

export class BySearchHandler extends SearchHandler {
    _updateResourceList(from: any, data: any): void {
        throw new Error("Method not implemented.");
    }
    constructor(context: Context, options: Options) {
        super(context, options);
    }
    _otherCss() {
        return {}
    }
    async _collectTag() {
        const { $bus } = this.context;
        const res = await this.busTagsData($bus);
        const tag = this.dataHandle(res);
        // const detectMainCategoryTags = this.detectTagData(tag, 'mainCategoryTags')
        await this.api.extension.byTag(tag);
    }
    _updatePage() {
    }
    _autoPatchNext() {

    }
    async busTagsData(bus: any) {
        const data = await bus.subscribe(
            /\/common\/square\/squareConf/,
            function (rs: any) {
                let body = bus.parseBody(rs);
                return body?.data;
            }
        );
        console.log('busTagData ok ', data);
        return data;
    }
    dataHandle(res: any) {
        const { content_types, main_cates } = res
        const contentTags: any = []
        const mainCategoryTags = []
        content_types.forEach((item: any) => {
            contentTags.push({ tag: item })
        })
        main_cates.forEach((item: any) => {
            const { name, sub_cates } = item
            // const tags = sub_cates.map(item => item.name)
            mainCategoryTags.push({
                tag: name
            })
        })
        console.log("main_cates", main_cates);
        const data = { byMainCategoryTags: main_cates, contentTags }
        console.log('busTagData ok ', data);

        return data;
    }
}