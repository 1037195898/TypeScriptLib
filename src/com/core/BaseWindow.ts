import Point = Laya.Point;
import Ease = Laya.Ease;
import Tween = Laya.Tween;
import GRoot = fgui.GRoot;
import Handler = Laya.Handler;
import {SceneManager} from "../manager/SceneManager"
import {AppRecordManager} from "../manager/AppRecordManager"
import {ActionLib} from "../actions/ActionLib"
import {ActionEvent, StringBlock, ViewProxy} from "../Factory"
import {IRecord} from "../interfaces/ICommon";

export class BaseWindow extends mixinExt(StringBlock, ViewProxy, ActionEvent, fgui.Window) implements IRecord {

    /** 动画显示或关闭 */
    protected isAction = true
    /** 是否加入后退记录 */
    joinRecord = true
    /** 动画起始点 */
    startPoint: Point
    /**
     * 是否在关闭窗口的时候  发送 ActionLib.GAME_RUN_SCENE_EVENT
     * @default false
     */
    isRunSceneEvent = false

    protected override onInit() {
        let scale = SceneManager.inst.getEqualRatioScale()
        this.contentPane.setSize(this.width * scale, this.height * scale)
        this.setSize(this.contentPane.width, this.contentPane.height)
        if (this.isAction) {
            this.setPivot(0.5, 0.5)
        }
    }

    protected updateSizePoint() {
        this.center()
    }

    protected override doHideAnimation() {
        this.displayObject.stage.off(Laya.Event.RESIZE, this, this.updateSizePoint)
        if (this.isAction) {
            let tempX = this.x
            let tempY = this.y
            if (this.startPoint) {
                tempX = this.startPoint.x - this.contentPane.width / 2
                tempY = this.startPoint.y - this.contentPane.height / 2
            }
            Tween.to(this, {
                scaleX: 0.3,
                scaleY: 0.3,
                x: tempX,
                y: tempY
            }, 400, Ease.backIn, Handler.create(this, this.hideImmediately))
        } else {
            this.hideImmediately()
        }
    }

    protected override doShowAnimation() {
        this.displayObject.stage.off(Laya.Event.RESIZE, this, this.updateSizePoint)
        this.displayObject.stage.on(Laya.Event.RESIZE, this, this.updateSizePoint)
        this.touchable = true
        if (this.joinRecord) AppRecordManager.addHistory(null, this)
        this.updateSizePoint()
        if (this.isAction) {
            this.setScale(.3, .3)
            let tempX = this.x
            let tempY = this.y
            if (this.startPoint) {
                this.setXY(this.startPoint.x - this.contentPane.width / 2, this.startPoint.y - this.contentPane.height / 2)
            }
            Tween.to(this, {scaleX: 1, scaleY: 1, x: tempX, y: tempY}, 400, Ease.backOut,
                Handler.create(this, this.onShown))
        } else {
            this.onShown()
        }
    }

    protected override closeEventHandler() {
        if (this.parent) {
            if (this.joinRecord) {
                AppRecordManager.backHistory()
            } else {
                this.hideRecord()
            }
        }
    }

    protected override onHide() {
        if (this.isRunSceneEvent) this.sendAction(ActionLib.GAME_RUN_SCENE_EVENT)
        AppRecordManager.invalidHistory(this)
    }

    hideRecord() {
        this.touchable = false
        GRoot.inst.closeModalWait()
        this.hide()
    }

    showRecord() {

    }

    override dispose() {
        this.parent = null
        AppRecordManager.invalidHistory(this)
        Tween.clearAll(this)
        this.displayObject?.stage.off(Laya.Event.RESIZE, this, this.updateSizePoint)
        if (!this.displayObject?.destroyed) super.dispose()
    }

}