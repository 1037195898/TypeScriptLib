import SkeletonWindow = tsCore.SkeletonWindow;
import {BaseGameData} from "./BaseGameData";
import {Player} from "../Player";
import Log = tsCore.Log;

export class BaseSkeletonWindow<T extends BaseGameData = BaseGameData> extends SkeletonWindow {

    /**
     * 如果传入的 data.url 不带/符号  则自动转成 gameName/url.ends/data.url
     * @param data
     */
    protected override onInit(data?: ISkeletonData) {
        if (data?.url) {
            if (!data.url.includes("/")) {
                data.url = `${Player.inst.simpleName}/${data.url.endsWith(".sk") ? "sk" : "spine"}/${data.url}`
            }
        }
        super.onInit(data);
    }

    protected get gameData(): T {
        return Player.inst.gameData as T
    }

    /**
     * @deprecated
     */
    protected set gameData(value: T) {
        Log.debug(value)
    }

}