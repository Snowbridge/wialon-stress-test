import { Axios, AxiosRequestConfig } from "axios"
import winston from "winston"
import { ILoggable, isLogLevelDebug, newLogger } from "../logger/loggable"

export class BaseAxiosClient extends Axios implements ILoggable {

    protected logger: winston.Logger

    constructor(config?: AxiosRequestConfig) {
        super(config)

        this.logger = newLogger({
            logger: this.constructor.name
        })

        if (!this.defaults.transformResponse)
            this.defaults.transformResponse = [this.transformResponse]

        if (!this.defaults.transformRequest)
            this.defaults.transformRequest = [this.transformRequest]

        if (!this.defaults.validateStatus)
            this.defaults.validateStatus = (status) => {
                return status < 400
            }

    }
    isLogLevelDebug(): boolean {
        return isLogLevelDebug()
    }

    private transformResponse(data: any): any {
        try {
            if (data)
                return JSON.parse(data)
        } catch (e) {
            this.logger.warn({ message: "Unexpected response data format", data: data, error: e })
        }
        return data
    }

    private transformRequest(data: any): any {
        if (data && "object" == typeof data)
            return JSON.stringify(data)
        return data
    }

    assignTraceId(traceId: string) {
        this.logger.defaultMeta.traceId = traceId
    }
}

export function isHttpCode2xx(code: number): boolean {
    return code >= 200 && code < 300
}

export function isHttpCode4xx(code: number): boolean {
    return code >= 400 && code < 500
}