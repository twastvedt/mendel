FROM node:16-alpine AS vue

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json . 
COPY client/package.json client/
COPY common/package.json common/

RUN npm ci

COPY common .
COPY client .

RUN ls -l

RUN npm run -w client build


FROM node:16-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json . 
COPY server/package.json server/
COPY common/package.json common/

RUN npm ci

COPY common .
COPY server .

COPY --from=vue /app/client/dist server/clientBuild

EXPOSE 8080

CMD ["npm", "start"]
