import { Context, Options } from "../../handler.interface";
import { CollectHandler } from '../../handler.collect'
import { For, Msg, Aim } from "../../enum";
import { content2Background, patchFrom } from "../../bridge";
import { isBroker } from "../../perm"
import { extractor } from "./index";

export class XhsResourceHandler extends CollectHandler {
    constructor(context: Context, options: Options) {
        super(context, options);
    }
    _ifEnvOk() {
        let { $bus } = this.context;
        let dom = document.querySelector('.login-btn')
        if (dom) {
            const reg: RegExp = /v2\/user\/me/;
            const filter: Function = (res: any) => {
                let body = $bus.parseBody(res);
                console.log(res)
                return body.data;
            }
            $bus.watch(reg, filter, function (data: any) {
                if (!data.guest) {
                    window.location.reload()
                }
            })
            this.context.$Notice.warning({
                title: '请先登录小红书',
                desc: '未登录小红书账号，获取粉丝、获赞与收藏会有偏差，粉丝、获赞与收藏将不会更新',
                duration: 5
            });
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    }
    _parser() {
        let data = extractor.parser();
        data.version = this.options.version;
        return Promise.resolve(data);
    }
    _formMeta(form: any) {
        let { brand } = form;
        let { options, reactive } = this;
        reactive.title = `${brand ? '品牌' : '资源'}基本信息(${options.version})`;
        return [
            this._basicView(form),
            {
                align: 'middle',
                gutter: 0,
                subList: [
                    {
                        span: 4,
                        html: this.render.label('介绍'),
                    },
                    {
                        span: 20,
                        html: form.introduce,
                    },
                    {
                        span: 4,
                        html: this.render.label('标签'),
                    },
                    {
                        span: 20,
                        html: form.customTags.join(','),
                    },
                    {
                        span: 4,
                        html: this.render.label('性别'),
                    },
                    {
                        span: 4,
                        html: form.sex,
                    },
                    {
                        span: 4,
                        html: this.render.label('年龄'),
                    },
                    {
                        span: 4,
                        html: form.age,
                    },
                ],
            },
        ];
    }
    _beforeSubmit(form: any) {
        const { brand } = form;
        if (brand) {
            const { forGaoqu, gaoqId } = this.options;
            if (forGaoqu == For.绑定小红书品牌) {
                this.reactive.data.push({
                    desc: '绑定',
                    record: gaoqId + '',
                })
            }
        }
    }
    _validateSubmit(form: any): boolean {
        console.log("this.userTabId", this.userTabId, isBroker(this.userTabId.user));
        if (isBroker(this.userTabId.user)) {
            const { fanCount, bloggerId, brand } = form;
            if ((fanCount < 5000) && ("63fc2548000000002901430b" != bloggerId) && !brand) {
                this.context.$Notice.warning({
                    title: '粉丝量低',
                    desc: '小红书粉丝量不低于5000才可入库',
                });
                return false;
            }
        }
        form.pass = true;
        return true;
    }
    _validateAuto(form: any): boolean {
        if (!form.uid) {
            this.context.$Notice.error({
                title: '遇到问题-_-!',
                desc: '数据不完备',
            });
            return false;
        }
        return true;
    }
    _ending(form: any) {
        const { tag, fromTabId, forGaoqu, fromId } = this.options;
        if (fromTabId && fromTabId > 0 && forGaoqu == For.回填基础数据) {
            let { mediaId } = form;
            window.navigator.clipboard.writeText(mediaId);
            content2Background(
                patchFrom(
                    {
                        title: '小红书号：' + mediaId + '已复制',
                        message: '请返回op页进行粘贴',
                        msg: Msg.content发送给background,
                        aim: Aim.系统通知
                    },
                    tag
                )
            );
            return content2Background(
                patchFrom(
                    {
                        data: form,
                        toTabId: fromTabId,
                        toId: fromId,
                        msg:
                            Msg.content通过background转发其他content发送给page,
                        aim: Aim.通知已提取,
                        closeTab: true,
                    },
                    tag
                )
            );
        }
    }
}