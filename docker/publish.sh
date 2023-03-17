docker context use rock64
docker compose -f docker/docker-compose.yml -p mendel build
docker compose -f docker/docker-compose.yml -p mendel up -d
docker context use default