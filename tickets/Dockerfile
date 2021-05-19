FROM node:lts-alpine as deps

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

FROM deps

COPY . .

RUN yarn run build

CMD ["yarn", "start"]