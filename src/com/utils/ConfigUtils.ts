import {StringUtil} from "./StringUtil"
import {Player} from "../Player"

export class ConfigUtils {

    /**
     * 在window上配置的属性名字
     * @default gameIdConfig
     */
    static CONFIG_NAME = "gameIdConfig"

    /**
     * 获取游戏配置表
     */
    static gameConfig(): { [key: number]: string } {
        return window[ConfigUtils.CONFIG_NAME]
    }

    /**
     * 根据游戏id获取游戏名字 如果没有 null
     * @param code
     */
    static gameName(code: number) {
        const config = ConfigUtils.gameConfig()
        return config ? config[code] : null
    }

    /**
     * 根据游戏名获取游戏id 如果不存在返回-1
     * @param name
     */
    static gameCode(name: string) {
        const config = ConfigUtils.gameConfig()
        if (config) {
            for (const key in config) {
                if (StringUtil.trimAll(config[key]) == name) {
                    return parseInt(key)
                }
            }
        }
        return -1
    }

    /**
     * 获取游戏配置数据
     * @param name 游戏名字 如果传入null 将尝试获取当前打开的游戏数据
     */
    static gameRes(name: string = null): ResConfig {
        if (name == null && StringUtil.isNotEmpty(Player.inst.gameName)) {
            return ConfigUtils.gameRes(Player.inst.gameName)
        }
        if (name == null) return null
        return window[name]
    }

}