# Mendel

## Development

Run `npm dev`.

If the database schema changes without a migration, the database will need to be recreated to match the new schema. The server will do this on start if there's no schema present in the database. To clear out the current database schema, recreate the database container (run inside `dev` folder):
`docker compose up db --force-recreate -V -d`
and then restart the server.

## Deployment

Deploy to Docker locally by running the docker/publish.sh script. Add an argument of the Docker context to deploy to a remote instance. E.g. `./docker/publish.sh remoteContext`.
