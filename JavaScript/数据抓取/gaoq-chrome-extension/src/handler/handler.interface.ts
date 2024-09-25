import { content2Background } from "./bridge";
import { Msg, Aim } from "./enum";
import { makeApi } from "./api";

/**
 * 上下文对象，包含各种与应用相关的工具和功能，比如$ajax用于发送网络请求，$Modal用于显示弹窗等
 */
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
    $jss: any; // 样式
    $Message: any;
    $Modal: any;
    $reactive: any;
    $Copy: any;
    renderFunctionMap: any;
}

/**
 * 配置对象，定义了一些插件初始化的可选参数，比如gaoqId、version和tag等。
 */
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

/**
 * 管理插件的认证逻辑
 */
export class CertPerm {
    options: Options;// 配置对象
    context: Context;// 上下文对象
    isInstallCertPem: boolean = false;// 标志位，表示是否已安装证书
    userTabId!: UserTabId; // 用户tabId对象，包含用户信息、tabId和href
    constructor(context: Context, options: Options) {
        this.context = context;
        this.options = options;
    }

    /**
     * 创建一个与后端进行交互的API实例
     */
    get api() {
        return makeApi(this.context.$ajax);
    }

    /**
     * 检查环境是否满足插件运行的条件
     */
    async _checkEnv(): Promise<boolean> {
        let pass = await this._ifInstallCertPem();
        if (pass) {
            pass = await this._ifEnvOk()
        }
        return pass;
    }

    /**
     * 检查是否安装了证书
     */
    _ifEnvOk(): Promise<boolean> {
        return Promise.resolve(true);
    }

    /**
     * 准备用户信息
     */
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
        // 通过chrome.storage从本地存储 获取用户信息
        let todo = await chrome.storage.local.get('user');
        console.log("todo.user", todo.user);
        userTabId.user = todo.user;
        // 通过坚挺chrome.runtime.onMessage监听消息，接收来自后台的消息
        // 当用户登陆时，展示相关的用户信息弹窗
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

    /**
     * 登录成功后的操作
     */
    _afterLogin() {
        console.warn("Method _afterLogin not implemented.");
    }

    /**
     * 登出
     */
    _signOut = () => {
        // 清楚本地存储中的用户信息
        chrome.storage.local.remove('user').then(() => {
            this.userTabId.user = false;
        });
    }

    /**
     * 检查是否安装了证书
     */
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