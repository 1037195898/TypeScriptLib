/** 公用信息处理 */
export enum CommonCmd {

    // 游戏id
    /** 游戏首页 */
    GAME_HOME = 999999,
    /** 水果 */
    GAME_FRUIT = 1,
    /** 大转盘 */
    GAME_WHEEL = 2,
    /** 百家乐 低倍 */
    GAME_LOW_BACCARAT = 30,
    /** 百家乐 高倍 */
    GAME_HIGH_BACCARAT = 3,
    /** 单机水果 低倍 */
    GAME_ALONE_LOW_FRUIT = 1001,
    /** 单机水果 高倍 */
    GAME_ALONE_HIGH_FRUIT = 1002,
    /** 刮刮奖 */
    GAME_SCRATCHER = 1003,
    /** 单机大转盘 低倍 */
    GAME_ALONE_LOW_WHEEL = 2001,
    /** 单机大转盘 高倍 */
    GAME_ALONE_HIGH_WHEEL = 2002,
    /** 翻牌机 */
    GAME_FACE_UP = 3001,
    /** 单机轮盘 */
    GAME_ALONE_ROULETTE = 3002,
    /** 动物园 */
    GAME_ZOO = 3003,
    /** 轮盘 */
    GAME_ROULETTE = 3005,
    /** 百家乐单机版 */
    GAME_ALONE_BACCARAT = 3006,
    /** 翻牌机单机版 */
    GAME_ALONE_FACEUP = 3007,
    /** 49游戏 */
    GAME_FOUR_NINE = 3008,
    /** 捕鱼游戏 */
    GAME_FISHING = 3009,
    /** 足球老虎机 */
    GAME_FOOTBALL_SLOT_MACHINES = 3010,


    /** 体育足彩 */
    GAME_SPORTS = 10000,
    /** 虚拟体育 */
    GAME_VIRTUAL_SPORTS = 10001,

    /** 游客模式玩游戏到达最大值 提示玩真钱 */
    GUEST_MAX_PLAY_COUNT = 15,
    /** web端玩游戏到达最大值 提示下载app */
    WEB_MAX_PLAY_COUNT = 100,

    /** 水果机最大下注值 */
    FRUIT_MAX_BET = 1000,
    /** 大转盘最大下注值 */
    WHEEL_MAX_BET = 1000,
    /** 百家乐最大下注值 */
    BACCARAT_MAX_BET = 5000,
    /** 动物园最大下注值 */
    ZOO_MAX_BET = 1000,


    // 开奖
    /** 大满贯  全部中大的（除苹果核BAR）*/
    GRAND_SLAM = 1,
    /** 大火车   5节火车*/
    MAX_CHOOCHOO = 2,
    /** 小火车   3节火车*/
    MIN_CHOOCHOO = 3,
    /** 大三元   中三个大结果*/
    DA_SAN_YUAN = 4,
    /** 小满贯  全部中小的（除苹果核BAR）*/
    LITTLE_SLAM = 5,
    /** 小三元 */
    XIAO_SAN_YUAN = 6,
    /** 大四喜  中四个苹果*/
    DA_SI_XI = 7,
    /** 随机送灯  随机反弹一个结果*/
    RANDOM = 8,


    // 金币模式
    /** 金币 */
    GAME_MONEY_TYPE_COINS = 2,
    /** 赠送金 */
    GAME_MONEY_TYPE_GIFT = 3,

}