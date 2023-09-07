import UIPackage = fgui.UIPackage
import {BaseWindow} from "../core/BaseWindow"

/** 图片窗口 */
export class ImageWindow extends BaseWindow {

    private static _instance: ImageWindow

    static get inst(): ImageWindow {
        if (this._instance == null) this._instance = new ImageWindow
        return this._instance
    }

    protected override onInit() {
        this.contentPane = UIPackage.createObjectFromURL("//init/ImageWindow").asCom
        super.onInit()
    }

    showTip(url: string) {
        this.show()
        this.contentPane.getChild("icon").asLoader.icon = url
    }

}