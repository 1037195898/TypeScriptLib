import Point = Laya.Point;

/**
 * 包装常用计算
 */
export class MathKit {

    /** 计算角度的公式  180 / Math.PI */
    static RAD_TO_DEG = 180 / Math.PI
    /** 计算弧度的公式  Math.PI / 180 */
    static DEG_TO_RAD = Math.PI / 180

    /**
     * 角度转弧度
     * @param angle 角度
     */
    static angleToRadians(angle) {
        return angle * MathKit.DEG_TO_RAD
    }

    /**
     * 弧度转角度
     * @param radians 弧度
     */
    static radiansToAngle(radians) {
        return radians * MathKit.RAD_TO_DEG
    }

    /**
     * 计算两点之间的角度角度
     * @param x1 原始坐标X
     * @param y1 原始坐标Y
     * @param x2 新坐标X
     * @param y2 新坐标Y
     *
     */
    static angle(x1: number, y1: number, x2: number, y2: number) {
        let newX = x2 - x1
        let newY = y2 - y1
        let a = Math.atan2(newY, newX)
        return a * 180 / Math.PI
    }

    /**
     * 获取圆旋转到指定位置的长度函数
     * @param count 圆拆分份数
     * @param index 奖品所在奖区
     * @param [minLoop=0] 最少圈数
     * @param [maxLoop=0] 最多圈数
     * @param [skew=-0.5] 第一个奖区起始点与0点位置的偏移比例
     * @param [offset=0.5] 指针所停位置离奖区边缘的比例
     *
     */
    static roundLong(count: number, index: number, minLoop = 0, maxLoop = 0, skew = -.5, offset = .5) {
        let loop = 0
        if (minLoop > 0 && maxLoop >= minLoop) {
            loop = 360 * (Math.floor(Math.random() * (maxLoop - minLoop)) + minLoop)//整圈长度
        }
        let _skew = (360 / count) * skew//第一个奖区起始点与0点位置的偏移量
        let _location = (360 / count) * index//目标奖区的起始点
        let _offset = Math.floor(Math.random() * (360 / count) * (1 - 2 * offset)) + (360 / count) * offset
        return loop + _skew + _location + _offset
    }

    /**
     * 获取滚动总长度
     * @param item 单个格子高度
     * @param count 转盘拆分份数
     * @param minLoop 最少圈数
     * @param maxLoop 最多圈数
     * @param location 奖品所在奖区
     * @return
     */
    static scrollLong(item: number, count: number, minLoop: number, maxLoop: number, location: number) {
        let totalLong = item * count
        let loop = totalLong * (Math.floor(Math.random() * (maxLoop - minLoop)) + minLoop) //整圈长度
        let _location = (totalLong / count) * location //目标奖区的起始点
        return loop + _location
    }

    /**
     * 计算两点之间的距离
     * @param x1 原始坐标X
     * @param y1 原始坐标Y
     * @param x2 新坐标X
     * @param y2 新坐标Y
     * @return
     *
     */
    static pointDistance(x1: number, y1: number, x2: number, y2: number) {
        let x = x1 - x2
        let y = y1 - y2
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    }

    /**
     * 获取两点中间点的坐标
     * @param x1 原始坐标X
     * @param y1 原始坐标Y
     * @param x2 新坐标X
     * @param y2 新坐标Y
     * @return
     */
    static getPointMiddle(x1: number, y1: number, x2: number, y2: number) {
        let tempX = (Math.max(x1, x2) - Math.min(x1, x2)) / 2
        let tempY = (Math.max(y1, y2) - Math.min(y1, y2)) / 2
        tempX += Math.min(x1, x2)
        tempY += Math.min(y1, y2)
        return new Point(tempX, tempY)
    }

    /**
     * 获取圆上一点的坐标，坐标起点从坐标系右下方向左计算
     * @param x 圆点X坐标
     * @param y 圆点Y坐标
     * @param radius 半径
     * @param radians 弧度(不是角度)
     */
    static roundPoint(x: number, y: number, radius: number, radians: number) {
        x = x + (Math.cos(radians) * radius)
        y = y + (Math.sin(radians) * radius)
        return new Laya.Point(x, y)
    }

    /**
     * 补全数字
     * @param data 要处理的数字、或字符串化的数字
     * @param len 数字总长度
     * @param isLast 是否补在尾部
     */
    static fillAVacancy(data: number | string, len: number, isLast = false) {
        let string = data + ""
        len = len - string.length
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                string = isLast ? string + "0" : "0" + string
            }
        }
        return string
    }

    /**
     * 精确小数点  如果有小数点 保留指定数量  如果没有  返回整数
     * @param value 要处理的数字、或字符串化的数字
     * @param p 保留的小数位数
     * @return
     */
    static toFixed(value: number | string, p = 0) {
        let temp = value + ""
        let index = temp.indexOf(".")
        if (index == -1) return parseInt(temp)
        p = p > 0 ? p + 1 : 0
        return parseFloat(temp.substring(0, index + p))
    }

    /**
     * 精确小数点  如果有小数点 保留指定数量  如果没有,添加指定保留的小数值
     * @param value 要处理的数字、或字符串化的数字
     * @param p 保留的小数位数
     */
    static toFixedStr(value: number | string, p = 0) {
        value = MathKit.toFixed(value, p)
        let money = value + ""
        let moneyStr = money.split('.')
        let left = moneyStr[0]
        if (p == 0) return left
        let right = moneyStr.length > 1 ? moneyStr[1] : null
        if (right) {
            if (right.length >= p) {
                right = '.' + right.substring(0, p)
            } else {
                right = '.' + MathKit.fillAVacancy(right, p, true)
            }
        } else {
            right = '.' + MathKit.fillAVacancy("0", p)
        }
        return left + right
    }

    /**
     * 字格式
     * @param value 数值
     * @param beyondLimit 超过此值否才分隔 (默认 1000)
     * @param limit 分隔值 按照此值分隔 (默认 1000)
     * @param unit 单位  (默认 K)
     * @param fixed 最后保留几位小数 (默认 2)
     * @return
     */
    static numberConvert(value: number, beyondLimit = 1000, limit = 1000, unit = "K", fixed = 2) {
        if (value >= beyondLimit)
            return this.toFixed(value / limit, fixed) + unit
        return this.toFixed(value, fixed) + ""
    }

    /**
     * 将100000转为100,000.00形式
     * @param money
     * @param fixed 是否保留小数(默认false)
     * @return
     */
    static formatMoney(money: string | number, fixed = false) {
        if (money) {
            money = money + ""
            let left = money.split('.')[0]
            let right = money.split('.')[1]
            right = right ? (right.length >= 2 ? '.' + right.substring(0, 2) : '.' + right + '0') : '.00'
            if (!fixed) right = ""
            let temp = left.split('').reverse().join('').match(/(\d{1,3})/g)
            return (parseFloat(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right
        } else if (money === 0) {   //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
            return fixed ? '0.00' : "0"
        } else {
            return fixed ? '0.00' : "0"
        }
    }

    /**
     * 将100,000.00转为100000形式
     * @param money
     * @param fixed 是否保留小数 (默认false)
     * @return
     */
    static formatMoney2(money: string | number, fixed = false) {
        if (money) {
            money = money + ""
            let group = money.split('.')
            let left = group[0].split(',').join('')
            return fixed ? parseFloat(left + "." + group[1]) : parseFloat(left)
        } else {
            return 0
        }
    }

    /**
     * 打乱数组
     * @param array 要被打乱的数组
     *
     */
    static shuffle(array: any[]) {
        let rnd: number
        let tmp: any
        let len = array.length
        for (let i = 0; i < len; i++) {
            tmp = array[i]
            rnd = parseInt(Math.random() * len + "")
            array[i] = array[rnd]
            array[rnd] = tmp
        }
    }

    /** aes加密 */
    static encrypt(word, key?: string) {
        if (key == null) key = "abcdefgabcdefg12"
        let keyWordArray = CryptoJS.enc.Utf8.parse(key)
        let srcs = CryptoJS.enc.Utf8.parse(word)
        let encrypted: any = CryptoJS.AES.encrypt(srcs, keyWordArray, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        })
        return encrypted.toString()
    }

    /** aes解密 */
    static decrypt(word, key?: string) {
        if (key == null) key = "abcdefgabcdefg12"
        let keyWordArray = CryptoJS.enc.Utf8.parse(key)
        let decrypt = CryptoJS.AES.decrypt(word, keyWordArray, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        })
        return CryptoJS.enc.Utf8.stringify(decrypt).toString()
    }

    /**
     * 文字长度省略
     * @param value 文字内容
     * @param len 最大长度
     * @param symbol 符号
     */
    static stringOmit(value: string, len: number, symbol = "...") {
        let str = value
        if (str && str.length > len) {
            str = str.substring(0, len)
            str += symbol
        }
        return str
    }

    /**
     * 去除重复值
     * @param array
     */
    static removeRepeat(array: any[]) {
        return array.filter(this.checkRepeat)
    }

    private static checkRepeat(item: any, index: number, arr: any[]) {
        return arr.indexOf(item) == index
    }

    /**
     * 交换数组中的两个值的位置
     * @param value 数组
     * @param stateIndex 要被切换掉的值
     * @param endIndex 要新切换到的位置 (该位置必须是总数组的长度-1)
     *
     */
    static swapValue(value: any[], stateIndex: number, endIndex: number) {
        if (stateIndex < value.length && endIndex < value.length) {
            let i: any = value[stateIndex]
            let i2: any = value[endIndex]
            value.splice(endIndex, 1, i)
            value.splice(stateIndex, 1, i2)
        }
    }

    /**
     * 改变值的位置(将数组中的一个值修改到其它位置)
     * @param value 数组
     * @param stateIndex 要被切换掉的值
     * @param endIndex 要新切换到的位置 (该位置必须是总数组的长度-1)
     *
     */
    static changeValue(value: any[], stateIndex: number, endIndex: number) {
        if (stateIndex < value.length && endIndex < value.length) {
            let i: any = value.splice(stateIndex, 1)
            value.splice(endIndex, 0, i[0])
        }
    }

    /**
     * 高度适配
     * @param obj 适配对象
     */
    static heightAdaptation(obj: fgui.GObject) {
        let scale = obj.width / obj.initWidth
        obj.height = obj.initHeight * scale
        // 如果有字体
    }

    /**
     * 从 nums数组中查找 大于value并且最接近value的数据信息
     * @param nums
     * @param value
     * @param equal
     */
    static getGreater(nums: number[], value: number, equal = true) {
        let index = -1
        let result = undefined
        for (let i = nums.length - 1; i >= 0; i--) {
            const num = nums[i]
            if (num > value || (equal && num === value)) {
                index = i
                result = num
            } else break
        }
        return {index, value: result}
    }

    /**
     * 从 nums数组中查找 小于value并且最接近value的数据信息
     * @param nums
     * @param value
     * @param equal
     */
    static getLess(nums: number[], value: number, equal = true) {
        let index = -1
        let result = undefined
        for (let i = nums.length - 1; i >= 0; i--) {
            const num = nums[i]
            if (num <= value) {
                if (num === value && !equal) continue
                index = i
                result = num
                break
            }
        }
        return {index, value: result}
    }

    static evil(fn) {
        //一个变量指向Function，防止有些前端编译工具报错
        return new Function('return ' + fn)()
    }

    /**
     * 添加动态代码
     * @param content javascript字符串代码
     * @param removeLast 添加后立马删除
     * @param sourceURL 是否添加映射文件名
     */
    static loadScript(content: string, removeLast = true, sourceURL?: string) {
        if (sourceURL) content += '\n//@ sourceURL=' + sourceURL
        let script = document.createElement('script')
        script.type = "text/javascript"
        script.text = content
        document.getElementsByTagName('head')[0].appendChild(script)
        removeLast && document.head.removeChild(document.head.lastChild)
    }

}

/**
 * @deprecated
 * @see MathKit
 */
export const Cast = MathKit