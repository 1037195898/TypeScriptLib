export class MyDrawTextureCmd extends Laya.DrawTextureCmd {

    /** 骨骼名字
     * @default null */
    name: string


    recover() {
        this.colorFlt = null; // 自己修改的 Laya Bug
        super.recover()
    }

}