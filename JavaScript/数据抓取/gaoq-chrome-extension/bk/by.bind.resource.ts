const Tag = 'content-script/xhs/search-brand'
import { makeSureLoad } from "../util";
import { getHandler } from "../../handlerFactory";
import bus from "../bus";
import api from '@/api';

console.log(Tag, 'loads')
makeSureLoad(async function () {
    const handler = await getHandler();
    console.log('handler', handler);
    handler.byBindResource(bus, api)
})
