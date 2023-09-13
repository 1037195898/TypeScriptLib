import {IAction} from "./interfaces/IAction"
import {DefineConfig} from "./DefineConfig"
import {Controller} from "./core/Controller"
import Handler = Laya.Handler;
import {MyLoader} from "./core/MyLoader";
import {ConfigKit, EnvType} from "./ConfigKit";
import {Log} from "./Log";
import {IController, IKey, IProxy, IView} from "./interfaces/ICommon";
import {Player} from "./Player";
import {UrlParam} from "./net/UrlParam";
import {AppRecordManager} from "./manager/AppRecordManager";

export class Factory implements IAction {

    private static _instance: Factory
    static get inst(): Factory {
        return this._instance
    }

    /** 默认的分组名
     * @default group
     * */
    static DEFAULT_GROUP = "group"
    /** 默认cacheId标记头
     * @default cache
     * */
    static DEFAULT_CACHE_HEAD = "cache"
    /**
     *  游戏公用组
     */
    static GAME_GROUP = "game_group"

    private _controller: IController

    constructor() {
        this.initController()
    }

    /**
     * 初始化框架
     */
    static init() {
        this._instance = new Factory()
        Player.inst.urlParam = new UrlParam()
        DefineConfig.init()
        let envType = ConfigKit.env()
        Log.debug("env", EnvType[envType])
        // 使用自定义加载器加载资源
        fgui.AssetProxy.inst.setAsset(MyLoader.loader)
        AppRecordManager.init()
    }

    static initClass(...args) {
        for (let i = 0; i < args.length; i++) {
            new args[i]()
        }
    }

    protected initController() {
        this._controller = new Controller()
    }

    regActionHandler(action: string, handler: Handler, group: string = null) {
        this._controller.regActionHandler(action, handler, group)
    }

    regAction(action: string, caller: any, method: Function, group: string = null) {
        this._controller.regAction(action, caller, method, group)
    }

    removeAllAction(...args: string[]) {
        this._controller.removeAllAction.apply(this._controller, args)
    }

    removeGroup(group: string) {
        this._controller.removeGroup(group)
    }

    removeGroupActions(group: string, ...args) {
        args.unshift(group)
        this._controller.removeGroupActions.apply(this._controller, args)
    }

    removeActionHandler(action: string, method: Function, group: string = null) {
        this._controller.removeActionHandler(action, method, group)
    }

    removeFunction(groupObj: any, action: string, method: Function) {
        this._controller.removeFunction(groupObj, action, method)
    }

    removeTargetAll(caller: any) {
        this._controller.removeTargetAll(caller)
    }

    removeTarget(groupObj: any, caller: any) {
        this._controller.removeTarget(groupObj, caller)
    }

    sendAction(action: string, ...args) {
        args.unshift(action)
        this._controller.sendAction.apply(this._controller, args)
    }

    sendGroupAction(group: string, action: string, ...args) {
        args.unshift(action)
        args.unshift(group)
        this._controller.sendGroupAction.apply(this._controller, args)
    }


    addView<T extends IView & IKey>(key: string | { new(): T }, view: T) {
        return this._controller.addView(key, view)
    }

    removeView<T extends IView & IKey>(key: string | T) {
        this._controller.removeView(key)
    }

    getView<T>(key: string | { new(): T }): T {
        return this._controller.getView(key)
    }

    getProxy<T>(name: string | { new(): T }): T {
        return this._controller.getProxy(name)
    }

    addProxy<T extends IProxy & IKey>(key: string | { new(): T }, proxy: T) {
        return this._controller.addProxy(key, proxy)
    }

    removeProxy<T extends IProxy & IKey>(key: string | T) {
        this._controller.removeProxy(key)
    }

    /** 清除所有UI缓存 */
    clearView() {
        this._controller.clearView()
    }

    /** 清除所有分组和包含的事件 */
    clearGroup() {
        this._controller.clearGroup()
    }

}