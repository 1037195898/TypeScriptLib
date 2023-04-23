import {Player} from "../Player"

export class LanguageUtils {

    private static _instance: LanguageUtils

    static get inst(): LanguageUtils {
        if (!LanguageUtils._instance)
            LanguageUtils._instance = new LanguageUtils()
        return LanguageUtils._instance
    }

    /** 语言配置文件 */
    protected xml: XMLDocument
    /**
     * 自定义需要转换的特殊符号 <br/>
     *
     * @example
     * customConvert = (content:string) => {
     *      return content
     * }
     * <br/>默认 {unit} 会转换成货币单位 Player.inst.getCurrencyUnit
     */
    customConvert: (content: string) => string

    setXml(xml: XMLDocument) {
        this.xml = xml
    }

    /**
     * 返回对应的语言
     * @see LibStr
     * @param str key
     */
    getStr(str: number | string) {
        if (typeof (str) !== "string") {
            str = str + ""
        }
        if (!this.xml) return str
        let element = this.xml.getElementById(str)
        if (element != null) {
            return this.__getStr(element)
        }
        let elements = this.xml.getElementsByName(str)
        if (elements.length > 0) {
            if (elements.length > 1)
                throw new Error("Language configuration has duplicate items：" + str)
            return this.__getStr(elements.item(0))
        }
        return str
    }

    private __getStr(element: Element) {
        let content = element.textContent
        if (this.customConvert) content = runFun(this.customConvert, content)
        // 这里统一处理货币转换
        content = content.replace(/\{unit}/g, Player.inst.getCurrencyUnit())
        return content
    }

}