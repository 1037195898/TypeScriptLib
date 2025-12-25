import IAppRunListener = tsCore.IAppRunListener;
import App = tsCore.App;

/**
 * @internal
 */
export class Activation implements IAppRunListener {


    onProxyComponentComplete() {







        for (const data of lazyInitBindView) {
            bindView(data[0], data[1], true)
        }







    }

    constructor() {
        addAppRunListeners(this)
    }

}