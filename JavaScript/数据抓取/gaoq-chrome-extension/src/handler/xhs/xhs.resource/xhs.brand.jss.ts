import { gaoqu, trigger, globalDrawerCollapse, flexContainer, buttonContainer } from '../../common/jss'
export interface Classes {
    trigger: string;
    gaoqu: string;
    flexContainer: string;
    buttonContainer: string;
}
export function makeCss($jss: any) {
    const { classes } = $jss.createStyleSheet({
        '@global': globalDrawerCollapse,
        flexContainer,
        buttonContainer,
        gaoqu,
        trigger
    }).attach()
    return { classes };
}