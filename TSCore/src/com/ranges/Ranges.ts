export class Range {

    /** An empty range of values of type Int. */
    static EMPTY = new Range(1, 0)

    readonly start: number
    readonly endInclusive: number

    constructor(start: number, endInclusive: number) {
        this.start = start
        this.endInclusive = endInclusive
    }

    contains(value: number) {
        return this.start <= value && value <= this.endInclusive
    }

    /**
     * 检查范围是否为空。
     *
     * 如果范围的起始值大于结束值，则该范围为空。
     */
    isEmpty() {
        return this.start > this.endInclusive
    }

    toArray(): number[] {
        const arr = []
        for (let i = this.start; i <= this.endInclusive; i++) {
            arr[i] = i
        }
        return arr
    }

}
