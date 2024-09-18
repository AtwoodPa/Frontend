// 获取所有具有 el-tabs__item 类的元素
import {bus} from "../gaoq-chrome-extension/src/content-scripts/bus";
//
// const tabs: NodeListOf<HTMLDivElement> = document.querySelectorAll('.el-tabs__item');
//
// // 为每个 tab 添加点击事件
// tabs.forEach((tab: HTMLDivElement) => {
//     tab.addEventListener('click', () => {
//         // 输出点击的 tab 的 id
//         console.log(`Tab ${tab.id} clicked!`);
//
//         // 你可以在这里添加其他处理逻辑
//     });
// });
// console.log("last15VideoBody", last15VideoBody);
// const { latest_item_info, latest_star_item_info} = last15VideoBody;
// // 获取播放量、点赞量、评论量和转发量
// // 个人视频
// let plays_item: number[] = latest_item_info.map(last_video_item => last_video_item.play / 10000); // 单位转为万
// let likes_item: number[] = latest_item_info.map(last_video_item => last_video_item.like / 10000); // 单位转为万
// let comments_item: number[] = latest_item_info.map(last_video_item => last_video_item.comment / 10000); // 单位转为万
// let shares_item: number[] = latest_item_info.map(last_video_item => last_video_item.share / 10000); // 单位转为万
// let isHotCount_item: number[] = latest_item_info.filter(last_video_item => last_video_item.is_hot).length;
// // 星图视频
// let plays_star_item = latest_star_item_info.map(last_video_star_item => last_video_star_item.play / 10000); // 单位转为万
// let likes_star_item = latest_star_item_info.map(last_video_star_item => last_video_star_item.like / 10000); // 单位转为万
// let comments_star_item = latest_star_item_info.map(last_video_star_item => last_video_star_item.comment / 10000); // 单位转为万
// let shares_star_item = latest_star_item_info.map(last_video_star_item => last_video_star_item.share / 10000); // 单位转为万
// let isHotCount_star_item = latest_star_item_info.filter(last_video_star_item => last_video_star_item.is_hot).length;
// // 计算最低、最高、均值
// const calculateMin = (arr: number[]): number => Math.min(...arr);
// const calculateMax = (arr: number[]): number => Math.max(...arr);
// const calculateAverage = (arr: number[]): number => arr.reduce((a, b) => a + b, 0) / arr.length;
// // 输出结果（单位均为万）
// console.log("最低播放量:", calculateMin(plays_item), "万");
// console.log("最高播放量:", calculateMax(plays_item), "万");
// console.log("播放量均值:", calculateAverage(plays_item).toFixed(2), "万");
//
// console.log("最低点赞量:", calculateMin(likes_item), "万");
// console.log("最高点赞量:", calculateMax(likes_item), "万");
// console.log("点赞量均值:", calculateAverage(likes_item).toFixed(2), "万");
//
// console.log("最低评论量:", calculateMin(comments_item), "万");
// console.log("最高评论量:", calculateMax(comments_item), "万");
// console.log("评论量均值:", calculateAverage(comments_item).toFixed(2), "万");
//
// console.log("最低转发量:", calculateMin(shares_item), "万");
// console.log("最高转发量:", calculateMax(shares_item), "万");
// console.log("转发量均值:", calculateAverage(shares_item).toFixed(2), "万");
// // 计算爆量视频百分比（热门视频占比）
// const hotVideoPercentage = (isHotCount_item / latest_item_info.length) * 100;
// console.log("爆量视频百分比:", hotVideoPercentage.toFixed(2) + "%");
//
// console.log("最低播放量:", calculateMin(plays_star_item), "万");
// console.log("最高播放量:", calculateMax(plays_star_item), "万");
// console.log("播放量均值:", calculateAverage(plays_star_item).toFixed(2), "万");
//
// console.log("最低点赞量:", calculateMin(likes_star_item), "万");
// console.log("最高点赞量:", calculateMax(likes_star_item), "万");
// console.log("点赞量均值:", calculateAverage(likes_star_item).toFixed(2), "万");
//
// console.log("最低评论量:", calculateMin(comments_star_item), "万");
// console.log("最高评论量:", calculateMax(comments_star_item), "万");
// console.log("评论量均值:", calculateAverage(comments_star_item).toFixed(2), "万");
//
// console.log("最低转发量:", calculateMin(shares_star_item), "万");
// console.log("最高转发量:", calculateMax(shares_star_item), "万");
// console.log("转发量均值:", calculateAverage(shares_star_item).toFixed(2), "万");
// // 计算爆量视频百分比（热门视频占比）
// const hotStarVideoPercentage = (isHotCount_star_item / latest_item_info.length) * 100;
// console.log("爆量视频百分比:", hotStarVideoPercentage.toFixed(2) + "%");
//

console.log("last15VideoBody", last15VideoBody);
const { latest_item_info, latest_star_item_info } = last15VideoBody;

// 计算最低、最高、均值的方法
const calculateMin = (arr: number[]): number => Math.min(...arr);
const calculateMax = (arr: number[]): number => Math.max(...arr);
const calculateAverage = (arr: number[]): number => arr.reduce((a, b) => a + b, 0) / arr.length;

// 打印统计信息的方法
const printStats = (label: string, data: number[]) => {
    console.log(`最低${label}:`, calculateMin(data), "万");
    console.log(`最高${label}:`, calculateMax(data), "万");
    console.log(`${label}均值:`, calculateAverage(data).toFixed(2), "万");
};

// 计算热门视频百分比的方法
const calculateHotVideoPercentage = (isHotCount: number, totalCount: number): string => {
    const percentage = (isHotCount / totalCount) * 100;
    return percentage.toFixed(2) + "%";
};

// 处理个人视频和星图视频
const processVideoStats = (videoInfo: any[], label: string) => {
    const plays = videoInfo.map(video => video.play / 10000); // 播放量单位转为万
    const likes = videoInfo.map(video => video.like / 10000); // 点赞量单位转为万
    const comments = videoInfo.map(video => video.comment / 10000); // 评论量单位转为万
    const shares = videoInfo.map(video => video.share / 10000); // 转发量单位转为万
    const isHotCount = videoInfo.filter(video => video.is_hot).length; // 热门视频计数

    // 打印统计信息
    printStats("播放量", plays);
    printStats("点赞量", likes);
    printStats("评论量", comments);
    printStats("转发量", shares);

    // 打印爆量视频百分比
    console.log(`爆量视频百分比:`, calculateHotVideoPercentage(isHotCount, videoInfo.length));
};

// 个人视频
processVideoStats(latest_item_info, "个人视频");

// 星图视频
processVideoStats(latest_star_item_info, "星图视频");

// 获取所有具有 el-tabs__item 类的元素
// const tabs: NodeListOf<HTMLDivElement> = document.querySelectorAll('.el-tabs__item');
//
// // 为每个 tab 添加点击事件
// tabs.forEach((tab: HTMLDivElement ) => {
//     tab.addEventListener('click', () => {
//         // 输出点击的 tab 的 id
//         const tabId = tab.id;
//
//         switch (tabId) {
//             case 'tab-"overview"':
//                 console.log("================达人概览================")
//                 break;
//             case 'tab-"content_performance"':
//                 console.log("================内容表现================")
//
//                 const last15VideoPromise: any = bus.subscribe(
//                     /\/api\/author\/get_author_show_items_v2/,
//                     (rs: any) => {
//                         let body = bus.parseBody(rs);
//                         return body.hasOwnProperty('base_resp') ? body : false;
//                     }
//                 );
//                 const [
//                     last15VideoBody,
//                 ] = await Promise.all([
//                     last15VideoPromise,
//                 ]);
//                 data = {
//                     last15VideoBody
//                 };
//                 console.log("busData ok", { last15VideoBody });
//                 break;
//             case 'tab-"connected_users"':
//                 console.log("================连接用户================")
//                 break;
//             case 'tab-"business_capabilities"':
//                 console.log("================商业能力================")
//                 break;
//             default:
//                 console.log("================tabDefault================")
//         }
//         console.log(`Tab ${tab.id} clicked!`);
//
//     });
// });

// 获取所有具有 el-tabs__item 类的元素
const tabs: NodeListOf<HTMLDivElement> = document.querySelectorAll('.el-tabs__item');

// 为每个 tab 添加点击事件
tabs.forEach((tab: HTMLDivElement ) => {
    tab.addEventListener('click', () => {
        // 输出点击的 tab 的 id
        const tabId = tab.id;

        switch (tabId) {
            case 'tab-"overview"':
                console.log("================tab_overview================")
                break;
            case 'tab-"content_performance"':
                console.log("================tab_content_performance================")
                break;
            case 'tab-"connected_users"':
                console.log("================tab_connected_users================")
                break;
            case 'tab-"business_capabilities"':
                console.log("================tab_business_capabilities================")
                break;
            default:
                console.log("================tabDefault================")
        }
        console.log(`Tab ${tab.id} clicked!`);

    });
});

// tab点击事件
async busData() {
    const bus = this.context.$bus;
    let data = {};

    // 获取所有具有 el-tabs__item 类的元素
    const tabs: NodeListOf<HTMLDivElement> = document.querySelectorAll('.el-tabs__item');

    // 为每个 tab 添加点击事件并处理相应逻辑
    tabs.forEach((tab: HTMLDivElement, index: number) => {
        tab.addEventListener('click', async () => {
            console.log(`Tab ${tab.id} clicked!`);

            switch (index) {
                case 0:
                    console.log("Fetching data for tab 0...");
                    // 这里可以处理 tab 0 的数据获取逻辑
                    break;
                case 1:
                    console.log("Fetching data for tab 1...");
                    const authorVideoDistributionPromise: any = bus.subscribe(
                        /\/api\/data_sp\/author_video_distribution/,
                        (rs: any) => {
                            let body = bus.parseBody(rs);
                            return body.hasOwnProperty('video_content_distribution') ? body : false;
                        }
                    );
                    const authorVideoDistribution = await authorVideoDistributionPromise;
                    data = { video_content_distribution: authorVideoDistribution.video_content_distribution };
                    break;
                case 2:
                    console.log("Fetching data for tab 2...");
                    const authorContent1mPromise: any = bus.subscribe(
                        /\/api\/data_sp\/get_author_spread_info/,
                        (rs: any) => {
                            let body = bus.parseBody(rs);
                            return body.hasOwnProperty('expect_cpe') ? body : false;
                        }
                    );
                    const last15VideoPromise: any = bus.subscribe(
                        /\/api\/author\/get_author_show_items_v2/,
                        (rs: any) => {
                            let body = bus.parseBody(rs);
                            return body.hasOwnProperty('base_resp') ? body : false;
                        }
                    );
                    const [authorContent1m, last15VideoBody] = await Promise.all([authorContent1mPromise, last15VideoPromise]);
                    data = { authorContent1m, last15VideoBody };
                    break;
                default:
                    console.log("No data fetching logic defined for this tab.");
                    break;
            }

            console.log('Data for clicked tab', data);
        });
    });

    // 如果你想预先点击某个 tab，可以在这里模拟点击事件
    if (tabs[2]) {
        tabs[2].click();  // 自动点击第三个 tab
    }
};
