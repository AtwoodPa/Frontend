import evalCore from 'chrome-inject-eval'
import api from './api'
// import { Context } from '../handler/handler.interface';
const evil = evalCore.getEvalInstance(window);
let remoteHandler: any = false;
let forceDefault = true;
// 不要用testRemote了，因为npm run build之后，dist/handler.index.js就是prod了，如果本地还跑着npm run dev，那么
if (import.meta.env.MODE == 'production') {
    forceDefault = false;
    // testRemote = false;
}
console.debug('evalCore', import.meta.env.MODE, forceDefault)
// 数据逻辑和版本号
let defaultHandler: any = false;
const storeKey = 'remote';
function getDefaultHandler(msg: string) {
    return new Promise(function (resolve) {
        if (!defaultHandler) {
            // 避免一开执行，就覆盖whiteList
            console.debug('extension', msg);
            import('../handler/handler.index').then(function ({ default: defaultFunction }) {
                defaultHandler = defaultFunction('default');
                resolve(defaultHandler);
            });
        } else {
            resolve(defaultHandler);
        }
    });
}
async function updateRemote(localVersion: string, refresh: boolean) {
    let { code, data } = await api.extension.get(/*testRemote ? {
        localVersion: '忽略' + localVersion,
        version: '压缩测试'
    } :*/ { localVersion });

    if (code === 0) {
        if (data.version && data.code) {
            await chrome.storage.local.set({ [storeKey]: data }, function () {
                refresh && window.location.reload();
                console.debug(
                    "update remote callback",
                    refresh,
                    data.version
                );
            });
            console.debug('extension', "update remote done", data.version);
            // if (data.version != '压缩测试') {
            remoteHandler = makeRemoteHandler(data)
            // }
        } else {
            console.log(data);
        }
    }
}
function makeRemoteHandler(config: { version: string, code: string }) {
    let { version, code } = config;
    // code = code.replace(/import\{\S* as \S*?\}from\"\.\/common\.index\.js\";import\"\.\/viewuiplus\.js\";/, '');
    let match = code.match(/export{\S* as default};\s*$/);
    if (match) {
        code = code.substr(0, match.index)
    }
    let sep = `console.log("12345abcde");`;
    if (code.indexOf(sep) > -1) {
        let [_import, _code] = code.split(sep)
        // console.log('_code', _import)
        code = '(function() {' + _import + ';return (' + _code + ')("' + version + '");})()';
        let todo = evil(code);
        console.debug('extension', "make remoteHandler", todo.options);
        return todo
    } else {
        chrome.storage.local.remove(storeKey).then(function () {
            window.location.reload()
        });
    }
}
export async function bindHandler(context: any) {
    window['_context'] = context;
    if (forceDefault/* && !testRemote*/) {
        return getDefaultHandler("forceDefault use default");
    } else if (remoteHandler) {
        console.debug('extension', 'reuse remoteHandler');
        return remoteHandler;
    } else {
        let cache = await chrome.storage.local.get(storeKey);
        if (cache && cache.hasOwnProperty(storeKey)) {
            try {
                console.debug('extension', "hit cache make remoteHandler");
                remoteHandler = makeRemoteHandler(cache[storeKey])
                console.debug('extension', "hit cache updateRemote");
                updateRemote(remoteHandler.version, true);
                return remoteHandler;
            } catch (e) {
                console.debug('extension', 'evil remote error getRemote', e);
            }
        }
        console.debug('extension', "loss cache updateRemote");
        await updateRemote('default', false);
        console.debug('extension', "window.location.reload");
        return remoteHandler;
    }
}