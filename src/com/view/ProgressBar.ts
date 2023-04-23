import GProgressBar = fgui.GProgressBar
import GTweener = fgui.GTweener
import GTween = fgui.GTween
import EaseType = fgui.EaseType
import Handler = Laya.Handler
import {Factory} from "../Factory"
import {BaseProxy} from "../core/BaseProxy"
import {Proxys} from "../core/Proxys"
import {View} from "../core/View"

export class ProgressBar extends GProgressBar {

    constructor() {
        super()
    }

    protected constructFromXML(xml: any) {
        super.constructFromXML(xml)
    }

    tweenValue2(value: number, duration: number, complete?: ParamHandler): GTweener {

        let oldValule: number

        let tweener: GTweener = GTween.getTween(this, this.update)
        if (tweener != null) {
            oldValule = tweener.value.x
            tweener.kill()
        } else
            oldValule = this.value

        this["_value"] = value
        return GTween.to(oldValule, this.value, duration)
            .setTarget(this, this.update)
            .onComplete(() => {
                runFun(complete)
            })
            .setEase(EaseType.Linear)

    }


    regAction(action: string, caller: any, method: Function, group: string = null) {
        Factory.inst.regAction(action, caller, method, group)
    }

    regActionHandler(action: string, handler: Handler, group: string = null) {
        Factory.inst.regActionHandler(action, handler, group)
    }

    removeAllAction(...arge: any[]) {
        Factory.inst.removeAllAction.apply(Factory.inst, arge)
    }

    removeGroup(group: string) {
        Factory.inst.removeGroup(group)
    }

    removeGroupActions(group: string, ...arge) {
        arge.unshift(group)
        Factory.inst.removeGroupActions.apply(Factory.inst, arge)
    }

    removeActionHandler(action: string, method: Function, group: string = null) {
        Factory.inst.removeActionHandler(action, method, group)
    }

    sendAction(action: string, ...arge) {
        arge.unshift(action)
        Factory.inst.sendAction.apply(Factory.inst, arge)
    }

    sendGroupAction(group: string, action: string, ...arge) {
        arge.unshift(action)
        arge.unshift(group)
        Factory.inst.sendGroupAction.apply(Factory.inst, arge)
    }

    /** 注册游戏数据 */
    regGameAction(action: string, caller: any, method: Function) {
        this.regAction(action, caller, method, BaseProxy.GAME_GROUP)
    }

    addView(key: string, view: View) {
        return Factory.inst.addView(key, view)
    }

    removeView(key: string) {
        Factory.inst.removeView(key)
    }

    getView(key: string) {
        return Factory.inst.getView(key)
    }

    getProxy(name: string): Proxys {
        return Factory.inst.getProxy(name)
    }

}