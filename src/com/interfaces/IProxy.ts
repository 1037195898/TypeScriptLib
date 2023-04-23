import {IAction} from "./IAction"
import {IKey} from "./IKey"

export interface IProxy extends IAction {

    getProxy<T>(key: string | { new(): T }): T

    removeProxy<T extends IProxy & IKey>(key: string | T)

    addProxy<T extends IProxy & IKey>(key: string | { new(): T }, proxy: T): boolean

}