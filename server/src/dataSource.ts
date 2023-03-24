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
import { SeedData1603059702825 } from "./migration/1603059702825-SeedData";

export const dataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "mendel",
  password: "mendel",
  database: "mendel",
  synchronize: true,
  logging: false,
  entities: [Bed, Family, Garden, Plan, Plant, Planting, Variety],
  migrations: [SeedData1603059702825],
});
