import Browser = Laya.Browser
import Render = Laya.Render
import {AppManager} from "../manager/AppManager"
import {SceneManager} from "../manager/SceneManager"
import {Player} from "../Player"

export class JSUtils {

    /**
     * 刷新页面  如果有父页面  刷新父页面
     */
    static reloadAll() {
        if (Browser.window.parent) {
            Browser.window.parent.location.reload()
        } else {
            Browser.window.location.reload()
        }
    }

    /** 刷新 */
    static reload() {
        Browser.window.location.reload()
    }

    /** 进入登录界面 */
    static login() {
        JSUtils.openPage("/login")
    }

    /** 充值 */
    static deposit() {
        JSUtils.openPage("/deposit")
    }

    /** 进入刮刮卡 */
    static jackpot() {
        JSUtils.openPage("/jackpot")
    }

    /** 打开指定的web页面 不关闭游戏的前提下 */
    static openWebPageWithoutLeaveGame(value: string) {
        JSUtils.openPage(value, false)
    }

    /** 关闭游戏
     * @param [type = 0]  0 默认直接退出  1 退出切换到新游戏
     * @param [data = null]
     * */
    static gameClose(type = 0, data = null) {
        SceneManager.inst.initComplete = false
        SceneManager.inst.isLoaderResComplete = false
        if (Browser.window.parent.GameToHall) {
            Browser.window.parent.GameToHall.gameClose(type, data)
        } else {
            if (!Render.isConchApp && Browser.window.location.protocol == "https:") {
                // 如果不是加速器 并且不是在非https下  那么直接返回大厅
                // Browser.window.location.href = Player.HOME_URL
                Browser.window.location.href = "//" + Browser.window.location.host
            }
        }
        AppManager.showWeb({javascript: `window.GameToHall.gameClose(${type}, ${data})`})
        SceneManager.inst.closeGame()
    }

    /** 弹窗 */
    static openModal(value: string) {
        Browser.window.parent?.GameToHall?.openModal?.(value)
        AppManager.showWeb({javascript: `window.GameToHall.openModal('${value}')`})
    }

    /**
     * 打开一个原生页面
     * @param page 页面 如： "/giftPage?token=***"
     * @param [isCloseGame=true] 是否关闭游戏
     */
    static openPage(page: string, isCloseGame = true) {
        if (isCloseGame) {
            Browser.window.parent?.GameToHall?.comeWebPage?.(page)
            AppManager.showWeb({javascript: `window.GameToHall.comeWebPage('${page}')`})
            SceneManager.inst.closeGame()
        } else {
            Browser.window.parent?.GameToHall?.openWebPageWithoutLeaveGame?.(page)
            AppManager.showWeb({javascript: `window.GameToHall.openWebPageWithoutLeaveGame('${page}')`})
        }
    }

    /** 进入游戏进度条 */
    static progress(value: number) {
        Browser.window.parent?.GameToHall?.progress?.(value)
        Browser.window.parent?.GameToHall?.getProgress?.(value)
        AppManager.executionJavascript("window.GameToHall.getProgress", value)
    }

    static getProgress = JSUtils.progress

    /** 通知进入游戏了 */
    static gameOnload() {
        Browser.window.parent?.GameToHall?.gameOnload?.()
        AppManager.executionJavascript("window.GameToHall.gameOnload", null)
    }

    /**
     * 通知服务器直接离开的房间
     */
    static outGameHttp() {
        Browser.window.parent?.GameToHall?.outGameHttp?.(Player.inst.urlParam.roomId)
    }

    /**
     * 分析邀请
     * @param type 1 开  2 关
     */
    static shareDetail(type: number) {
        Browser.window.parent?.GameToHall?.shareDetail?.(Player.inst.gameModel, type)
    }

    /** 上传头像 */
    static uploadAvatar() {
        Browser.window.parent?.GameToHall?.uploadAvatar?.()
        Browser.window.parent?.GameToHall?.openReviseAvatarNickNameDrawer?.()
        AppManager.showWeb({javascript: "window.GameToHall.openReviseAvatarNickNameDrawer()"})
    }

    static updateHead = JSUtils.uploadAvatar

}
