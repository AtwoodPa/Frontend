import CustomComponent from '../custom-component'
import safearea from "../../behavior/safearea";
import plugin from "../../behavior/plugin";

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
    data:{
        dynamicStyle: "",
        showBackButton: false,
        backBtnAnimClass: "",
        activeIndex: -1,
        infoVisible: false,
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
                imageKey: 'trend_card_1',
                transform: 'translateY(385rpx)',
                dynamicStyle: '',
                title: '账号诊断',
                info: 'trends_card_info_1',
                index: 2
            },
            {
                imageKey: 'trend_card_2',
                transform: 'translateY(485rpx)',
                dynamicStyle: '',
                title: '次抛服务',
                // info: 'trends_card_info_2',
                info: '',
                index: 3
            },
            // last
            {
                imageKey: 'trend_card_3',
                transform: 'translateY(585rpx)',
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
            const {activeIndex} = this.data

            this.setData({
                activeIndex: index,
            })
            if (activeIndex === index) {
                this.handleReset()
                return
            }
            this.setData({
                activeIndex: index,
                activeCard: this.data.cards[index],
                showBackButton: true,
                backBtnAnimClass: "fade-in"
            })
            this.dynamicAddStyle()
        },
        dynamicAddStyle() {
            const activeIndex = this.data.activeIndex
            this.data.cards.forEach((_, index) => {
                let activeTopStyle = `transform: translateY(.5vh);`
                let activeDownStyle = `transform: translateY(100vh);`;
                this.setData({
                    [`cards[${index}].dynamicStyle`]: index <= activeIndex ? activeTopStyle: activeDownStyle
                })
            })
            setTimeout(() => {
              this.setData({
                  infoVisible: true
              });
          }, 500);
        },
        handleReset() {
            const originalTransforms = [
                'translateY(385rpx)',
                'translateY(485rpx)',
                'translateY(585rpx)'
            ];

            this.setData({
                activeIndex: -1,
                cards: this.data.cards.map((card, index) => ({
                    ...card,
                    transform: originalTransforms[index],
                    dynamicStyle: ''
                })),
                infoOpacity: 0,
                infoVisible: false,
                showBackButton: false
            });
        },
    }
})
