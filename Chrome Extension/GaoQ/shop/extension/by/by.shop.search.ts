import { Options, CertPerm, Context } from './../handler.interface';
import { For, Msg, Aim } from "../enum";
import {sleep} from "../util";
import { content2Background, patchFrom } from "../bridge";


/**
 * @description 补充百应店铺id
 */
export class ByShopCheckExistsHandler extends CertPerm {
    constructor(context: Context, options: Options) {
        super(context, options);
        this.doSomething();
    }
    doSomething(): void {
        const { name, fromTabId, fromId, gaoqId } = this.options
        const productId = name;
        const { $bus } = this.context
        console.log("productId", productId)
        if (productId) {
            let it = setInterval(async () => {
                let input: any = document.querySelector(".index-module__FilterContainer___3yOHy  .auxo-input-group-wrapper .auxo-input")
                console.log("input", input);
                if (input) {
                    clearInterval(it)
                    await sleep(500);
                    console.log("productId", productId);
                    input.value = productId;
                    const eventInput = new InputEvent('input', {
                        'bubbles': true
                    })
                    input.dispatchEvent(eventInput)
                    // let search = await wait(5000, () => { return document.querySelector(".index__selectorAutoComplete___1Qfjc .auxo-input-group-addon .auxo-input-search-button") })
                    let search: any = document.querySelector(".index-module__FilterContainer___3yOHy .auxo-input-group-addon .auxo-input-search-button")
                    console.log("search", search);
                    let str = "ecom\\/captain\\/selection_pool\\/product_list\\?query_info";
                    const regex = new RegExp(str);
                    console.log("regex", regex);

                    const resultPromise = $bus.subscribe(
                        regex,
                        function (rs: any) {
                            let body = $bus.parseBody(rs);
                            console.log("body", body);
                            return body.data.hasOwnProperty('product_list') ? body.data : false;
                        }
                    );
                    search.click()
                    const result: any = await resultPromise;
                    console.log("result", result);
                    let { product_list } = result;
                    let data = {
                        jump: false,
                        shop_id: '',
                        gaoqId
                    }
                    let hit = product_list ? product_list[0] : false;
                    if (hit && hit.shop_id && hit.product_id == productId) {
                        data.shop_id = hit.shop_id
                    } else {
                        data.jump = true
                    }
                    return content2Background(
                        patchFrom(
                            {
                                data,
                                toTabId: fromTabId,
                                toId: fromId,
                                msg:
                                Msg.content通过background转发其他content发送给page,
                                aim: Aim.通知已提取,
                                closeTab: true,
                            },
                            "爬取百应店铺ID"
                        )
                    );

                }
            }, 500)
        }
    }
}