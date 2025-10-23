Number.prototype.inRange = function(min: number, max: number, includeMin = false, includeMax = false): boolean {
    const value = this.valueOf();

    // 检查边界值是否有效
    if (min > max) {
        throw new Error('Minimum value cannot be greater than maximum value');
    }

    // 根据是否包含边界值进行判断
    const minCheck = includeMin ? value >= min : value > min;
    const maxCheck = includeMax ? value <= max : value < max;

    return minCheck && maxCheck;
}