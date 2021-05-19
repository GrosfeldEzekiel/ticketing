FROM node:lts-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

#Should change, for production to run npm build and then npm run dev
#RUN npm run build
#CMD ["npm", "start"]
CMD ["npm", "run", "dev"]