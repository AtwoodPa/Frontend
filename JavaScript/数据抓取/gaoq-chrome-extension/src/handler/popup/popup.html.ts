import { Options } from './../handler.interface';
import { Context, CertPerm } from "../../handler/handler.interface";
export class PopupHandler extends CertPerm {
    constructor(context: Context, options: Options) {
        super(context, options);
        this.doSomething();
    }
    doSomething(): void {
        let { context } = this;
        let { $h, $resolveComponent } = context;
        context.renderFunctionMap.popup = function () {
            let Button = $resolveComponent('Button')
            return [
                $h(Button, {
                    type: 'success', onClick() {
                        window.location.reload()
                    }
                }, context.publication)]
        }
    }
}