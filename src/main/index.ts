#!/usr/bin/env node

import 'dotenv/config'
import { spawn, Worker } from 'threads'
import { WialonStressTest } from './app/stress-test'
import { GeoPointDTO } from './dto/geo-points-dto'
import { TraccarDeviceDTO } from './dto/traccar-dto'
import { YARGS } from "./infrastructure/cli/cli"
import { WialonClient } from './infrastructure/client/wialon'

(async () => {
    const options = await YARGS.parseAsync()
    if (options.threads == 1) {
        const client = new WialonClient(options.host||'localhost', Number(options.port||5167))
        const app = new WialonStressTest(client, options.devices as unknown as TraccarDeviceDTO[], options.points as unknown as GeoPointDTO[], options.delay)
        await app.run()
    } else {
        for (let i = 0; i < options.threads; i++) {
            const worker = await spawn(new Worker("./infrastructure/worker/appRunner"))
            await worker(
                options.host,
                options.port,
                options.devices,
                options.points,
                i
            )
        }
    }
})()
