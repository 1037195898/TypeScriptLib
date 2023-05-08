import {IGameModel} from "./IGameModel"

/**
 * 游戏请求接口
 * @author boge
 *
 */
export interface IGameServlet {

    /**
     * 检查游戏当前状态
     * @param handler 游戏可进入时  调用函数
     *
     */
    checkState(handler: ParamHandler): void

    /** 游戏初始化  向服务器发送请求数据 */
    init(handler: ParamHandler): void

    /** 获取游戏逻辑类 */
    gameModel: IGameModel

    /** 设置游戏逻辑类 */

    // gameModel(value: IGameModel): void

    /** 检查游戏期数是否正确 */
    checkGamePeriod(handler: ParamHandler): void

    /**
     * get 获取数据
     * @param url
     * @param data
     * @param callback
     * @param error
     * @param timeout
     *
     */
    getURL(url: string, data: any, callback?: ParamHandler, error?: ParamHandler, timeout?: ParamHandler): void

    /**
     * post 请求数据
     * @param url
     * @param data
     * @param callback
     * @param error
     * @param timeout
     * @param headers
     * @param overtime
     *
     */
    post(url: string, data: any, callback?: ParamHandler, error?: ParamHandler, timeout?: ParamHandler, headers?: any[], overtime?: number): void

    /**
     *
     * @param callback
     * @param error
     */
    getUserMoney(callback: ParamHandler, error: ParamHandler): void

    /**
     * 清理收
     */
    dispose(): void

}
