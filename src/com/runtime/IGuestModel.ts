/**
 * 游戏模式
 */
export interface IGuestModel {

    /** 游客id */
    guestUID: number
    /** 游客模式玩次数 */
    guestPlayCount

    /** 清除数据  */
    clearData()

    /**
     * post请求 返回数据  可以在这里对返回数据进行修改
     * @param url 访问网址
     * @param data 押注额度
     */
    playAdd(url: string, data: any)

}