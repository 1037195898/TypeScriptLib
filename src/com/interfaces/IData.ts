import {UrlParam} from "../net/UrlParam"

export interface IData {

    /** 用户昵称是否是第一次改名，0 是，1 不是  */
    isFirstNick: boolean
    /** 该账号是否是第一次登录，0 是，1 不是  */
    isFirstLogin: boolean
    /** 开奖时间戳(s) */
    lotteryTime: number
    /** 缓存初始化开奖期数  */
    initPeriod: number
    /** 当前开奖期数  */
    period: number

    /** 进入房间后  当前房间总投注信息  (只有进入房间的时候才使用) */
    initRoomTotalItem: any[]
    /** 进入房间后  当前房间自己投注信息  (只有进入房间的时候才使用) */
    initRoomCurBet: any[]
    /** 初始化奖金池数据(只有进入房间的时候才使用) */
    jackpot: number
    /** 上次发送聊天数据时间 s */
    oldSendChatTimer: number
    /** 开奖历史 */
    betHistory: any[]
    /** 当前历史次数 */
    betStatic: any[]

    /** 获取完整的wap请求url */
    getWapUrl(url: string): string

    /** 获取完整的game请求 带版本号  url */
    getGameUrl(url: string): string

    /**
     * 获取国家编码 国家 'ke'肯尼亚；'ug'乌干达, 'ng'尼日尼亚
     * @param urlParam
     */
    getCountry(urlParam: UrlParam): string

    /**
     * 获取错误上传地址
     */
    getErrorUrl(): string

}
