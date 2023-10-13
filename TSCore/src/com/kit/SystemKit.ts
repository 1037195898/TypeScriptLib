import {App} from "../App";
import {Log} from "../Log";

export class SystemKit {

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
        if (App.inst.options.isNotchEnable) {
            let cacheNotch = 0
            function notchFun() {
                const notch = SystemKit.notchHeight
                cacheNotch = notch
                Log.debug(`notchHeight1=${notch}`)
            }
            function getNotchEnd() {
                const notch = SystemKit.notchHeight
                cacheNotch = notch
                Log.debug(`notchHeight2=${notch}`)
                value(cacheNotch)
            }
            Laya.timer.callLater(this, notchFun)
            Laya.timer.once(300, this, getNotchEnd)
        }
    }

}