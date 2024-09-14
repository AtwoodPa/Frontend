let apiRoot = 'https://wxapp.gaoq.com';  // 正式用，可以登录
let gaoq01Root = 'https://ec.gaoq.com';
let cxRoot = 'https://ec.gaoq.com';
// let apiRoot = 'https://wxapp.gaoq.com/gq-uat'; //测试用，不能登录
if (import.meta.env.MODE !== "development") {
    apiRoot = 'https://wxapp.gaoq.com';
    cxRoot += '/cxprod'
} else {
    // cxRoot += '/cxuat'
    // cxRoot += '/cxprod'
    cxRoot += '/cxuat'
}
console.log('apiRoot', import.meta.env.MODE, apiRoot, cxRoot)
const noParams = {}
let _api: any = false;
export function makeApi(Ajax: any) {
    if (!_api) {
        let ajax = new Ajax(apiRoot, {
            fixedCost: false,
            withCredentials: false, // 插件contentScript不允许发送cookie
        })
        let gaoq01 = new Ajax(gaoq01Root, {
            fixedCost: false,
            withCredentials: false,
        });
        let cx = new Ajax(cxRoot, {
            fixedCost: false,
            withCredentials: false,
        })
        _api = {
            ajax,
            gaoq01,
            ifInstallCertPem() {
                return gaoq01.get('https://xx.gaoq.com/ifInstallCertPem', noParams)
                // 用ip
                // return gaoq01.get('https://101.34.133.164/ifInstallCertPem', noParams)
                // return gaoq01.get('https://49.234.231.122:88/ifInstallCertPem', noParams)
            },
            resource: {
                fetch(params: any) {
                    return ajax.post('/resource/fetch', params)
                },
                bind(params: any) {
                    return ajax.post('/resource/bind', params)
                },
                existList(params: any) {
                    return ajax.post('/resource/exist/list', params)
                }
            },
            platformAccount: {
                record(params: any) {
                    return cx.post('/platformAccount/record', params)
                }
            },
            resourceXt: {
                makeBymediaIdAndBloggerId(params: any) {
                    return ajax.post('/resourceXt/make/mediaIdAndBloggerId', params)
                },
            },
            resourceTag: {
                addLiveCategoryTag(params: any) {
                    return ajax.post('/resourceTag/add/liveCategoryTag', params)
                },
            },
            notesCollect: {
                addOrUpdate(params: any) {
                    return ajax.post('/notesCollect/addOrUpdate', params)
                }
            },
            fansPgy: {
                addOrUpdate(params: any) {
                    return ajax.post('/fansPgy/addOrUpdate', params)
                }
            },
            projectResource: {
                extensionBatchAdd(params: any) {
                    return ajax.post('/projectResource/extension/batchAdd', params)
                }
            },
            project: {
                extensionSearch(params: any) {
                    return ajax.post('/project/extension/search', params)
                }
            },
            brand: {
                fetch(params: any) {
                    return ajax.post('/brand/fetch', params)
                },
                bind(params: any) {
                    return ajax.post('/brand/bind', params)
                }
            },
            shop: {
                ifUpdate(params: any) {
                    return cx.post('/shop/ifUpdate', params)
                },
                import(params: any) {
                    return cx.post('/shop/import', params)
                }
            },
            goodsImport: {
                import(params: any) {
                    return cx.post('/goodsImport/import', params)
                },
                checkExists(params: any) {
                    return cx.post('/goodsImport/checkExists', params)
                }
            },
            goods: {
                extensionPatch(params: any) {
                    return cx.post('/goods/extensionPatch', params)
                }
            },
            buyerLivePlan: {
                addOrUpdate(params: any) {
                    return ajax.post('/buyerLivePlan/addOrUpdate', params)
                },
            },
            liveCategory: {
                updateOrInsert(params: any) {
                    return cx.post('/live-category/updateOrInsert', params)
                },
            },
            liveProduct: {
                updateOrInsert(params: any) {
                    return cx.post('/live-product/updateOrInsert', params)
                },
            },
            liveShop: {
                updateOrInsert(params: any) {
                    return cx.post('/live-shop/updateOrInsert', params)
                },
            },
            extension: {
                import(params: any, token: string) {
                    return ajax.post('/extension/import?token=' + token, params)
                },
                auto(params: any) {
                    return ajax.post('/extension/auto', params)
                },
                pgyTag(params: any) {
                    return ajax.post("/extension/pgy/tag", params)
                },
                xtTag(params: any) {
                    return ajax.post("/extension/xt/tag", params)
                },
                byTag(params: any) {
                    return ajax.post("/extension/by/tag", params)
                },
                xtFieldTag() {
                    return ajax.get("/extension/xt/fieldTag")
                }
            },
            baojing(params: any) {
                return ajax.post('/baojing', params)
            }
        }
    }
    return _api;
}