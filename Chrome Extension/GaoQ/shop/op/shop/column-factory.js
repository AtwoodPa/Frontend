import MemberRender from '@/pc/component/render/MemberRender'
import BrandRender from '@/pc/component/render/BrandRender'
import ShopRender from '@/pc/component/render/ShopRender'
import { resolveComponent } from 'vue';
export default function (me, { forBrand } = {}) {
    const Image = resolveComponent('Image')
    const Icon = resolveComponent('Icon')

    let columns = [];
    columns.push(
        {
            type: 'index',
            width: me.$width.index,
        },
        {
            title: '店铺',
            className: 'clear-padding',
            minWidth: 250,
            render(h, { row }) {
                return h(ShopRender, { target: row })
            }
        },
        {
            title: '平台/来源',
            align: 'center',
            className: 'clear-padding',
            width: 150,
            render(h, { row }) {
                let todoList = [me.$filter.platformLabel(row.platform)]
                if (row.platformOrigin) {
                    todoList.push('-', me.$filter.platformOriginLabel(row.platformOrigin))
                }
                return todoList;
            }
        },
        {
            title: '类目',
            width: 150,
            render(h, { row }) {
                return row.categories ? row.categories.join(',') : ''
            }
        },
        {
            title: "店铺企微",
            width: 84,
            className: 'clear-padding',
            align: "center",
            render(h, { row }) {
                let { qrCodes } = row;
                if (qrCodes && qrCodes.length) {
                    let i = 0;
                    return qrCodes.map(item => h(Image, {
                        width: "84px",
                        preview: true,
                        initialIndex: i++,
                        previewList: qrCodes,
                        src: item,
                    }))
                }
                return h(Icon, { type: "md-image", size: 32 });
            },
        },
    );
    // {
    //     title: '状态',
    //     width: 80,
    //     align: 'center',
    //     render(h, { row }) {
    //         return me.$filter.shopStatusLabel(row.status)
    //     }
    // },
    // {
    //     title: '操作',
    //     width: me.$width.action,
    //     render(h, {row}) {

    //     }
    // },
    if (forBrand) {

    } else {
        columns.push({
            title: '品牌',
            minWidth: 200,
            render(h, { row }) {
                let { brandId } = row;
                if (brandId) {
                    return h(BrandRender, { target: me.brandMap[brandId] })
                }
                return '...'
            }
        },)
    }
    columns.push(
        {
            type: 'expand',
            width: 80,
            title: '介绍',
            render(h, { row }) {
                let { hply, hpys, jybz, tlbz, hpb, month_sale, corp_daren_count, corp_captain_count, views, avt_commission_rate, avg_service_rate } = row;
                return h('div', { class: 'info-list' }, [
                    h('span', '货品来源:' + (hply || '...')),
                    h('span', '佣金优势:' + (hpys || '...')),
                    h('span', '寄样标准:' + (jybz || '...')),
                    h('span', '投流标准:' + (tlbz || '...')),
                    h('span', '30日商品销量:' + (month_sale || '...')),
                    h('span', '30日合作达人:' + (corp_daren_count || '...')),
                    h('span', '30日平均佣金率:' + (avt_commission_rate || '...')),
                    h('span', '30日商品浏览:' + (views || '...')),
                    h('span', '30日合作团长:' + (corp_captain_count || '...')),
                    h('span', '30日平均服务费率:' + (avg_service_rate || '...')),
                    h('span', ['货盘表:', hpb ? h('a', { target: '_blank', href: me.$filter.url(hpb) }, hpb) : ''])
                ])
            }
        },
        {
            title: '破价',
            align: 'center',
            width: 80,
            render(h, { row }) {
                return row.pj ? '允许' : '否'
            }
        },
        {
            title: '不走团',
            align: 'center',
            width: 80,
            render(h, { row }) {
                return row.unGroup ? '是' : '否'
            }
        },
        // {
        //     title: '电商平台',
        //     width: 100,
        //     render(h, { row }) {
        //         return row.dspts.join(',')
        //     }
        // },
        {
            title: '责任招商',
            width: me.$width.member,
            render(h, { row }) {
                return h(MemberRender, {
                    id: row.zsOpId
                })
            }
        },
        {
            title: '入库人员',
            width: me.$width.member,
            render(h, { row }) {
                return h(MemberRender, {
                    id: row.opId
                })
            }
        },
        {
            title: '添加时间',
            align: 'center',
            width: me.$width.time,
            render(h, { row }) {
                return me.$filter.date(row.createdAt)
            }
        },
        {
            title: '提交时间',
            align: 'center',
            width: me.$width.time,
            render(h, { row }) {
                return me.$filter.date(row.submitTime)
            }
        }
    )
    return columns
}
