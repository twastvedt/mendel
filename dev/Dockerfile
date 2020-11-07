# -- DEV DOCKERFILE --
# -- DO NOT USE IN PRODUCTION! --

FROM node:14-alpine

RUN apk update && \
    apk add bash curl git python make g++ nano openssh gnupg --no-cache && \
    mkdir -p /mendel && \
    npm install -g @vue/cli

WORKDIR /mendel

ENV dockerdev 1

EXPOSE 3000

CMD ["tail", "-f", "/dev/null"]
