#!/bin/bash

pushd $(dirname "${BASH_SOURCE[0]}")

if [ ! -z "$1" ]
  then
    docker context use $1
fi

docker compose -f docker-compose.yml -p mendel build
docker compose -f docker-compose.yml -p mendel up -d

if [ ! -z "$1" ]
  then
    docker context use default
fi

popd
