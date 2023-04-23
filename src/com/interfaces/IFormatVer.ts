export interface IFormatVer {

    /**
     * 调用自定义的方法
     * @param url 原始请求地址
     * @param version 从版本控制中获取的版本号 可能为空
     * @return 返回处理后的版本号
     */
    call(url: string, version): string

}