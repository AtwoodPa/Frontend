import { Render } from "./handler.collect.jss";


export function getAuthorContentData(target: any, key: any, multiplier = 1) {
    if (target) {
        const value = target[key];
        if (value) {
            if (typeof value == "number") {
                return Math.ceil(value * multiplier)
            } else {
                return Math.ceil(Number(value) * multiplier)
            }
        } else if (value === 0) {
            return value
        }
    }
    return null;
}
export async function portRequest(api: any, url: string, name: string, tag: string, params: any = null, tryCount = 5) {
    let response = null
    try {
        if (params) {
            response = await api.ajax.post(url, params)
        } else {
            response = await api.ajax.get(url);
        }
        console.log("url", url);
        const pass = response.data.hasOwnProperty(name)
        console.log("pass", pass);
        if (!pass) {
            throw new Error("data数据出错")
        }
    } catch (error: any) {
        if (tryCount > 0) {
            // return portRequest(vm, url, name, --tryCount)
        } else {
            api.baojing({ tag, error: error.message, at: `portRequest ${url}`, url: window.location.href });
        }
    }
    return response
}
function f0(color: string): any {
    return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)]) && (color.length === 6) ? color : f0(color)
}
export function randomColor() {
    return '#' + f0('')
}
export function formatDate(date: Date, fmt: string = 'yyyy-MM-dd hh:mm') {
    let o: any = {
        // 月份
        'M+': date.getMonth() + 1,
        // 日
        'd+': date.getDate(),
        // 小时 0-24
        'h+': date.getHours(),
        // 分
        'm+': date.getMinutes(),
        // 秒
        's+': date.getSeconds(),
        // 季度
        'q+': Math.floor((date.getMonth() + 3) / 3),
        // 毫秒
        'S': date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return fmt
}

function judgeDataType(data: any) {
    return Object.prototype.toString.call(data).slice(8, -1);
}
/*
  * @param object
  * 可以深度遍历 param 属性值为对象数组、对象的数据结构转为array
  *  */
export function objectToList(viewObject: any, render: Render) {
    let viewList: any[] = [];
    if (viewObject != null && judgeDataType(viewObject) === 'Object') {
        Object.keys(viewObject).forEach((item) => {
            const value = viewObject[item];
            if (judgeDataType(value) === 'Object') {
                viewList.push({ span: 24, html: render.mainLabel(item) });
                let deepViewList = objectToList(value, render);
                viewList = [...viewList, ...deepViewList];
            } else if (
                judgeDataType(value) === 'Array' &&
                value &&
                value.length > 0
            ) {
                if (value[0] instanceof Object) {
                    value.forEach((item: any) => {
                        let deepViewList = objectToList(item, render);
                        viewList = [...viewList, ...deepViewList];
                    });
                } else {
                    console.log('objectToList');
                    viewList.push({ span: 24, html: '' });
                    viewList.push({ span: 4, html: render.label(item) });
                    viewList.push({
                        span: 20,
                        html: viewObject[item].join(','),
                    });
                }
            } else {
                viewList.push({ span: 4, html: render.label(item) });
                viewList.push({ span: 4, html: viewObject[item] });
            }
        });
    }
    return viewList;
}

export function tryDo(outTime = 1500, fun: Function) {
    return new Promise((resolve, inject) => {
        let time = 0
        const timer = setInterval(() => {
            const content = fun();
            if (content) {
                resolve(content)
                clearInterval(timer)
            } else {
                time += 50;
                if (time > outTime) {
                    resolve(content)
                    clearInterval(timer);
                }
            }
        }, 50)
    })
}

export function sleep(outTime = 1500) {
    return new Promise((resolve) => {
        setTimeout(resolve, outTime)
    })
}

export function getDomText(selector: any) {
    const dom = getDom(selector);
    return dom ? dom.innerText : '';
}
export function getDom(selector: any) {
    const dom = document.querySelector(selector);
    if (!dom) {
        console.warn(`${selector} of selector is null`);
    }
    return dom;
}

export function detectTagData(data: any, key: any) {
    console.log(data[key]);
    let flag = false;
    for (let item of data[key]) {
        if (item.tags && (item.tags.length > 0)) {
            flag = true
            break;
        }
    }
    return flag
}

export function text2number(text: string) {
    let ratio = 1;
    if (text.indexOf('亿') > -1) {
        text = text.replace('亿', '')
        ratio = 100000000;
    } else if (text.indexOf('千万') > -1) {
        text = text.replace('千万', '')
        ratio = 10000000;
    } else if (text.indexOf('百万') > -1) {
        text = text.replace('百万', '')
        ratio = 1000000;
    } else if (text.indexOf('万') > -1) {
        text = text.replace('万', '')
        ratio = 10000;
    } else if (text.indexOf('千') > -1) {
        text = text.replace('千', '')
        ratio = 1000;
    }
    return Number(text) * ratio;
}