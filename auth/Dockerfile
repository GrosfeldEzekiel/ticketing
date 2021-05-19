FROM node:lts-alpine as packages

WORKDIR /app

COPY package*.json .

RUN npm install

## Stage two
FROM packages

COPY . ./

RUN npm run build

CMD ["npm", "start"]