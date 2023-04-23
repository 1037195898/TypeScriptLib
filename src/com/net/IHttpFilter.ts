export interface IHttpFilter {

    /**
     * 解析发送数据
     * @param url 访问地址
     * @param value 发送的数据
     * @return 发送的数据
     */
    filterSendData(url: string, value: any): any

    /**
     * 解析返回的数据
     * @param url 访问地址
     * @param value 返回的数据
     * @return 返回的数据
     */
    filterResultData(url: string, value: any): any

    /**
     * 拦截器 返回true 表示拦截不再继续执行后续的处理   false 表示继续执行后续的处理
     * @param url 访问地址
     * @param value 数据
     * @param complete 成功数据
     * @param error 失败数据
     * @param timeout 超时
     */
    interceptSend(url: string, value: any, complete?: ParamHandler, error?: ParamHandler, timeout?: ParamHandler): boolean

    /**
     * 错误调用
     * @param error
     */
    errorResult(error: any): void

    /** 自己解析通信数据 url->Handler   需要有返回方法 false 表示继续默认的处理模式 true 表示中止继续处理 */
    customResult: {
        [key: string]: ((url: string, value: any, complete?: ParamHandler, error?: ParamHandler, timeout?: ParamHandler) => boolean) | Laya.Handler
    }

    /**
     * 解析服务器的时间 返回服务器时间毫秒
     * @param data
     */
    parseData(data: any): number

}