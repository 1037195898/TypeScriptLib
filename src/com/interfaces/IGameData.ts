/**
 * 游戏数据
 */
export interface IGameData {

    /** 总共要投注的钱 */
    getTotalBetMoney(): number
    /** 上报错误数据 */
    reportError(): any
    /** 本次总共赢的钱 */
    totalWinMoney?: number
    /** 玩的次数 计数 */
    playCount?: number
    /** 是否是推荐游戏 */
    isRecommend?: boolean

}