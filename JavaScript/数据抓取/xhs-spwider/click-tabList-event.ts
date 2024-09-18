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
