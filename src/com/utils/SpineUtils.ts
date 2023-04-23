import Event = Laya.Event;
import Templet = Laya.Templet;
import Handler = Laya.Handler;
import {GSkeleton} from "../view/GSkeleton"
import {GSpineSkeleton} from "../view/GSpineSkeleton"
import {ISkeletonData} from "../interfaces/ICommon";

export class SpineUtils {

    /**
     * 对指定 skeleton 进行设置
     * @param skeleton
     * @param url
     * @param [nameOrIndex = 0] 播放名字或位置
     * @param [loop = true] 循环
     * @param playComplete
     * @param loaderComplete
     * @param aniMode
     */
    static playSpine(skeleton: GSkeleton | GSpineSkeleton, url: string, nameOrIndex: string | number | (string | number)[] = 0,
                       loop = true, playComplete?: ParamHandler, loaderComplete?: ParamHandler, aniMode = -1) {
        if (skeleton instanceof GSpineSkeleton) {
            this.createSpineSk(skeleton, url, nameOrIndex, loop, playComplete, loaderComplete)
            return
        }
        skeleton.offAll(Event.STOPPED)
        skeleton.on(Event.STOPPED, this, function (handler: ParamHandler) {
            runFun(handler)
        }, [playComplete])
        if (skeleton.asSkeleton.url == url && skeleton.asSkeleton.templet) {
            // loaderComplete && loaderComplete.run()
            SpineUtils.parseComplete(skeleton, nameOrIndex, loop, loaderComplete, null)
            return
        }
        if (aniMode == -1) aniMode = skeleton.aniMode
        // 界面显示了  在加载资源
        skeleton.load(url,
            Handler.create(this, SpineUtils.parseComplete, [skeleton, nameOrIndex, loop, loaderComplete]), aniMode)
    }

    private static parseComplete(skeleton: GSkeleton | GSpineSkeleton, nameOrIndex: string | number | (string | number)[], loop: boolean, loaderComplete: ParamHandler, fac?: Templet) {
        runFun(loaderComplete)
        if (skeleton == null || nameOrIndex == null || nameOrIndex < 0) return
        skeleton.play(nameOrIndex, loop)
    }


    static createSpineSk(spine: GSpineSkeleton, url: string, nameOrIndex: string | number | (string | number)[] = 0,
                         loop = true, playComplete?: ParamHandler, loaderComplete?: ParamHandler) {
        spine.offAll(Event.STOPPED)
        spine.on(Event.STOPPED, this, function (handler: ParamHandler) {
            runFun(handler)
        }, [playComplete])
        if (spine.aniPath == url && spine.asSkeleton != null) {
            // loaderComplete && loaderComplete.run()
            SpineUtils.parseComplete(spine, nameOrIndex, loop, loaderComplete)
            return
        }
        // 界面显示了  在加载资源
        spine.load(url,
            Handler.create(this, SpineUtils.parseComplete, [spine, nameOrIndex, loop, loaderComplete]))
    }

    /**
     * 创建spine 骨骼动画组件
     * @param url 根据传入的json 或 sk自动创建 GSpineSkeleton、GSkeleton
     * @param optional
     * @param SkeletonClass 指定一个类型 GSpineSkeleton、GSkeleton
     */
    static createSpine(url: string, optional?: ISkeletonData, SkeletonClass?: {
        new<T extends GSkeleton | GSpineSkeleton>()
    }) {

        optional ||= {}

        optional.x ??= 0
        optional.y ??= 0

        SkeletonClass ??= Laya.Utils.getFileExtension(url) === "json" ? GSpineSkeleton : GSkeleton

        const skeleton = new SkeletonClass()
        SpineUtils.playSpine(skeleton, url)

        optional.scaleX ??= skeleton.scaleX
        optional.scaleY ??= skeleton.scaleY

        if (optional.scale) optional.scaleX = optional.scaleY = optional.scale

        skeleton.setScale(optional.scaleX, optional.scaleY)
        skeleton.setXY(optional.x, optional.y)



        if (optional.relation) {
            let relation = optional.relation
            relation.usePercent ??= true
            relation.lr = relation.ud = relation.target
            relation.lr && skeleton.addRelation(relation.lr, fgui.RelationType.Center_Center, relation.usePercent)
            relation.ud && skeleton.addRelation(relation.ud, fgui.RelationType.Middle_Middle, relation.usePercent)
        }
        return skeleton
    }


}