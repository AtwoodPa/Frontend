import { gaoqu, trigger, flexContainer, buttonContainer, globalDrawerCollapse, success, error, info } from "../handler.jss";
export interface Classes {
    gaoqu: string;
    trigger: string;
    img: string;
    error: string;
    success: string;
    info: string;
    buttonContainer: string;
    flexContainer: string;
    marginTop: string;
}
export function makeCss($jss: any) {
    const { classes } = $jss.createStyleSheet({
        '@global': {
            ...globalDrawerCollapse,
            '.ivu-input-number': {
                marginRight: '3px'
            },
        },
        buttonContainer,
        flexContainer,
        gaoqu,
        trigger,
        success,
        info: { ...info, marginLeft: '10px' },
        error,
        marginTop: {
            marginTop: '20%'
        },
        img: {
            width: '120px'
        }
    }).attach()
    return { classes };
}