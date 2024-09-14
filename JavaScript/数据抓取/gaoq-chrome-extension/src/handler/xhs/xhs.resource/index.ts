import { Context, Options } from "../../handler.interface";
import { For } from "../../enum";
import { XhsResourceHandler } from "./xhs.resource";
import { XhsBrandHandler } from "./xhs.brand";
import { getDom, getDomText } from "../../util";
import { text2Int } from "../../filter";
export function getXhsResourceHandler(context: Context, options: Options) {
    if (options.forGaoqu == For.绑定小红书品牌) {
        return new XhsBrandHandler(context, options);
    } else {
        return new XhsResourceHandler(context, options)
    }
}


function arrContainStr(str: any, arr: any) {
    return arr.find((item: any) => str.indexOf(item.trim()) > -1);
}
export const extractor = {
    dynamicDom2Data() {
        let text = getDomText('.user-info .user-tags');
        let age = '',
            region = '',
            contentTags = [],
            personalTag = '';

        if (text) {
            const regionList = '北京 上海 广东 江苏 浙江 重庆 安徽 福建 甘肃 广西 贵州 海南 河北 黑龙江 河南 湖北 湖南 江西 吉林 辽宁 内蒙古 宁夏 青海 山东 山西 陕西 四川 天津 新疆 西藏 云南 香港 澳门 台湾 中国'.split(/\s+/)
            let list = text.split('\n');
            const ageJudgment = list[0].match(/(\d+)/);
            const xingzuoJudgment = list[0].match(/(座)/);

            if (ageJudgment) {
                age = ageJudgment[1];
                if (list.length == 2) {
                    if (arrContainStr(list[1], regionList)) {
                        region = list[1];
                    } else {
                        contentTags = [list[1]];
                    }
                } else if (list.length > 2) {
                    if (arrContainStr(list[1], regionList)) {
                        region = list[1];
                        contentTags = list.splice(2, list.length);
                    } else {
                        contentTags = list.splice(1, list.length);
                    }
                }
            } else {
                if (xingzuoJudgment) {
                    personalTag = list[0].substr(
                        list[0].length - 3,
                        list[0].length
                    );
                    if (list.length == 2) {
                        if (arrContainStr(list[1], regionList)) {
                            region = list[1];
                        } else {
                            contentTags = [list[1]];
                        }
                    } else if (list.length > 2) {
                        if (arrContainStr(list[1], regionList)) {
                            region = list[1];
                            contentTags = list.splice(2, list.length);
                        } else {
                            contentTags = list.splice(1, list.length);
                        }
                    }
                } else {
                    if (arrContainStr(list[0], regionList)) {
                        region = list[0];
                        if (list.length > 1) {
                            contentTags = list.splice(1, list.length);
                        }
                    } else {
                        contentTags = list;
                    }
                }
            }
            if (personalTag) {
                contentTags.push(personalTag);
            }
        }
        let customTags = contentTags[0] ? contentTags : [];
        const data = { age, region, customTags };
        console.log('dynamicDom2Data ok', data);
        return data;
    },
    dom2Data() {
        const userInfo = getDom('.user-info');
        let mediaId = getDomText('.user-redId').replace('小红书号：', '')
        let ip = getDomText('.user-IP').replace('IP属地：', '')
        let name = getDomText('.user-name').trim();
        let introduce = getDomText('.user-info .user-desc');
        if (introduce == '还没有简介') {
            introduce = ''
        }
        let brand = false;
        const brandDom = document.querySelector('.verify-icon .reds-icon use');
        if (brandDom) {
            const xlinkHref: any = brandDom.getAttribute("xlink:href")
            if (xlinkHref.includes("company")) {
                brand = true;
            }
        }
        // console.log("brandDom", brandDom);
        // console.log("brandDom", brandDom.getAttribute("xlink:href"))
        // let brand = !!document.querySelector('.verify-icon');
        let countMap: any = {}
        const interactionList: any = document.querySelectorAll('.user-interactions div');
        for (let dom of interactionList) {
            let { innerText } = dom;
            if (innerText.indexOf('关注') > -1) {
                countMap.followCount = innerText.replace('关注', '')
            } else if (innerText.indexOf('粉丝') > -1) {
                countMap.fanCount = innerText.replace('粉丝', '')
            } else if (innerText.indexOf('获赞与收藏') > -1) {
                countMap.greatCount = innerText.replace('获赞与收藏', '')
            }
        }
        const sexDom = getDom(".gender svg[class='reds-icon']");
        let img = getDom('.avatar-component-avatar-container img');
        let sex = '';

        if (sexDom != null) {
            sex =
                sexDom.children[0].attributes['xlink:href'].nodeValue ===
                    '#female'
                    ? '女'
                    : '男';
        }
        if (!img) {
            img = userInfo.querySelector('img');
        }

        let photo = img.getAttribute('src');
        const data = {
            brand,
            ip,
            sex,
            name,
            photo,
            mediaId,
            introduce,
            ...countMap
        };
        console.log('dom2Data ok', data);
        return data;
    },
    parser() {
        let {
            fanCount,
            greatCount,
            followCount,
            ...others
        } = this.dom2Data();
        let dynamicDom2Data: any = this.dynamicDom2Data();
        let { region, customTags } = dynamicDom2Data;
        let site = window.location.origin + window.location.pathname;
        let uid = window.location.pathname.replace('/user/profile/', '');
        followCount = text2Int(followCount);
        fanCount = text2Int(fanCount);
        greatCount = text2Int(greatCount);
        let age: any = dynamicDom2Data.age == 0 ? '' : text2Int(dynamicDom2Data.age);

        const data = {
            ...others,
            age,
            uid,
            site,
            region,
            fanCount,
            greatCount,
            customTags,
            followCount,
            origin: '小红书',
            platform: '小红书',
        };
        console.log('data cleaning ok', data);
        return data;
    }
}