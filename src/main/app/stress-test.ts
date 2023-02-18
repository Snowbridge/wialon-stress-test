import { GeoPointDTO } from "../dto/geo-points-dto"
import { TraccarDeviceDTO } from "../dto/traccar-dto"
import { Loggable } from "../infrastructure/logger/loggable"
import { WialonClient } from "../infrastructure/client/wialon"
import { OutgoingMessage } from "./outgoing-message"
import { WialonPacket } from "./wialon-packet"

export class WialonStressTest extends Loggable {

    private client: WialonClient
    private devices: TraccarDeviceDTO[]
    private points: GeoPointDTO[]
    private delay: number

    constructor(client: WialonClient, devices: TraccarDeviceDTO[], points: GeoPointDTO[], delay = 0) {
        super()
        this.client = client
        this.devices = devices
        this.points = points
        this.delay = delay
    }

    async run() {


        for (const device of this.devices) {
            await this.client.connect()
            this.logger.info(`Device ${device.id} at ${new Date()}`)
            for (const point of this.points) {
                const message = new OutgoingMessage({
                    contractor_uuid: "519b6516-32ed-4144-b915-c266f4072bf2",
                    order_uuid: "015ab792-45f4-4b32-877f-70aa13c3ac28",
                    device_uuid: `${device.id}`,
                    time: new Date(),
                    longitude: Number(point.lon),
                    lattitude: Number(point.lat)
                } as OutgoingMessage)

                const wialonDataPacket = new WialonPacket(message)
                const buffer = Buffer.from(wialonDataPacket.toUint8Array())
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const result = await this.client.send(buffer)
            }
            await this.client.disconnect()
            await sleep(this.delay)
        }

    }
}

function sleep(delay: number): Promise<void> {
    return new Promise((res, rej) => {
        if(delay == 0)
            return res(undefined)
            
        setTimeout(() => {
            return res(undefined)
        }, delay * 1000)
    })
}