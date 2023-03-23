/**
 * устройства хранятся в формате Traccar API
 * это в действительности не имеет собого значения, но, если интересно, см https://traccar.org
 **/ 
export interface TraccarDeviceDTO{   
        id: number
        attributes: any
        groupId: number
        name: string
        uniqueId: string
        status: "online"|"offline"
        lastUpdate: Date
        positionId: number
        phone: string
        model: string
        contact: string
        category?: string
        disabled: boolean
        expirationTime?: Date 
}