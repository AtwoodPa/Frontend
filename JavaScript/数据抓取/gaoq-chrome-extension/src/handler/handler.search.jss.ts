import { dispLayList } from "./enum"
import { commonCss, gaoqu } from "./common/jss"
export interface Classes {
    gaoqu: string;
}
export interface Render {
    image: Function,
    checkbox: Function,
    info: Function,
}
export function makeCss($jss: any, otherCss: any, $h: any) {
    const { classes } = $jss.createStyleSheet({
        '@global': {
            otherCss,
            ".ivu-card-body": {
                padding: '0'
            },
            ".ivu-tabs": {
                flex: "1",
                display: "flex",
                flexDirection: "column"
            },
            ".ivu-tabs-bar": {
                flexShrink: "0",
            },
            ".ivu-table": {
                display: "flex",
                flexDirection: "column"
            },
            ".ivu-table-header": {
                flexShrink: "0",
            },
            ".ivu-tabs-content": {
                overflow: "hidden",
                flex: "1"
            },
            ".ivu-table-body": {
                overflowY: "scroll",
                overflowX: "hidden",
            },
            ".ivu-tabs-tabpane,.ivu-table-wrapper": {
                height: "100%"
            },
            ".ivu-drawer-body": {
                display: "flex",
                flexDirection: "column"
            },
            ".author-header": {
                position: "relative",
                width: "560px!important"
            },
            ".author-info-list": {
                width: "560px!important",
            },
            "#crx-app": {
                width: "520px"
            },
            ...commonCss
        },
        opts: {
            gap: "5px",
            display: "flex",
            marginRight: "5px",
            alignItems: "center",
        },
        opLabel: {
            width: "120px",
            display: "flex",
            alignItems: "center",
        },
        opItem: {
            "margin": "0px 5px",
            width: "230px",
            display: "flex",
            "justify-content": "space-between"
        },
        search: {
            display: "flex",
            marginRight: "70px",
            minHeight: "34px",
            position: "relative",
        },
        opWrapper: {
            flexShrink: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "var(--padding)",
        },
        cardOperation: {
            marginTop: "5px",
            display: "flex",
            justifyContent: "space-around",
        },
        insertHeaderDom: {
            position: "absolute",
            width: "300px",
            height: "100%",
            top: "0px",
            right: "0px",
            display: "flex",
            justifyContent: "space-between",
            marginRight: "10px",
            alignItems: "center",
            padding: "0px 10px",
        },
        insertDom: {
            position: "absolute",
            width: "300px",
            top: "0px",
            right: "0px",
            display: "flex",
            justifyContent: "space-between",
            marginRight: "10px",
            alignItems: "center",
            borderBottom: "1px solid rgb(231 225 225)",
            color: "#333",
            fontSize: "12px",
            lineHeight: "21px",
            padding: "0px 10px",
            borderRadius: "10px",
            height: "100%",
            boxSizing: "border-box",
        },
        "import-detail": {
            margin: "10px 5px",
            display: "inline-block",
            fontSize: "medium",
            fontWeight: "700",
            // borderBottom: "2px ridge",
        },
        "import-project-title": {
            "margin": "0px 5px",
        },
        "import-project-resource-detail": {
            backgroundColor: "#b2f6b2",
            display: "inline-block",
            margin: "5px",
            height: "24px",
            lineHeight: "24px",
            borderRadius: "5px",
            fontSize: "12px",
            padding: "0px 5px",
        },
        "import-project-extension-detail": {
            backgroundColor: "rgb(181 216 236)",
            display: "inline-block",
            margin: "5px",
            height: "24px",
            lineHeight: "24px",
            borderRadius: "5px",
            fontSize: "12px",
            padding: "0px 5px",
        },
        opInsertItem: {
            "margin": "0px 5px",
            width: "180px",
            display: "flex",
            "justify-content": "space-between"
        },
        "op-done": {
            backgroundColor: "#b2f6b2"
        },
        "op-doing": {
            backgroundColor: "rgb(181 216 236)"
        },
        gaoqu
    }).attach()
    let render = {
        image(component: any, src: string) {
            return $h(component, {
                src: src,
                fit: "contain",
                preview: true,
                previewList: [src],
                initialIndex: 0,
                width: "80px",
                height: "80px"
            }, {
                error() {
                    return "无"
                }
            });
        },
        info(item: any) {
            const todoList: any = [];
            dispLayList.forEach((display: any) => {
                const { label, key } = display;
                if (item[key]) {
                    todoList.push($h('div', { class: classes.opInsertItem },
                        [$h('div', null, label),
                        $h('div', null, item[key])]))
                }
            })
            return todoList;
        },
        checkbox(component: any, item: any, onChange: Function) {
            return $h(component, {
                modelValue: item.checked,
                onChange: (e: any) => {
                    console.log("onChange", e);
                    item.checked = !item.checked
                    onChange(item.checked);
                }
            });
        },

    }
    return { classes, render };
}