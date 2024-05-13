
export class ResUtils {

    static parseRes(urls: string[]) {

        for (let i = 0; i < urls.length; i++) {
            const value = urls[i]
            let matchArray = value.match(/\{(\d+,\d+)}/)
            if (matchArray?.length == 2) {
                let nums = matchArray[1].split(",")
                if (nums?.length == 2) {
                    urls.splice(i, 1)
                    i--
                    let start = tsCore.StringUtil.getNumbers(nums[0])
                    let end = tsCore.StringUtil.getNumbers(nums[1]) + 1
                    for (let j = start; j < end; j++) {
                        const newValue = value.replace(/\{(\d+,\d+)}/, j + "")
                        urls.push(newValue)
                    }
                }
            }
        }

    }


















}