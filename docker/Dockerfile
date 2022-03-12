FROM node:16-alpine AS vue

RUN mkdir -p /app
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json tsconfig*.json .eslintrc.js ./ 
COPY client/package.json client/
COPY common/package.json common/

RUN npm ci

COPY common common/
COPY client client/

RUN npx -w common tsc -b && npm run -w client build


FROM node:16-alpine

RUN mkdir -p /app
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY server/package.json server/
COPY common/package.json common/

RUN npm ci

COPY . .

RUN rm -rf client && npx -w common tsc -b

COPY --from=vue /app/client/dist server/clientBuild

EXPOSE 8080

CMD ["npm", "start"]
