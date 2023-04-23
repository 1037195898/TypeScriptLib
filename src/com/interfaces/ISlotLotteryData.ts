/**
 * 开奖数据
 */
export interface ISlotLotteryData {

    /** 开奖数组 */
    arr: number[]
    /** 是否是快速模式 */
    isTurboMode: boolean
    /** 块有多少个 */
    itemCount: number
    /** 附带数据 */
    data?: any

}