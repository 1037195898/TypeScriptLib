import {Environment, EnvType} from "./ConfigKit";

export enum LogLevel {
    ALL,
    /**
     * 跟踪
     */
    TRACE,
    DEBUG,
    INFO,
    WARN,
    ERROR,
    /**
     * 致命错误
     */
    FATAL,
    OFF
}

/**
 * 定义日志格式
 */
export class Log {

    /**
     * @default LogLevel.ALL
     */
    static level = LogLevel.ALL
    static MAX_HISTORY = 3000
    static history: { level: number, data: any[] }[] = []

    static trace(...value) {
        Log.append({level: LogLevel.TRACE, data: value})
        if (Environment.active === EnvType.PROD || Log.level > LogLevel.TRACE) return
        // Log._log(value)
        console.trace.apply(window, value)
    }

    static debug(...value) {
        Log.append({level: LogLevel.DEBUG, data: value})
        if (Environment.active === EnvType.PROD || Log.level > LogLevel.DEBUG) return
        Log._log(value)
    }

    static info(...value) {
        Log.append({level: LogLevel.INFO, data: value})
        if (Log.level > LogLevel.INFO) return
        Log._log(value)
    }

    static warn(...value) {
        Log.append({level: LogLevel.INFO, data: value})
        if (Log.level > LogLevel.WARN) return
        console.warn.apply(window, value)
    }

    static error(...value) {
        Log.append({level: LogLevel.ERROR, data: value})
        if (Log.level > LogLevel.ERROR) return
        console.error.apply(window, value)
    }

    static fatal(...value) {
        Log.append({level: LogLevel.FATAL, data: value})
        if (Log.level > LogLevel.FATAL) return
        console.error.apply(window, value)
    }

    private static _log(value: any[]) {
        console.log.apply(window, value)
    }

    /**
     * @internal
     */
    static log() {
        const logs = Log.history.concat()
        for (const value of logs) {
            switch (value.level) {
                case LogLevel.TRACE:
                    console.trace.apply(window, value.data)
                    break
                case LogLevel.WARN:
                    console.warn.apply(window, value.data)
                    break
                case LogLevel.FATAL:
                case LogLevel.ERROR:
                    console.error.apply(window, value.data)
                    break
                case LogLevel.DEBUG:
                case LogLevel.INFO:
                    console.log.apply(window, value.data)
                    break
            }
        }
    }

    private static append(data: { data: any[]; level: LogLevel }) {
        Log.history.push(data)
        if (Log.history.length > Log.MAX_HISTORY + 500) {
            Log.history.splice(0, 500)
        }
    }

}