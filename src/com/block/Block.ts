import {Factory} from "../Factory";
import {IKey, IProxy, IView} from "../interfaces/ICommon";
import {IAction} from "../interfaces/IAction";

/**
 * 只有 getProxy 和 getView
 */
export class ViewProxy {

    getProxy<T>(name: string | { new(): T }): T {
        return Factory.inst.getProxy(name)
    }

    getView<T>(key: string | { new(): T }): T {
        return Factory.inst.getView(key)
    }

}

export class ViewBlock {

    getProxy<T>(name: string | { new(): T }): T {
        return Factory.inst.getProxy(name)
    }

    addView<T extends IView & IKey>(key: string | { new(): T }, view: T): boolean {
        return Factory.inst.addView(key, view)
    }

    getView<T>(key: string | { new(): T }): T {
        return Factory.inst.getView(key)
    }

    removeView<T extends IView & IKey>(key: string | T) {
        Factory.inst.removeView(key)
    }

}

export class ProxyBlock {

    addProxy<T extends IProxy & IKey>(key: string | { new(): T }, proxy: T): boolean {
        return Factory.inst.addProxy(key, proxy)
    }

    getProxy<T>(key: string | { new(): T }): T {
        return Factory.inst.getProxy(key)
    }

    removeProxy<T extends IProxy & IKey>(key: string | T) {
        Factory.inst.removeProxy(key)
    }

    getView<T>(key: string | { new(): T }): T {
        return Factory.inst.getView(key)
    }

}

export class StringBlock {

    /**
     * 根据语言包id获取字符串
     * @deprecated
     * @see window.getString
     */
    getString(id: string | number, ...args): string {
        return getString(id, ...args)
    }
}

export class ActionEvent implements IAction {

    regAction(action: string, caller: any, method: Function, group?: string) {
        Factory.inst.regAction(action, caller, method, group)
    }

    regActionHandler(action: string, handler: Laya.Handler, group?: string) {
        Factory.inst.regActionHandler(action, handler, group)
    }

    /** 注册游戏数据 */
    regGameAction(action: string, caller: any, method: Function) {
        this.regAction(action, caller, method, Factory.GAME_GROUP)
    }

    removeAllAction(...args: string[]) {
        Factory.inst.removeAllAction.apply(Factory.inst, args)
    }

    removeGroup(group: string) {
        Factory.inst.removeGroup(group)
    }

    removeGroupActions(group: string, ...args: string[]) {
        args.unshift(group)
        Factory.inst.removeGroupActions.apply(Factory.inst, args)
    }

    removeActionHandler(action: string, method: Function, group?: string) {
        Factory.inst.removeActionHandler(action, method, group)
    }

    removeFunction(groupObj: any, action: string, method: Function) {
        Factory.inst.removeFunction(groupObj, action, method)
    }

    removeTargetAll(caller: any) {
        Factory.inst.removeTargetAll(caller)
    }

    removeTarget(groupObj: any, caller: any) {
        Factory.inst.removeTarget(groupObj, caller)
    }

    sendAction(action: string, ...args) {
        args.unshift(action)
        Factory.inst.sendAction.apply(Factory.inst, args)
    }

    sendGroupAction(group: string, action: string, ...args) {
        args.unshift(action)
        args.unshift(group)
        Factory.inst.sendGroupAction.apply(Factory.inst, args)
    }

}