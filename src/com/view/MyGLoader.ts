import GLoader = fgui.GLoader

export class MyGLoader extends GLoader {

    constructor() {
        super()
    }

    protected onExternalLoadSuccess(texture: Laya.Texture) {
        super.onExternalLoadSuccess(texture)
        if (this.displayObject) this.displayObject.event(Laya.Event.COMPLETE)
    }

    protected loadFromPackage(itemURL: string) {
        super.loadFromPackage(itemURL)
        if (this.displayObject) this.displayObject.event(Laya.Event.COMPLETE)
    }

    protected onExternalLoadFailed() {
        super.onExternalLoadFailed()
        if (this.displayObject) this.displayObject.event(Laya.Event.COMPLETE)
    }

}