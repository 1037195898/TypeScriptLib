import SoundManager = Laya.SoundManager
import Sound = Laya.Sound
import URL = Laya.URL

export class SoundUtils {


    /** 需要立即播放的 */
    private static autoPlay: string[] = []
    /** 加载资源 */
    private static loadAsset: LoadRes[] = []

    private static bgMusicLoop = 0
    private static bgVolume = 1
    private static bgComplete: Laya.Handler
    private static bgStartTime = 0

    static addRes(res: LoadRes[]) {
        SoundManager.autoReleaseSound = false
        SoundUtils.loadAsset = res
    }

    static load(url: string = null) {
        Laya.loader.load(url == null ? SoundUtils.loadAsset : url, Laya.Handler.create(null, SoundUtils.onLoader))
    }

    private static onLoader() {
        for (let i = 0; i < SoundUtils.autoPlay.length; i++) {
            let url = SoundUtils.autoPlay[i]
            SoundUtils.playMusic(url, SoundUtils.bgMusicLoop, SoundUtils.bgComplete, SoundUtils.bgVolume, SoundUtils.bgStartTime)
            console.log("auto play = " + url)
        }
        SoundUtils.autoPlay.length = 0
    }

    /**
     *
     * @param url
     * @param loops
     * @param complete
     * @param volume
     * @param startTime
     * @param coverBefore 如果正在播放指定的音乐  是否覆盖 默认 false
     * @return
     */
    static playMusic(url: string, loops = 0, complete?: Laya.Handler, volume = -1, startTime = 0, coverBefore = false) {
        if (SoundManager["_bgMusic"] == URL.formatURL(url) && !coverBefore) return null
        let sound: Sound = Laya.loader.getRes(url)
        SoundUtils.bgMusicLoop = loops
        SoundUtils.bgVolume = volume
        SoundUtils.bgComplete = complete
        SoundUtils.bgStartTime = startTime
        if (sound != null) {
            let channel = SoundManager.playMusic(url, loops, complete, startTime)
            if (!channel) return null
            if (volume > -1) channel.volume = volume
            return channel
        } else {
            console.log("sound not load " + url)
            if (SoundUtils.autoPlay.indexOf(url) == -1) SoundUtils.autoPlay.push(url)
            const index = SoundUtils.loadAsset.findIndex(function (value: LoadRes) {
                return value.url == url
            })
            if (index < 0) {
                SoundUtils.load(url)
            }
        }
        return null
    }

    static playSound(url: string, loops = 1, complete?: Laya.Handler, volume = 1, startTime = 0) {
        let sound: Sound = Laya.loader.getRes(url)
        if (sound != null) {
            let channel = SoundManager.playSound(url, loops, complete, null, startTime)
            if (!channel) return null
            if (volume > -1) channel.volume = volume
            return channel
        } else {
            let index = SoundUtils.loadAsset.findIndex(function (value: LoadRes) {
                return value.url == url
            })
            if (index < 0) {
                SoundUtils.load(url)
            }
            console.log("sound not load " + url)
        }
        return null
    }

    static clear() {
        SoundUtils.autoPlay.length = 0
        while (SoundUtils.loadAsset.length > 0) {
            let loadRes = SoundUtils.loadAsset.shift()
            Laya.loader.cancelLoadByUrl(loadRes.url)
            SoundManager.destroySound(loadRes.url)
        }
        console.log("clear sound")
        SoundUtils.loadAsset.length = 0
    }

    static stopSound(url: string) {
        SoundManager.stopSound(url)
    }

    /**
     * 停止播放所有音效（不包括背景音乐）。
     */
    static stopAllSound() {
        SoundManager.stopAllSound()
    }

    /**
     * 停止播放所有声音（包括背景音乐和音效）。
     */
    static stopAll() {
        SoundManager.stopAll()
    }

    /**
     * 停止播放背景音乐（不包括音效）。
     */
    static stopMusic() {
        SoundManager.stopMusic()
    }

}