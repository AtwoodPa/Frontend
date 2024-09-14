const Tag = 'content-script/xhs/search-brand'
import { getHandler, bindContext } from "../../handler/handler.factory.ts";
import api from '@/api'
import { bus } from "../bus";
import { makeSureLoad } from "../helper";
import { Context } from "../../handler/handler.interface.js";
console.log(Tag, 'load')
makeSureLoad(async function () {
    bindContext({ $bus: bus, $api: api, tag: Tag } as Context);
    const handler = await getHandler();
    console.log('handler', handler);
    handler.xhsBindBrand()
})
