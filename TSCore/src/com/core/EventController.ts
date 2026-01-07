import {StringUtil} from "../utils/StringUtil"
import {App} from "../App"
import {Log} from "../Log";
import {IKey, IProxy} from "../interfaces/ICommon";
import {IController} from "../interfaces/IController";
import {IView} from "../interfaces/IView";

/**
 * 事件控制器，用于管理事件的注册、分发和移除，同时提供对象缓存功能
 * 支持事件分组管理、事件处理器的生命周期管理以及对象的注册和获取
 */
export class EventController implements IController {

    /** 事件缓存的所有组 组名字->组object */
    private eventGroup = new Map<string, Map<string | number, Laya.Handler[]>>()
    /**
     * 缓存key -> 实例
     */
    private cacheTarget = new Map<string, any>()
    /**
     * 缓存类名 -> 实例
     */
    private cacheClassTarget = new Map<string, any>()

    private static _CLSID = 0

    /**
     * 注册事件处理器
     * @param action 事件标识
     * @param handler 事件处理器
     * @param group 分组名称
     * @param order 执行顺序
     */
    regActionHandler(action: string | number, handler: Laya.Handler, group?: string, order?: number) {
        handler.order = order
        let groupObj = this.getGroup(group)
        // 获取此分组下  action 的执行函数存储数组
        groupObj.getOrPut(action, () => []).push(handler)
    }

    /**
     * 分组存储对象
     * @param groupKey 分组key
     * @return 分组对应的Map对象
     */
    getGroup(groupKey: string) {
        if (StringUtil.isEmpty(groupKey)) {
            groupKey = App.DEFAULT_GROUP
        }
        return this.eventGroup.getOrPut(groupKey, () => new Map())
    }

    /**
     * 注册事件
     * @param action 事件标识
     * @param caller 调用者
     * @param method 事件处理方法
     * @param group 分组名称
     * @param order 执行顺序
     */
    regAction(action: string | number, caller: any, method: Function, group?: string, order?: number) {
        const handler = new Laya.Handler(caller, method)
        this.regActionHandler(action, handler, group, order)
    }

    /**
     * 清空视图缓存
     */
    clearView() {
        this.cacheTarget.clear()
        EventController._CLSID = 0
    }

    /**
     * 清空事件分组
     */
    clearGroup() {
        this.eventGroup.clear()
        Log.debug("clear eventGroup")
    }

    /**
     * 移除所有事件分组中的指定事件
     * @param args 要移除的事件标识列表
     */
    removeAllAction(...args: string[]) {
        for (const key of this.eventGroup.keys()) {// 获取key
            this.removeGroupActions.apply(this, [key, ...args])
        }
    }

    /**
     * 移除指定分组
     * @param groupKey 分组名称
     */
    removeGroup(groupKey: string) {
        Log.debug(`removeGroup ${groupKey}`)
        this.eventGroup.delete(groupKey)
    }

    /**
     * 移除分组中的指定事件
     * @param groupKey 分组名称
     * @param args 要移除的事件标识列表
     */
    removeGroupActions(groupKey: string, ...args) {
        let groupObj = this.getGroup(groupKey)
        args.forEach(value => groupObj.delete(value))
    }

    /**
     * 移除事件处理器
     * @param action 事件标识
     * @param method 事件处理方法
     * @param group 分组名称
     */
    removeActionHandler(action: string | number, method: Function, group?: string) {
        if (!group) {
            for (let groupKey of this.eventGroup.values()) {
                this.removeFunction(groupKey, action, method)
            }
            return
        }
        let groupObj = this.getGroup(group)
        this.removeFunction(groupObj, action, method)
    }

    /**
     * 从分组中移除指定的函数处理器
     * @param groupObj 分组对象
     * @param action 事件标识
     * @param method 事件处理方法
     */
    removeFunction(groupObj: Map<string | number, Laya.Handler[]>, action: string | number, method: Function) {
        let arr = groupObj.get(action)
        if (arr) {
            for (let i = 0; i < arr.length; i++) {
                let h = arr[i]
                if (h.method == method) {
                    arr.splice(i, 1)
                    i--
                }
            }
            if (arr.length == 0) groupObj.delete(action)
        }
    }

    /**
     * 移除指定调用者的全部事件处理器
     * @param caller 调用者
     */
    removeTargetAll(caller: any) {
        for (let groupObj of this.eventGroup.keys()) {
            this.removeTarget(this.eventGroup.get(groupObj), caller)
        }
    }

    /**
     * 从分组中移除指定调用者的处理器
     * @param groupObj 分组对象
     * @param caller 调用者
     */
    removeTarget(groupObj: Map<string | number, Laya.Handler[]>, caller: any) {
        for (const [key, value] of groupObj.entries()) {
            for (let i = 0; i < value.length; i++) {
                let h = value[i]
                if (h.caller == caller) {
                    value.splice(i, 1)
                    i--
                }
            }
            if (value.length == 0) groupObj.delete(key)
        }
    }

    /**
     * 检查是否存在指定事件
     * @param action 事件标识
     * @returns 是否存在事件
     */
    hasAction(action: string | number) {
        const eventMap = this.eventGroup.values()
        for (const map of eventMap) {
            let arr = map.get(action)
            if (arr) {
                return true
            }
        }
        return false
    }

    /**
     * 向指定分组发送事件
     * @param group 分组名称
     * @param action 事件标识
     * @param args 事件参数
     */
    sendGroupAction(group: string, action: string | number, ...args: any[]) {
        let result: boolean = this.sendActionEvent.apply(this, [group, action, ...args])
        if (!result) {
            Log.debug("group[" + group + "], action [" + action + "] not exist! Call failure")
        }
    }

    /**
     * 发送事件到所有分组
     * @param action 事件标识
     * @param args 事件参数
     */
    sendAction(action: string | number, ...args: any[]) {
        let result: boolean
        for (const groupName of this.eventGroup.keys()) {
            let tempResult: boolean = this.sendActionEvent.apply(this, [groupName, action, ...args])
            if (tempResult) result = true
        }
        if (!result)
            Log.debug("action [" + action + "] not exist! Call failure")
    }

    /**
     * 发送事件到指定分组
     * @param group 分组名称
     * @param action 事件标识
     * @param args 事件参数
     * @returns 是否成功发送
     */
    sendActionEvent(group: string, action: string | number, ...args: any[]) {
        let groupObj = this.getGroup(group)
        let arr = groupObj.get(action)
        if (arr) {
            arr.sort((a, b) => a.order || 100 - b.order || 100)
                .forEach(value =>
                    value.runWith(args)
                )
            return true
        }
        return false
    }

    /**
     * 添加Bean对象到缓存
     * @param key 键值或类构造函数
     * @param bean Bean对象
     * @param saveClassName 是否保存类名映射
     * @returns 是否添加成功
     */
    addBean<T>(key: string | { new(): T }, bean: T, saveClassName = true) {
        if (typeof key !== "string") {
            key = this._getClassSign(key)
        }
        if (StringUtil.isEmpty(key)) {
            Log.warn("cannot be empty, key = " + key)
            return false
        }
        if (this.getView(key)) {
            Log.warn("already exist key = " + key + ", add failure!")
            return false
        }
        this.cacheTarget.set(key, bean)
        if (saveClassName) {
            this.cacheClassTarget.set(bean.constructor.name, bean)
        }
        return true
    }

    /**
     * 从缓存中移除Bean对象
     * @param key 键值或类构造函数
     */
    removeBean<T extends { new(...args: any[]) }>(key: string | T) {
        if (!key) return
        if (typeof key !== "string") {
            key = this._getClassSign(key, false)
        }
        if (StringUtil.isEmpty(key)) return
        this.cacheTarget.delete(key)
        this.cacheClassTarget.delete(key.charAt(0).toUpperCase() + key.slice(1))
    }

    /**
     * 获取Bean对象
     * @param key 键值或类构造函数
     * @returns Bean对象
     */
    getBean<T>(key: string | { new(): T }): T {
        if (!key) return
        if (typeof key !== "string") {
            key = this._getClassSign(key, false)
        }
        return this.cacheTarget.get(key) ?? this.cacheClassTarget.get(key)
    }

    /**
     * 检查是否包含指定的Bean对象
     * @param key 键值或类构造函数
     * @returns 是否包含
     */
    hasBean<T>(key: string | { new(): T }): boolean {
        if (typeof key !== "string") {
            key = this._getClassSign(key, false)
        }
        if (!key) return false
        return this.cacheTarget.has(key) || this.cacheClassTarget.has(key)
    }

    /**
     * 添加视图对象到缓存
     * @param key 键值或类构造函数
     * @param view 视图对象
     * @returns 是否添加成功
     */
    addView<T extends IView & IKey>(key: string | { new(): T }, view: T) {
        if (this.addBean(key, view)) {
            if (typeof key !== "string") {
                key = this._getClassSign(key)
            }
            view.setKey(key)
            return true
        }
        return false
    }

    /**
     * 从缓存中移除视图对象
     * @param key 键值或类构造函数
     */
    removeView<T extends IView & IKey>(key: string | T) {
        if (!key) return
        if (typeof key !== "string") {
            key = key.getKey()
        }
        this.removeBean(key)
    }

    /**
     * 获取视图对象
     * @param key 键值或类构造函数
     * @returns 视图对象
     */
    getView<T>(key: string | { new(): T }): T {
        return this.getBean(key)
    }

    /**
     * 添加代理对象到缓存
     * @param key 键值或类构造函数
     * @param proxy 代理对象
     * @returns 是否添加成功
     */
    addProxy<T extends IProxy & IKey>(key: string | { new(): T }, proxy: T) {
        if (this.addBean(key, proxy)) {
            if (typeof key !== "string") {
                key = this._getClassSign(key)
            }
            proxy.setKey(key)
            return true
        }
        return false
    }

    /**
     * 从缓存中移除代理对象
     * @param key 键值或类构造函数
     */
    removeProxy<T extends IProxy & IKey>(key: string | T) {
        if (!key) return
        if (typeof key !== "string") {
            key = key.getKey()
        }
        this.removeBean(key)
    }

    /**
     * 获取代理对象
     * @param name 键值或类构造函数
     * @returns 代理对象
     */
    getProxy<T>(name: string | { new(): T }): T {
        return this.getBean(name)
    }

    /**
     * 获取缓存映射表
     * @returns 缓存映射表
     */
    getMap() {
        return this.cacheTarget
    }

    /**
     * 返回类的唯一标识
     * @param cla 类构造函数
     * @param create 是否创建新标识
     * @returns 类标识字符串
     */
    private _getClassSign<T>(cla: { new(): T }, create = true): string {
        let className = cla["__className"] || cla["_cacheId"] || cla.name
        if (!className && create) {
            cla["_cacheId"] = className = `${App.DEFAULT_CACHE_HEAD}_${EventController._CLSID}`
            EventController._CLSID++
        }
        return className
    }

}