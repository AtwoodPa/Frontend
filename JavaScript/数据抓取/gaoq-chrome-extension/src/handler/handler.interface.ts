import { content2Background } from "./bridge";
import { Msg, Aim } from "./enum";
import { makeApi } from "./api";
export interface Context {
    src: string;
    publication: string;
    $bus: any;
    $ajax: any;
    $resolveComponent: Function,
    $h: Function,
    $Teleport: any;
    $Suspense: any;
    $Notice: any;
    $toRaw: any;
    $computed: any;
    $jss: any;
    $Message: any;
    $Modal: any;
    $reactive: any;
    $Copy: any;
    renderFunctionMap: any;
}

export interface Options {
    gaoqId?: number;
    fromId?: any;
    fromTabId?: number;
    forGaoqu?: number;
    grab?: number;
    forDebug?: number;
    version: string;
    tag: string;
    needInstallCertPem?: boolean;
    keyword?: any;
    name?: any;
    closeTabIds?: number[];
    login?: boolean
}
export interface UserTabId {
    user: any;
    tabId: string;
    href: string;
}
export class CertPerm {
    options: Options;
    context: Context;
    isInstallCertPem: boolean = false;
    userTabId!: UserTabId;
    constructor(context: Context, options: Options) {
        this.context = context;
        this.options = options;
    }
    get api() {
        return makeApi(this.context.$ajax);
    }
    async _checkEnv(): Promise<boolean> {
        let pass = await this._ifInstallCertPem();
        if (pass) {
            pass = await this._ifEnvOk()
        }
        return pass;
    }

    _ifEnvOk(): Promise<boolean> {
        return Promise.resolve(true);
    }
    async _prepareUser() {
        let { context } = this;
        let userTabId = context.$reactive({
            user: false,
            tabId: '',
        });
        this.userTabId = userTabId;
        content2Background(
            {
                msg: Msg.content发送给background,
                aim: Aim.获取当前tabId
            }
        ).then(tabId => {
            userTabId.tabId = tabId + '';
            userTabId.href = (import.meta.env.MODE == "development" ? 'http://localhost:8088' : 'http://op.gaoq.com') + '/#/signIn/extension?fromTabId=' + tabId
        });
        let todo = await chrome.storage.local.get('user');
        console.log("todo.user", todo.user);
        userTabId.user = todo.user;
        chrome.runtime.onMessage.addListener((params, sender, sendResponse) => {
            console.log(this.options.tag, 'onMessage', params)
            // 发送方postMessage如果只有一个参数，默认是local
            // window.postMessage(JSON.stringify(params), 'http://op.gaoq.com');
            let { user, aim } = params;
            if (Msg.background发送给content) {
                if (Aim.设置插件认证码 == aim) {
                    userTabId.user = user;
                    let contentList = [user.name];
                    if (user.deptNames && user.deptNames.length) {
                        contentList.push(user.deptNames.join('/'))
                    }
                    if (user.roleName) {
                        contentList.push(user.roleName);
                    }
                    context.$Modal.success({
                        title: '插件已登录',
                        content: contentList.join('-')
                    });
                    this._afterLogin();
                }
            }
            sendResponse(this.options.tag + 'echo backgorund');
        })
    }
    _afterLogin() {
        console.warn("Method _afterLogin not implemented.");
    }
    _signOut = () => {
        chrome.storage.local.remove('user').then(() => {
            this.userTabId.user = false;
        });
    }
    async _ifInstallCertPem() {
        if (this.isInstallCertPem || !this.options.needInstallCertPem) {
            return true;
        }
        let install = false;
        try {
            const rs = await this.api.ifInstallCertPem();
            install = rs.install;
        } catch (e) {
            console.debug("ifInstallCertPem", e);
            this.api.baojing({ tag: this.options.tag, message: JSON.stringify(e), site: window.location.href })
        }
        if (install) {
            this.isInstallCertPem = true;
            return true;
        } else {
            this.context.$Notice.error({
                title: '请更新插件和安装证书',
                desc: '请在OP 下载中心 中下载插件和证书，并按照教程安装',
            });
        }
        return false;
    }
}