import GraphicsAni = Laya.GraphicsAni
import {GSkeleton} from "./GSkeleton"

export class GGraphicsAni extends GraphicsAni {

    boneSlotName = ""

    static create() {
        // 这里处理缓存动画
        let rs: GGraphicsAni = GraphicsAni["_caches"].pop()
        return rs || new GGraphicsAni()
    }

    drawTexture(texture: Laya.Texture | null, x?: number, y?: number, width?: number, height?: number, matrix?: Laya.Matrix | null, alpha?: number, color?: string | null, blendMode?: string | null, uv?: number[]): Laya.DrawTextureCmd | null {
        if (this["_sp"] != null && blendMode == null && this["_sp"]["$owner"] != null && this["_sp"]["$owner"] instanceof GSkeleton) {
            let skeleton: GSkeleton = this["_sp"]["$owner"]
            if (skeleton.isBlendModeAdd) {
                // blendMode = BlendMode.ADD
                blendMode = "add"
            }
        }
        return super.drawTexture(texture, x, y, width, height, matrix, alpha, color, blendMode, uv)
    }

    clear(recoverCmds = true) {
        super.clear(recoverCmds)
        this.boneSlotName = ""
    }

}