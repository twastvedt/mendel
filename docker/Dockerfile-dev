# -- DEV DOCKERFILE --
# -- DO NOT USE IN PRODUCTION! --

FROM node:16-alpine

RUN apk update && \
    apk add bash curl git make g++ nano openssh gnupg --no-cache && \
    mkdir -p /mendel && \
    npm install -g @vue/cli npm-check-updates

WORKDIR /mendel

USER node

ENV dockerdev 1

EXPOSE 3000

CMD ["tail", "-f", "/dev/null"]
