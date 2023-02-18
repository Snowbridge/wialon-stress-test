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