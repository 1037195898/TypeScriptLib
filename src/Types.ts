
window["runFun"] = (func?: ParamHandler, ...args) => {
    if (func != null) return func instanceof Laya.Handler ? func.runWith(args) : func.apply(null, args)
    return null
}
