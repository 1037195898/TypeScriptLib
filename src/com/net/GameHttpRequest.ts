import Handler = Laya.Handler;

export class GameHttpRequest extends Laya.HttpRequest {

    /** 请求数据完成 */
    private completeHandler: ParamHandler
    /** 请求错误 */
    private errorHandler: ParamHandler
    /** 超时 */
    private timerOutHandler: ParamHandler
    /** 超时时间 */
    private overtime = 10000

    /**
     * 创建一个请求
     */
    constructor() {
        super()
        this.once(Laya.Event.COMPLETE, this, this.resultHandler)
        this.once(Laya.Event.ERROR, this, this.httpErrorHandler)
    }

    onComplete(value: ParamHandler) {
        this.completeHandler = value
    }

    onTimerOut(value: ParamHandler) {
        this.timerOutHandler = value
    }

    onError(value: ParamHandler) {
        this.errorHandler = value
    }

    setOvertime(value: number) {
        this.overtime = value
    }

    send(url: string, data?: any, method?: string, responseType?: string, headers?: string[] | null) {
        if (this.overtime > 0) Laya.timer.once(this.overtime, this, this.timeOut)
        super.send(url, data, method, responseType, headers)
    }

    private httpErrorHandler(obj: any) {
        Laya.timer.clear(this, this.timeOut)
        if (this.completeHandler && this.completeHandler instanceof Handler) this.completeHandler.recover()
        if (this.timerOutHandler && this.timerOutHandler instanceof Handler) this.timerOutHandler.recover()
        this.completeHandler = null
        this.timerOutHandler = null
        runFun(this.errorHandler, obj)
    }

    /** 请求返回结果数据 */
    private resultHandler(json: any) {
        Laya.timer.clear(this, this.timeOut)
        if (this.errorHandler && this.errorHandler instanceof Handler) this.errorHandler.recover()
        if (this.timerOutHandler && this.timerOutHandler instanceof Handler) this.timerOutHandler.recover()
        this.errorHandler = null
        this.timerOutHandler = null
        runFun(this.completeHandler, json)
    }

    private timeOut() {
        Laya.timer.clear(this, this.timeOut)
        this.offAll(Laya.Event.COMPLETE)
        this.offAll(Laya.Event.ERROR)
        this.clear()
        if (this.errorHandler && this.errorHandler instanceof Handler) this.errorHandler.recover()
        if (this.completeHandler && this.completeHandler instanceof Handler) this.completeHandler.recover()
        this.errorHandler = null
        this.completeHandler = null
        runFun(this.timerOutHandler)
    }

    /**
     * 终止请求
     */
    abort() {
        if (this.errorHandler && this.errorHandler instanceof Handler) this.errorHandler.recover()
        if (this.completeHandler && this.completeHandler instanceof Handler) this.completeHandler.recover()
        if (this.timerOutHandler && this.timerOutHandler instanceof Handler) this.timerOutHandler.recover()
        this.completeHandler = null
        this.errorHandler = null
        this.timerOutHandler = null
        this.clear()
        Laya.timer.clear(this, this.timeOut)
        this.offAll(Laya.Event.COMPLETE)
        this.offAll(Laya.Event.ERROR)
    }

}