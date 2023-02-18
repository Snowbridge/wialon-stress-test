import winston from "winston"
import { v4 as uuid } from "uuid"

export abstract class Loggable implements ILoggable {
    protected logger: winston.Logger

    constructor(labels?: unknown) {
        this.logger = newLogger(
            Object.assign(
                {
                    logger: this.constructor.name
                },
                labels
            )
        )
    }

    assignTraceId(traceId: string) {
        this.logger.defaultMeta.traceId = traceId
    }

    isLogLevelDebug(): boolean {
        return isLogLevelDebug()
    }
}

export interface ILoggable {
    assignTraceId(traceId: string): void
    isLogLevelDebug(): boolean
}

export function newLogger(labels?: unknown) {
    return winston.createLogger({
        level: winston.level,
        format: winston.format.timestamp(),
        defaultMeta: Object.assign(
            {
                service: "wialon-stress-test",
                traceId: uuid().split("-")[4]
            },
            labels
        ),
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.json(),
                    winston.format.timestamp()
                )
            }),
        ],
    })
}

export function logLevel(level?: string): string {
    if (level)
        winston.level = level.trim().toLowerCase()

    return winston.level.toLowerCase()
}

export function isLogLevelDebug(): boolean {
    return logLevel() == "debug"
}