import {App} from "../App";

export class SystemKit {

    /**
     * 启动后自动获取的刘海屏高度
     */
    static cacheNotch = 0

    /**
     * 获取设备刘海屏高度
     */
    static get notchHeight() {
        return (window.innerHeight - document.documentElement.clientHeight) /* / Laya.Browser.pixelRatio */
    }

    /**
     * 在启用刘海屏模式下会调用指定方法并得到刘海屏信息
     * @param value
     */
    static set onNotch(value: (height: number) => any) {
        if (App.inst.options.isNotchEnable) value(SystemKit.cacheNotch)
    }

}