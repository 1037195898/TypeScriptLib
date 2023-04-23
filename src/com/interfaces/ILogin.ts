/**
 * 登录接口
 */
export interface ILogin {

    /** 使用Token登录 并获取用户数据 */
    loginToken(callback: ParamHandler)

}