CLI-утилитка на ноде для тестовой отправки точек по протоколу [Wialon retranslator](http://extapi.wialon.com/hw/cfg/WialonRetranslator%201.0.pdf)


[[_TOC_]]


## Docker image

В репе есть докерфайл, который пакует всё в образ, избавляя вас от необходимости иметь установленную ноду правильной версии:

1. Склонировать репу `$ git clone`
2. Собрать образ `$ docker build -t wialon-stress-test .`
3. Run image `$ docker run wialon-stress-test ./build/index.js --host wialon.example.ru --port 5167 --devices 123456789 --points ./data/points-short.json`

NB! `--points ./data/points-short.json` - это файл внутри контейнера, а не локальный

## install locally

1. Склонировать репу `$ git clone`
2. Установить зависимости `$ npm install`
3. Скомпилировать в js `$ npm run rebuild`
4. Отправить точки `./build/index.js --host wialon.example.ru --port 5167 --devices 123456789 --points ./data/points-short.json`

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
