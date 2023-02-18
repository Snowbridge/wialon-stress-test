export class BinaryDataConverterService {

    static integerToBigEndianUint8Array(n: number) {
        return new Uint8Array(new Uint32Array([n]).buffer).reverse()
    }
    
    static integerToLittleEndianUint8Array(n: number) {
        return new Uint8Array(new Uint32Array([n]).buffer)
    }

    static integerToUint8Array(num: number) {
        if (!num)
            return new Uint8Array(0)
        const a = []
        a.unshift(num & 255)
        while (num >= 256) {
            num = num >>> 8
            a.unshift(num & 255)
        }
        return new Uint8Array(a)
    }

    static stringToZeroTerminatedASCII(str: string) {
        const arr = new Uint8Array(str.length + 1)
        str
            .split("")
            .forEach((char, index) => {
                arr[index] = char.charCodeAt(0)
            })
        return arr
    }

    static calculateTotalSize(blocks: Uint8Array[]): number {
        return blocks.reduce((size, cur) => {
            size += cur.length
            return size
        }, 0)
    }
}