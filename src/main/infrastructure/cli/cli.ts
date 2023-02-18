#!/usr/bin/env node
import yargs from 'yargs/yargs'
import * as fs from 'fs'
import { TraccarDeviceDTO } from '../../dto/traccar-dto';
import { GeoPointDTO } from '../../dto/geo-points-dto';

const DEFAULT_THREADS_NUMBER = 1

export const YARGS = yargs(process.argv.slice(2))
    .options({
        host: {
            type: 'string',
            default: process.env.HOST,
            demandOption: true,
            desc: 'Хост wialon-retranslator\'а. Дефолт берется из process.env.HOST',
        },
        port: {
            type: 'number',
            default: process.env.PORT,
            demandOption: true,
            desc: 'Порт wialon-retranslator\'а. Дефолт берется из process.env.PORT',
        },
        threads: {
            desc: 'Количество потоков, дефолт ' + DEFAULT_THREADS_NUMBER,
            type: 'number',
            default: DEFAULT_THREADS_NUMBER,
            demandOption: true
        },
        devices: {
            type: 'string',
            array: true,
            desc: [
                'Массив id устройств. Если передано имя существующего файла, то устройства вычитываются из него',
                'Формат файла - это ответ от GET https://traccar-host/api/devices'
            ].join('\n'),
            coerce: (devices: string[]) => {
                if (fs.existsSync(devices[0])) {
                    const data = JSON.parse(fs.readFileSync(devices[0]).toString()) as TraccarDeviceDTO[]
                    devices = data.map(it => it.id.toString())
                }



                if (devices.length == 0)
                    throw Error("Массив устройств пустой")

                if(typeof devices[0] == 'string')
                    return devices.map(it=>{return {id:it}}) // строго говоря, это жульничество, но хрен с ним

                return devices
            },
            demandOption: true
        },
        delay:{
            type:'number',
            desc:'Включить задержку в секундах между отправками пакетов в траккар',
            default: 0
        },
        points: {
            type: 'string',
            desc: [
                'Имя файла, в котором точки очки, по которым надо прогнать девайсы.',
                'Формат файла: JSON-массив объектов GeoPointDTO'
            ].join('\n'),
            coerce: (points: string) => {
                if (!fs.existsSync(points))
                    throw Error(`Файл ${points} не найден`)

                return JSON.parse(fs.readFileSync(points).toString()) as GeoPointDTO[]
            },
            demandOption: true
        }
    })
    .example('$0 --host traccar.gruzi.ru --port 5167 --devices 6661366613 --points ./data/points-short.json', 'Выполнит передачу на прод грузи толпу точек из ./data/points-short.json для девайса с id 6661366613')
    .strict()
    .wrap(140)