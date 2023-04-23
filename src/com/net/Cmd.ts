/** 通信命令 */
export enum Cmd {

    /** 大厅socket房间号 */
    PROT_HOME = 999999,

    /** 聊天内容 */
    SOCKET_CHAT_MESSAGE = 1,
    /** 中奖信息公告 */
    SOCKET_WIN_INFO,
    /** 在线人数 */
    SOCKET_ROOM_MONEY_MESSAGE,
    /** 充值状态 */
    SOCKET_RECHARGE_STATUS,
    /** 余额变化 */
    SOCKET_MONEY_CHANGE = 1001,
    /** 黄金变化 */
    SOCKET_GOLD_CHANGE,
    /** 充值成功 */
    SOCKET_TOP_UP_CHANGE = 1004,
    /** 显示广播消息 */
    SOCKET_SHOW_NOTICE = 12


}