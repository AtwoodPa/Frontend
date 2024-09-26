if (tabList && tabList[2]) {
    console.log("tabList[2]", 1);
    tabList[2].click();

    // await tryDo(1500, async () => {
    //     tabList[3].click();
    //     // 连接用户 - 连接用户画像tab
    //     const radioGroup: any = await tryDo(1500, () => {
    //         const radioGroupDom =  document.querySelector('.page-right .tabs-content .title-wrapper .el-radio-group[role="radiogroup"]');
    //         if (radioGroupDom) {
    //             const radioButtons = radioGroupDom.children;
    //             if (radioButtons && radioButtons[1]) {
    //                 return radioButtons;
    //             }
    //         }
    //         return false
    //     });
    //     radioGroup[1].click()
    //     return true;
    // });

    // 预期cpm cpe
    const authorContent1mPromise: any = bus.subscribe(
        /\/api\/data_sp\/get_author_spread_info/,
        (rs: any) => {
            console.log("get_author_spread_info", rs);
            let body = bus.parseBody(rs);
            return body.hasOwnProperty('expect_cpe') ? body : false;
        }
    );
    // 内容类型占比
    const authorVideoDistributionPromise: any = bus.subscribe(
        /\/api\/data_sp\/author_video_distribution/,
        (rs: any) => {
            let body = bus.parseBody(rs);
            return body.hasOwnProperty('video_content_distribution') ? body : false;
        }
    );

    // // 数据概览
    // // 最新15个视频表现柱状图
    // const last15VideoPromise: any = bus.subscribe(
    //     /\/api\/author\/get_author_show_items_v2/,
    //     (rs: any) => {
    //         let body = bus.parseBody(rs);
    //         return body.hasOwnProperty('base_resp') ? body : false;
    //     }
    // );
    // // 星图指数
    // const xtIndexPromise: any = bus.subscribe(
    //     /\/api\/data_sp\/get_author_link_info/,
    //     (rs: any) => {
    //         let body = bus.parseBody(rs);
    //         return body.hasOwnProperty('base_resp') ? body : false;
    //     }
    // );
    // // 受众标签类型 - 连接用户数
    // const connectUsersPromise: any = bus.subscribe(
    //     /\/api\/data_sp\/author_link_struct/,
    //     (rs: any) => {
    //         let body = bus.parseBody(rs);
    //         return body.hasOwnProperty('base_resp') ? body : false;
    //     }
    // );
    // // 受众标签类型 - 连接用户画像 - 观众画像
    // const audiencePortraitPromise: any = bus.subscribe(
    //     /\/api\/data_sp\/author_audience_distribution/,
    //     (rs: any) => {
    //         console.log("author_audience_distribution - Response:", rs);
    //         let body = bus.parseBody(rs);
    //         return body.hasOwnProperty('base_resp') ? body : false;
    //     }
    // );
    // // 受众标签类型 - 连接用户画像 - 粉丝画像
    // const fansPortraitPromise: any = bus.subscribe(
    //     /\/api\/data_sp\/get_author_fans_distribution/,
    //     (rs: any) => {
    //         let body = bus.parseBody(rs);
    //         return body.hasOwnProperty('base_resp') ? body : false;
    //     }
    // );

    const [
        authorContent1m,
        authorVideoDistribution,
        // last15VideoBody,
        // xtIndexBody,
        // connectUsersBody,
        // audiencePortraitBody,
        // fansPortraitBody,
    ] = await Promise.all([
        authorContent1mPromise,
        authorVideoDistributionPromise,
        // last15VideoPromise,
        // xtIndexPromise,
        // connectUsersPromise,
        // audiencePortraitPromise,
        // fansPortraitPromise

    ]);
    // console.log("busData ok", {last15VideoBody, xtIndexPromise});
    //
    // console.log("========>>> data_sp connectUsersPromise : " , connectUsersBody)
    // console.log("========>>> data_sp audiencePortraitBody : " , audiencePortraitBody)
    // console.log("========>>> data_sp fansPortraitBody : " , fansPortraitBody)

    const {video_content_distribution} = authorVideoDistribution;
    tabList[1].click();
    data = {
        authorContent1m,
        // authorBusinessCapabilitiesNoLimit: {},
        // authorBusinessCapabilitiesNoLimit: bus.parseBody(authorBusinessCapabilitiesNoLimit),
        video_content_distribution,
        // last15VideoBody,
        // xtIndexBody,
        // connectUsersBody,
        // audiencePortraitBody,
        // fansPortraitBody
    };
}