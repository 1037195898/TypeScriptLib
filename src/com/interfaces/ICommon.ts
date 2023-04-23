/**
 * 对话框修改显示数据
 */
export interface IPromptData {

    /** 按钮确定文案 */
    okName?: string
    /** 按钮取消文案 */
    cancelName?: string

}

/**
 * 资源加载数据
 */
export interface LoadRes {

    /** 加载地址 */
    url: string
    /**
     * 类型字符串
     * @see Laya.Loader.IMAGE
     */
    type?: string
    /** 强制加载 */
    forceLoad?: boolean
    /** 分支 */
    branch?: string

    //------------  Laya 的数据

    size?: number

    priority?: number

    useWorkerLoader?: boolean

    progress?: number

    group?: string

}

/**
 * 游戏资源配置
 */
export interface ResConfig {
    /** 加载的资源列表 */
    res: LoadRes[]
    /** 加载的js文件名字 */
    js: string
    /** 执行启动函数 */
    completeFun: Function
    /** 引导帮助文档 */
    couponHelp?: string[]
    /** 指引 */
    guide?: string[] | string
    /** 游戏赔率 */
    odds?: number[][] | any[][]
}

/**
 * 优惠券
 */
export interface Coupons {
    /** id */
    id: number
    /** 当前数量 */
    num: number
    /** 原总数量 */
    total_number: number
    /** 劵的面值 */
    faceValue: number
    /** 投注最低使用额度 */
    bet_limit: number
    /** 过期时间 */
    expire_time: number
    /** 1抵用券 2投注劵 */
    type: number
    /** 来源 */
    source?: number
    /** 支持的游戏 */
    games: number[]
    /** 是否正在使用 */
    isUse: boolean
}

export interface ISkeletonData {

    x?: number,
    y?: number,
    /** 关联对象 */
    relation?: ISKRelation,
    /** 播放数据 */
    play?: ISkeletonPlay,
    scaleX?: number,
    scaleY?: number,
    /** xy 公用的缩放值 */
    scale?: number,
    rot?

}

export interface ISkeletonPlay {
    /**
     * 播放某个动画
     * @default 0
     */
    nameOrIndex?: string | number | (string | number)[],
    /** 自动播放
     * @default true
     * */
    loop?: boolean,
    playComplete?: ParamHandler,
    loaderComplete?: ParamHandler,
    /**
     * 是否支持换皮  -1 不设置
     * @default -1
     */
    aniMode?: number
}

export interface ISKRelation {

    /** 上下左右关联对象 */
    target?: any,
    /** 左右关联对象 */
    lr?: any,
    /** 上下关联对象 */
    ud?: any
    /** 是否使用百分比关联  默认true */
    usePercent?: boolean,

}

export enum Method {GET = "get", POST = "post"}