import {IGameData} from "../Interfaces";
import {Player} from "../Player";

/**
 * 游戏类型
 */
export enum GameType {
    /** 正常游戏 */
    NORMAL,
    /** 连线游戏 */
    SLOT,
    /** 连线游戏,单独的bet bet值和线数量无关 */
    SLOT_SINGLE_BET,
}

/**
 * 游戏数据的基类
 */
export class BaseGameData implements IGameData {

    /**
     * 服务器返回的当前本金
     */
    currentBalance = 0
    /** 最后盈利总额 */
    totalWinMoneyLast = 0
    /** 本轮总盈利额 */
    totalWinMoney = 0
    /** 服务器返回当前盈利额 */
    serverWinMoney = 0
    /**
     * 玩的次数
     */
    playCount = 0
    /**
     * 推荐
     */
    isRecommend = false
    /**
     * 是否已启动特殊游戏模式
     */
    specialMode = false
    /**
     * 游戏类型
     * @see GameType
     */
    gameType = GameType.NORMAL
    attachedDebugData: any
    /** 是否快速播放 */
    protected _isTurboMode = false
    /** 缓存的下注值 */
    cacheAnte: any
    /** 默认bet位置 */
    defaultBetIndex = 0
    /** 缓存 后端计算 当前盈利 */
    tempServerWinMoney = 0
    /** 当前玩家选择的自动bet次数 */
    autoBetCount = 0
    /** 当前玩家选择的自动bet次数 (缓存) */
    tempAutoBetCount = 0
    /** bet 额度切换值 */
    betMoney = []
    /** 当前bet值 */
    betValue = 0
    /** 开奖结果 */
    lotteryId: any[]
    /** 通知数据 */
    noticeData = []
    /**
     * 重置默认bet值
     * @default false
     */
    isResetBetValue = false

    constructor() {
        const key = Player.inst.gameId + "_isTurboMode"
        this._isTurboMode = Laya.LocalStorage.getItem(key) != null
    }

    get isTurboMode() {
        return this._isTurboMode
    }

    set isTurboMode(value: boolean) {
        this._isTurboMode = value
        const key = Player.inst.gameId + "_isTurboMode"
        if (value) {
            Laya.LocalStorage.setItem(key, "1")
        } else {
            Laya.LocalStorage.removeItem(key)
        }
    }

    /**
     * 获取 Skeleton 播放速率
     */
    getPlaybackRate() {
        return this.isTurboMode ? 2 : 1
    }

    /**
     * 将传入参数计算加速后的值
     * @param value 获取转换时间
     * @param [rate=-1] 需要加速的速率 如果是-1将调用 getPlaybackRate 获取默认速率
     *
     * @see getPlaybackRate
     */
    convertPlaybackRate(value: number, rate = -1) {
        if (!this.isTurboMode) return value
        if (rate == -1) rate = this.getPlaybackRate()
        return Math.floor(value / rate)
    }



    /**
     * 总金额 default BaseGameData.betValue
     */
    getTotalBetMoney() {
        return this.betValue
    }

    /**
     * 获取赢钱动画 的播放时长
     * @param level 播放时长等级 0开始
     */
    getWinMoneyAniDuration(level: number) {
        return this.convertPlaybackRate(1000) * (level + 1)
    }

    /**
     * 是否达到 BigWin 的值
     * @param [isTotal=false] 是否看总金额
     * @param [multiple=10] 倍数
     * @return
     */
    isBigWin(isTotal = false, multiple = 10) {
        return (isTotal ? this.totalWinMoney : this.serverWinMoney) > this.getTotalBetMoney() * multiple
    }

    /**
     * 是否达到 MegaWin 的值
     * @param [isTotal=false] 是否看总金额
     * @param [multiple=30] 倍数
     * @return
     */
    isMegaWin(isTotal = false, multiple = 30) {
        return (isTotal ? this.totalWinMoney : this.serverWinMoney) > this.getTotalBetMoney() * multiple
    }

    /**
     * 是否达到 SuperWin 的值
     * @param [isTotal=false] 是否看总金额
     * @param [multiple=60] 倍数
     */
    isSuperWin(isTotal = false, multiple = 60) {
        return (isTotal ? this.totalWinMoney : this.serverWinMoney) > this.getTotalBetMoney() * multiple
    }


    reportError() {
        return JSON.stringify(this)
    }

}