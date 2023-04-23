import Browser = Laya.Browser
import {BaseSocket} from "../core/BaseSocket"
import {GameSocket} from "./GameSocket"
import {StringUtil} from "../utils/StringUtil"

/** socket管理 */
export class SocketManager extends BaseSocket {

    private static _instance: SocketManager

    static get inst(): SocketManager {
        if (this._instance == null) this._instance = new SocketManager()
        return this._instance
    }

    /** 当前连接的房间号 */
    private _roomId: number
    /** 接受到的消息 */
    private receiveData = []

    private _client: GameSocket
    public static SocketClass = GameSocket

    constructor() {
        super()
    }

    /**
     * 链接服务器socket
     * @param roomId 房间号
     * @param token token
     * @param userId 用户id 默认 110
     * @param url 连接地址 如果不存在 会使用 window.socketUrl
     */
    connect(roomId: number, token: string, userId = 110, url?: string) {
        if (this.isConnect) {
            close()
        }
        this.isConnect = true
        if (StringUtil.isEmpty(url)) {
            url = Browser.window.socketUrl
        }
        this._roomId = roomId
        let obj = {
            auth: {rid: this._roomId, uid: userId},
            notify: this.onMessageReveived.bind(this),
            url: url,
            token: token
        }

        // GameSocket.SOCKET_CLASS_PATH = "com.casino.GameSocket"
        GameSocket.SOCKET_CLASS_PATH = null

        // 初始化IM客户端库
        this._client = new SocketManager.SocketClass(obj)
        Laya.timer.loop(200, this, this.sendData)
    }

    private sendData() {
        if (this.receiveData.length > 0 && this.isConnect) {
            let data: any
            let len = this.receiveData.length
            for (let i = 0; i < len; i++) {
                data = this.receiveData.shift()
                let msg = data.message
                let roomId: number = msg.roomId
                let obj = msg.data
                let type = msg.type
                this.sendEventManager(type, obj)
            }
        }
    }

    /** 关闭链接 */
    close() {
        console.log("close socket")
        Laya.timer.clear(this, this.sendData)
        this._roomId = -1
        if (this._client) this._client.alive = false
        if (this._client) this._client.close()
        this._client = null
        this.receiveData.splice(0, this.receiveData.length)
        super.close()
    }

    /** 服务器发来消息 */
    onMessageReveived(data: any) {
        if (!this.isConnect) {
            return
        }
        this.receiveData.push(data)
    }

    closeHandler(msg: any = null) {
        if (this._client) this._client.closeHandler(msg)
    }

    messageHandler(evt) {
        if (this._client) this._client.messageHandler(evt)
    }

    errorHandler(e) {
        if (this._client) this._client.errorHandler(e)
    }

    openHandler() {
        if (this._client) this._client.openHandler()
    }

    get roomId() {
        return this._roomId
    }

    test(value: string) {
        if (typeof value == "string") {
            console.log("string=" + JSON.stringify(value))
        } else {
            console.log("json=" + JSON.stringify(value))
        }
    }

}