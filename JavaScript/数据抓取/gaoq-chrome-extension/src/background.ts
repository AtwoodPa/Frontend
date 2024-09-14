// 从util.ts中拷贝
function patchFrom(params: any, from: any) {
    params._from = 'gaoqu extension ' + from;
    return params;
}
const Msg = {
    page通过content发送给background: 'page通过content发送给background',
    background通过content发送给page: 'background通过content发送给page',
    content通过background转发其他content发送给page: "content通过background转发其他content发送给page",
    content发送给background: 'content发送给background',
    background发送给content: 'background发送给content'
}
// 非content与background通信的携带信息
const Aim = {
    获取当前tabId: '获取当前tabId',
    通知已补丁: '通知已补丁',
    通知已提取: '通知已提取',
    设置插件认证码: '设置插件认证码',
    清除插件认证码: '清除插件认证码',
    关闭当前并跳转tab: '关闭当前并跳转tab',
    系统通知: '系统通知',
    通知已入库: '通知已入库',
    清理缓存: '清理缓存',
    TTS: 'TTS',
    Cookie: 'Cookie',
    SetCookies: 'SetCookies'
}
const Tag = 'background';


// https://lf-headquarters-speed.yhgfb-cn-static.com/obj/rc-client-security/web/glue/1.0.0.26/sdk-glue.js
// https://lf-c-flwb.bytetos.com/obj/rc-client-security/web/glue/1.0.0.49/sdk-glue.js
// return "PROXY 49.234.231.122:88;DIRECT";
// https://lf-c-flwb.bytetos.com/obj/rc-client-security/web/glue/1.0.0.49/sdk-glue.js
// https://lf-c-flwb.bytetos.com/obj/rc-client-security/c-webmssdk/1.0.0.20/webmssdk.es5.js
//  https://lf-c-flwb.bytetos.com/obj/rc-client-security/web/glue/1.0.0.51/sdk-glue.js
// https://pgy.xiaohongshu.com/solar/pre-trade/blogger-detail/5faccee100000000010048ae?track_id=kolMatch_23b9520593644455973011189e8ac574&source=Advertiser_Kol_1
const config = {
    mode: 'pac_script',
    pacScript: {
        url: 'http://101.34.133.164/cxprod/static/proxy.pac'
        //     data: `function FindProxyForURL(url, host) {
        //     if (host == "lf-headquarters-speed.yhgfb-cn-static.com" || host == "www.lf-headquarters-speed.yhgfb-cn-static.com" || host == "lf-c-flwb.bytetos.com"|| host == "www.lf-c-flwb.bytetos.com") {
        //       return "PROXY 49.234.231.122:88";
        //     } else if (host == "xx.gaoq.com") {
        //       return "PROXY 49.234.231.122:88;DIRECT";
        //     } else {
        //       return "DIRECT";
        //     }
        //   }`
    }
}
// turn off
// const config = {
//     mode: 'system'
// }

// chrome.webRequest.onBeforeRequest.addListener(
//     function (details) {
//         console.log('onBeforeRequest', details)
//         chrome.scripting.executeScript({
//             target: { tabId: details.tabId },
//             func: () => {
//                 let { href } = window.location;
//                 var usePgySend = href.indexOf('pgy.xiaohongshu.com') > -1;
//                 var XHR = XMLHttpRequest.prototype;
//                 var open = XHR.open;
//                 var setRequestHeader = XHR.setRequestHeader;
//                 var rewrited = false;
//                 function rewriteSend(send) {
//                     if (!rewrited) {
//                         rewrited = true;
//                         console.log('rewriteSend', send)
//                         XHR.send = function (postData) {
//                             this.addEventListener('load', function () {
//                                 var myUrl = this._url ? this._url.toLowerCase() : this._url;
//                                 console.log('myUrl', myUrl)
//                                 if (myUrl) {
//                                     // here you get the RESPONSE HEADERS
//                                     var responseHeaders = this.getAllResponseHeaders();
//                                     // console.log('responseHeaders', responseHeaders, postData)
//                                     if (['', 'text'].includes(this.responseType) && this.responseText) {
//                                         // responseText is string or null
//                                         try {
//                                             window.postMessage({ "ajax_rewrite": JSON.stringify({ url: this._url, postData, requestHeaders: this._requestHeaders, responseHeaders, responseText: this.responseText }) }, '*');//userik就从GLOBALS中取得
//                                         } catch (err) {
//                                             console.log(err, "Error in responseType try catch");
//                                         }
//                                     }
//                                 }
//                             });
//                             return send.apply(this, arguments);
//                         };
//                     }
//                 }
//                 if (usePgySend) {

//                 } else {
//                     rewriteSend(XHR.send)
//                 }
//                 XHR.open = function (method, url) {
//                     this._method = method;
//                     this._url = url;
//                     this._requestHeaders = {};
//                     this._startTime = (new Date()).toISOString();
//                     if (usePgySend && url.includes('shield/webprofile')) {
//                         rewriteSend(XHR.send)
//                     }
//                     return open.apply(this, arguments);
//                 };

//                 XHR.setRequestHeader = function (header, value) {
//                     this._requestHeaders[header] = value;
//                     return setRequestHeader.apply(this, arguments);
//                 };

//                 console.log('ajax-rewrite done')
//             },
//         });

//         return { redirectUrl: 'http://101.34.133.164/cxprod/static/ajax-rewrite.js' };
//     },
//     { urls: ['http://localhost/cxprod/static/ajax-rewrite.js*'] },
//     // ["blocking"]
// );
// chrome.webRequest.onBeforeRequest.addListener(
//     function (details) {
//         console.log('onBeforeRequest', details)
//         return { redirectUrl: 'http://101.34.133.164/cxuat/static/ajax-rewrite.js' };
//     },
//     { urls: ['http://localhost/cxprod/static/ajax-rewrite.js'] },
//     // ["blocking"]
// );

// chrome.webRequest.onCompleted.addListener(
//     function (details) {
//         console.log(details)
//         return { cancel: details.url.indexOf("://www.evil.com/") != -1 };
//     },
//     { urls: ['https://pgy.xiaohongshu.com/solar/pre-trade/blogger-detail/*'] },
// );

chrome.proxy.settings.set(
    { value: config, scope: 'regular' },
    function () {
        console.log('proxy load')
        chrome.proxy.settings.get(
            { 'incognito': false },
            function (config) {
                console.log(config);
            }
        );
    }
);
chrome.runtime.onMessage.addListener(async function (params, sender: chrome.runtime.MessageSender, sendResponse) {
    let { msg, aim } = params;
    if (Msg.page通过content发送给background === msg) {
        if (Aim.获取当前tabId == aim) {
            sendResponse(patchFrom({ msg: Msg.background通过content发送给page, aim, tabId: sender.tab ? sender.tab.id : '获取不到' }, Tag))
        } else if (Aim.设置插件认证码 == aim) {
            let { user, extra } = params;
            sendResponse(patchFrom({ msg: Msg.background通过content发送给page, aim, user }, Tag));
            await chrome.storage.local.set({ user });
            console.log('chrome.storage.local.set extensionToken', user, extra)
            if (extra) {
                let { isExtensionSignIn, fromTabId } = extra;
                if (isExtensionSignIn && fromTabId) {
                    fromTabId = +fromTabId;
                    chrome.tabs.update(fromTabId, { active: true })
                    chrome.tabs.sendMessage(fromTabId, { msg: Msg.background发送给content, aim, user })
                    if (sender.tab && sender.tab.id) {
                        chrome.tabs.remove(sender.tab.id)
                    }
                }
            }
        } else if (Aim.清除插件认证码 === aim) {
            await chrome.storage.local.remove('user');
            sendResponse(patchFrom({ msg: Msg.background通过content发送给page, aim }, Tag))
        } else if (Aim.关闭当前并跳转tab === aim) {
            let { tabId } = params;
            tabId = +tabId;
            chrome.tabs.update(tabId, { active: true })
            if (sender.tab && sender.tab.id) {
                chrome.tabs.remove(sender.tab.id)
            }
        } else if (Aim.SetCookies === aim) {
            let { cookies } = params;
            // sendResponse只能同步执行
            console.log('SetCookies', params)
            sendResponse('background receive Aim.SetCookies ok')
            let cookieList = await Promise.all(cookies.map((details: chrome.cookies.SetDetails) => chrome.cookies.set(details)))
            if (sender.tab) {
                let sendTabId: any = sender.tab.id;
                console.log('cookieList', cookieList)
                chrome.tabs.sendMessage(sendTabId, { msg: Msg.background通过content发送给page, aim, cookieList })
            }
        }
    } else if (Msg.content通过background转发其他content发送给page === msg) {
        let { toTabId, closeTab, closeTabIds } = params;
        if (toTabId) {
            if (closeTab) {
                chrome.tabs.update(toTabId, { active: true })
            }
            chrome.tabs.sendMessage(toTabId, params, sendResponse)
        }
        if (closeTab && sender.tab && sender.tab.id) {
            chrome.tabs.remove(sender.tab.id)
        }
        if (closeTabIds) {
            closeTabIds.forEach(function (tabId: number) {
                chrome.tabs.remove(tabId)
            })
        }
    } else if (Msg.content发送给background === msg) {
        if (Aim.系统通知 === aim) {
            let { title, message } = params;
            chrome.tts.speak(message);
            chrome.notifications.create({
                type: "basic",
                title,
                message,
                iconUrl: "icons/logo.png"
            })
        } else if (Aim.清理缓存 === aim) {
            let { options, dataSet, title, message } = params;
            chrome.browsingData.remove(options, dataSet, function () {
                console.log('清理缓存 done', options, dataSet)
                chrome.tts.speak(message);
                chrome.notifications.create({
                    type: "basic",
                    title,
                    message,
                    iconUrl: "icons/logo.png"
                })
            });
        } else if (Aim.TTS === aim) {
            let { message } = params;
            chrome.tts.speak(message);
        } else if (Aim.Cookie === aim) {
            let { domain } = params;
            // sendResponse只能同步执行
            sendResponse('background receive Aim.Cookie ok')
            let cookies = await chrome.cookies.getAll({ domain });
            if (sender.tab) {
                let sendTabId: any = sender.tab.id;
                params.cookies = cookies;
                chrome.tabs.sendMessage(sendTabId, params)
            }
            // console.log('cookies', cookies)
        } else if (Aim.获取当前tabId === aim) {
            sendResponse(sender.tab ? sender.tab.id : '')
        }
    }
})
const manifest = chrome.runtime.getManifest();
console.log('manifest', manifest);
const activeList: string[] = []
manifest.content_scripts?.forEach(function ({ js, matches }) {
    if (js?.length && js[0] !== 'content-dev.js') {
        matches?.forEach(function (todo) {
            let wenPos = todo.indexOf('?');
            if (wenPos > -1) {
                todo = todo.substring(0, wenPos)
            }
            activeList.push(todo.replace('*', ''))
        })
    }
})
console.log('activeList', activeList);
function needActive(url: string | undefined) {
    if (url) {
        for (let i = 0; i < activeList.length; i++) {
            if (url.indexOf(activeList[i]) > -1) {
                return true;
            }
        }
    }
    return false;
}
chrome.tabs.onActivated.addListener(async function (activeInfo: chrome.tabs.TabActiveInfo) {
    let { tabId } = activeInfo;
    let tab: chrome.tabs.Tab = await chrome.tabs.get(tabId);
    if (needActive(tab.url)) {
        chrome.action.setBadgeTextColor({ color: '#fff' })
        chrome.action.setBadgeBackgroundColor({ color: 'green' })
        chrome.action.setBadgeText({ text: 'ON' })
    } else {
        chrome.action.setBadgeTextColor({ color: '#fff' })
        chrome.action.setBadgeBackgroundColor({ color: 'red' })
        chrome.action.setBadgeText({ text: 'OFF' })
    }
    console.log(Tag, 'onActivated', tabId, tab.url)
});
