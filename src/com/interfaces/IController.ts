import {IView} from "./IView"
import {IProxy} from "./IProxy"

export interface IController extends IView, IProxy {

    /** 清除所有UI缓存 */
    clearView()

    /** 清除所有分组和包含的事件 */
    clearGroup()

}