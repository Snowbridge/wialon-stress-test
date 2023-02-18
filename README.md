CLI-утилитка на ноде для тестовой отправки точек по протоколу [Wialon retranslator](http://extapi.wialon.com/hw/cfg/WialonRetranslator%201.0.pdf)


[[_TOC_]]


## install

1. `$ git pull`
2. `$ npm install`
3. `$ npm run rebuild`

В `.env` можно сложить переменные
```bash
HOST
PORT
DEFAULT_THREADS_NUMBER
```
чтобы не задавать их в параметрах

## Usage

`$ ./build/index.js --help` - справка с примерами

Пример:

```bash
# Передать точки из файла points-short.json для девайса 1472757845338
$ ./build/index.js --host wialon.example.ru --port 5167 --devices 1472757845338 --points ./data/points-short.json

# Передать точки из файла points.json для всех девайсов из фала devices.json в пять потоков
$ ./build/index.js --host wialon.example.ru --port 5167 --devices ./data/devices.json --points ./data/points.json --threads 5
```


## Also

Если инсталлить глобально `$ npm install --global`, то вызывать потом можно просто по имени `$ wialon-stress-test --help`
