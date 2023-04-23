import Browser = Laya.Browser
import {Player} from "../Player"
import {AppManager} from "./AppManager"
import {ConfigUtils} from "../utils/ConfigUtils"

/**
 * 统计管理器
 * @author boge
 */
export class AnalyticsManager {

    /** 开启数据统计 */
    public static isOpenAnalytics = true

    constructor() {
    }

    /** 打开了一个游戏 */
    static openGame() {
    }

    /** 关闭了一个游戏 */
    static closeGame() {
    }

    /** 打开统计 */
    static openAnalysis(callback: Function) {
        if (callback) callback()
    }

    /**
     * 发送游戏事件
     * @param eventAction 互动类型 (默认会添加 _)
     */
    static sendGameAnalysis(eventAction: string) {
        // 获取当前的游戏配置
        let gameName = ConfigUtils.gameName(Player.inst.gameModel)
        if (gameName) {
            gameName = gameName.replace(/\s+/g, "_").toLowerCase()
            if (Player.inst.isGuest) eventAction += "_demo"
            AnalyticsManager.send(gameName + "_" + eventAction)
        } else {
            console.warn("sendGameAnalysis : gameId=" + Player.inst.gameModel + " not exist")
        }
    }

    /**
     * 向Google Analytics 发送事件
     * @param eventAction 互动类型
     *
     */
    static send(eventAction: string) {
        this.isOpenAnalytics = Browser.window.openAnalytics
        if (Player.inst.isWeb && this.isOpenAnalytics && Browser.window.ga)
            Browser.window.ga('send', 'event', 'game', eventAction)
        if (!Player.inst.isWeb && this.isOpenAnalytics)
            AppManager.enterFeedback({eventName: eventAction, eventValue: ""}, AppManager.nullFun)
    }

    /**
     * 向Google Analytics 发送用户用时
     * @param timingVar 用于标识要记录的变量
     * @param timingValue 向 Google Analytics（分析）报告的，以毫秒为单位的历时时间（例如 20）。
     *
     */
    static sendTiming(timingVar: string, timingValue: number) {
        this.isOpenAnalytics = Browser.window.openAnalytics
        if (Player.inst.isWeb && this.isOpenAnalytics && Browser.window.ga)
            Browser.window.ga('send', 'timing', 'game', timingVar, timingValue)
        if (!Player.inst.isWeb && this.isOpenAnalytics)
            AppManager.enterInvite({eventName: timingVar, eventValue: timingValue}, AppManager.nullFun)
    }

}