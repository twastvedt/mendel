import { DataSource } from "typeorm";
import {
  Bed,
  Family,
  Garden,
  Plan,
  Plant,
  Planting,
  Variety,
} from "@mendel/common";
import { SeedData1603059702825 } from "./migration/1603059702825-SeedData.js";

let dataSource: DataSource;

export function getDataSource() {
  dataSource ??= new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? "5432"),
    username: "mendel",
    password: "mendel",
    database: "mendel",
    synchronize: true,
    logging: false,
    entities: [Bed, Family, Garden, Plan, Plant, Planting, Variety],
    migrations: [SeedData1603059702825],
  });

  return dataSource;
}
