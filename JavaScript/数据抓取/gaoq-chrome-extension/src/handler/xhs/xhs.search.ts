import { CertPerm, Context, Options } from "../handler.interface";
import { For, Msg, Aim } from "../enum";
import { content2Background } from "../bridge";
export class XhsSearchHandler extends CertPerm {
    constructor(context: Context, options: Options) {
        super(context, options)
        this.doSomething();
    }
    patchForGaoquFromTabId(dom: any, tabId: any) {
        let { forGaoqu, fromTabId, gaoqId } = this.options;
        if (dom && dom.tagName.toLowerCase() == 'a') {
            dom.href = dom.href + `?forGaoqu=${forGaoqu}&fromTabId=${fromTabId}&gaoqId=${gaoqId}&closeTabIds=${tabId}`
        }
    }
    async doSomething() {
        let tabId = await content2Background(
            {
                msg: Msg.content发送给background,
                aim: Aim.获取当前tabId
            }
        );
        let { forGaoqu, fromTabId, gaoqId } = this.options;
        if (For.绑定小红书品牌 == forGaoqu && fromTabId && gaoqId) {
            let todoList: any = document.querySelectorAll('.content-container .channel');
            for (let todo of todoList) {
                if (todo.innerText.trim() === '用户') {
                    todo.click();
                    break;
                }
            }
            setTimeout(() => {
                let vList: any = document.querySelectorAll('.verify-icon')
                console.log('vList', vList)
                for (let v of vList) {
                    let parent = v.parentNode;
                    this.patchForGaoquFromTabId(parent, tabId)
                    while (parent && !parent.classList.contains('user-list-item')) {
                        parent = parent.parentNode;
                        this.patchForGaoquFromTabId(parent, tabId)
                    }
                    if (parent) {
                        parent.style = 'background-color: #19be6b';
                    }
                }
            }, 2000)
        }
    }
}