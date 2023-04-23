import Browser = Laya.Browser
import {BaseView} from "../core/BaseView"
import {BaseGameData} from "../core/BaseGameData"
import {Player} from "../Player"
import {StringUtil} from "../utils/StringUtil"
import {LibStr} from "../LibStr"

export class NoticeView extends BaseView {

    static NAME = "NoticeView"
    private richText: fgui.GRichTextField
    private tempX: number
    /** 是否在滚动 */
    private isRun = false

    private gameData: BaseGameData

    constructor() {
        super()
        this.addView(NoticeView, this)
        this.gameData = Player.inst.gameData as BaseGameData
    }

    protected onInit() {
        super.onInit()
        this.richText = this.getChild("n1").asCom.getChild("n1").asRichTextField
        this.tempX = this.richText.x
    }

    protected addedHandler() {
        super.addedHandler()
        if (this.gameData.noticeData.length > 0) {
            this.startRun()
        } else {
            this.visible = false
        }
    }

    showText(values: any[]) {
        this.gameData.noticeData = this.gameData.noticeData.concat(values)
        this.startRun()
    }

    /** 开始滚动 */
    private startRun() {
        if (!this.isRun && this.gameData.noticeData && this.gameData.noticeData.length > 0) {
            this.isRun = true
            this.updateNoticeContent()
            Laya.timer.frameLoop(1, this, this.loopHandler)
            this.visible = true
        }
    }

    private loopHandler() {
        this.richText.x -= 1
        if (this.richText.x < -this.richText.div.contextWidth + 5) {
            if (this.gameData.noticeData.length > 0) {
                this.updateNoticeContent()
            } else {
                this.stopRun()
            }
        }
    }

    /** 更新内容 并重置位置 */
    private updateNoticeContent() {
        this.resetMsgPosition()
        let msg
        if (this.gameData.noticeData.length > 1) {
            msg = this.gameData.noticeData.shift()
        } else {
            msg = this.gameData.noticeData[0]
        }
        this.richText.text = StringUtil.format(this.getString(LibStr.WIN_NOTICE), msg.mobile, msg.win, Browser.window.gameIdConfig[Player.inst.gameModel])
    }

    private stopRun() {
        this.resetMsgPosition()
        Laya.timer.clearAll(this)
        this.visible = false
        this.isRun = false
    }

    /** 重置位置 */
    private resetMsgPosition() {
        this.richText.x = this.tempX + this.richText.width + 5
    }

    dispose() {
        Laya.timer.clearAll(this)
        super.dispose()
    }

}