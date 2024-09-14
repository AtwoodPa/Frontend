import { Context, Options, CertPerm } from "../handler.interface";
import { SearchHandler } from "../handler.search"
import { detectTagData } from "../util";
import { For, Msg, Aim } from "../enum";
import { content2Background, patchFrom } from "../bridge";

export function getPgySearchHandler(context: Context, options: Options) {
    if (options.forGaoqu == For.检测是否登录) {
        return new CheckLoginHandler(context, options);
    } else {
        return new PgySearchHandler(context, options)
    }
}
export class CheckLoginHandler extends CertPerm {
    constructor(context: Context, options: Options) {
        super(context, options);
        this._init();
    }

    async _init() {
        let pageLogin = false;
        let login = await this._checkEnv();
        let content = "蒲公英环境检测正常";
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
                    "蒲公英插件环境检测"
                )
            );
        }

    }
    async doSomething() {
        let pageLogin = false;
        const { context } = this;
        let data: any = await context.$bus.subscribe(
            /solar\/cooperator\/blogger\/v2/,
            (rs: any) => {
                let body = context.$bus.parseBody(rs);
                return body;
            }
        );
        console.log("doSomething", data);

        if (data.data?.kols) {
            pageLogin = true;
        }
        return pageLogin;
    }
}
export class PgySearchHandler extends SearchHandler {
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
        const { api } = this;
        const data = await this.busTagsData(api);
        const tag = this.dataHandle(data);
        console.log('tag', tag);
        const detectContentTags = detectTagData(tag, 'contentTags')
        const detectFeatureTags = detectTagData(tag, 'featureTags')
        const detectPersonalTags = detectTagData(tag, 'personalTags')
        const liveCategoryTags = detectTagData(tag, 'liveCategoryTags')
        detectPersonalTags && detectFeatureTags && detectContentTags && liveCategoryTags && await api.extension.pgyTag(tag);
    }
    _updatePage() {
    }
    _autoPatchNext() {
    }
    async busTagsData(api: any) {
        const tagTreePromise = api.ajax.get('https://pgy.xiaohongshu.com/api/solar/cooperator/content/tag_tree');
        const tagsConfigV2Promise = api.ajax.get('https://pgy.xiaohongshu.com/api/solar/kol/get_select_kol_tags_config_v2');
        const tagsDistributorPromise = api.ajax.get('https://pgy.xiaohongshu.com/api/draco/distributor-square/distributors-tags');
        const [
            tagTreeBody,
            tagsConfigBody,
            tagsDistributor] = await Promise.all([
                tagTreePromise,
                tagsConfigV2Promise,
                tagsDistributorPromise
            ]);
        const { personalTags, featureTags } = tagsConfigBody.data;
        const contentTags = tagTreeBody.data;

        const { distribution_category: liveCategoryTags } = tagsDistributor.data.distributor_tag_map;
        const data = {
            contentTags,
            featureTags,
            personalTags,
            liveCategoryTags
        };
        console.log('busTagsData ok ', data);
        return data;
    }
    dataHandle(param: any) {
        const contentTags = this.deconstructionTransformation(
            param.contentTags
        );
        const featureTags = this.deconstructionTransformation(
            param.featureTags
        );
        const personalTags = this.deconstructionTransformation(
            param.personalTags
        );
        const liveCategoryTags = this.deconstructionTransformationLive(
            param.liveCategoryTags
        )

        const data = {
            contentTags,
            featureTags,
            personalTags,
            liveCategoryTags
        };
        console.log('dataHandle ok', data);
        return data;
    }
    deconstructionTransformation(list: any) {
        let tags: any = [];
        list.forEach((obj: any) => {
            let data: any = {};
            if (obj['taxonomy2Tag'] != '母婴阶段') {
                Object.keys(obj).forEach((key) => {
                    if (obj[key] instanceof Array && obj[key].length > 0) {
                        data['tags'] = obj[key];
                    }
                });
                if (
                    obj.hasOwnProperty('taxonomy2Tag') &&
                    typeof obj['taxonomy2Tag'] == 'string'
                ) {
                    data['tag'] = obj['taxonomy2Tag'];
                } else {
                    data['tag'] = obj['taxonomy1Tag'];
                }
                tags.push(data);
            }
        });
        return tags;
    }
    deconstructionTransformationLive(list: any) {
        let tags: any = []
        list.forEach((obj: any) => {
            const { first_category, second_category } = obj;
            tags.push({ tag: first_category, tags: second_category })
        })
        return tags;
    }
}