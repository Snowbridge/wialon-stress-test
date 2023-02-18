import { Socket } from "net"
import { Loggable } from "../logger/loggable"
export class WialonClient extends Loggable {
    private socket: Socket
    private port: number
    private host: string
    private status: "CONNECTED" | "DISCONNECTED" = "DISCONNECTED"
    private delay: number

    constructor(host: string, port: number, delay?: number) {
        super({ host: host, port: port })

        this.socket = new Socket()
        this.port = port
        this.host = host
        this.delay = delay || 0
        this.socket.on("error", (error: Error) => {
            this.logger.error("Wialon socket error", { error: error })
            this.socket.end()
            this.socket.destroy()
            throw Error("Wialon socket error")
        })
        this.socket.on("data", (data: Buffer) => {
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("Recieved data from socket", { data: data.toString() })
            }
        })
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.socket.once("connect", () => {
                this.status = "CONNECTED"
                this.logger.debug("Wialon connection established successfully")
                resolve(true)
            })
            this.socket.once("error", error => {
                this.logger.error("Unable to connect wialon retranslator endpoint", { error: error })
                reject(false)
            })
            this.socket.connect(this.port, this.host)
        })
    }

    async disconnect() {
        return new Promise((resolve) => {
            this.socket.end(() => {
                this.status = "DISCONNECTED"
                this.socket.end()
                this.socket.destroy()
                resolve(true)
            })
        })
    }

    async send(dataPacket: Buffer): Promise<boolean> {

        return new Promise((resolve, reject) => {

            this.socket.write(dataPacket, error => {
                this.socket.once("data", async (data: Buffer) => {

                    let logger = this.logger.info

                    await pause(this.delay) // я хз, почему, но в реализации траккара точка на карте не движется без задержки здесь минимум в 150мс

                    const isSuccessfull = data instanceof Buffer && data[0] == 0x11
                    if (!isSuccessfull)
                        logger = this.logger.error

                    logger("Recieved data from the wialon server", { data: data, buffer: data.toString("utf-8") })

                    resolve(isSuccessfull)
                })

                if (error) {
                    reject(error)
                }
            })
        })
    }

    getStatus() { return this.status }

}

async function pause(ms: number) {
    if (!ms)
        return

    return new Promise(resolve => {
        setTimeout(() => { resolve(ms) }, ms)
    })
}