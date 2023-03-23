FROM node:16

WORKDIR /usr/src/wialon-stress-test

COPY . .

RUN npm install -g typescript
RUN npm install

RUN npm run rebuild