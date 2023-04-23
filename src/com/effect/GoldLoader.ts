import GLoader = fgui.GLoader;
import Point = Laya.Point;
import LoaderFillType = fgui.LoaderFillType;

/**
 * 具有贝塞尔曲线运动的loader
 */
export class GoldLoader extends GLoader {

    /** 经过时间 */
    private _t = 0
    private p1: Point
    private p2: Point
    private p3: Point
    private p4: Point

    constructor() {
        super()
        this.fill = LoaderFillType.Scale
        this.setPivot(.5, .5)
    }

    get t(): number {
        return this._t
    }

    set t(value: number) {
        this._t = value
        this.setXY(this.getX(), this.getY())
    }

    getX() {
        return Math.pow((1 - this._t), 3) * this.p1.x
            + 3 * this.p2.x * this._t * (1 - this._t) * (1 - this._t)
            + 3 * this.p3.x * this._t * this._t * (1 - this._t)
            + this.p4.x * Math.pow(this._t, 3)
    }

    getY() {
        return Math.pow((1 - this._t), 3) * this.p1.y
            + 3 * this.p2.y * this._t * (1 - this._t) * (1 - this._t)
            + 3 * this.p3.y * this._t * this._t * (1 - this._t)
            + this.p4.y * Math.pow(this._t, 3)
    }

    setStartPoint(tempX: number, tempY: number) {
        this.p1 = new Point(tempX, tempY)
        this._t = 0
    }

    setMiddlePoint(tempX: number, tempY: number) {
        this.p2 = new Point(tempX, tempY)
        this.p3 = this.p2
    }

    setEndPoint(tempX: number, tempY: number) {
        this.p4 = new Point(tempX, tempY)
    }


}