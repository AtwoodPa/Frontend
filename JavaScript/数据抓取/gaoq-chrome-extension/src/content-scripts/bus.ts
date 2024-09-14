const todoList: any = [];
const subscribeList: any = [];
const watchList: any = [];
export class Bus {
    whiteList: string[] = [];
    setWhiteList(whiteList: string[]) {
        console.log("setWhiteList", whiteList);
        this.whiteList = whiteList;
    }
    publish(dataStr: string) {
        const data = JSON.parse(dataStr);
        let pass = true;
        if (this.whiteList.length > 1) {
            pass = false;
            for (var i = 0; i < this.whiteList.length; i++) {
                let todo = this.whiteList[i];
                if (data.url.indexOf(todo) > -1) {
                    pass = true;
                    break;
                }
            }
        }
        if (pass) {
            todoList.push(data);
            this.digest(data);
        }
    }
    digest(data: any) {
        // console.log('digest', data);
        for (let i = subscribeList.length - 1, j = 0; i >= j; i--) {
            let { regex, controlList } = subscribeList[i];
            let match = data.url.match(regex);
            if (match) {
                console.debug("digest subscribe match", data, controlList);
                for (let control of controlList) {
                    if (control.status == "todo") {
                        let hit = control.filter(data);
                        console.log("hit", hit);
                        if (hit) {
                            control.resolve(hit);
                            control.status = "resolved";
                            clearTimeout(control.it);
                        }
                    } else {
                        console.debug("digest after timeout", control);
                    }
                }
                subscribeList.splice(i, 1);

            }
        }

        for (let watch of watchList) {
            let { regex, controlList } = watch;
            let match = data.url.match(regex);
            if (match) {
                console.debug("digest watch match", data, controlList);
                for (let { cb, filter } of controlList) {
                    let hit = filter(data);
                    if (hit) {
                        cb(hit);
                    }
                }
            }
        }
    }

    watch(regex: RegExp, filter: Function, cb: Function) {
        if (!filter) {
            throw 'bus.watch filter必填';
        }
        let data = this.getPortData(regex, filter);
        if (data) {
            cb(data);
        }

        let control = { cb, filter };
        const find = watchList.find((item: any) => item.regex.toString() == regex.toString());
        console.log("find", find);

        if (find) {
            find.controlList.push(control);
        } else {
            watchList.push({ regex, controlList: [control] });
        }
    }
    subscribe(regex: RegExp, filter: Function, second: number = 5000) {
        if (!filter) {
            throw 'bus.subscribe filter必填';
        }
        return new Promise((resolve, reject) => {
            let data = this.getPortData(regex, filter);
            if (data) {
                resolve(data);
            } else {
                let control = { resolve, status: "todo", filter, it: -1 as any };
                const find = subscribeList.find((item: any) => item.regex.toString() == regex.toString());
                if (find) {
                    find.controlList.push(control);
                } else {
                    subscribeList.push({ regex, controlList: [control] });
                }
                // console.log("subscribeList", subscribeList);
                control.it = setTimeout(function () {
                    if (control.status === "todo") {
                        console.log("subscribe failed", regex, '请确保加入白名单');
                        reject();
                        control.status = "rejected";
                    }
                }, second);
            }
        });
    }
    parseBody(data: any) {
        if (
            !data.body &&
            typeof data.responseText == "string" &&
            data.responseText[0] === "{"
        ) {
            try {
                data.body = JSON.parse(data.responseText);
                delete data.responseText;
            } catch (e) {
                console.debug(e, data.responseText);
            }
        }
        return data.body;
    }
    parseHeader(data: any) {
        if (!data.headers && typeof data.responseHeaders == "string") {
            const headers: any = {};
            const headerList = data.responseHeaders.split("\r\n");
            headerList.forEach((item: any) => {
                if (item) {
                    let [key, value] = item.split(/\s*:\s*/);
                    headers[key] = value;
                }
            });
            data.headers = headers;
        }
        return data.headers;
    }
    getPortData(reg: RegExp, filter: Function) {
        for (let i = todoList.length - 1; i >= 0; i--) {
            let todo = todoList[i];
            if (reg.test(todo.url)) {
                let hit = filter(todo);
                if (hit) {
                    return hit;
                }
            }
        }
        return null;
    }
    getTodoList() {
        return todoList;
    }
    getSubscribeList() {
        return subscribeList;
    }
    getWatchList() {
        return watchList;
    }
}
console.log('第几份bus');
export const bus = new Bus();
let { href } = window.location;
let isOp = href.indexOf('op.gaoq.com') > -1 || href.indexOf('localhost:8088') > -1;
if (isOp) {
    console.log('isOp')
} else {

    let useSdkGlue = href.indexOf('buyin.jinritemai') > -1 || href.indexOf('www.douyin.com') > -1;

    if (useSdkGlue) {

    } else {
        const AjaxRewrite = document.createElement("script");
        AjaxRewrite.id = "ajaxRewrite";
        // AjaxRewrite.src = 'http://localhost/cxprod/static/ajax-rewrite.js';
        AjaxRewrite.src = chrome.runtime.getURL("content-scripts/injected/ajax-rewrite.js");
        AjaxRewrite.onload = function () {
            AjaxRewrite.remove();
        };
        console.log('src', AjaxRewrite.src);
        (document.head || document.documentElement).appendChild(AjaxRewrite);
    }
    window.addEventListener(
        "message",
        function (event) {
            if (event.data.ajax_rewrite) {
                let data = event.data.ajax_rewrite;
                bus.publish(data);
            }
        },
        false
    );
    chrome.storage.local.get('whiteList').then(cache => {
        if (cache && cache.hasOwnProperty('whiteList')) {
            console.table([{ name: 'chrome.storage.local.get', msg: 'ok', length: cache.whiteList.length }])
            bus.setWhiteList(cache.whiteList)
        }
    })
}