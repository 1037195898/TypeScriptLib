import GButton = fgui.GButton;
import GTextField = fgui.GTextField;
import {LongPressBtn} from "./LongPressBtn"
import {UtilKit} from "./UtilKit"

/**
 * 切换参数
 * @author boge
 *
 */
export class ChangeValue {

    /** 加号按钮 */
    private readonly addBtn: GButton
    /** 减号按钮 */
    private readonly minusBtn: GButton
    /** 数据变动显示对象 */
    private label: GTextField
    /** 变动数据的存储库 */
    private _antes: number[]
    /** 变更值后调用 */
    dateChange: ParamHandler
    /** 执行max min 或点击加减变化前调用 如果返回false 将停止继续执行 */
    dateChangeBefore: ParamHandler
    /** 最近的值 */
    lastValue: number
    /** 是否启用到达最大值后禁用按钮 */
    autoEnabled: boolean
    /** 是否启用 */
    private isEnabled = true
    private jiaLongPressBtn: LongPressBtn
    private jianLongPressBtn: LongPressBtn
    /** 动态切换值 要在调用金额的方法使用前初始化 */
    dynamicHandler: ParamHandler

    /**
     *
     * @param addBtn 加
     * @param minusBtn 减
     * @param label 文字
     *
     */
    constructor(addBtn: GButton, minusBtn: GButton, label: GTextField) {
        this.addBtn = addBtn
        this.minusBtn = minusBtn
        this.label = label
        this.openLong = false
    }

    /** 开通按钮长按 */
    set openLong(value: boolean) {
        if (value) {
            this.addBtn.offClick(this, this.changeAnteHandler)
            this.minusBtn.offClick(this, this.changeAnteHandler)
            this.jiaLongPressBtn = UtilKit.bindLongPressBtn(this.addBtn, this.changeAnteHandler.bind(this), 1)
            this.jianLongPressBtn = UtilKit.bindLongPressBtn(this.minusBtn, this.changeAnteHandler.bind(this), 2)
        } else {
            this.addBtn.onClick(this, this.changeAnteHandler, [1])
            this.minusBtn.onClick(this, this.changeAnteHandler, [2])
        }
    }

    /**
     * 设置到最大
     * @param [isEvent = true] 是否派发本次改变值的事件
     */
    max(isEvent = true) {
        if (this.antes == null || this.antes.length == 0) {
            return
        }
        let ante = this.antes[this.antes.length - 1]
        if (this.dateChangeBefore) {
            if (!runFun(this.dateChangeBefore, ante)) // 执行变化前的调用如果返回false 将停止继续执行
                return
        }
        this.lastValue = parseFloat(this.label.text)
        this.label.text = ante + ""
        if (isEvent) this.sendEventValue(ante)
    }

    /**
     * 设置到最小
     * @param [isEvent = true] 是否派发本次改变值的事件
     */
    min(isEvent = true) {
        if (this.antes == null || this.antes.length == 0) {
            return
        }
        let ante = this.antes[0]
        if (this.dateChangeBefore) {
            if (!runFun(this.dateChangeBefore, ante)) // 执行变化前的调用如果返回false 将停止继续执行
                return
        }
        this.lastValue = parseFloat(this.label.text)
        this.label.text = ante + ""
        if (isEvent) this.sendEventValue(ante)
    }


    set enabled(value: boolean) {
        this.isEnabled = value
        this.addBtn.enabled = this.minusBtn.enabled = this.isEnabled
        this.checkAutoEnabled()
    }

    /**
     * 赌注值
     * @param value 值
     * @param [defaultValue = 1] 默认取值
     * @param [isEvent = true] 是否派发本次改变值的事件
     */
    setAntes(value?: number[], defaultValue = 1, isEvent = true) {
        if (value) this._antes = value
        this.label.text = this.antes[defaultValue] + ""
        this.lastValue = parseFloat(this.label.text)
        if (isEvent) this.sendEventValue(this.antes[defaultValue])
        // 初始化的时候就判断是否可以点击
        this.checkAutoEnabled()
    }

    /**
     * 设置为数组中小于 value 并最接近的值
     * @param value 一个参考值
     * @param [isEvent = true] 是否派发本次改变值的事件
     */
    setClosest(value: number, isEvent = true) {
        if (this.antes == null || this.antes.length == 0) return
        let tempAnte
        let ante = this.antes[0]
        for (let i = 0; i < this.antes.length; i++) {
            tempAnte = this.antes[i]
            if (tempAnte <= value) {
                ante = tempAnte
            } else {
                break
            }
        }
        this.lastValue = parseFloat(this.label.text)
        this.label.text = ante + ""
        if (isEvent) this.sendEventValue(ante)
    }

    /**
     * 返回上一个值
     * @param [isEvent = true] 是否派发本次改变值的事件
     */
    before(isEvent = true) {
        let tempAnte = parseFloat(this.label.text)
        if (tempAnte != this.lastValue) {
            this.label.text = this.lastValue + ""
            if (isEvent) this.sendEventValue(this.lastValue)
            this.checkAutoEnabled()
        }
    }

    /**
     * 设置切换到指定的位置
     * @param index 下标
     * @param [isEvent = true] 是否派发本次改变值的事件 如果值和当前的值相同 不派发事件
     */
    setPosition(index: number, isEvent = true) {
        if (index > -1 && index < this.antes.length) {
            let newValue = this.antes[index]
            let lastValue = parseFloat(this.label.text)
            // 值相等不发送
            if (newValue === lastValue) return
            this.lastValue = lastValue
            this.label.text = newValue + ""
            if (isEvent) this.sendEventValue(newValue)
        }
    }

    get antes(): number[] {
        return runFun(this.dynamicHandler) ?? this._antes
    }

    /** 兼容老版本 */
    getAntes(): number[] {
        return this.antes
    }

    /**
     * 触发监听事件
     * @param ante 当前显示值
     */
    private sendEventValue(ante: number) {
        runFun(this.dateChange, ante)
    }

    private changeAnteHandler(code: number) {
        let antes = this.antes
        if (antes == null || antes.length == 0) {
            return
        }
        let tempAnte = parseFloat(this.label.text)
        let ante = tempAnte
        let index = antes.indexOf(ante)
        if (index == -1) {
            ante = antes[0]
        } else {
            if (code == 1) {// 加
                index++
                if (index >= antes.length) {
                    index = antes.length - 1
                }
            } else if (code == 2) {// 减
                index--
                if (index < 0) {
                    index = 0
                }
            }
            ante = antes[index]
        }

        if (this.dateChangeBefore) {
            if (!runFun(this.dateChangeBefore, ante)) // 执行变化前的调用如果返回false 将停止继续执行
                return
        }

        this.lastValue = tempAnte
        this.label.text = ante + ""
        this.checkAutoEnabled()
        this.sendEventValue(ante)
    }

    /** 获取当前显示文本的数字 */
    getTextToNumber() {
        return parseFloat(this.getText())
    }

    /** 获取当前显示文本 */
    getText() {
        return this.label.text
    }

    dispose() {
        this.jiaLongPressBtn?.dispose()
        this.jianLongPressBtn?.dispose()
    }

    /** 检查自动启用停止 */
    private checkAutoEnabled() {
        let index = this.antes.indexOf(this.getTextToNumber())
        if (this.isEnabled && this.autoEnabled) {
            this.addBtn.enabled = index < this.antes.length - 1
            this.minusBtn.enabled = index > 0
        }
    }

}