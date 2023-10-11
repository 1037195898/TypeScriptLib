export class SystemKit {

    /**
     * 获取设备刘海屏高度
     */
    static get notchHeight() {
        return (window.innerHeight - document.documentElement.clientHeight) /* / Laya.Browser.pixelRatio */
    }

}