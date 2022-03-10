FROM node:16-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json . 

RUN npm install

COPY . .

RUN npm run client-build &&\
    cp src/client/dist src/server/clientBuild

EXPOSE 8080

CMD ["npm", "start"]
