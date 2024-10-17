import {resolveComponent} from 'vue'
import ShopRender from "pc/component/render/ShopRender.vue";

export default function (me, active) {
    const Button = resolveComponent('Button');
    const Icon = resolveComponent("Icon");

    const columns = [
        {
            type: "index",
            width: me.$width.index,
        },
        {
            title: '店铺',
            minWidth: 100,
            render(h, { row }) {
                return h(ShopRender, { target: row })
            }
        },
        {
            title: '店铺ID',
            align: 'center',
            className: 'clear-padding',
            minWidth: 150,
            render(h, { row }) {
                const mapItem = me.map[row.id];
                console.log("-----me.map[row.id]",me.map[row.id])
                console.log("-----row",row)
                // console.log("-----mapItem",mapItem.shop_id)
                if (mapItem){
                    if (mapItem.shop_id){
                        return mapItem.shop_id
                    }
                }else {
                    return '-';
                }
            }
        },
        {
            title: '店铺加密ID',
            align: 'center',
            className: 'clear-padding',
            minWidth: 150,
            render(h, { row }) {
                return row.sec_shop_id ? row.sec_shop_id : '-';
            }
        },
        {
            title: "ID",
            align: "center",
            width: 80,
            render(h, { row }) {
                let id = row.id;
                let todo = me.map[id];
                let clzss = "";
                if (todo || todo === 0) {
                    clzss = "success";
                } else {
                    clzss = "error";
                }
                return h(
                    "span",
                    {
                        id: `${me.active}${id}`,
                        class: clzss + " display",
                    },
                    id
                );
            },
        },
        {
            title: '平台/来源',
            align: 'center',
            className: 'clear-padding',
            width: 150,
            render(h, { row }) {
                // if (row.platformOrigin) {
                //     todoList.push('-', me.$filter.platformOriginLabel(row.platformOrigin))
                // }
                return [me.$filter.platformLabel(row.platform)];
            }
        },
        // {
        //     title: '类目',
        //     align: 'center',
        //     className: 'clear-padding',
        //     width: 150,
        //     render(h, { row }) {
        //         return row.categories ? row.categories.join(',') : ''
        //     }
        // },
    ];
    if (active === "by"){
        columns.push({
            title: "链接",
            minWidth: 400,
            render(h, { row }) {
                let site = "https://buyin.jinritemai.com/dashboard/goodsCooperation/product-saving";
                row.site = site;
                return h(
                    "a",
                    {
                        class: "hover-primary",
                        onClick: () => {
                            me.clickSite(row);
                        },
                    },
                    site
                );
            },
        })

    }

    // if (active === "by" || active === "fixBy") {
    //     columns.push({
    //         title: "更新时间",
    //         align: "center",
    //         width: me.$width.time,
    //         key: "byUpdateTime",
    //     });
    // }
    return columns
}
