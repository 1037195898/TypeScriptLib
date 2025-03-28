export class ResUtils {

    static matchReg = /\{(\d+,\d+)}/

    static parseRes(urls: (string | { url: string })[]) {
        let len = urls.length
        for (let i = 0; i < len; i++) {
            const value = urls[i]
            const isStr = typeof value === "string"
            let url = isStr ? value : value.url
            let matchArray = url.match(ResUtils.matchReg)
            if (matchArray?.length == 2) {
                let nums = matchArray[1].split(",")
                if (nums?.length == 2) {
                    urls.splice(i, 1)
                    i--
                    len--
                    let start = tsCore.StringUtil.getNumbers(nums[0])
                    let end = tsCore.StringUtil.getNumbers(nums[1]) + 1
                    for (let j = start; j < end; j++) {
                        const newUrl = url.replace(ResUtils.matchReg, j + "")
                        if (isStr) {
                            urls.push(newUrl)
                        } else {
                            const newValue = Object.create(value)
                            newValue.url = newUrl
                            urls.push(newValue)
                        }
                    }
                }
            }
        }
        return urls
    }


}