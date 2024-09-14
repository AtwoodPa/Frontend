import { Context, Options } from "../handler.interface";
import { CollectHandler } from '../handler.collect'
import { For, Msg, Aim } from "../enum";
import { content2Background, patchFrom } from "../bridge";
import { getDom } from "../util";
import { text2Int } from "../filter";
export class DyResourceHandler extends CollectHandler {
    constructor(context: Context, option: Options) {
        super(context, option);
    }
    async _parser() {
        let {
            name,
            kind,
            photo,
            fanCount,
            introduce,
            greatCount,
            followCount,
        } = this.dom2Data();
        let dynamicDom2Data = this.dynamicDom2Data();
        let {
            ip,
            sex,
            region,
            mediaId,
            customTags,
        } = dynamicDom2Data
        let age: any = dynamicDom2Data.age;
        let site = window.location.origin + window.location.pathname;
        const match: any = site.match(/https:\/\/www.douyin.com\/user\/(\S+)/);
        let uid = match[1];
        if (kind) {
            customTags = [...customTags, ...kind.split('、')];
        }
        followCount = text2Int(followCount);
        fanCount = text2Int(fanCount);
        greatCount = text2Int(greatCount);
        age = age == '' ? '' : text2Int(age);
        let data = {
            ip,
            age,
            sex,
            uid,
            name,
            site,
            photo,
            region,
            mediaId,
            version: this.options.version,
            fanCount,
            introduce,
            greatCount,
            customTags,
            followCount,
            origin: '抖音',
            platform: '抖音',
        };
        return data;
    }
    _validateAuto(form: any): boolean {
        console.log("form", form);
        if (!form.uid) {
            this.context.$Notice.error({
                title: '遇到问题-_-!',
                desc: '数据不完备',
            });
            return false;
        }
        return true;
    }
    _validateSubmit(form: any): boolean {
        return true;
    }
    _formMeta(form: any) {
        let { options, reactive } = this;
        reactive.title = `资源基本信息(${options.version})`;
        return [
            this._basicView(form),
            {
                align: 'middle',
                gutter: 0,
                subList: [
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
                        html: this.render.label('介绍'),
                    },
                    {
                        span: 20,
                        html: form.introduce,
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
            }
        ]
    }
    _ending(form: any) {
        const { tag, fromTabId, forGaoqu, fromId } = this.options;
        console.log("tag, fromTabId, forGaoqu, fromI", tag, fromTabId, forGaoqu, fromId);

        if (fromTabId && fromTabId > 0 && forGaoqu == For.回填基础数据) {
            let { mediaId } = form;
            window.navigator.clipboard.writeText(mediaId);
            content2Background(
                patchFrom(
                    {
                        title: '抖音号：' + mediaId + '已复制',
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
    dom2Data() {
        let userInfo = getDom('div[data-e2e="user-info"]');
        let text = userInfo.children[0].innerText;
        let match = text.match(/(.*)\n*(\S*)?/);
        let [$0, name, kind] = match;
        text = userInfo.children[1].innerText;
        match = text.match(/关注\s*(\S*)\s*粉丝\s*(\S*)\s*获赞\s*(\S*)\s*/);
        let [$00, followCount, fanCount, greatCount] = match;
        let introduce = ""
        if (userInfo.children[3]) {
            let introduceDom = userInfo.children[3].children[0];
            const introduceList = introduceDom.children
            console.log("length", length);
            if (introduceList.length > 1) {
                const text = introduceList[1].innerText;
                if (text == '更多') {
                    const mouseOverEvent = new MouseEvent('mouseover', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    introduceDom.dispatchEvent(mouseOverEvent);
                    introduce = introduceList[2].innerText;
                }
            } else {
                introduce = introduceDom.innerText
            }
        }
        console.log("introduce", introduce);
        let img = getDom(
            'div[data-e2e="user-detail"] .avatar-component-avatar-container img'
        );
        if (!img) {
            img = userInfo.previousSibling.querySelector('img');
        }
        console.error('????', img)
        let photo = img.getAttribute('src');
        const data = {
            name,
            kind,
            photo,
            fanCount,
            introduce,
            greatCount,
            followCount,
        };
        console.log('dom2Data ok', data);
        return data;
    }
    dynamicDom2Data() {
        let match: any = '';
        let text = '';
        let sex = '';
        let age = '';
        let region = '';
        let userInfo = getDom('div[data-e2e="user-info"]');
        const user3Dom = userInfo.children[2];
        text = user3Dom.innerText;
        match = text.match(/抖音号：(\S*)\s*(IP属地：\S*)?/);
        let [$000, mediaId, ip] = match;
        let ipNoneFlag = 0;
        if (!ip) {
            ip = '';
            ipNoneFlag = 1;
        } else {
            ip = ip.replace('IP属地：', '');
        }
        const customTags = [];
        const domList = user3Dom.children;
        if (domList.length > 2 - ipNoneFlag) {
            text = domList[2 - ipNoneFlag].innerText;
            match = text.match(/(\d*)[男女岁]/);
            if (match) {
                // 男女
                if (match[1] == '') {
                    sex = match[0];
                    // 年龄
                } else {
                    age = match[1];
                }
            } else {
                match = text.match(/(\S*)·(\S*)/);
                if (match) {
                    region = `${match[1]} ${match[2]}`;
                } else {
                    customTags.push(text);
                }
            }
        }
        if (domList.length > 3 - ipNoneFlag && region == '') {
            text = domList[3 - ipNoneFlag].innerText;
            match = text.match(/(\S*)·(\S*)/);
            if (match) {
                region = `${match[1]} ${match[2]}`;
            } else {
                customTags.push(text);
            }
        }

        if (domList.length > 4 - ipNoneFlag) {
            customTags.push(domList[4 - ipNoneFlag].innerText);
        }

        if (domList.length > 2 - ipNoneFlag && sex == '' && age != '') {
            const sexDom = domList[2 - ipNoneFlag].children[0];
            const flag = sexDom ? sexDom.getAttribute('xmlns') : '';
            if (sexDom && flag == 'http://www.w3.org/2000/svg') {
                if (sexDom.children.length > 1) {
                    sex = '女';
                } else {
                    sex = '男';
                }
            }
        }
        const data = {
            ip,
            sex,
            age,
            region,
            mediaId,
            customTags,
        };
        console.log('dynamicDom2Data ok', data);
        return data;
    }
}