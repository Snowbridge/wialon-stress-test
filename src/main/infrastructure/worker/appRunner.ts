import { expose } from "threads"
import { WialonStressTest } from "../../app/stress-test";
import { GeoPointDTO } from "../../dto/geo-points-dto";
import { TraccarDeviceDTO } from "../../dto/traccar-dto";
import { WialonClient } from "../client/wialon";


expose(function run(
  host: string,
  port: number,
  devices: TraccarDeviceDTO[],
  points: GeoPointDTO[],
  delay:number,
  threadNumber: number
) {
  const client = new WialonClient(host, port)
  const test = new WialonStressTest(client, devices, points, delay)
  test.assignTraceId(`thread: ${threadNumber}`)
  test.run()
})