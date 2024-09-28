```js
private async collectContextShowDataFromApiGet(xtId: any) {
        const resultAuthorContent: any = {}
        const authorContentXtUrl1m = (xt_id: string) =>
            `https://www.xingtu.cn/gw/api/data_sp/get_author_spread_info?o_author_id=${xt_id}&platform_source=1&platform_channel=1&range=2&type=2&only_assign=true`;

        const authorContentXtUr3m = (xt_id: string) =>
            `https://www.xingtu.cn/gw/api/data_sp/get_author_spread_info?o_author_id=${xt_id}&platform_source=1&platform_channel=1&range=3&type=2&only_assign=true`;

        const authorContentXtUrl1mPromise = await this.portRequest(authorContentXtUrl1m(xtId), "base_resp");
        const authorContentXtUrl3mPromise = await this.portRequest(authorContentXtUr3m(xtId), "base_resp");
        const [xt1m, xt3m] = await Promise.all([authorContentXtUrl1mPromise, authorContentXtUrl3mPromise]);
        const totalData: any = { xt1m, xt3m };
        const authorContentMap: any = {
            xt1m: {
                prefix: "xtAssign", // 指派视频
                suffix: '1m'
            },
            xt3m: {
                prefix: "xtAssign",// 指派视频
                suffix: '3m'
            },
        };

        Object.keys(totalData).forEach((key: string) => {
            const data = totalData[key];
            const {prefix, suffix} = authorContentMap[key]
            const handleMap: any = {};
            if (data.hasOwnProperty("base_resp")){
                handleMap[key] = data;
                const {play_over_rate, interact_rate, item_rate} = handleMap[key]
                resultAuthorContent[prefix + "wblOvertake" + suffix] = getAuthorContentData(play_over_rate, "overtake")
                resultAuthorContent[prefix + "wblValue" + suffix] = getAuthorContentData(play_over_rate, "value")
                resultAuthorContent[prefix + "hdlOvertake" + suffix] = getAuthorContentData(interact_rate, "overtake")
                resultAuthorContent[prefix + "hdlValue" + suffix] = getAuthorContentData(interact_rate, "value")
                if (item_rate) {
                    const {play_mid} = item_rate
                    resultAuthorContent[prefix + "bflzwsOvertake" + suffix] = getAuthorContentData(play_mid, "overtake")
                    resultAuthorContent[prefix + "bflzwsValue" + suffix] = getAuthorContentData(play_mid, "value")
                }
                resultAuthorContent[prefix + "fbzp" + suffix] = getAuthorContentData(data, "item_num")
                resultAuthorContent[prefix + "pjsc" + suffix] = getAuthorContentData(data, "avg_duration")
                resultAuthorContent[prefix + "pjdz" + suffix] = getAuthorContentData(data, "like_avg")
                resultAuthorContent[prefix + "pjpl" + suffix] = getAuthorContentData(data, "comment_avg")
                resultAuthorContent[prefix + "pjzf" + suffix] = getAuthorContentData(data, "share_avg")
            }
        });
        console.log("====================resultAuthorContent====================")
        console.log(resultAuthorContent)
        return resultAuthorContent;
    }
// 2、最新15个视频表现柱状图数据
        // console.log("last15VideoBody", last15VideoBody);
        // const {latest_item_info, latest_star_item_info} = last15VideoBody;
        // const calculateMin = (arr: number[]): number => Math.min(...arr);
        // const calculateMax = (arr: number[]): number => Math.max(...arr);
        // const calculateAverage = (arr: number[]): number => arr.reduce((a, b) => a + b, 0) / arr.length;
        // const printStats = (label: string, data: number[]) => {
        //     console.log(`最低${label}:`, calculateMin(data), "万");
        //     console.log(`最高${label}:`, calculateMax(data), "万");
        //     console.log(`${label}均值:`, calculateAverage(data).toFixed(2), "万");
        // };
        // const calculateHotVideoPercentage = (isHotCount: number, totalCount: number): string => {
        //     const percentage = (isHotCount / totalCount) * 100;
        //     return percentage.toFixed(2) + "%";
        // };
        // const processVideoStats = (videoInfo: any[], label: string) => {
        //     const plays = videoInfo.map(video => video.play / 10000);
        //     const likes = videoInfo.map(video => video.like / 10000);
        //     const comments = videoInfo.map(video => video.comment / 10000);
        //     const shares = videoInfo.map(video => video.share / 10000);
        //     const isHotCount = videoInfo.filter(video => video.is_hot).length;
        //
        //     printStats("播放量", plays);
        //     printStats("点赞量", likes);
        //     printStats("评论量", comments);
        //     printStats("转发量", shares);
        //
        //     console.log(`爆量视频百分比:`, calculateHotVideoPercentage(isHotCount, videoInfo.length));
        // };
        //
        // processVideoStats(latest_item_info, "个人视频");
        // processVideoStats(latest_star_item_info, "星图视频");
        // 3、受众标签类型
        // const monthlyConnectedUsers = (connectUsersBody.link_struct['5'] as any).value;// 月连接用户数
        // const understandUsers = connectUsersBody.link_struct['1'].value; // 了解
        //
        // const interestUsers = connectUsersBody.link_struct['2'].value;// 兴趣
        //
        // const likeUsers = connectUsersBody.link_struct['3'].value; // like
        //
        // const followUsers = connectUsersBody.link_struct['4'].value;// 追随
        //
        // const monthlyConnectedUsers = connectUsersBody.link_struct['5'].value;// 月连接用户数
        // // 使用 reduce 获取最大 proportion 和对应的 value
        // const { value: maxValue } = Object.values(connectUsersBody.link_struct)
        //     .slice(0, 4)
        //     .reduce((acc, item) => {
        //         return item.proportion > acc.proportion ? { proportion: item.proportion, value: item.value } : acc;
        //     }, { proportion: -Infinity, value: 0 });
        // const monthlyDeepUsers = monthlyConnectedUsers - maxValue;// 月深度用户数
        //
        // console.log("月连接用户数:", monthlyConnectedUsers);
        // console.log("月深度用户数:", monthlyDeepUsers);
        // //TODO 月粉丝增长量 - 待定 240920
        // console.log("了解 用户数:", understandUsers);
        // console.log("感兴趣用户数:", interestUsers);
        // console.log("喜欢 用户数:", likeUsers);
        // console.log("追随 用户数:", followUsers);
        // // 观众画像数据
        // const audienceByPeopleType: Record<string, string> = {};
        // const audienceByAge: Record<string, string> = {};
        // const audienceByGender: Record<string, string> = {};
        // const audienceByDevice: Record<string, string> = {};
        // const audienceByRegion: Record<string, string> = {};
        // audiencePortraitBody.distributions.forEach(distribution => {
        //     switch (distribution.type_display) {
        //         case '八大人群分布':
        //             distribution.distribution_list.forEach(item => {
        //                 audienceByPeopleType[item.distribution_key] = item.distribution_value;
        //             });
        //             break;
        //         case '年龄分布':
        //             distribution.distribution_list.forEach(item => {
        //                 audienceByAge[item.distribution_key] = item.distribution_value;
        //             });
        //             break;
        //         case '性别分布':
        //             distribution.distribution_list.forEach(item => {
        //                 const genderKey = item.distribution_key === 'male' ? '男性' : '女性';
        //                 audienceByGender[genderKey] = item.distribution_value;
        //             });
        //             break;
        //         case '设备品牌分布':
        //             distribution.distribution_list.forEach(item => {
        //                 audienceByDevice[item.distribution_key] = item.distribution_value;
        //             });
        //             break;
        //         case '省份分布':
        //         case '城市分布':
        //             distribution.distribution_list.forEach(item => {
        //                 audienceByRegion[item.distribution_key] = item.distribution_value;
        //             });
        //             break;
        //         default:
        //             console.warn(`未处理的分布类型: ${distribution.type_display}`);
        //     }
        // });
        // console.log("八大人群占比:", audienceByPeopleType);
        // console.log("观众年龄:", audienceByAge);
        // console.log("观众性别:", audienceByGender);
        // console.log("观众设备品牌:", audienceByDevice);
        // console.log("观众地域:", audienceByRegion);
        // // 粉丝画像
        // const ageDistribution: Record<string, string> = {};
        // const genderDistribution: Record<string, string> = {};
        // const deviceBrandDistribution: Record<string, string> = {};
        // const regionDistribution: Record<string, string> = {};
        // fansPortraitBody.distributions.forEach(distribution => {
        //     // const list = distribution.distribution_list.map(item => ({
        //     //     key: item.distribution_key,
        //     //     value: parseInt(item.distribution_value, 10)
        //     // }));
        //
        //     switch (distribution.type_display) {
        //         case '年龄分布':
        //             distribution.distribution_list.forEach(item => {
        //                 ageDistribution[item.distribution_key] = item.distribution_value;
        //             })
        //             break;
        //         case '性别分布':
        //             distribution.distribution_list.forEach(item => {
        //                 genderDistribution[item.distribution_key] = item.distribution_value;
        //             })
        //             break;
        //         case '设备品牌分布':
        //             distribution.distribution_list.forEach(item => {
        //                 deviceBrandDistribution[item.distribution_key] = item.distribution_value;
        //             })
        //             break;
        //         case '省份分布':
        //         case '城市分布':
        //             distribution.distribution_list.forEach(item => {
        //                 regionDistribution[item.distribution_key] = item.distribution_value;
        //             })
        //             break;
        //         default:
        //             break;
        //     }
        // });
        // console.log("粉丝年龄分布:", ageDistribution);
        // console.log("粉丝性别分布:", genderDistribution);
        // console.log("粉丝设备品牌分布:", deviceBrandDistribution);
        // console.log("粉丝地域分布:", regionDistribution);
        // console.log("粉丝地域分布:", regionDistribution);
        // 4、星图指数数据
        // const xtValues: number[] = [
        //     xtIndexBody.cooperate_index.value,
        //     xtIndexBody.cp_index.value,
        //     xtIndexBody.link_convert_index.value,
        //     xtIndexBody.link_shopping_index.value,
        //     xtIndexBody.link_spread_index.value,
        //     xtIndexBody.link_star_index.value,
        // ];
        // console.log("星图指标数据：", xtValues)




```

```js
private async collectOtherData() {
        const bus = this.context.$bus;

        let data = {}
        const tabList: any = await tryDo(1500, () => {
            const clickDom = document.querySelector('.page-right .card-panel .is-top[role="tablist"]')
            if (clickDom) {
                const tabList = clickDom.children;
                if (tabList && tabList[2]) {
                    return tabList
                }
            }
            return false
        });
        if (tabList && tabList[1]) {
            // 存储处理之后的数据
            const resultAuthorContent: any = {}
            console.log("tabList[1].click", 1)
            await this.delay(1000, 10000);

            tabList[1].click();
            const authorContentShowPromise: any = bus.subscribe(
                /\/api\/author\/get_author_show_items_v2/,
                (rs: any) => {
                    let body = bus.parseBody(rs);
                    return body.hasOwnProperty('base_resp') ? body : false;
                }
            );
            const [ authorContentShowBody ] = await Promise.all([authorContentShowPromise]);
            console.log("collectOtherData ok => authorContentShowBody", authorContentShowBody);
        }
        // tab2内容表现 最新15个视频表现柱状图
        if (tabList && tabList[2]) {
            console.log("tabList[2].click", 2)
            await this.delay(1000, 10000);
            tabList[2].click();
            // 最新15个视频表现柱状图
            const last15VideoPromise: any = bus.subscribe(
                /\/api\/author\/get_author_show_items_v2/,
                (rs: any) => {
                    let body = bus.parseBody(rs);
                    return body.hasOwnProperty('base_resp') ? body : false;
                }
            );
            let videoTotalData = {}
            const [ last15VideoBody ] = await Promise.all([last15VideoPromise]);
            console.log("collectOtherData ok => last15VideoBody", last15VideoBody);
            const {latest_item_info, latest_star_item_info} = last15VideoBody;
            const calculateMin = (arr: number[]): number => Math.min(...arr);
            const calculateMax = (arr: number[]): number => Math.max(...arr);
            const calculateAverage = (arr: number[]): number => arr.reduce((a, b) => a + b, 0) / arr.length;
            const printStats = (label: string, data: number[]) => {
                console.log(`最低${label}:`, calculateMin(data), "万");
                console.log(`最高${label}:`, calculateMax(data), "万");
                console.log(`${label}均值:`, calculateAverage(data).toFixed(2), "万");
            };
            const calculateHotVideoPercentage = (isHotCount: number, totalCount: number): string => {
                const percentage = (isHotCount / totalCount) * 100;
                return percentage.toFixed(2) + "%";
            };
            const processVideoStats = (videoInfo: any[], label: string) => {
                const plays = videoInfo.map(video => video.play / 10000);
                const likes = videoInfo.map(video => video.like / 10000);
                const comments = videoInfo.map(video => video.comment / 10000);
                const shares = videoInfo.map(video => video.share / 10000);
                const isHotCount = videoInfo.filter(video => video.is_hot).length;

                printStats("播放量", plays);
                printStats("点赞量", likes);
                printStats("评论量", comments);
                printStats("转发量", shares);

                console.log(`爆量视频百分比:`, calculateHotVideoPercentage(isHotCount, videoInfo.length));
            };

            processVideoStats(latest_item_info, "个人视频");
            processVideoStats(latest_star_item_info, "星图视频");
            // const { latest_item_info, latest_star_item_info } = last15VideoBody;
            //
            // videoTotalData = {
            //     latest_item_info,
            //     latest_star_item_info
            // };
            // console.log("videoTotalData",videoTotalData);

        }
        // tab3 连接用户 连接用户分布、连接用户画像
        if (tabList && tabList[3]) {
            console.log("tabList[3].click()",3)
            tabList[3].click();
            await this.delay(1000, 10000);
            await tryDo(1000, () => {
                const element = document.querySelector('.star-footer-protocol-record');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' }); // 平滑滚动到元素
                    console.log("Scrolled to .star-footer-protocol-record");
                } else {
                    console.error(".star-footer-protocol-record 未找到");
                }
            });
            const radioGroup: any = await tryDo(1500, () => {
                const radioGroupDom = document.querySelector('.page-right .tabs-content .title-wrapper .el-radio-group[data-btm="type-select"]');

                if (radioGroupDom) {
                    const radioButtons = radioGroupDom.children;
                    if (radioButtons && radioButtons.length > 0) {
                        return radioButtons;
                    }
                }
                return false;
            });

            // 确保 radioGroup 存在，然后点击第二个按钮
            if (radioGroup && radioGroup[1]) {
                radioGroup[1].click();
                console.log("点击第二个按钮",radioGroup);
            }
            // 受众标签类型 - 连接用户数
            const connectUsersPromise: any = bus.subscribe(
                /\/api\/data_sp\/author_link_struct/,
                (rs: any) => {
                    let body = bus.parseBody(rs);
                    return body.hasOwnProperty('base_resp') ? body : false;
                }
            );
            // 受众标签类型 - 连接用户画像 - 观众画像
            const audiencePortraitPromise: any = bus.subscribe(
                /\/api\/data_sp\/author_audience_distribution/,
                (rs: any) => {
                    let body = bus.parseBody(rs);
                    return body.hasOwnProperty('base_resp') ? body : false;
                }
            );
            // 受众标签类型 - 连接用户画像 - 粉丝画像
            const fansPortraitPromise: any = bus.subscribe(
                /\/api\/data_sp\/get_author_fans_distribution/,
                (rs: any) => {
                    let body = bus.parseBody(rs);
                    return body.hasOwnProperty('base_resp') ? body : false;
                }
            );
            const [ connectUsersBody,
                audiencePortraitBody,
                fansPortraitBody] = await Promise.all([connectUsersPromise, audiencePortraitPromise, fansPortraitPromise]);
            console.log("collectOtherData ok => connectUsersBody、audiencePortraitBody、fansPortraitBody", connectUsersBody, audiencePortraitBody, fansPortraitBody);
            // 3、受众标签类型相关数据
            const understandUsers = connectUsersBody.link_struct['1'].value; // 了解

            const interestUsers = connectUsersBody.link_struct['2'].value;// 兴趣

            const likeUsers = connectUsersBody.link_struct['3'].value; // like

            const followUsers = connectUsersBody.link_struct['4'].value;// 追随

            const monthlyConnectedUsers = connectUsersBody.link_struct['5'].value;// 月连接用户数
            // 使用 reduce 获取最大 proportion 和对应的 value
            const { value: maxValue } = Object.values(connectUsersBody.link_struct)
                .slice(0, 4)
                .reduce((acc, item) => {
                    return item.proportion > acc.proportion ? { proportion: item.proportion, value: item.value } : acc;
                }, { proportion: -Infinity, value: 0 });
            const monthlyDeepUsers = monthlyConnectedUsers - maxValue;// 月深度用户数

            console.log("月连接用户数:", monthlyConnectedUsers);
            console.log("月深度用户数:", monthlyDeepUsers);
            //TODO 月粉丝增长量 - 待定 240920
            console.log("了解 用户数:", understandUsers);
            console.log("感兴趣用户数:", interestUsers);
            console.log("喜欢 用户数:", likeUsers);
            console.log("追随 用户数:", followUsers);
            // 观众画像数据
            const audienceByPeopleType: Record<string, string> = {};
            const audienceByAge: Record<string, string> = {};
            const audienceByGender: Record<string, string> = {};
            const audienceByDevice: Record<string, string> = {};
            const audienceByRegion: Record<string, string> = {};
            audiencePortraitBody.distributions.forEach(distribution => {
                switch (distribution.type_display) {
                    case '八大人群分布':
                        distribution.distribution_list.forEach(item => {
                            audienceByPeopleType[item.distribution_key] = item.distribution_value;
                        });
                        break;
                    case '年龄分布':
                        distribution.distribution_list.forEach(item => {
                            audienceByAge[item.distribution_key] = item.distribution_value;
                        });
                        break;
                    case '性别分布':
                        distribution.distribution_list.forEach(item => {
                            const genderKey = item.distribution_key === 'male' ? '男性' : '女性';
                            audienceByGender[genderKey] = item.distribution_value;
                        });
                        break;
                    case '设备品牌分布':
                        distribution.distribution_list.forEach(item => {
                            audienceByDevice[item.distribution_key] = item.distribution_value;
                        });
                        break;
                    case '省份分布':
                    case '城市分布':
                        distribution.distribution_list.forEach(item => {
                            audienceByRegion[item.distribution_key] = item.distribution_value;
                        });
                        break;
                    default:
                        console.warn(`未处理的分布类型: ${distribution.type_display}`);
                }
            });
            console.log("八大人群占比:", audienceByPeopleType);
            console.log("观众年龄:", audienceByAge);
            console.log("观众性别:", audienceByGender);
            console.log("观众设备品牌:", audienceByDevice);
            console.log("观众地域:", audienceByRegion);
            // 粉丝画像
            const ageDistribution: Record<string, string> = {};
            const genderDistribution: Record<string, string> = {};
            const deviceBrandDistribution: Record<string, string> = {};
            const regionDistribution: Record<string, string> = {};
            fansPortraitBody.distributions.forEach(distribution => {
                // const list = distribution.distribution_list.map(item => ({
                //     key: item.distribution_key,
                //     value: parseInt(item.distribution_value, 10)
                // }));

                switch (distribution.type_display) {
                    case '年龄分布':
                        distribution.distribution_list.forEach(item => {
                            ageDistribution[item.distribution_key] = item.distribution_value;
                        })
                        break;
                    case '性别分布':
                        distribution.distribution_list.forEach(item => {
                            genderDistribution[item.distribution_key] = item.distribution_value;
                        })
                        break;
                    case '设备品牌分布':
                        distribution.distribution_list.forEach(item => {
                            deviceBrandDistribution[item.distribution_key] = item.distribution_value;
                        })
                        break;
                    case '省份分布':
                    case '城市分布':
                        distribution.distribution_list.forEach(item => {
                            regionDistribution[item.distribution_key] = item.distribution_value;
                        })
                        break;
                    default:
                        break;
                }
            });
            console.log("粉丝年龄分布:", ageDistribution);
            console.log("粉丝性别分布:", genderDistribution);
            console.log("粉丝设备品牌分布:", deviceBrandDistribution);
            console.log("粉丝地域分布:", regionDistribution);
            console.log("粉丝地域分布:", regionDistribution);
        }

        //tab4 商业能力 星图指数
        if (tabList && tabList[4]) {
            console.log("tabList[4].click()",4);
            await this.delay(1000, 10000);
           tabList[4].click();
            // 星图指数
            const xtIndexPromise: any = bus.subscribe(
                /\/api\/data_sp\/get_author_link_info/,
                (rs: any) => {
                    let body = bus.parseBody(rs);
                    return body.hasOwnProperty('base_resp') ? body : false;
                }
            );
            const [ xtIndexBody ] = await Promise.all([xtIndexPromise]);
            console.log("collectOtherData ok => xtIndexBody", xtIndexBody);
            // 4、星图指数数据
            const xtValues: number[] = [
                xtIndexBody.cooperate_index.value,
                xtIndexBody.cp_index.value,
                xtIndexBody.link_convert_index.value,
                xtIndexBody.link_shopping_index.value,
                xtIndexBody.link_spread_index.value,
                xtIndexBody.link_star_index.value,
            ];
            console.log("星图指标数据：", xtValues)
        }


        // data = {
        //     last15VideoBody,
        //     xtIndexBody,
        // }
        //
        // return data;
    }
```

```java
		// 播放量
    private Integer grbfMin;
    private Integer grbfMax;
    private Integer grbfAvg;
    private Integer grblspbfbValue;// 爆量视频百分比
    //点赞量
    private Integer grdzMin;
    private Integer grdzMax;
    private Integer grdzAvg;
    // 评论量
    private Integer grplMin;
    private Integer grplMax;
    private Integer grplAvg;
    // 转发量
    private Integer grzfMin;
    private Integer grzfMax;
    private Integer grzfAvg;
    // 星图视频表现数据 前缀xtAll
    // 播放量
    private Integer xtAllbfMin;
    private Integer xtAllbfMax;
    private Integer xtAllbfAvg;
    private Integer xtAllblspbfbValue;// 爆量视频百分比
    // 点赞量
    private Integer xtAlldzMin;
    private Integer xtAlldzMax;
    private Integer xtAlldzAvg;
    // 评论量
    private Integer xtAllplMin;
    private Integer xtAllplMax;
    private Integer xtAllplAvg;
    // 转发量
    private Integer xtAllzfMin;
    private Integer xtAllzfMax;
    private Integer xtAllzfAvg;
    // 受众标签类型
    // 连接用户数
    private Integer yljyhs;// 月连接用户数
    private Integer ysdyhs;// 月深度用户数
    private Integer ljConnectNum;// 连接用户分布 - 了解
    private Integer xqConnectNum;// 连接用户分布 - 兴趣
    private Integer xhConnectNum;// 连接用户分布 - 喜欢
    private Integer zsConnectNum;// 连接用户分布 - 追随
    // 观众画像 - 八大人群占比、观众年龄、观众性别、观众设备品牌、观众地域
    private Integer bdrqRatio;// 八大人群占比
    private Integer gzAge;// 观众年龄
    private Integer gzSex;// 观众性别
    private Integer gzDevice;// 观众设备品牌
    private Integer gzArea;// 观众地域
    // 粉丝画像 - 粉丝年龄、粉丝性别、粉丝设备品牌、粉丝地域
    private Integer fsAge;// 粉丝年龄
    private Integer fsSex;// 粉丝性别
    private Integer fsDevice;// 粉丝设备品牌
    private Integer fsArea;// 粉丝地域
```



last15VideoBody

```json
{
    "base_resp": {
        "status_code": 0,
        "status_message": "Success"
    },
    "data_description": {
        "interaction": {
            "compare_author": 0.42,
            "compare_avg": -0.023000000000000003,
            "rate": 0.0299
        },
        "interaction_enrollment": {
            "compare_author": 0.33,
            "compare_avg": -0.0505,
            "rate": 0.0301
        },
        "play_medium": {
            "compare_author": 0.96,
            "compare_avg": 6.5034067104829765,
            "rate": 114587
        },
        "play_medium_enrollment": {
            "compare_author": 0.87,
            "compare_avg": 1.346351420772578,
            "rate": 101716
        },
        "video_view_rate": {
            "compare_author": 0.82,
            "compare_avg": 0.0796,
            "rate": 0.2301
        },
        "video_view_rate_enrollment": {
            "compare_author": 0.23,
            "compare_avg": -0.061599999999999995,
            "rate": 0.0598
        }
    },
    "latest_item_info": [
        {
            "comment": 6756,
            "core_user_id": "71510504205",
            "create_time": 1726658522,
            "create_timestamp": 1726658522,
            "duration": 11,
            "duration_min": 0,
            "head_image_uri": "tos-cn-p-0015/osfmej9HAVD6RVvEbbFPIQu7A8CGQgBmrjGDCA",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/osfmej9HAVD6RVvEbbFPIQu7A8CGQgBmrjGDCA",
            "item_cover": "tos-cn-p-0015/osfmej9HAVD6RVvEbbFPIQu7A8CGQgBmrjGDCA",
            "item_date": "2024-09-18",
            "item_id": "7415941749329235209",
            "item_title": "“透心良”也来包鱼塘了，你们觉得他会亏多少？#包塘 #抓鱼 #日常vlog",
            "like": 217995,
            "media_type": "4",
            "original_status": 102,
            "play": 26890570,
            "share": 4031,
            "status": 1,
            "title": "“透心良”也来包鱼塘了，你们觉得他会亏多少？#包塘 #抓鱼 #日常vlog",
            "url": "https://www.iesdouyin.com/share/video/7415941749329235209/?region=CN&mid=7415941660829322020",
            "video_id": "v0300fg10000crlb7i7og65j0gp33hv0"
        },
        {
            "comment": 60464,
            "core_user_id": "71510504205",
            "create_time": 1726050349,
            "create_timestamp": 1726050349,
            "duration": 552,
            "duration_min": 9,
            "head_image_uri": "tos-cn-p-0015/oIc0KiZAiIvIgg45WhfeqVcA9rs7mBD1ACHIB6",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/oIc0KiZAiIvIgg45WhfeqVcA9rs7mBD1ACHIB6",
            "item_cover": "tos-cn-p-0015/oIc0KiZAiIvIgg45WhfeqVcA9rs7mBD1ACHIB6",
            "item_date": "2024-09-11",
            "item_id": "7413329738246278427",
            "item_title": "30亩老山塘的最后一网，能否摘掉李赔光这个名号？#李维刚和大表哥包塘二番战 #抓鱼 #日常vlog",
            "like": 602675,
            "media_type": "4",
            "original_status": 102,
            "play": 45850245,
            "share": 28918,
            "status": 1,
            "title": "30亩老山塘的最后一网，能否摘掉李赔光这个名号？#李维刚和大表哥包塘二番战 #抓鱼 #日常vlog",
            "url": "https://www.iesdouyin.com/share/video/7413329738246278427/?region=CN&mid=7413330339172600614",
            "video_id": "v0300fg10000crgmuefog65kcr6nial0"
        },
        {
            "comment": 19657,
            "core_user_id": "71510504205",
            "create_time": 1725880876,
            "create_timestamp": 1725880876,
            "duration": 350,
            "duration_min": 5,
            "head_image_uri": "tos-cn-p-0015/ogXgGxrgBGtvMEo9FsLeADgI7AHfHqjeBSCNCb",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/ogXgGxrgBGtvMEo9FsLeADgI7AHfHqjeBSCNCb",
            "item_cover": "tos-cn-p-0015/ogXgGxrgBGtvMEo9FsLeADgI7AHfHqjeBSCNCb",
            "item_date": "2024-09-09",
            "item_id": "7412601888291441932",
            "item_title": "下了天罗地网，但听老师傅的话，心里还是打鼓！总要让我赚一次吧！#李维刚和大表哥包塘二番战 #抓鱼 #日常vlog",
            "like": 395238,
            "media_type": "4",
            "original_status": 102,
            "play": 44918130,
            "share": 12684,
            "status": 1,
            "title": "下了天罗地网，但听老师傅的话，心里还是打鼓！总要让我赚一次吧！#李维刚和大表哥包塘二番战 #抓鱼 #日常vlog",
            "url": "https://www.iesdouyin.com/share/video/7412601888291441932/?region=CN&mid=7412601995493673766",
            "video_id": "v0200fg10000crfdgsfog65hqu0ckatg"
        },
        {
            "comment": 71648,
            "core_user_id": "71510504205",
            "create_time": 1725601474,
            "create_timestamp": 1725601474,
            "duration": 212,
            "duration_min": 3,
            "head_image_uri": "tos-cn-p-0015/ooBaRCjtIBjb6Ii3sfelAP4AXrmXUgV5CQAWiz",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/ooBaRCjtIBjb6Ii3sfelAP4AXrmXUgV5CQAWiz",
            "item_cover": "tos-cn-p-0015/ooBaRCjtIBjb6Ii3sfelAP4AXrmXUgV5CQAWiz",
            "item_date": "2024-09-06",
            "item_id": "7411401817214487842",
            "item_title": "还原一下全过程。希望我们都能不误解不愤怒，做正能量的事，做能体谅的人。\n视频隐藏了，过去的事就让他过去。提前祝大家中秋节快乐。",
            "like": 1089874,
            "media_type": "4",
            "original_status": 102,
            "play": 39374136,
            "share": 39640,
            "status": 1,
            "title": "还原一下全过程。希望我们都能不误解不愤怒，做正能量的事，做能体谅的人。\n视频隐藏了，过去的事就让他过去。提前祝大家中秋节快乐。",
            "url": "https://www.iesdouyin.com/share/video/7411401817214487842/?region=CN&mid=7411401840379693834",
            "video_id": "v0200fg10000crd9bmvog65o8efa6lbg"
        },
        {
            "comment": 21578,
            "core_user_id": "71510504205",
            "create_time": 1725537985,
            "create_timestamp": 1725537985,
            "duration": 430,
            "duration_min": 7,
            "head_image_uri": "tos-cn-p-0015/owm9DEg6QTmGJ5AYQBz8HCFMa2GGPAfZwtAf0c",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/owm9DEg6QTmGJ5AYQBz8HCFMa2GGPAfZwtAf0c",
            "item_cover": "tos-cn-p-0015/owm9DEg6QTmGJ5AYQBz8HCFMa2GGPAfZwtAf0c",
            "item_date": "2024-09-05",
            "item_id": "7411129167648935203",
            "item_title": "和大表哥包塘二番战，这次直接巨款包下了一个30亩的大山塘！#包塘 #户外捕鱼 #日常vlog #中国农民丰收节",
            "like": 299241,
            "media_type": "4",
            "original_status": 102,
            "play": 36710436,
            "share": 13346,
            "status": 1,
            "title": "和大表哥包塘二番战，这次直接巨款包下了一个30亩的大山塘！#包塘 #户外捕鱼 #日常vlog #中国农民丰收节",
            "url": "https://www.iesdouyin.com/share/video/7411129167648935203/?region=CN&mid=7411129382300830473",
            "video_id": "v0200fg10000crcpq77og65o4rbk93hg"
        },
        {
            "comment": 148300,
            "core_user_id": "71510504205",
            "create_time": 1724662841,
            "create_timestamp": 1724662841,
            "duration": 476,
            "duration_min": 7,
            "head_image_uri": "tos-cn-p-0015/os4i2YlIHdQfmxINAOHQ7i9Lke2TzeBGBGQCAD",
            "is_hot": true,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/os4i2YlIHdQfmxINAOHQ7i9Lke2TzeBGBGQCAD",
            "item_cover": "tos-cn-p-0015/os4i2YlIHdQfmxINAOHQ7i9Lke2TzeBGBGQCAD",
            "item_date": "2024-08-26",
            "item_id": "7407370448033369379",
            "item_title": "和大表哥花巨款包下一口深山悬崖老塘，两天两夜都没抽干，血赚还是血亏？#户外 #抓鱼  #日常vlog #记录农村美好生活",
            "like": 2089735,
            "media_type": "4",
            "original_status": 102,
            "play": 256032188,
            "share": 114650,
            "status": 1,
            "title": "和大表哥花巨款包下一口深山悬崖老塘，两天两夜都没抽干，血赚还是血亏？#户外 #抓鱼  #日常vlog #记录农村美好生活",
            "url": "https://www.iesdouyin.com/share/video/7407370448033369379/?region=CN&mid=7407370477062179622",
            "video_id": "v0300fg10000cr63pbnog65u1rr21vk0"
        },
        {
            "comment": 6954,
            "core_user_id": "71510504205",
            "create_time": 1724576496,
            "create_timestamp": 1724576496,
            "duration": 253,
            "duration_min": 4,
            "head_image_uri": "tos-cn-p-0015/oUmFD4KzhBMIvAF9eA4IyvMCJyAdgWfXaI8DEw",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/oUmFD4KzhBMIvAF9eA4IyvMCJyAdgWfXaI8DEw",
            "item_cover": "tos-cn-p-0015/oUmFD4KzhBMIvAF9eA4IyvMCJyAdgWfXaI8DEw",
            "item_date": "2024-08-25",
            "item_id": "7406999578618154251",
            "item_title": "冰杯啥的太小气了，要上就上冰盆！冰盆冷面体德处暑特供！#冰碗 #冰碗冷面 #美食 #日常vlog",
            "like": 164878,
            "media_type": "4",
            "original_status": 102,
            "play": 22954543,
            "share": 11178,
            "status": 1,
            "title": "冰杯啥的太小气了，要上就上冰盆！冰盆冷面体德处暑特供！#冰碗 #冰碗冷面 #美食 #日常vlog",
            "url": "https://www.iesdouyin.com/share/video/7406999578618154251/?region=CN&mid=7406999484045069083",
            "video_id": "v0300fg10000cr5f48fog65upsjngco0"
        },
        {
            "comment": 15911,
            "core_user_id": "71510504205",
            "create_time": 1724058295,
            "create_timestamp": 1724058295,
            "duration": 596,
            "duration_min": 9,
            "head_image_uri": "tos-cn-p-0015/okDKgYBCxIzVi3gTdDfBeAL8s6TgCYAjAiA7uI",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/okDKgYBCxIzVi3gTdDfBeAL8s6TgCYAjAiA7uI",
            "item_cover": "tos-cn-p-0015/okDKgYBCxIzVi3gTdDfBeAL8s6TgCYAjAiA7uI",
            "item_date": "2024-08-19",
            "item_id": "7404773952993742092",
            "item_title": "沉浸式体验消防战士的一天，很累！很燃！致敬最可爱的人！#消防员 #蓝朋友 #训练 #日常vlog",
            "like": 383340,
            "media_type": "4",
            "original_status": 102,
            "play": 34464874,
            "share": 13702,
            "status": 1,
            "title": "沉浸式体验消防战士的一天，很累！很燃！致敬最可爱的人！#消防员 #蓝朋友 #训练 #日常vlog",
            "url": "https://www.iesdouyin.com/share/video/7404773952993742092/?region=CN&mid=7404773992629848842",
            "video_id": "v0300fg10000cr1gj5vog65q02ke0jtg"
        },
        {
            "comment": 17724,
            "core_user_id": "71510504205",
            "create_time": 1723800699,
            "create_timestamp": 1723800699,
            "duration": 274,
            "duration_min": 4,
            "head_image_uri": "tos-cn-p-0015/oA1DFBToxAvyIlofQDlHEf0xCHvomQA8IAK9gH",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/oA1DFBToxAvyIlofQDlHEf0xCHvomQA8IAK9gH",
            "item_cover": "tos-cn-p-0015/oA1DFBToxAvyIlofQDlHEf0xCHvomQA8IAK9gH",
            "item_date": "2024-08-16",
            "item_id": "7403667566129892642",
            "item_title": "多次创业失败却仍不气馁，给逆流而上的老板涨涨人气，祝老板生意兴隆！#美食 #美食探店  #锅锅菜 #日常vlog",
            "like": 237865,
            "media_type": "4",
            "original_status": 102,
            "play": 21127272,
            "share": 6657,
            "status": 1,
            "title": "多次创业失败却仍不气馁，给逆流而上的老板涨涨人气，祝老板生意兴隆！#美食 #美食探店  #锅锅菜 #日常vlog",
            "url": "https://www.iesdouyin.com/share/video/7403667566129892642/?region=CN&mid=7403667595095771931",
            "video_id": "v0200fg10000cqvhkcfog65nq7h6a4d0"
        },
        {
            "comment": 8183,
            "core_user_id": "71510504205",
            "create_time": 1723453200,
            "create_timestamp": 1723453200,
            "duration": 204,
            "duration_min": 3,
            "head_image_uri": "tos-cn-p-0015/oQ6iAnfBDI8J9OmAbo9N6uTZ5BhAKifJiBsWIg",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/oQ6iAnfBDI8J9OmAbo9N6uTZ5BhAKifJiBsWIg",
            "item_cover": "tos-cn-p-0015/oQ6iAnfBDI8J9OmAbo9N6uTZ5BhAKifJiBsWIg",
            "item_date": "2024-08-12",
            "item_id": "7402125636455648550",
            "item_title": "见过比脑袋都大的巨型梦龙吗？三天都吃不完！#冰激凌#雪糕#美食#美食vlog",
            "like": 188519,
            "media_type": "4",
            "original_status": 102,
            "play": 19509597,
            "share": 21626,
            "status": 1,
            "title": "见过比脑袋都大的巨型梦龙吗？三天都吃不完！#冰激凌#雪糕#美食#美食vlog",
            "url": "https://www.iesdouyin.com/share/video/7402125636455648550/?region=CN&mid=7402125431618505513",
            "video_id": "v0300fg10000cqspvbfog65sdokssj6g"
        },
        {
            "comment": 52736,
            "core_user_id": "71510504205",
            "create_time": 1722502791,
            "create_timestamp": 1722502791,
            "duration": 306,
            "duration_min": 5,
            "head_image_uri": "tos-cn-p-0015/owkZ42DYQEEnY0fA0TmArDpBqQNuCFAfgABFG9",
            "is_hot": true,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/owkZ42DYQEEnY0fA0TmArDpBqQNuCFAfgABFG9",
            "item_cover": "tos-cn-p-0015/owkZ42DYQEEnY0fA0TmArDpBqQNuCFAfgABFG9",
            "item_date": "2024-08-01",
            "item_id": "7398093128453868839",
            "item_title": "20分钟卸5000件快递？拼的不仅仅是手速。#职业体验  #快递分拣  #物流",
            "like": 373812,
            "media_type": "4",
            "original_status": 102,
            "play": 42449409,
            "share": 97956,
            "status": 1,
            "title": "20分钟卸5000件快递？拼的不仅仅是手速。#职业体验  #快递分拣  #物流",
            "url": "https://www.iesdouyin.com/share/video/7398093128453868839/?region=CN&mid=7398093206790982427",
            "video_id": "v0200fg10000cqlks6fog65r0dqe5260"
        },
        {
            "comment": 3148,
            "core_user_id": "71510504205",
            "create_time": 1721902400,
            "create_timestamp": 1721902400,
            "duration": 114,
            "duration_min": 1,
            "head_image_uri": "tos-cn-p-0015/oU9mJiK2CAeoD9zlgQF8oJNDpfm5sUiEAAByiQ",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/oU9mJiK2CAeoD9zlgQF8oJNDpfm5sUiEAAByiQ",
            "item_cover": "tos-cn-p-0015/oU9mJiK2CAeoD9zlgQF8oJNDpfm5sUiEAAByiQ",
            "item_date": "2024-07-25",
            "item_id": "7395514446942145827",
            "item_title": "和他们在一起很开心，年轻人就应该活力满满敢于挑战#户外健身  #扳手腕 #花小龙",
            "like": 178531,
            "media_type": "4",
            "original_status": 102,
            "play": 13552749,
            "share": 3839,
            "status": 1,
            "title": "和他们在一起很开心，年轻人就应该活力满满敢于挑战#户外健身  #扳手腕 #花小龙",
            "url": "https://www.iesdouyin.com/share/video/7395514446942145827/?region=CN&mid=7395514410808265523",
            "video_id": "v0d00fg10000cqh25afog65kfcrdcsv0"
        },
        {
            "comment": 13806,
            "core_user_id": "71510504205",
            "create_time": 1721466017,
            "create_timestamp": 1721466017,
            "duration": 191,
            "duration_min": 3,
            "head_image_uri": "tos-cn-p-0015/okAGMIuaNBiNfqT5AGC4EAjNLDvQGQe7KBse2m",
            "is_hot": true,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/okAGMIuaNBiNfqT5AGC4EAjNLDvQGQe7KBse2m",
            "item_cover": "tos-cn-p-0015/okAGMIuaNBiNfqT5AGC4EAjNLDvQGQe7KBse2m",
            "item_date": "2024-07-20",
            "item_id": "7393640220807220519",
            "item_title": "扛楼一天，华哥请客海鲜大餐，疯狂下单22份大龙虾后华哥脸都绿了。#海鲜大餐 #海鲜#龙虾  #美食 #抖音美好食光",
            "like": 341352,
            "media_type": "4",
            "original_status": 102,
            "play": 32048380,
            "share": 39367,
            "status": 1,
            "title": "扛楼一天，华哥请客海鲜大餐，疯狂下单22份大龙虾后华哥脸都绿了。#海鲜大餐 #海鲜#龙虾  #美食 #抖音美好食光",
            "url": "https://www.iesdouyin.com/share/video/7393640220807220519/?region=CN&mid=7393640134509366043",
            "video_id": "v0300fg10000cqdnbqfog65uflhkcl9g"
        },
        {
            "comment": 12994,
            "core_user_id": "71510504205",
            "create_time": 1721381388,
            "create_timestamp": 1721381388,
            "duration": 137,
            "duration_min": 2,
            "head_image_uri": "tos-cn-p-0015/oUdYVJEIIAgm4FmfNMFDaUqvfh8rUAAvDBi9B2",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/oUdYVJEIIAgm4FmfNMFDaUqvfh8rUAAvDBi9B2",
            "item_cover": "tos-cn-p-0015/oUdYVJEIIAgm4FmfNMFDaUqvfh8rUAAvDBi9B2",
            "item_date": "2024-07-19",
            "item_id": "7393276737880165647",
            "item_title": "扛楼一天750，一顿生腌758，白干了！#潮汕生腌 #生腌海鲜 #美食",
            "like": 158335,
            "media_type": "4",
            "original_status": 102,
            "play": 16053811,
            "share": 12778,
            "status": 1,
            "title": "扛楼一天750，一顿生腌758，白干了！#潮汕生腌 #生腌海鲜 #美食",
            "url": "https://www.iesdouyin.com/share/video/7393276737880165647/?region=CN&mid=7393276642401094438",
            "video_id": "v0300fg10000cqd2ue7og65rbpmnfavg"
        },
        {
            "comment": 13902,
            "core_user_id": "71510504205",
            "create_time": 1721208621,
            "create_timestamp": 1721208621,
            "duration": 105,
            "duration_min": 1,
            "head_image_uri": "tos-cn-p-0015/oYav944BmQNdAlAjHBlFfEiEQ4DEL8AH7gfblX",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/oYav944BmQNdAlAjHBlFfEiEQ4DEL8AH7gfblX",
            "item_cover": "tos-cn-p-0015/oYav944BmQNdAlAjHBlFfEiEQ4DEL8AH7gfblX",
            "item_date": "2024-07-17",
            "item_id": "7392534702097173775",
            "item_title": "挑战一下扛30块砖上六楼，真不容易。提醒户外作业的兄弟们，注意防暑，太热了！！#扛楼  #健身 #挑战 #扛楼工",
            "like": 190013,
            "media_type": "4",
            "original_status": 102,
            "play": 21450630,
            "share": 4669,
            "status": 1,
            "title": "挑战一下扛30块砖上六楼，真不容易。提醒户外作业的兄弟们，注意防暑，太热了！！#扛楼  #健身 #挑战 #扛楼工",
            "url": "https://www.iesdouyin.com/share/video/7392534702097173775/?region=CN&mid=7392534679682927386",
            "video_id": "v0d00fg10000cqbohevog65hiqvg7de0"
        }
    ],
    "latest_item_statics_antispam": {},
    "latest_star_item_info": [
        {
            "comment": 49882,
            "core_user_id": "71510504205",
            "create_time": 1726996212,
            "create_timestamp": 1726996212,
            "duration": 671,
            "duration_min": 11,
            "head_image_uri": "tos-cn-p-0015/ocTN3FGzQBCIrfWHeBAAQU7Lv4vHX4ZUBge7Gx",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/ocTN3FGzQBCIrfWHeBAAQU7Lv4vHX4ZUBge7Gx",
            "item_cover": "tos-cn-p-0015/ocTN3FGzQBCIrfWHeBAAQU7Lv4vHX4ZUBge7Gx",
            "item_date": "2024-09-22",
            "item_id": "7417362470278303002",
            "item_title": "花8000包下80岁爷爷的草鱼塘，这次是亏是赚呢？#户外捕鱼#九块九省钱攻略#我在抖音淘到的解馋小零食",
            "like": 701786,
            "media_type": "4",
            "original_status": 102,
            "play": 44619155,
            "share": 33446,
            "status": 1,
            "title": "花8000包下80岁爷爷的草鱼塘，这次是亏是赚呢？#户外捕鱼#九块九省钱攻略#我在抖音淘到的解馋小零食",
            "url": "https://www.iesdouyin.com/share/video/7417362470278303002/?region=CN&mid=7417362667247356698",
            "video_id": "v0300fg10000crns50vog65lnievjcu0"
        },
        {
            "comment": 30105,
            "core_user_id": "71510504205",
            "create_time": 1726826695,
            "create_timestamp": 1726826695,
            "duration": 518,
            "duration_min": 8,
            "head_image_uri": "tos-cn-p-0015/oobCR0pwIIPorPwRxIZiAtBQonizwQuhkmJAl",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/oobCR0pwIIPorPwRxIZiAtBQonizwQuhkmJAl",
            "item_cover": "tos-cn-p-0015/oobCR0pwIIPorPwRxIZiAtBQonizwQuhkmJAl",
            "item_date": "2024-09-20",
            "item_id": "7416626473466907955",
            "item_title": "1500撒6网，现场教“透心良”怎么做生意。#户外捕鱼 #鱼塘 #日常vlog",
            "like": 163390,
            "media_type": "4",
            "original_status": 102,
            "play": 15278486,
            "share": 5316,
            "status": 1,
            "title": "1500撒6网，现场教“透心良”怎么做生意。#户外捕鱼 #鱼塘 #日常vlog",
            "url": "https://www.iesdouyin.com/share/video/7416626473466907955/?region=CN&mid=7416626371947924236",
            "video_id": "v0300fg10000crmib47og65gosu13b8g"
        },
        {
            "comment": 20679,
            "core_user_id": "71510504205",
            "create_time": 1726565479,
            "create_timestamp": 1726565479,
            "duration": 579,
            "duration_min": 9,
            "head_image_uri": "tos-cn-p-0015/o8ACpiV1gdw9BMDHefPBJzAzgDiJAT9IazJYIz",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/o8ACpiV1gdw9BMDHefPBJzAzgDiJAT9IazJYIz",
            "item_cover": "tos-cn-p-0015/o8ACpiV1gdw9BMDHefPBJzAzgDiJAT9IazJYIz",
            "item_date": "2024-09-17",
            "item_id": "7415515180563483930",
            "item_title": "挑战2小时帮网友卸货 5000 件，助他们早点回家过节。#装卸工 #卸货 #日常vlog #博朗剃须刀",
            "like": 216833,
            "media_type": "4",
            "original_status": 102,
            "play": 17702354,
            "share": 11857,
            "status": 1,
            "title": "挑战2小时帮网友卸货 5000 件，助他们早点回家过节。#装卸工 #卸货 #日常vlog #博朗剃须刀",
            "url": "https://www.iesdouyin.com/share/video/7415515180563483930/?region=CN&mid=7415515226935659274",
            "video_id": "v0300fg10000crkj0qvog65jo3r1aqpg"
        },
        {
            "comment": 53021,
            "core_user_id": "71510504205",
            "create_time": 1725979255,
            "create_timestamp": 1725979255,
            "duration": 502,
            "duration_min": 8,
            "head_image_uri": "tos-cn-p-0015/oEfDAFfDCQiK9mmAlgA4X4QEABYAREBbFEZMQg",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/oEfDAFfDCQiK9mmAlgA4X4QEABYAREBbFEZMQg",
            "item_cover": "tos-cn-p-0015/oEfDAFfDCQiK9mmAlgA4X4QEABYAREBbFEZMQg",
            "item_date": "2024-09-10",
            "item_id": "7412995976409009446",
            "item_title": "华哥一网回本！！我真的太替他高兴了！！#李维刚和大表哥包塘二番战 #抓鱼 #日常vlog",
            "like": 218494,
            "media_type": "4",
            "original_status": 102,
            "play": 24137030,
            "share": 10235,
            "status": 1,
            "title": "华哥一网回本！！我真的太替他高兴了！！#李维刚和大表哥包塘二番战 #抓鱼 #日常vlog",
            "url": "https://www.iesdouyin.com/share/video/7412995976409009446/?region=CN&mid=7412996327530875685",
            "video_id": "v0200fg10000crg40j7og65h98cb68e0"
        },
        {
            "comment": 48324,
            "core_user_id": "71510504205",
            "create_time": 1725627671,
            "create_timestamp": 1725627671,
            "duration": 509,
            "duration_min": 8,
            "head_image_uri": "tos-cn-p-0015/okvm2CDIIABErbjjfAAgIgFFfua6Xz8n8c09D6",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/okvm2CDIIABErbjjfAAgIgFFfua6Xz8n8c09D6",
            "item_cover": "tos-cn-p-0015/okvm2CDIIABErbjjfAAgIgFFfua6Xz8n8c09D6",
            "item_date": "2024-09-06",
            "item_id": "7411495338663513382",
            "item_title": "和大表哥包塘二番战，这次直接巨款包下了一个30亩的大山塘！#抓鱼#康比特酸奶乳清",
            "like": 288148,
            "media_type": "4",
            "original_status": 102,
            "play": 27986022,
            "share": 15271,
            "status": 1,
            "title": "和大表哥包塘二番战，这次直接巨款包下了一个30亩的大山塘！#抓鱼#康比特酸奶乳清",
            "url": "https://www.iesdouyin.com/share/video/7411495338663513382/?region=CN&mid=7411495318455405353",
            "video_id": "v0300fg10000crdejunog65ht5vshspg"
        },
        {
            "comment": 34511,
            "core_user_id": "71510504205",
            "create_time": 1725354642,
            "create_timestamp": 1725354642,
            "duration": 703,
            "duration_min": 11,
            "head_image_uri": "tos-cn-p-0015/ocPcvIwZQAyxz3bBJIPIIVMkQKXbItwiBIiAi",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/ocPcvIwZQAyxz3bBJIPIIVMkQKXbItwiBIiAi",
            "item_cover": "tos-cn-p-0015/ocPcvIwZQAyxz3bBJIPIIVMkQKXbItwiBIiAi",
            "item_date": "2024-09-03",
            "item_id": "7410050330320325915",
            "item_title": "花二万二包了一个抵债的大鱼塘，据说有四五千斤鱼！会不会又是冤大头？#鱼塘 #农村生活 #日常vlog",
            "like": 241209,
            "media_type": "4",
            "original_status": 102,
            "play": 30672782,
            "share": 11877,
            "status": 1,
            "title": "花二万二包了一个抵债的大鱼塘，据说有四五千斤鱼！会不会又是冤大头？#鱼塘 #农村生活 #日常vlog",
            "url": "https://www.iesdouyin.com/share/video/7410050330320325915/?region=CN&mid=7410050543059520306",
            "video_id": "v0300fg10000crasgc7og65jrk62uai0"
        },
        {
            "comment": 30568,
            "core_user_id": "71510504205",
            "create_time": 1724754273,
            "create_timestamp": 1724754273,
            "duration": 621,
            "duration_min": 10,
            "head_image_uri": "tos-cn-p-0015/oABXdDQY4CPikJN2F9PnDIAAsIZd9Wi7QwrWI",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/oABXdDQY4CPikJN2F9PnDIAAsIZd9Wi7QwrWI",
            "item_cover": "tos-cn-p-0015/oABXdDQY4CPikJN2F9PnDIAAsIZd9Wi7QwrWI",
            "item_date": "2024-08-27",
            "item_id": "7407750436351905078",
            "item_title": "和大表哥花巨款包下一口深山悬崖老塘，两天两夜都没抽干，血赚还是血亏？#户外 #抓鱼 #日常vlog #记录农村美好生活",
            "like": 573101,
            "media_type": "4",
            "original_status": 102,
            "play": 42150778,
            "share": 44620,
            "status": 1,
            "title": "和大表哥花巨款包下一口深山悬崖老塘，两天两夜都没抽干，血赚还是血亏？#户外 #抓鱼 #日常vlog #记录农村美好生活",
            "url": "https://www.iesdouyin.com/share/video/7407750436351905078/?region=CN&mid=7407750421046921994",
            "video_id": "v0300fg10000cr6pq37og65rc42u8mb0"
        },
        {
            "comment": 28955,
            "core_user_id": "71510504205",
            "create_time": 1724240386,
            "create_timestamp": 1724240386,
            "duration": 318,
            "duration_min": 5,
            "head_image_uri": "tos-cn-p-0015/oMQeFmFAzBby7g92ypQATFEAqvDd4xCHifWuGD",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/oMQeFmFAzBby7g92ypQATFEAqvDd4xCHifWuGD",
            "item_cover": "tos-cn-p-0015/oMQeFmFAzBby7g92ypQATFEAqvDd4xCHifWuGD",
            "item_date": "2024-08-21",
            "item_id": "7405532234070969612",
            "item_title": "价值20万，重达300斤，海鲜中的劳斯莱斯到底长啥样？今天开眼了！#美食vlog #金枪鱼 #吉列剃须刀",
            "like": 472208,
            "media_type": "4",
            "original_status": 102,
            "play": 52657468,
            "share": 48347,
            "status": 1,
            "title": "价值20万，重达300斤，海鲜中的劳斯莱斯到底长啥样？今天开眼了！#美食vlog #金枪鱼 #吉列剃须刀",
            "url": "https://www.iesdouyin.com/share/video/7405532234070969612/?region=CN&mid=7405532094358702884",
            "video_id": "v0300fg10000cr2rlbnog65p8mqi5s5g"
        },
        {
            "comment": 28040,
            "core_user_id": "71510504205",
            "create_time": 1723110134,
            "create_timestamp": 1723110134,
            "duration": 294,
            "duration_min": 4,
            "head_image_uri": "tos-cn-p-0015/oklzNDZQmNASeKmoBvFEgTDFAtA9PbiQQMfCDG",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/oklzNDZQmNASeKmoBvFEgTDFAtA9PbiQQMfCDG",
            "item_cover": "tos-cn-p-0015/oklzNDZQmNASeKmoBvFEgTDFAtA9PbiQQMfCDG",
            "item_date": "2024-08-08",
            "item_id": "7400652630348827915",
            "item_title": "带学生挑战8000块的大活，难道砸墙来钱这么快？#职业体验 #砸墙",
            "like": 301330,
            "media_type": "4",
            "original_status": 102,
            "play": 25224399,
            "share": 14864,
            "status": 1,
            "title": "带学生挑战8000块的大活，难道砸墙来钱这么快？#职业体验 #砸墙",
            "url": "https://www.iesdouyin.com/share/video/7400652630348827915/?region=CN&mid=7400652574589782847",
            "video_id": "v0300fg10000cqq69hfog65nj4mc2540"
        },
        {
            "comment": 11486,
            "core_user_id": "71510504205",
            "create_time": 1722848474,
            "create_timestamp": 1722848474,
            "duration": 239,
            "duration_min": 3,
            "head_image_uri": "tos-cn-p-0015/oMEeQDbfEhNQMMA9nRsmEEFUgQ3DiCgAAogtwB",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/oMEeQDbfEhNQMMA9nRsmEEFUgQ3DiCgAAogtwB",
            "item_cover": "tos-cn-p-0015/oMEeQDbfEhNQMMA9nRsmEEFUgQ3DiCgAAogtwB",
            "item_date": "2024-08-05",
            "item_id": "7399491216003386635",
            "item_title": "被小孩哥按在地上摩擦，哈桑来了都拯救不了，国足有希望了。#国粉之光康比特 #蛋白粉",
            "like": 104337,
            "media_type": "4",
            "original_status": 102,
            "play": 8580832,
            "share": 6323,
            "status": 1,
            "title": "被小孩哥按在地上摩擦，哈桑来了都拯救不了，国足有希望了。#国粉之光康比特 #蛋白粉",
            "url": "https://www.iesdouyin.com/share/video/7399491216003386635/?region=CN&mid=7399491169283017509",
            "video_id": "v0300fg10000cqo4a9vog65g148p86o0"
        },
        {
            "comment": 5908,
            "core_user_id": "71510504205",
            "create_time": 1722336760,
            "create_timestamp": 1722336760,
            "duration": 600,
            "duration_min": 10,
            "head_image_uri": "tos-cn-p-0015/o4WFmBVrIADJ2ECA9AuiObwAnIKegPibzoBrKf",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/o4WFmBVrIADJ2ECA9AuiObwAnIKegPibzoBrKf",
            "item_cover": "tos-cn-p-0015/o4WFmBVrIADJ2ECA9AuiObwAnIKegPibzoBrKf",
            "item_date": "2024-07-30",
            "item_id": "7397366179301543180",
            "item_title": "开长城炮跨越700公里参加@嘴哥 的特训，我认为我是完成质量最高的那个，你们觉得呢？#中国皮卡就看长城炮  #长城炮",
            "like": 158899,
            "media_type": "4",
            "original_status": 102,
            "play": 11689393,
            "share": 5433,
            "status": 1,
            "title": "开长城炮跨越700公里参加@嘴哥 的特训，我认为我是完成质量最高的那个，你们觉得呢？#中国皮卡就看长城炮  #长城炮",
            "url": "https://www.iesdouyin.com/share/video/7397366179301543180/?region=CN&mid=7397366158606781211",
            "video_id": "v0300fg10000cqkbg4vog65trardm450"
        },
        {
            "comment": 9462,
            "core_user_id": "71510504205",
            "create_time": 1722676226,
            "create_timestamp": 1722676226,
            "duration": 347,
            "duration_min": 5,
            "head_image_uri": "tos-cn-p-0015/oMEnIDNFQDAlizWFAIFfA9mBCALgZBhqI9fDoE",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/oMEnIDNFQDAlizWFAIFfA9mBCALgZBhqI9fDoE",
            "item_cover": "tos-cn-p-0015/oMEnIDNFQDAlizWFAIFfA9mBCALgZBhqI9fDoE",
            "item_date": "2024-08-03",
            "item_id": "7397314396168473867",
            "item_title": "带暑假工搬瓷砖，挑战日赚一千，中途风波不断 ！#暑假工 #搬运工 #瓷砖",
            "like": 112197,
            "media_type": "4",
            "original_status": 102,
            "play": 9929898,
            "share": 5039,
            "status": 1,
            "title": "带暑假工搬瓷砖，挑战日赚一千，中途风波不断 ！#暑假工 #搬运工 #瓷砖",
            "url": "https://www.iesdouyin.com/share/video/7397314396168473867/?region=CN&mid=7397314397506865947",
            "video_id": "v0300fg10000cqk8jk7og65v2svkmp6g"
        },
        {
            "comment": 9267,
            "core_user_id": "71510504205",
            "create_time": 1722070829,
            "create_timestamp": 1722070829,
            "duration": 338,
            "duration_min": 5,
            "head_image_uri": "tos-cn-p-0015/ooWIALhNiiATFUCgIezBDbvHO62Z11zhmAafB9",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/ooWIALhNiiATFUCgIezBDbvHO62Z11zhmAafB9",
            "item_cover": "tos-cn-p-0015/ooWIALhNiiATFUCgIezBDbvHO62Z11zhmAafB9",
            "item_date": "2024-07-27",
            "item_id": "7395433678391856403",
            "item_title": "以前都是干体力活，今天干点技术活。挑战一天挣2000块！#职业体验 #踩缝纫机 #制衣厂#九块九省钱攻略",
            "like": 144819,
            "media_type": "4",
            "original_status": 102,
            "play": 10277924,
            "share": 15324,
            "status": 1,
            "title": "以前都是干体力活，今天干点技术活。挑战一天挣2000块！#职业体验 #踩缝纫机 #制衣厂#九块九省钱攻略",
            "url": "https://www.iesdouyin.com/share/video/7395433678391856403/?region=CN&mid=7395433644203985690",
            "video_id": "v0300fg10000cqgtldvog65l9mlsfq6g"
        },
        {
            "comment": 22398,
            "core_user_id": "71510504205",
            "create_time": 1721812215,
            "create_timestamp": 1721812215,
            "duration": 297,
            "duration_min": 4,
            "head_image_uri": "tos-cn-p-0015/oARBSIX4goNAZtumAUEvCFQB7BQDjAfG0Ifaif",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/oARBSIX4goNAZtumAUEvCFQB7BQDjAfG0Ifaif",
            "item_cover": "tos-cn-p-0015/oARBSIX4goNAZtumAUEvCFQB7BQDjAfG0Ifaif",
            "item_date": "2024-07-24",
            "item_id": "7395078790407392551",
            "item_title": "奥特曼来了都要亮红灯的职业，我直接把流水线干停！ #康比特增肌粉 #日常 #增肌粉 #职业体验",
            "like": 256919,
            "media_type": "4",
            "original_status": 102,
            "play": 11369323,
            "share": 9653,
            "status": 1,
            "title": "奥特曼来了都要亮红灯的职业，我直接把流水线干停！ #康比特增肌粉 #日常 #增肌粉 #职业体验",
            "url": "https://www.iesdouyin.com/share/video/7395078790407392551/?region=CN&mid=7395078642444946188",
            "video_id": "v0300fg10000cqg9fu7og65k8o392vcg"
        },
        {
            "comment": 28002,
            "core_user_id": "71510504205",
            "create_time": 1721293248,
            "create_timestamp": 1721293248,
            "duration": 442,
            "duration_min": 7,
            "head_image_uri": "tos-cn-p-0015/o0EHAZXieCafIpqolgB8tIVSIAXz57BUjz4AiB",
            "is_hot": false,
            "is_playlet": 0,
            "item_animated_cover": "tos-cn-p-0015/o0EHAZXieCafIpqolgB8tIVSIAXz57BUjz4AiB",
            "item_cover": "tos-cn-p-0015/o0EHAZXieCafIpqolgB8tIVSIAXz57BUjz4AiB",
            "item_date": "2024-07-18",
            "item_id": "7392543796975668532",
            "item_title": "挑战扛楼一天赚1000块，看看今天能不能刷新记录#扛楼 #扛楼工 #康比特酸奶乳清  #蛋白粉",
            "like": 265199,
            "media_type": "4",
            "original_status": 102,
            "play": 13816492,
            "share": 10005,
            "status": 1,
            "title": "挑战扛楼一天赚1000块，看看今天能不能刷新记录#扛楼 #扛楼工 #康比特酸奶乳清  #蛋白粉",
            "url": "https://www.iesdouyin.com/share/video/7392543796975668532/?region=CN&mid=7392543831851502386",
            "video_id": "v0200fg10000cqbp9pvog65rbmn4g7k0"
        }
    ]
}
```



connectUsersBody

```json
{
    "author_link_type": "种草",
    "base_resp": {
        "status_code": 0,
        "status_message": ""
    },
    "link_struct": {
        "1": {
            "proportion": 0.3898591178874022,
            "same_industry_median": 8045082,
            "value": 70583920
        },
        "2": {
            "proportion": 0.3268152910316195,
            "same_industry_median": 6562219,
            "value": 59169847
        },
        "3": {
            "proportion": 0.28330789981709564,
            "same_industry_median": 1645789,
            "value": 51292842
        },
        "4": {
            "proportion": 0.00001769126388267114,
            "same_industry_median": 2976,
            "value": 3203
        },
        "5": {
            "rank_percent": 0.0001,
            "relative_ratio": 0.795,
            "value": 181049812
        }
    }
}
```

audiencePortraitBody

```json
{
    "base_resp": {
        "status_code": 0,
        "status_message": ""
    },
    "distributions": [
        {
            "description": "一线居多,占比29%",
            "distribution_list": [
                {
                    "distribution_key": "五线",
                    "distribution_value": "24225940"
                },
                {
                    "distribution_key": "四线",
                    "distribution_value": "31816196"
                },
                {
                    "distribution_key": "二线",
                    "distribution_value": "38663876"
                },
                {
                    "distribution_key": "三线",
                    "distribution_value": "44912050"
                },
                {
                    "distribution_key": "一线",
                    "distribution_value": "58218636"
                }
            ],
            "image": [
                "一线居多"
            ],
            "origin_type": 5,
            "type": 32,
            "type_display": "城市等级分布"
        },
        {
            "description": "分布最多的3个兴趣随拍(65%),社会时政(5%),二次元(5%)",
            "distribution_list": [
                {
                    "distribution_key": "随拍",
                    "distribution_value": "108371670"
                },
                {
                    "distribution_key": "社会时政",
                    "distribution_value": "9858755"
                },
                {
                    "distribution_key": "二次元",
                    "distribution_value": "9835274"
                },
                {
                    "distribution_key": "游戏",
                    "distribution_value": "9623639"
                },
                {
                    "distribution_key": "亲子",
                    "distribution_value": "8843310"
                },
                {
                    "distribution_key": "体育",
                    "distribution_value": "6805734"
                },
                {
                    "distribution_key": "美食",
                    "distribution_value": "6585982"
                },
                {
                    "distribution_key": "电视剧",
                    "distribution_value": "5044060"
                }
            ],
            "image": [
                "随拍,社会时政,二次元居多"
            ],
            "origin_type": 6,
            "type": 64,
            "type_display": "兴趣分布"
        },
        {
            "description": "Z世代居多,占比22%",
            "distribution_list": [
                {
                    "distribution_key": "Z世代",
                    "distribution_value": "40606477"
                },
                {
                    "distribution_key": "新锐白领",
                    "distribution_value": "31194851"
                },
                {
                    "distribution_key": "小镇中老年",
                    "distribution_value": "18032609"
                },
                {
                    "distribution_key": "都市蓝领",
                    "distribution_value": "23900479"
                },
                {
                    "distribution_key": "都市银发",
                    "distribution_value": "12708326"
                },
                {
                    "distribution_key": "精致妈妈",
                    "distribution_value": "4843622"
                },
                {
                    "distribution_key": "小镇青年",
                    "distribution_value": "35837826"
                },
                {
                    "distribution_key": "资深中产",
                    "distribution_value": "15098370"
                }
            ],
            "image": [
                "Z世代居多"
            ],
            "origin_type": 10,
            "type": 1024,
            "type_display": "八大人群分布"
        },
        {
            "description": "31到40岁居多,占比33%",
            "distribution_list": [
                {
                    "distribution_key": "50+",
                    "distribution_value": "19461549"
                },
                {
                    "distribution_key": "41-50",
                    "distribution_value": "27406017"
                },
                {
                    "distribution_key": "18-23",
                    "distribution_value": "32058753"
                },
                {
                    "distribution_key": "24-30",
                    "distribution_value": "44400981"
                },
                {
                    "distribution_key": "31-40",
                    "distribution_value": "61461456"
                }
            ],
            "image": [
                "31到40岁居多"
            ],
            "origin_type": 1,
            "type": 2,
            "type_display": "年龄分布"
        },
        {
            "description": "男性居多,占比82%",
            "distribution_list": [
                {
                    "distribution_key": "female",
                    "distribution_value": "35574525"
                },
                {
                    "distribution_key": "male",
                    "distribution_value": "162215414"
                }
            ],
            "image": [
                "男性居多"
            ],
            "origin_type": 0,
            "type": 1,
            "type_display": "性别分布"
        },
        {
            "description": "苹果手机占比28%, 消费能力较好",
            "distribution_list": [
                {
                    "distribution_key": "iPhone",
                    "distribution_value": "55635573"
                },
                {
                    "distribution_key": "红米",
                    "distribution_value": "8546926"
                },
                {
                    "distribution_key": "荣耀",
                    "distribution_value": "21871509"
                },
                {
                    "distribution_key": "vivo",
                    "distribution_value": "24819932"
                },
                {
                    "distribution_key": "其他",
                    "distribution_value": "19312701"
                },
                {
                    "distribution_key": "小米",
                    "distribution_value": "12100286"
                },
                {
                    "distribution_key": "oppo",
                    "distribution_value": "22976191"
                },
                {
                    "distribution_key": "华为",
                    "distribution_value": "32573580"
                }
            ],
            "image": [
                "苹果手机较多"
            ],
            "origin_type": 3,
            "type": 8,
            "type_display": "设备品牌分布"
        },
        {
            "description": "分布最多的3个省份广东(13%),江苏(7%),浙江(7%)",
            "distribution_list": [
                {
                    "distribution_key": "湖南",
                    "distribution_value": "8227016"
                },
                {
                    "distribution_key": "青海",
                    "distribution_value": "524024"
                },
                {
                    "distribution_key": "云南",
                    "distribution_value": "6049348"
                },
                {
                    "distribution_key": "北京",
                    "distribution_value": "3901096"
                },
                {
                    "distribution_key": "重庆",
                    "distribution_value": "4211981"
                },
                {
                    "distribution_key": "湖北",
                    "distribution_value": "8190236"
                },
                {
                    "distribution_key": "西藏",
                    "distribution_value": "671223"
                },
                {
                    "distribution_key": "陕西",
                    "distribution_value": "5482818"
                },
                {
                    "distribution_key": "安徽",
                    "distribution_value": "9029836"
                },
                {
                    "distribution_key": "贵州",
                    "distribution_value": "4650359"
                },
                {
                    "distribution_key": "山西",
                    "distribution_value": "3568426"
                },
                {
                    "distribution_key": "福建",
                    "distribution_value": "6922657"
                },
                {
                    "distribution_key": "香港",
                    "distribution_value": "198161"
                },
                {
                    "distribution_key": "江苏",
                    "distribution_value": "15543415"
                },
                {
                    "distribution_key": "澳门",
                    "distribution_value": "54670"
                },
                {
                    "distribution_key": "海南",
                    "distribution_value": "1849835"
                },
                {
                    "distribution_key": "天津",
                    "distribution_value": "1790846"
                },
                {
                    "distribution_key": "江西",
                    "distribution_value": "6291917"
                },
                {
                    "distribution_key": "四川",
                    "distribution_value": "10379190"
                },
                {
                    "distribution_key": "广东",
                    "distribution_value": "26194319"
                },
                {
                    "distribution_key": "甘肃",
                    "distribution_value": "1908942"
                },
                {
                    "distribution_key": "河北",
                    "distribution_value": "7322403"
                },
                {
                    "distribution_key": "河南",
                    "distribution_value": "12613521"
                },
                {
                    "distribution_key": "吉林",
                    "distribution_value": "1542873"
                },
                {
                    "distribution_key": "新疆",
                    "distribution_value": "2997512"
                },
                {
                    "distribution_key": "浙江",
                    "distribution_value": "14936692"
                },
                {
                    "distribution_key": "黑龙江",
                    "distribution_value": "1764888"
                },
                {
                    "distribution_key": "台湾",
                    "distribution_value": "162723"
                },
                {
                    "distribution_key": "辽宁",
                    "distribution_value": "3217733"
                },
                {
                    "distribution_key": "广西",
                    "distribution_value": "6284187"
                },
                {
                    "distribution_key": "上海",
                    "distribution_value": "4588238"
                },
                {
                    "distribution_key": "内蒙古",
                    "distribution_value": "2076390"
                },
                {
                    "distribution_key": "宁夏",
                    "distribution_value": "721182"
                },
                {
                    "distribution_key": "山东",
                    "distribution_value": "11652624"
                }
            ],
            "image": [
                "广东,江苏,浙江居多"
            ],
            "origin_type": 2,
            "type": 4,
            "type_display": "省份分布"
        },
        {
            "description": "分布最多的1个城市广州(12%)",
            "distribution_list": [
                {
                    "distribution_key": "武汉",
                    "distribution_value": "2954282"
                },
                {
                    "distribution_key": "杭州",
                    "distribution_value": "3142433"
                },
                {
                    "distribution_key": "东莞",
                    "distribution_value": "3467259"
                },
                {
                    "distribution_key": "苏州",
                    "distribution_value": "3516250"
                },
                {
                    "distribution_key": "北京",
                    "distribution_value": "3901097"
                },
                {
                    "distribution_key": "广州",
                    "distribution_value": "4920133"
                },
                {
                    "distribution_key": "上海",
                    "distribution_value": "4588238"
                },
                {
                    "distribution_key": "深圳",
                    "distribution_value": "4427114"
                },
                {
                    "distribution_key": "重庆",
                    "distribution_value": "4211981"
                },
                {
                    "distribution_key": "成都",
                    "distribution_value": "4113256"
                }
            ],
            "image": [
                "广州居多"
            ],
            "origin_type": 8,
            "type": 256,
            "type_display": "城市分布"
        }
    ],
    "last_update_time": "1727341690"
}
```

fansPortraitBody

```json
{
    "base_resp": {
        "status_code": 0,
        "status_message": ""
    },
    "distributions": [
        {
            "description": "31到40岁居多,占比38%",
            "distribution_list": [
                {
                    "distribution_key": "18-23",
                    "distribution_value": "909596"
                },
                {
                    "distribution_key": "50+",
                    "distribution_value": "411103"
                },
                {
                    "distribution_key": "其他",
                    "distribution_value": "703545"
                },
                {
                    "distribution_key": "31-40",
                    "distribution_value": "1962780"
                },
                {
                    "distribution_key": "41-50",
                    "distribution_value": "515070"
                },
                {
                    "distribution_key": "24-30",
                    "distribution_value": "1271011"
                }
            ],
            "image": [
                "31到40岁居多"
            ],
            "origin_type": 1,
            "type": 2,
            "type_display": "年龄分布"
        },
        {
            "description": "苹果手机占比27%, 消费能力较好",
            "distribution_list": [
                {
                    "distribution_key": "荣耀",
                    "distribution_value": "580459"
                },
                {
                    "distribution_key": "vivo",
                    "distribution_value": "655054"
                },
                {
                    "distribution_key": "红米",
                    "distribution_value": "278819"
                },
                {
                    "distribution_key": "小米",
                    "distribution_value": "381974"
                },
                {
                    "distribution_key": "其他",
                    "distribution_value": "849330"
                },
                {
                    "distribution_key": "oppo",
                    "distribution_value": "577068"
                },
                {
                    "distribution_key": "iPhone",
                    "distribution_value": "1562240"
                },
                {
                    "distribution_key": "华为",
                    "distribution_value": "892556"
                }
            ],
            "image": [
                "苹果手机较多"
            ],
            "origin_type": 3,
            "type": 8,
            "type_display": "设备品牌分布"
        },
        {
            "description": "一线居多,占比32%",
            "distribution_list": [
                {
                    "distribution_key": "五线",
                    "distribution_value": "514377"
                },
                {
                    "distribution_key": "一线",
                    "distribution_value": "1813405"
                },
                {
                    "distribution_key": "二线",
                    "distribution_value": "1136577"
                },
                {
                    "distribution_key": "四线",
                    "distribution_value": "863453"
                },
                {
                    "distribution_key": "三线",
                    "distribution_value": "1241577"
                }
            ],
            "image": [
                "一线居多"
            ],
            "origin_type": 5,
            "type": 32,
            "type_display": "城市等级分布"
        },
        {
            "description": "男性居多,占比87%",
            "distribution_list": [
                {
                    "distribution_key": "female",
                    "distribution_value": "709828"
                },
                {
                    "distribution_key": "male",
                    "distribution_value": "5063286"
                }
            ],
            "image": [
                "男性居多"
            ],
            "origin_type": 0,
            "type": 1,
            "type_display": "性别分布"
        },
        {
            "description": "分布最多的1个城市上海(13%)",
            "distribution_list": [
                {
                    "distribution_key": "成都",
                    "distribution_value": "109115"
                },
                {
                    "distribution_key": "重庆",
                    "distribution_value": "108828"
                },
                {
                    "distribution_key": "深圳",
                    "distribution_value": "137314"
                },
                {
                    "distribution_key": "广州",
                    "distribution_value": "149192"
                },
                {
                    "distribution_key": "北京",
                    "distribution_value": "122309"
                },
                {
                    "distribution_key": "苏州",
                    "distribution_value": "108610"
                },
                {
                    "distribution_key": "长沙",
                    "distribution_value": "107261"
                },
                {
                    "distribution_key": "杭州",
                    "distribution_value": "102640"
                },
                {
                    "distribution_key": "东莞",
                    "distribution_value": "97326"
                },
                {
                    "distribution_key": "上海",
                    "distribution_value": "157943"
                }
            ],
            "image": [
                "上海居多"
            ],
            "origin_type": 8,
            "type": 256,
            "type_display": "城市分布"
        },
        {
            "description": "分布最多的3个省份广东(13%),江苏(9%),浙江(7%)",
            "distribution_list": [
                {
                    "distribution_key": "重庆",
                    "distribution_value": "108828"
                },
                {
                    "distribution_key": "新疆",
                    "distribution_value": "69017"
                },
                {
                    "distribution_key": "浙江",
                    "distribution_value": "439953"
                },
                {
                    "distribution_key": "广西",
                    "distribution_value": "130604"
                },
                {
                    "distribution_key": "江西",
                    "distribution_value": "170258"
                },
                {
                    "distribution_key": "四川",
                    "distribution_value": "254096"
                },
                {
                    "distribution_key": "山西",
                    "distribution_value": "111471"
                },
                {
                    "distribution_key": "天津",
                    "distribution_value": "56698"
                },
                {
                    "distribution_key": "安徽",
                    "distribution_value": "243529"
                },
                {
                    "distribution_key": "湖北",
                    "distribution_value": "232230"
                },
                {
                    "distribution_key": "黑龙江",
                    "distribution_value": "59021"
                },
                {
                    "distribution_key": "江苏",
                    "distribution_value": "512353"
                },
                {
                    "distribution_key": "河南",
                    "distribution_value": "325339"
                },
                {
                    "distribution_key": "辽宁",
                    "distribution_value": "104527"
                },
                {
                    "distribution_key": "香港",
                    "distribution_value": "11975"
                },
                {
                    "distribution_key": "上海",
                    "distribution_value": "157943"
                },
                {
                    "distribution_key": "台湾",
                    "distribution_value": "15221"
                },
                {
                    "distribution_key": "河北",
                    "distribution_value": "200719"
                },
                {
                    "distribution_key": "湖南",
                    "distribution_value": "282714"
                },
                {
                    "distribution_key": "海南",
                    "distribution_value": "38890"
                },
                {
                    "distribution_key": "广东",
                    "distribution_value": "755764"
                },
                {
                    "distribution_key": "云南",
                    "distribution_value": "122207"
                },
                {
                    "distribution_key": "贵州",
                    "distribution_value": "85957"
                },
                {
                    "distribution_key": "甘肃",
                    "distribution_value": "49011"
                },
                {
                    "distribution_key": "山东",
                    "distribution_value": "389491"
                },
                {
                    "distribution_key": "吉林",
                    "distribution_value": "51320"
                },
                {
                    "distribution_key": "青海",
                    "distribution_value": "12607"
                },
                {
                    "distribution_key": "西藏",
                    "distribution_value": "10644"
                },
                {
                    "distribution_key": "澳门",
                    "distribution_value": "3009"
                },
                {
                    "distribution_key": "宁夏",
                    "distribution_value": "18128"
                },
                {
                    "distribution_key": "陕西",
                    "distribution_value": "155132"
                },
                {
                    "distribution_key": "福建",
                    "distribution_value": "202873"
                },
                {
                    "distribution_key": "北京",
                    "distribution_value": "122308"
                },
                {
                    "distribution_key": "内蒙古",
                    "distribution_value": "65720"
                }
            ],
            "image": [
                "广东,江苏,浙江居多"
            ],
            "origin_type": 2,
            "type": 4,
            "type_display": "省份分布"
        },
        {
            "description": "分布最多的3个兴趣随拍(51%),游戏(12%),体育(9%)",
            "distribution_list": [
                {
                    "distribution_key": "亲子",
                    "distribution_value": "192808"
                },
                {
                    "distribution_key": "美食",
                    "distribution_value": "192525"
                },
                {
                    "distribution_key": "随拍",
                    "distribution_value": "2574608"
                },
                {
                    "distribution_key": "游戏",
                    "distribution_value": "630567"
                },
                {
                    "distribution_key": "体育",
                    "distribution_value": "487505"
                },
                {
                    "distribution_key": "社会时政",
                    "distribution_value": "356007"
                },
                {
                    "distribution_key": "二次元",
                    "distribution_value": "328542"
                },
                {
                    "distribution_key": "剧情",
                    "distribution_value": "196731"
                }
            ],
            "image": [
                "随拍,游戏,体育居多"
            ],
            "origin_type": 6,
            "type": 64,
            "type_display": "兴趣分布"
        },
        {
            "description": "Z世代居多,占比26%",
            "distribution_list": [
                {
                    "distribution_key": "资深中产",
                    "distribution_value": "417930"
                },
                {
                    "distribution_key": "精致妈妈",
                    "distribution_value": "92160"
                },
                {
                    "distribution_key": "Z世代",
                    "distribution_value": "1400069"
                },
                {
                    "distribution_key": "小镇中老年",
                    "distribution_value": "329283"
                },
                {
                    "distribution_key": "小镇青年",
                    "distribution_value": "979299"
                },
                {
                    "distribution_key": "新锐白领",
                    "distribution_value": "1097299"
                },
                {
                    "distribution_key": "都市银发",
                    "distribution_value": "212174"
                },
                {
                    "distribution_key": "都市蓝领",
                    "distribution_value": "667749"
                }
            ],
            "image": [
                "Z世代居多"
            ],
            "origin_type": 10,
            "type": 1024,
            "type_display": "八大人群分布"
        },
        {
            "description": "",
            "distribution_list": [
                {
                    "distribution_key": "200-500",
                    "distribution_value": "170899"
                },
                {
                    "distribution_key": "100-200",
                    "distribution_value": "340501"
                },
                {
                    "distribution_key": "50-100",
                    "distribution_value": "544331"
                },
                {
                    "distribution_key": "500以上",
                    "distribution_value": "72294"
                },
                {
                    "distribution_key": "0-50",
                    "distribution_value": "1339642"
                }
            ],
            "image": [
                ""
            ],
            "origin_type": 12,
            "type": 4096,
            "type_display": "客单价分布"
        },
        {
            "description": "",
            "distribution_list": [
                {
                    "distribution_key": "其他",
                    "distribution_value": "950054"
                },
                {
                    "distribution_key": "食品饮料",
                    "distribution_value": "487112"
                },
                {
                    "distribution_key": "智能家居",
                    "distribution_value": "347928"
                },
                {
                    "distribution_key": "服饰内衣",
                    "distribution_value": "281182"
                },
                {
                    "distribution_key": "个护家清",
                    "distribution_value": "203941"
                },
                {
                    "distribution_key": "运动户外",
                    "distribution_value": "200105"
                }
            ],
            "image": [
                ""
            ],
            "origin_type": 11,
            "type": 2048,
            "type_display": "消费品类分布"
        }
    ],
    "last_update_time": "1727341692"
}
```

xtIndexBody

```json
{
    "base_resp": {
        "status_code": 0,
        "status_message": ""
    },
    "cooperate_index": {
        "avg_value": 75.32,
        "link_relative_ratio": 0.1729,
        "rank": "3557",
        "rank_percent": 0.002,
        "value": 88.48
    },
    "cp_index": {
        "avg_value": 63.26,
        "link_relative_ratio": -0.0066,
        "rank": "16066",
        "rank_percent": 0.0092,
        "value": 73.34
    },
    "link_convert_index": {
        "avg_value": 55.81,
        "link_relative_ratio": -0.0037,
        "rank": "6840",
        "rank_percent": 0.0039,
        "value": 89.61
    },
    "link_shopping_index": {
        "avg_value": 53.89,
        "link_relative_ratio": 0.1151,
        "rank": "66",
        "rank_percent": 0,
        "value": 99.38
    },
    "link_spread_index": {
        "avg_value": 53.62,
        "link_relative_ratio": 0.0254,
        "rank": "233",
        "rank_percent": 0.0001,
        "value": 98.76
    },
    "link_star_index": {
        "avg_value": 56.81,
        "link_relative_ratio": 0.0586,
        "rank": "66",
        "rank_percent": 0,
        "value": 89.91
    }
}
```

字段修改sql

```sql
ALTER TABLE `resource_xt`
ADD COLUMN `grBfMin` int(11) DEFAULT NULL COMMENT '个人视频播放量最小值',
ADD COLUMN `grBfMax` int(11) DEFAULT NULL COMMENT '个人视频播放量最大值',
ADD COLUMN `grBfAvg` int(11) DEFAULT NULL COMMENT '个人视频播放量平均值',
ADD COLUMN `grBlSpBfbValue` int(11) DEFAULT NULL COMMENT '个人视频爆量视频百分比',
ADD COLUMN `grDzMin` int(11) DEFAULT NULL COMMENT '个人视频点赞量最小值',
ADD COLUMN `grDzMax` int(11) DEFAULT NULL COMMENT '个人视频点赞量最大值',
ADD COLUMN `grDzAvg` int(11) DEFAULT NULL COMMENT '个人视频点赞量平均值',
ADD COLUMN `grPlMin` int(11) DEFAULT NULL COMMENT '个人视频评论量最小值',
ADD COLUMN `grPlMax` int(11) DEFAULT NULL COMMENT '个人视频评论量最大值',
ADD COLUMN `grPlAvg` int(11) DEFAULT NULL COMMENT '个人视频评论量平均值',
ADD COLUMN `grZfMin` int(11) DEFAULT NULL COMMENT '个人视频转发量最小值',
ADD COLUMN `grZfMax` int(11) DEFAULT NULL COMMENT '个人视频转发量最大值',
ADD COLUMN `grZfAvg` int(11) DEFAULT NULL COMMENT '个人视频转发量平均值',
ADD COLUMN `xtAllBfMin` int(11) DEFAULT NULL COMMENT '星图视频播放量最小值',
ADD COLUMN `xtAllBfMax` int(11) DEFAULT NULL COMMENT '星图视频播放量最大值',
ADD COLUMN `xtAllBfAvg` int(11) DEFAULT NULL COMMENT '星图视频播放量平均值',
ADD COLUMN `xtAllBlSpBfbValue` int(11) DEFAULT NULL COMMENT '星图视频爆量视频百分比',
ADD COLUMN `xtAllDzMin` int(11) DEFAULT NULL COMMENT '星图视频点赞量最小值',
ADD COLUMN `xtAllDzMax` int(11) DEFAULT NULL COMMENT '星图视频点赞量最大值',
ADD COLUMN `xtAllDzAvg` int(11) DEFAULT NULL COMMENT '星图视频点赞量平均值',
ADD COLUMN `xtAllPlMin` int(11) DEFAULT NULL COMMENT '星图视频评论量最小值',
ADD COLUMN `xtAllPlMax` int(11) DEFAULT NULL COMMENT '星图视频评论量最大值',
ADD COLUMN `xtAllPlAvg` int(11) DEFAULT NULL COMMENT '星图视频评论量平均值',
ADD COLUMN `xtAllZfMin` int(11) DEFAULT NULL COMMENT '星图视频转发量最小值',
ADD COLUMN `xtAllZfMax` int(11) DEFAULT NULL COMMENT '星图视频转发量最大值',
ADD COLUMN `xtAllZfAvg` int(11) DEFAULT NULL COMMENT '星图视频转发量平均值',
ADD COLUMN `yljyhs` int(11) DEFAULT NULL COMMENT '月连接用户数',
ADD COLUMN `ysdyhs` int(11) DEFAULT NULL COMMENT '月深度用户数',
ADD COLUMN `ljConnectNum` int(11) DEFAULT NULL COMMENT '连接用户分布 - 了解',
ADD COLUMN `xqConnectNum` int(11) DEFAULT NULL COMMENT '连接用户分布 - 兴趣',
ADD COLUMN `xhConnectNum` int(11) DEFAULT NULL COMMENT '连接用户分布 - 喜欢',
ADD COLUMN `zsConnectNum` int(11) DEFAULT NULL COMMENT '连接用户分布 - 追随',
ADD COLUMN `bdrqRatio` int(11) DEFAULT NULL COMMENT '观众画像 - 八大人群占比',
ADD COLUMN `gzAge` int(11) DEFAULT NULL COMMENT '观众画像 - 观众年龄',
ADD COLUMN `gzSex` int(11) DEFAULT NULL COMMENT '观众画像 - 观众性别',
ADD COLUMN `gzDevice` int(11) DEFAULT NULL COMMENT '观众画像 - 观众设备品牌',
ADD COLUMN `gzAreaProvince` int(11) DEFAULT NULL COMMENT '观众画像 - 观众地域 省份',
ADD COLUMN `gzAreaCity` int(11) DEFAULT NULL COMMENT '观众画像 - 观众地域 城市',
ADD COLUMN `fsAge` int(11) DEFAULT NULL COMMENT '粉丝画像 - 粉丝年龄',
ADD COLUMN `fsSex` int(11) DEFAULT NULL COMMENT '粉丝画像 - 粉丝性别',
ADD COLUMN `fsDevice` int(11) DEFAULT NULL COMMENT '粉丝画像 - 粉丝设备品牌',
ADD COLUMN `fsAreaProvince` int(11) DEFAULT NULL COMMENT '粉丝画像 - 粉丝地域 省份',
ADD COLUMN `fsAreaCity` int(11) DEFAULT NULL COMMENT '粉丝画像 - 粉丝地域 城市',
ADD COLUMN `syXtIndex` int(11) DEFAULT NULL COMMENT '商业能力 - 星图指数',
ADD COLUMN `syCbIndex` int(11) DEFAULT NULL COMMENT '商业能力 - 传播指数',
ADD COLUMN `syZcIndex` int(11) DEFAULT NULL COMMENT '商业能力 - 种草指数',
ADD COLUMN `syZhIndex` int(11) DEFAULT NULL COMMENT '商业能力 - 转化指数',
ADD COLUMN `syXjbIndex` int(11) DEFAULT NULL COMMENT '商业能力 - 性价比指数',
ADD COLUMN `syHzIndex` int(11) DEFAULT NULL COMMENT '商业能力 - 合作指数';

```

```sql
SELECT* FROM extension_import
where shortId = "89329922"

SELECT * FROM resource_xt
WHERE resourceId = 788161
```

