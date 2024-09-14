import { gaoqu, trigger, flexContainer, buttonContainer, globalDrawerCollapse, success, error, info, hoverPrimary } from "./jss";
export interface Classes {
    gaoqu: string;
    trigger: string;
    img: string;
    error: string;
    success: string;
    marginTop: string;
    info: string;
    photoFlex: string;
    buttonContainer: string;
    flexContainer: string;
    clearPadding: string;
    hoverPrimary: string;
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
        clearPadding: { padding: 0 },
        flexContainer,
        hoverPrimary,
        gaoqu,
        trigger,
        success,
        photoFlex: {
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            '& .photo': {
                width: '30px',
            }
        },
        marginTop: {
            marginTop: '20%'
        },
        info: { ...info, marginLeft: '10px' },
        error,
        img: {
            width: '120px'
        }
    }).attach()
    return { classes };
}