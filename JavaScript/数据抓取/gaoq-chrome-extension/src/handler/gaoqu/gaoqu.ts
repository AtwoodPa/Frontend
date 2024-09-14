import { Options } from './../handler.interface';
import { Context, CertPerm } from "../../handler/handler.interface";
import { content2Background, patchFrom } from "../bridge";
import { Msg, Aim } from "../enum";
export class GaoquIndexHandler extends CertPerm {
    constructor(context: Context, options: Options) {
        super(context, options);
        this.doSomething()
    }
    doSomething(): void {
        // background -> content 
        this.context.$Notice.success({
            title: '告趣助手',
            desc: '已加载',
        });
        content2Background(
            patchFrom(
                {
                    message: '告趣助手已加载',
                    msg: Msg.content发送给background,
                    aim: Aim.TTS,
                },
                this.options.tag
            )
        );
        chrome.runtime.onMessage.addListener((params, sender, sendResponse) => {
            console.log(this.options.tag, 'onMessage', params)
            // 发送方postMessage如果只有一个参数，默认是local
            // window.postMessage(JSON.stringify(params), 'http://op.gaoq.com');
            if (Msg.content通过background转发其他content发送给page == params.msg || Msg.background通过content发送给page == params.msg) {
                window.postMessage(JSON.stringify(params));
            }
            sendResponse(this.options.tag + 'echo backgorund');
        })

        // page -> content
        window.addEventListener('message', async e => {
            if (e.data && e.data[0] === "{") {
                try {
                    let json = JSON.parse(e.data);
                    if (Msg.page通过content发送给background == json.msg) {
                        console.log('gaoq page通过content发送给background', json)
                        let data = await content2Background(json)
                        window.postMessage(JSON.stringify(data))
                    } else if (Msg.page发送给content == json.msg) {
                        if (Aim.获取版本信息 == json.aim) {
                            window.postMessage(JSON.stringify(patchFrom(
                                {
                                    msg: Msg.content发送给page,
                                    aim: Aim.获取版本信息,
                                    version: this.options.version
                                },
                                this.options.tag
                            )))
                        }
                    }
                } catch (error) {
                    console.debug(e.data, error)
                }
            }
        });
    }
}