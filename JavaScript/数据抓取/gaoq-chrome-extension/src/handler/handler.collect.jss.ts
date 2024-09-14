import { commonCss, gaoqu } from './common/jss'
export interface Classes {
    title: string;
    label: string;
    mainLabel: string;
    submit: string;
    line1: string;
    site: string;
    photo: string;
    gaoqu: string;
    insertOpInfoDom: string;
    insertLabel: string;
    insertItem: string;
}
export interface Render {
    title: Function,
    label: Function,
    mainLabel: Function,
    site: Function,
    photo: Function
}
export function makeCss($jss: any) {
    const { classes } = $jss.createStyleSheet({
        '@global': {
            "#crx-app .ivu-card-body": {
                padding: '0 5px'
            },
            ".author-page-tab": {
                zIndex: "10!important"
            },
            ".ivu-image": {
                gridColumn: "2 / 5",
                margin: "2.5px 5px"
            },
            ...commonCss
        },
        insertItem: {
            color: "#333",
            margin: "5px 0px 0px 5px"
        },
        insertLabel: {
            margin: "5px 0px 0px 5px"
        },
        insertOpInfoDom: {
            margin: "16px auto",
            width: "260px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gridAutoFlow: "row",
            alignItems: "center",
            color: "rgb(153, 153, 153)",
            backgroundColor: "rgb(255, 238, 243)",
            fontWeight: "400",
            fontSize: "12px",
            lineHeight: "18px",
            // padding: "8px",
            borderRadius: "8px",
            gap: "5px",
        },
        line1: {
            textOverflow: "ellipsis",
            overflow: "hidden"
        },
        site: {
            wordBreak: "break-all"
        },
        photo: {
            width: "30px",
            height: "30px",
            borderRadius: "50%"
        },
        submit: {
            marginTop: "10px",
            width: "100%",
            '&:before': {
                content: '"icon"'
            }
        },
        mainLabel: {
            color: "rgb(0, 0, 255)",
            fontWeight: "bold"
        },
        label: {
            color: "rgb(45, 140, 240)"
        },
        title: {
            color: "rgb(161 23 190)",
            textAlign: "center",
            borderRadius: "5px",
            backgroundColor: "#f6e5f6",
            fontWeight: 700
        },
        gaoqu
    }).attach()
    let render: Render = {
        title(name: string) {
            return (
                `<div class="${classes.title}">${name}</div>`
            );
        },
        label(name: string) {
            return (
                `<label class="${classes.label}">${name}</label>`
            );
        },
        mainLabel(name: string) {
            return (
                `<label class="${classes.mainLabel}">${name}</label>`
            );
        },
        site(name: string) {
            return `<div class="${classes.site}">${name}</div>`;
        },
        photo(photo: string) {
            return `<img src="${photo}" class="${classes.photo}"/>`;
        }
    }
    return { classes, render };
}