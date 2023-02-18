
const THE_BEGINNING = new Date("January 1, 1970")
export class OutgoingMessage {
    contractor_uuid: string
    order_uuid: string
    device_uuid: string
    time: Date
    longitude: number
    lattitude: number
    constructor(message:OutgoingMessage) {
        this.contractor_uuid = message.contractor_uuid
        this.order_uuid = message.order_uuid
        this.device_uuid = message.device_uuid
        this.time = new Date(message.time)
        this.longitude = Number(message.longitude)
        this.lattitude = Number(message.lattitude)
    }

    /**
     * количество миллисекунд между this.time и началом времен
     */
    getTimestamp(timeOffsetMs?: number) {
        const t = new Date(this.time)
        t.setMilliseconds(0)
        const numberOfMilliseconds = t.getTime() - THE_BEGINNING.getTime() + (timeOffsetMs || 0)
        return Math.round(numberOfMilliseconds / 1000)
    }
}