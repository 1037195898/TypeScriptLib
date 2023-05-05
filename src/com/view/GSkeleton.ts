import Skeleton = Laya.Skeleton;
import Templet = Laya.Templet;


import GraphicsAni = Laya.GraphicsAni;
import Handler = Laya.Handler;
import Loader = Laya.Loader;
import Event = Laya.Event;
import Point = Laya.Point;
import Texture = Laya.Texture;
import HTMLImage = Laya.HTMLImage;
import UIPackage = fgui.UIPackage;
import BoneSlot = Laya.BoneSlot;
import TextureFormat = Laya.TextureFormat;
import KeyFramesContent = Laya.KeyFramesContent;
import {ISkeletonPlay} from "../interfaces/ICommon";
import {BaseSkeleton} from "../core/BaseSkeleton";

export class GSkeleton extends BaseSkeleton {

    /**
     * 骨骼更新
     * ````
     * GSkeleton cmd:DrawTextureCmd
     * GSpineSkeleton spine.Slot
     * ````
     */
    static readonly UPDATE_BONE_SLOT = "update_bone_slot"

    /** 是否使用混合模式 */
    isBlendModeAdd = false
    /** 使用混合模式的插槽 */
    blendBoneSlotNames: string[] = []
    /** 指定的骨骼忽略XY偏移量 */
    readonly clearBoneSlotOffset: string[] = []
    /** 指定的骨骼忽略X偏移量 */
    readonly clearBoneSlotOffsetX: string[] = []
    /** 指定的骨骼忽略Y偏移量 */
    readonly clearBoneSlotOffsetY: string[] = []
    aniMode = 0
    private _loadAniMode = 0
    /** 自定义缓存的Templet名字 */
    cacheName = ""

    constructor(aniMode = 0) {
        super()
        this.aniMode = aniMode
    }

    protected createDisplayObject() {
        // super.createDisplayObject()
        this._displayObject = new Skeleton(null, this.aniMode)
        this._displayObject["$owner"] = this
        this["_touchable"] = this._displayObject.mouseEnabled = this._displayObject.mouseThrough = false
        this._displayObject.on(Event.STOPPED, this, this.onPlayStopped)

        this._container = this._displayObject
    }

    get asSkeleton() {
        return this._displayObject as Skeleton
    }

    /**
     * 通过加载直接创建动画
     * @param    url        要加载的动画文件路径
     * @param    handler    加载完成的回调函数
     * @param    aniMode        与<code>Skeleton.init</code>的<code>aniMode</code>作用一致
     */
    load(url: string, handler: ParamHandler, aniMode = 0) {
        this.displayObject["_skinIndex"] = 0
        this.displayObject["_skinName"] = "default"
        this._aniPath = url
        this.asSkeleton["_aniPath"] = url
        this._complete = handler
        this._loadAniMode = aniMode
        const content = Loader.getRes(url)
        if (content == null) {
            Laya.loader.load([{url: url, type: Loader.BUFFER}], Handler.create(this, this._onLoaded))
        } else {
            this._onLoaded()
        }
        // (<Skeleton>this._displayObject).load(url, handler, aniMode)
    }

    /**
     * 加载完成
     */
    private _onLoaded() {
        const arraybuffer: ArrayBuffer = Loader.getRes(this._aniPath)
        if (arraybuffer == null) return
        if (Templet["TEMPLET_DICTIONARY"] == null) {
            Templet["TEMPLET_DICTIONARY"] = {}
        }
        let tFactory: Templet
        tFactory = Templet["TEMPLET_DICTIONARY"][this._aniPath + this.cacheName]
        if (tFactory) {
            if (tFactory.isParseFail) {
                this._parseFail()
            } else {
                if (tFactory.isParserComplete) {
                    this._parseComplete()
                } else {
                    tFactory.on(Event.COMPLETE, this, this._parseComplete)
                    tFactory.on(Event.ERROR, this, this._parseFail)
                }
            }

        } else {
            tFactory = new Templet()
            tFactory._setCreateURL(this._aniPath)
            Templet["TEMPLET_DICTIONARY"][this._aniPath + this.cacheName] = tFactory
            tFactory.on(Event.COMPLETE, this, this._parseComplete)
            tFactory.on(Event.ERROR, this, this._parseFail)
            tFactory.isParserComplete = false
            tFactory.parseData(null, arraybuffer)
        }
    }

    /**
     * 解析完成
     */
    private _parseComplete() {
        if (this.isDisposed) return
        const tTemple: Templet = Templet["TEMPLET_DICTIONARY"]?.[this._aniPath + this.cacheName]
        if (tTemple) {
            this.asSkeleton.init(tTemple, this._loadAniMode)
            // this.play(0, true)
        }
        runFun(this._complete, this)
    }

    /**
     * 解析失败
     */
    private _parseFail() {
        console.log("[Error]:" + this._aniPath + "解析失败")
    }

    /**
     * 延迟播放动画
     * @param    playDelay    延迟时间
     * @param    nameOrIndex    动画名字或者索引
     * @param    loop        是否循环播放
     * @param    force        false,如果要播的动画跟上一个相同就不生效,true,强制生效
     * @param    start        起始时间
     * @param    end            结束时间
     * @param    freshSkin    是否刷新皮肤数据
     *
     * @deprecated
     */
    playDelay(playDelay: number, nameOrIndex: string | number | (string | number)[] | ISkeletonPlay, loop: boolean, force = true, start = 0, end = 0, freshSkin = true) {
        if (this.asSkeleton.templet == null) return
        Laya.timer.once(playDelay, this, this.play, [nameOrIndex, loop, force, start, end, freshSkin])
    }

    /**
     * 通过名字显示一套皮肤
     * @param    name    皮肤的名字
     * @param    freshSlotIndex    是否将插槽纹理重置到初始化状态
     */
    showSkinByName(name: string, freshSlotIndex = true) {
        this.asSkeleton.showSkinByName(name, freshSlotIndex)
    }

    /**
     * 通过索引显示一套皮肤
     * @param    skinIndex    皮肤索引
     * @param    freshSlotIndex    是否将插槽纹理重置到初始化状态
     */
    showSkinByIndex(skinIndex: number, freshSlotIndex = true) {
        this.asSkeleton.showSkinByIndex(skinIndex, freshSlotIndex)
    }

    getAniIndexByName(name: string) {
        return this.asSkeleton.getAniIndexByName(name)
    }

    // AnimationContent
    getAnimation(aniIndex: number): AnimationContent {
        return this.asSkeleton.templet?.getAnimation(aniIndex)
    }

    getAnimDuration(aniIndex: number): number {
        return this.getAnimation(aniIndex).playTime
    }

    getAnimFrame(aniIndex: number): number {
        return this.getAnimation(aniIndex).totalKeyframeDatasLength
    }

    get currAniIndex(): number {
        return this.asSkeleton["_currAniIndex"]
    }

    /**
     * 根据动作名和插槽骨骼名,来获取该骨骼在该动作播放时,每一帧该骨骼坐标位置,返回所有帧数骨骼坐标位置组成的列表
     * @param nameOrIndex
     * @param boneName
     */
    getBoneCoords(nameOrIndex: string | number, boneName: string): number[] {
        return this.asSkeleton["getBoneCoords"](nameOrIndex, boneName)
    }

    getSlotXByName(name: string) {
        const slot = this.getBoneSlotByName(name)
        if (slot == null) return 0
        return slot.currDisplayData.transform.x
    }

    getSlotYByName(name: string) {
        const slot = this.getBoneSlotByName(name)
        if (slot == null) return 0
        return -slot.currDisplayData.transform.y
    }

    getSlotPointByName(name: string) {
        const slot = this.getBoneSlotByName(name)
        if (slot == null) return null
        return new Point(slot.currDisplayData.transform.x, -slot.currDisplayData.transform.y)
    }

    getBoneSlotByName(name: string) {
        let slot: BoneSlot = null
        if (this.asSkeleton.templet != null) {
            slot = this.asSkeleton.getSlotByName(name)
        }
        return slot
    }

    private static _emptyTexture: Texture
    static get emptyTexture() {
        if (GSkeleton._emptyTexture == null) GSkeleton._emptyTexture = Texture.create(HTMLImage.create(50, 50, TextureFormat.R8G8B8A8), 0, 0, 50, 50)
        return GSkeleton._emptyTexture
    }


    /**
     * 设置插槽的某个皮肤
     * @param slotName 插槽名字
     * @param skin Texture 或 fairygui 的路径  如：//package/skin
     */
    setSlotSkin(slotName: string, skin: Texture | string = GSkeleton.emptyTexture) {
        let texture = null
        if (skin != null && typeof skin === "string") {
            const packageItem = UIPackage.getItemByURL(skin)
            if (packageItem != null) {
                texture = packageItem.load() as Texture
            }
        } else {
            texture = skin
        }
        let slot = this.getBoneSlotByName(slotName)
        if (this.aniMode > 0) {
            this.asSkeleton.setSlotSkin(slotName, texture)
            return
        }
        slot = this.getBoneSlotByName(slotName)
        if (slot != null) {
            if (texture != null && texture != GSkeleton.emptyTexture) {
                slot.currDisplayData.width = texture.width
                slot.currDisplayData.height = texture.height
                slot.currDisplayData.transform.scY = -1
            }
            slot.currDisplayData.texture = texture
            slot.currTexture = texture
            this.clearCache()
        } else {
            console.warn("not found BoneSlot name = " + slotName)
        }
    }

    /**
     * 换装的时候，需要清一下缓冲区
     */
    private clearCache() {
        if (this.aniMode == 0) {
            const _graphicsCache: GraphicsAni[][] = this.asSkeleton.templet["_graphicsCache"]
            for (let i = 0, n = _graphicsCache.length; i < n; i++) {
                for (let j = 0, len = _graphicsCache[i].length; j < len; j++) {
                    let gp = _graphicsCache[i][j]
                    if (gp && gp != this.displayObject.graphics) {
                        GraphicsAni.recycle(gp)
                    }
                }
                _graphicsCache[i].length = 0
            }
        }
    }

    on(type: string, thisObject: any, listener: Function, args: any[] = null) {
        if (type == Event.STOPPED) {
            this.stoppedHandler.push(new Handler(thisObject, listener, args))
            return
        }
        super.on(type, thisObject, listener, args)
    }

    off(type: string, thisObject: any, listener: Function) {
        if (type == Event.STOPPED) {
            for (let i = this.stoppedHandler.length - 1; i > -1; i--) {
                const handler = this.stoppedHandler[i]
                if (handler.caller == thisObject && handler.method == listener) {
                    handler.clear()
                    this.stoppedHandler.splice(i, 1)
                }
            }
            return
        }
        super.off(type, thisObject, listener)
    }

    offAll(type: string = null) {
        if (type == Event.STOPPED) {
            this.stoppedHandler.length = 0
            return
        }
        this.displayObject.offAll(type)
    }

    getSkeletonPlay() {
        return this.skeletonPlay
    }

    dispose() {
        const obj = Templet["TEMPLET_DICTIONARY"]
        const tTemple: Templet = obj[this._aniPath + this.cacheName]
        if (tTemple) delete obj[this._aniPath + this.cacheName]
        // tTemple?.destroy()
        while (this.stoppedHandler.length) {
            this.stoppedHandler.shift().clear()
        }
        Laya.timer.clearAll(this)
        super.dispose()
    }

}

export class AnimationNodeContent {
    name: string
    parentIndex: number
    parent: AnimationNodeContent
    keyframeWidth: number
    lerpType: number
    interpolationMethod: any[]
    childs: any[]
    keyFrame: KeyFramesContent[];// = new Vector.<KeyFramesContent>
    playTime: number
    extenData: ArrayBuffer
    dataOffset: number
}

export class AnimationContent {
    nodes: AnimationNodeContent[]
    name: string
    /**
     * 播放时长
     */
    playTime: number
    bone3DMap: any
    totalKeyframeDatasLength: number
}