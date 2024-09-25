
async baseBusData() {
    const bus = this.context.$bus;
    const baseInfoPromise: any = bus.subscribe(
        /\/api\/author\/get_author_base_info/,
        (rs: any) => {
            let body = bus.parseBody(rs);
            return body.hasOwnProperty('nick_name') ? body : false;
        }
    );
    const marketingInfoPromise: any = bus.subscribe(
        /\/api\/author\/get_author_marketing_info/,
        (rs: any) => {
            let body = bus.parseBody(rs);
            return body.hasOwnProperty('hot_list_ranks') ? body : false;
        }
    );
    const introducePromise: any = bus.subscribe(
        /\/api\/author\/get_author_platform_channel_info_v2/,
        (rs: any) => {
            let body = bus.parseBody(rs);
            return body.hasOwnProperty('self_intro') ? body : false;
        }
    );

    const [
        baseInfoBody,
        marketInfoBody,
        introduceBody,

    ] = await Promise.all([
        baseInfoPromise,
        marketingInfoPromise,
        introducePromise,
    ]);
    const {
        grade,
        mcn_name,
        id,
        gender,
        nick_name,
        province,
        city,
        sec_uid,
        short_id,
        // core_user_id,
        unique_id,
        tags_relation,
        avatar_uri,
        follower,
    } = baseInfoBody;
    console.log("basePort ok", {baseInfoBody, marketInfoBody, introduceBody});
    const mediaId = unique_id;
    const name = nick_name;
    const shortId = short_id;
    const secUid = sec_uid;
    const mcn = mcn_name;
    const photo = avatar_uri;
    const sex = 1 == gender ? '男' : '女';
    const site = 'https://www.douyin.com/user/' + secUid;
    let region = province + ' ' + city;
    region = region ? region.trim() : region;
    let level = 'LV' + grade; //星图等级
    const {
        price_info,
        industry_tags,
        hot_list_ranks,
    } = marketInfoBody;
    const data = {
        mcn,
        uid: secUid,
        sex,
        site,
        name,
        level,
        photo,
        secUid,
        region,
        shortId,
        mediaId,
        price_info,
        tags_relation,
        industry_tags,
        hot_list_ranks,
        fanCount: follower,
        introduce: introduceBody.self_intro,
    };
    console.log('baseBusData ok', data);
    return data;
}