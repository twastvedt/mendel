module.exports = {
  type: "postgres",
  host: "db",
  port: 5432,
  username: "mendel",
  password: "mendel",
  database: "mendel",
  synchronize: true,
  logging: false,
  entities: [__dirname + "/common/**/entity/*{.ts,.js}"],
  migrations: [__dirname + "/server/src/migration/*.ts"],
  subscribers: [__dirname + "/server/src/subscriber/*.ts"],
  cli: {
    entitiesDir: "common/src/entity",
    migrationsDir: "server/src/migration",
    subscribersDir: "server/src/subscriber",
  },
};
