import CustomComponent from '../custom-component'
import safearea from "../../behavior/safearea";
import plugin from "../../behavior/plugin";

const CARD_OFFSET = 120; // 卡片堆叠间隔
const MAX_SCROLL = 400;  // 最大滚动阈值

CustomComponent({
    options: {
        styleIsolation: 'shared',
    },
    behaviors: [safearea, plugin],
    properties: {
        title: String,
        back: {
            type: Boolean,
            default: false,
        },
    },
    data: {
        // 动态添加样式
        dynamicStyle: "",
        showBackButton: false,// 按钮显示
        backBtnAnimClass: "",// 按钮动效
        showAnimClass: "",// 卡片&info 动效
        resetAnimating: false,
        //
        activeIndex: -1,
        scrollTop: 0,
        infoVisible: false,
        infoOpacity: 0,
        infoTranslate: 1000,
        scaleClass: '',
        //
        peopleNodes: [
            {
                name: 'h1',
                attrs: {
                    style: 'color: #333; font-size: 36rpx; border-left: 6rpx solid #07c160; padding-left: 20rpx; margin-bottom: 40rpx;'
                },
                children: [{type: 'text', text: '全民经纪计划'}]
            },
            {
                name: 'p',
                attrs: {style: 'color: #666; font-size: 28rpx; line-height: 1.8; margin-bottom: 40rpx;'},
                children: [{
                    type: 'text',
                    text: '全民经纪是一种创新的商业模式，旨在让每个人都能成为服务推广者和受益者。通过分享和推荐，您不仅可以获得丰厚回报，还能帮助更多人发现优质服务。'
                }]
            },
            {
                name: 'img',
                attrs: {
                    src: 'https://cdn.gaoq.com/wx-app/gaoqu-kol/trends_card_3@4x.png?md5=OzBONckyZiGbBFOY7Vio2w==',
                    style: 'width: 100%; height: 200rpx; border-radius: 16rpx; margin-bottom: 40rpx;',
                    mode: 'widthFix'
                }
            },
        ],
        serviceNodes: [
            {
                name: 'h1',
                attrs: {
                    style: 'color: #333; font-size: 36rpx; border-left: 6rpx solid #07c160; padding-left: 20rpx; margin-bottom: 40rpx;'
                },
                children: [{type: 'text', text: '次抛服务介绍'}]
            },
            // 段落
            {
                name: 'p',
                attrs: {style: 'color: #666; font-size: 28rpx; line-height: 1.8; margin-bottom: 40rpx;'},
                children: [{
                    type: 'text',
                    text: '次抛服务是一种高效、灵活的服务模式，旨在为用户提供短期、高价值的服务体验。无论您是需要快速解决某个问题，还是希望尝试某项新服务，次抛服务都能满足您的需求。'
                }]
            },
            // 图片
            {
                name: 'img',
                attrs: {
                    src: 'https://cdn.gaoq.com/wx-app/gaoqu-kol/trends_card_2@4x.png?md5=Phm1QAP09DQ5kLzzFjgfsQ==',
                    style: 'width: 100%; height: 200rpx; border-radius: 16rpx; margin-bottom: 40rpx;',
                    mode: 'widthFix'
                }
            },
        ],
        cards: [
            {
                // fast
                imageKey: 'trends_card_1',
                transform: 'translateY(0) scale(0.95)',
                dynamicStyle: '',
                title: '账号诊断',
                info: 'trends_card_info_1',
                index: 2
            },
            {
                imageKey: 'trends_card_2',
                transform: 'translateY(120rpx) scale(1)',
                dynamicStyle: '',
                title: '次抛服务',
                // info: 'trends_card_info_2',
                info: '',
                index: 3
            },
            // last
            {
                imageKey: 'trends_card_3',
                transform: 'translateY(240rpx) scale(1)',
                dynamicStyle: '',
                title: '全民经济',
                // info: 'trends_card_info_2',
                index: 4
            }
        ]
    },
    lifetimes: {
        attached() {

        },
    },
    methods: {
        handleCardTap(e) {
            const index = e.currentTarget.dataset.index;
            const {activeIndex} = this.data;

            if (activeIndex === index) {
                this.handleReset();
                return;
            }

            this.setData({
                activeIndex: index,
                activeCard: this.data.cards[index],
                showBackButton: true,
                showAnimClass: 'slide-in-up' // 添加进入动画类名
            });

            this.dynamicAddStyle();
            this.animateInfoPanel();
        },
        dynamicAddStyle() {
            const activeIndex = this.data.activeIndex;
            this.data.cards.forEach((_, index) => {
                const cardItemDynamicStyle = [`cards[${index}].dynamicStyle`];
                const style =
                    index === activeIndex ?
                        'active slide-in-up' : `un-active slide-out-down`; // 添加动画类名

                this.setData({
                    [cardItemDynamicStyle]: style,
                    [`cards[${index}].transform`]: activeIndex
                });
            });
        },
        animateInfoPanel() {
            this.setData({
                infoVisible: true,
                infoOpacity: 0.1,
                infoTranslate: 300,
                showAnimClass: 'fade-in-down' // 添加进入动画类名
            }, () => {
                setTimeout(() => {
                    this.setData({
                        infoOpacity: 1,
                        infoTranslate: 0,
                        showAnimClass: ''
                    });
                }, 500);
            });
        },
        handleReset() {
            const originalTransforms = [
                'translateY(0) scale(0.95)',
                'translateY(120rpx) scale(1)',
                'translateY(240rpx) scale(1)'
            ];

            this.setData({
                activeIndex: -1,
                cards: this.data.cards.map((card, index) => ({
                    ...card,
                    transform: originalTransforms[index],
                    dynamicStyle: 'un-active slide-out-down' // 添加退出动画类名
                })),
                showBackButton: false,
                showAnimClass: 'fade-out-down' // 添加退出动画类名
            });
        },
    }
});