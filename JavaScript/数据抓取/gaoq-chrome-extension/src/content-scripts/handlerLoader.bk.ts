import evalCore from 'chrome-inject-eval'
import Ajax from '~/api/ajax'
let apiRoot = 'https://wxapp.gaoq.com';
let ajax = new Ajax(apiRoot, {
    fixedCost: false,
    withCredentials: false, // 插件contentScript不允许发送cookie
})
const evil = evalCore.getEvalInstance(window);
let remoteHandler: any = false;
let forceDefault = true;
if (import.meta.env.MODE == 'production') {
    forceDefault = false;
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
async function getNewestRemoteHandler(localVersion: string) {
    let { code, data } = await ajax.get('/extension/get', { localVersion });
    if (code === 0) {
        if (data.version && data.code) {
            await chrome.storage.local.set({ [storeKey]: data });
            console.debug(
                "update remote callback",
                localVersion,
                data.version
            );
            console.debug('extension', "update remote done", data.version);
            return makeRemoteHandler(data)
        }
    }
    return false;
}

async function getNewestRemoteOrLocalHandler(localVersion: string, localCode: string) {
    let handler = await getNewestRemoteHandler(localVersion);
    if (!handler) {
        handler = await makeRemoteHandler({ version: localVersion, code: localCode })
    }
    return handler;
}

async function makeRemoteHandler(config: { version: string, code: string }) {
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
        console.log("todo", todo);

        console.debug('extension', "make remoteHandler", todo.options);
        return todo
    } else {
        await chrome.storage.local.remove(storeKey);
        window.location.reload()
    }
}
export async function bindHandler(context: any, useCacheFirst = false) {
    window['_context'] = context;
    if (forceDefault) {
        return getDefaultHandler("forceDefault use default");
    } else if (remoteHandler) {
        console.debug('extension', 'reuse remoteHandler');
        return remoteHandler;
    } else {
        let cache = await chrome.storage.local.get(storeKey);
        let version = 'default';
        let code = '';
        if (cache && cache.hasOwnProperty(storeKey)) {
            version = cache[storeKey].version;
            code = cache[storeKey].code;
        }
        if (useCacheFirst) {
            remoteHandler = await makeRemoteHandler({ version, code });
        }
        if (!remoteHandler) {
            remoteHandler = await getNewestRemoteOrLocalHandler(version, code);
        }
        return remoteHandler;
    }
}