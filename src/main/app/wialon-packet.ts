
import { BinaryDataConverterService } from "./binary-data-converter"
import { OutgoingMessage } from "./outgoing-message"

type FieldNames = "PacketSize" | "UID" | "Time" | "Bitmask" | "BlockName" | "BlockType" | "BlockSize" | "StealthAttribute"
    | "BlockDataType" | "Longitude" | "Latitude" | "Altitude" | "Speed" | "Course" | "NumberOfSatellites"

export class WialonPacket {

    private packetSize: number
    private blockSize: number

    binaryData: Record<FieldNames, Uint8Array> & { [key: string]: Uint8Array } = {
        PacketSize: new Uint8Array,
        UID: new Uint8Array,
        Time: new Uint8Array(4),
        Bitmask: new Uint8Array([0, 0, 0, 1]),
        BlockType: new Uint8Array([0x0B, 0xBB]),
        BlockSize: new Uint8Array([0, 0, 0, 1]),
        StealthAttribute: new Uint8Array([1]),
        BlockDataType: new Uint8Array([2]),
        BlockName: BinaryDataConverterService.stringToZeroTerminatedASCII("posinfo"),
        Longitude: new Uint8Array(8),
        Latitude: new Uint8Array(8),
        Altitude: new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0x5A, 0x40]),
        Speed: new Uint8Array([0x00, 0x36]),
        Course: new Uint8Array([0x01, 0x46]),
        NumberOfSatellites: new Uint8Array([0x0B]),
    }

    constructor(message: OutgoingMessage, timeOffsetMs?:number) {
        this.binaryData.UID = BinaryDataConverterService.stringToZeroTerminatedASCII(message.device_uuid)
        this.binaryData.Time = BinaryDataConverterService.integerToUint8Array(message.getTimestamp(timeOffsetMs))
        this.binaryData.Longitude = new Uint8Array(new Float64Array([message.longitude]).buffer)
        this.binaryData.Latitude = new Uint8Array(new Float64Array([message.lattitude]).buffer)

        this.blockSize = BinaryDataConverterService.calculateTotalSize([
            this.binaryData.StealthAttribute,
            this.binaryData.BlockDataType,
            this.binaryData.BlockName,
            this.binaryData.Longitude,
            this.binaryData.Latitude,
            this.binaryData.Altitude,
            this.binaryData.Speed,
            this.binaryData.Course,
            this.binaryData.NumberOfSatellites,
        ])
        this.binaryData.BlockSize = BinaryDataConverterService.integerToBigEndianUint8Array(this.blockSize)

        this.packetSize = this.blockSize + BinaryDataConverterService.calculateTotalSize([
            this.binaryData.UID,
            this.binaryData.Time,
            this.binaryData.Bitmask,
            this.binaryData.BlockType,
            this.binaryData.BlockSize,
        ])
        this.binaryData.PacketSize = BinaryDataConverterService.integerToLittleEndianUint8Array(this.packetSize)
    }

    toUint8Array(): Uint8Array {

        const buffers = [
            this.binaryData.PacketSize,
            this.binaryData.UID,
            this.binaryData.Time,
            this.binaryData.Bitmask,
            this.binaryData.BlockType,
            this.binaryData.BlockSize,
            this.binaryData.StealthAttribute,
            this.binaryData.BlockDataType,
            this.binaryData.BlockName,
            this.binaryData.Longitude,
            this.binaryData.Latitude,
            this.binaryData.Altitude,
            this.binaryData.Speed,
            this.binaryData.Course,
            this.binaryData.NumberOfSatellites,
        ]

        const binaryMessage = new Uint8Array(BinaryDataConverterService.calculateTotalSize(buffers))

        let offset = 0
        buffers.forEach(buffer => {
            binaryMessage.set(buffer, offset)
            offset += buffer.length
        })

        return binaryMessage
    }

    toString(): string {
        return JSON.stringify(
            {
                sizes: {
                    packet: this.packetSize,
                    block: this.blockSize
                },
                PacketSize: this.binaryData.PacketSize.toString(),
                UID: this.binaryData.UID.toString(),
                Time: this.binaryData.Time.toString(),
                Bitmask: this.binaryData.Bitmask.toString(),
                BlockType: this.binaryData.BlockType.toString(),
                BlockSize: this.binaryData.BlockSize.toString(),
                StealthAttribute: this.binaryData.StealthAttribute.toString(),
                BlockDataType: this.binaryData.BlockDataType.toString(),
                BlockName: this.binaryData.BlockName.toString(),
                Longitude: this.binaryData.Longitude.toString(),
                Latitude: this.binaryData.Latitude.toString(),
                Altitude: this.binaryData.Altitude.toString(),
                Speed: this.binaryData.Speed.toString(),
                Course: this.binaryData.Course.toString(),
                NumberOfSatellites: this.binaryData.NumberOfSatellites.toString(),
            }
        )
    }
}
