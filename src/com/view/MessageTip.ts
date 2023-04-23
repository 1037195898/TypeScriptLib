import GComponent = fgui.GComponent;
import GTextField = fgui.GTextField;
import Tween = Laya.Tween;
import UIPackage = fgui.UIPackage;
import Pool = Laya.Pool;
import RelationType = fgui.RelationType;
import Handler = Laya.Handler;
import {LanguageUtils} from "../utils/LanguageUtils"
import {StringUtil} from "../utils/StringUtil"
import {AlertPanel} from "./AlertPanel"

/** 消息提示框 */
export class MessageTip extends GComponent {

    private static NAME: string = "MessageTip"
    /** 使用中的 */
    private static usePool: MessageTip[] = []
    /** 缓存的内容 */
    private static cacheContent = []
    /** 展示时间 */
    static displayTime = 3000
    content: GTextField
    tween: Tween
    /** 缓存的字体大小 */
    tempFontSize: number

    constructor() {
        super()
    }

    protected constructFromXML(xml: any) {
        super.constructFromXML(xml)

        this.touchable = false
        this.content = this.getChild("n1").asTextField
        this.tempFontSize = this.content.fontSize

    }

    /**
     * 设置显示文本字体大小
     * @param value 大小
     */
    set fontSize(value: number) {
        this.content.fontSize = value
    }

    get fontSize(): number {
        return this.content.fontSize
    }

    /**
     * 显示文本提示框
     * @see LibStr
     * @param value 内容 参数多个类型:string-直接显示文本 、int-从语言包里面操作文本、array-带替换内容 [int|string, ...string]
     */
    static showTip(value: string | number | any[]) {
        if (UIPackage.getByName("common") == null || value == null)
            return
        if (Array.isArray(value)) {
            value[0] = LanguageUtils.inst.getStr(value[0])
            value = StringUtil.format.apply(null, value) as string
        } else {
            value = LanguageUtils.inst.getStr(value)
        }
        this.cacheContent.push(value)
        if (this.cacheContent.length > 5) {// 最多缓存5条
            this.cacheContent.shift()
        }
        this.showMes()
    }

    private static createHandler(): MessageTip {
        return UIPackage.createObjectFromURL("//common/MessageTip", MessageTip) as MessageTip
    }

    /**
     * 显示弹窗内容
     */
    private static showMes() {
        let mt: MessageTip = Pool.getItemByCreateFun(MessageTip.NAME, this.createHandler)
        mt.removeRelation(AlertPanel.inst, RelationType.Width)
        mt["applyPivot"]()
        mt.width = AlertPanel.inst.width
//		mt.fontSize = Math.floor(mt.tempFontSize * AlertPanel.inst.width / mt.initWidth)
        mt.content.text = this.cacheContent.shift()
        mt.alpha = .1
        mt.x = 0
        mt.y = (AlertPanel.inst.height - mt.height) >> 1
        mt.scaleX = .5
        mt.addRelation(AlertPanel.inst, RelationType.Width)
        AlertPanel.inst.addChild(mt)
        mt.tween = Tween.to(mt, {
            alpha: 1,
            scaleX: 1
        }, 400, null, Handler.create(mt, this.showEnd, [mt, this.displayTime]))
        this.usePool.push(mt)
        switch (this.usePool.length) {
            case 2:
                Tween.clear(this.usePool[0].tween)
                this.showEnd(this.usePool[0], this.displayTime)
                this.movePoint(this.usePool[0])
                break
            case 3:
                Tween.clear(this.usePool[0].tween)
                this.showEnd(this.usePool[0])
                this.movePoint(this.usePool[1])
                break
        }
    }

    private static movePoint(mt: MessageTip) {
        Tween.to(mt, {y: mt.y - mt.height - 5}, 300)
    }

    private static showEnd(mt: MessageTip, delay: number = 0) {
        mt.tween = Tween.to(mt, {
            alpha: 0,
            scaleX: .5,
            y: mt.y - 100
        }, 400, null, Handler.create(this, this.hideEnd, [mt]), delay)
    }

    private static hideEnd(mt: MessageTip) {
        mt.tween = null
        mt.removeFromParent()
        Pool.recover(this.NAME, mt)
        let index: number = this.usePool.indexOf(mt)
        this.usePool.splice(index, 1)
        if (this.cacheContent.length > 0) {
            this.showMes()
        }
    }

    /** 清楚所有提示 */
    static clearAll() {
        this.cacheContent.splice(0, this.cacheContent.length)
        let tip: MessageTip
        for (let i = 0; i < AlertPanel.inst.numChildren; i++) {
            tip = AlertPanel.inst.getChildAt(0) as MessageTip
            Tween.clearAll(tip)
            this.hideEnd(tip)
            i--
        }
    }


}

