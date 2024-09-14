import { Context, Options } from "../handler.interface";
import { content2Background, patchFrom } from "../bridge";
import { Msg, Aim } from "../enum";
import { makeApi } from "../api";
export class PgyCookieWatcher {
    options: Options;
    context: Context;
    constructor(context: Context, options: Options) {
        this.context = context;
        this.options = options;
        this.init();
    }
    get api() {
        return makeApi(this.context.$ajax);
    }

    init() {
        let { $bus, $Message } = this.context;
        const reg: RegExp = /solar\/user\/info/;
        const filter: Function = (res: any) => {
            let body = $bus.parseBody(res);
            return body.data;
        }
        const record: any = { nickName: '', userId: '', cookie: '', platform: '蒲公英' }
        $bus.watch(reg, filter, (data: any) => {
            // console.error('xxxxxx', reg, data);
            record.nickName = data.nickName;
            record.userId = data.userId;
            if (record.nickName && record.userId) {
                content2Background(
                    patchFrom(
                        {
                            msg: Msg.content发送给background,
                            aim: Aim.Cookie,
                            domain: '.xiaohongshu.com'
                        },
                        this.options.tag
                    )
                );
            }
        });
        chrome.runtime.onMessage.addListener(async (params, sender, sendResponse) => {
            // console.log(this.options.tag, 'onMessage', params)
            // 发送方postMessage如果只有一个参数，默认是local
            // window.postMessage(JSON.stringify(params), 'http://op.gaoq.com');
            if (Msg.content发送给background == params.msg && Aim.Cookie == params.aim) {
                record.cookie = params.cookies.map((item: any) => `${item.name}=${item.value}`).join(';');
                if (record.cookie.indexOf('solar.beaker.session.id') > -1) {
                    let todo = await chrome.storage.local.get('user');
                    if (todo && todo.user) {
                        record.opId = todo.user.id;
                    }
                    record.cookies = params.cookies;
                    let { code, data } = await this.api.platformAccount.record(record);
                    if (code == 0) {
                        $Message.success({ content: '已同步账号数据' + record.nickName })
                    }
                } else {
                    console.error('cookie中不包含solar.beaker.session.id', record)
                }
            }
            sendResponse(this.options.tag + 'echo backgorund');
        })
    }

}