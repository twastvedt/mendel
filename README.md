# Mendel

## To Do

- remove family color
- add content and styling to details pane
- delaunay not picking up plants from previous session when adding new plant of same family
- Icon display in family edit view

## Development

Run `npm dev`.

If the database schema changes without a migration, the database will need to be recreated to match the new schema. The server will do this on start if there's no schema present in the database. To clear out the current database schema, recreate the database container (run inside `dev` folder):
`docker compose up db --force-recreate -V -d`
and then restart the server.
