import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import { features } from "./SeedBeds.json";
import { Bed } from "../entity/Bed";
import { Variety } from "../entity/Variety";
import { Polygon } from "geojson";
import { Type } from "../entity/Type";

export class SeedData1603059702825 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await getRepository(Bed).save(
      features
        .filter((f) => f.geometry.type === "Polygon")
        .map((f) => ({
          shape: f.geometry as Polygon,
          startDate: new Date(2019, 5, 15),
        }))
    );

    const tomato = new Type(
      "Tomato",
      "#ff4518",
      `<svg viewBox="0 0 512 640"><path d="M256.05 143.15a18.55 18.55 0 0018.58-18.46c.05-21.21 2.6-49.88 13.27-75.87a18.57 18.57 0 10-34.35-14.1c-12.94 31.52-16 65.25-16.07 89.86a18.55 18.55 0 0018.57 18.57z"/><path d="M323.7 129.48c20.53-17 30.55-27.37 63.22-42.87 0 0-63-1.8-111.42 17.33-.61 7.4-.86 14.41-.87 20.75a18.58 18.58 0 01-37.15-.11c0-5.63.19-11.74.6-18.19a449.42 449.42 0 01-80.54-44.69s5.83 41.54 24.78 67.05c-66.73.93-117.33-13-117.33-13 38.27 44 101.28 59.18 144.9 64.28-7 28.79-26.11 57.28-26.11 57.28 54.79-7.18 86-33.47 102-52.58 52.85 1.46 116.46-11.45 140.59-55.19-.02.02-46.98 12.05-102.67-.06z"/><path d="M409.54 150.48c-30.13 27-80.55 35.47-123.78 34.27-15.93 19.11-47.19 45.4-102 52.58 0 0 19.14-28.49 26.11-57.28-30.11-3.52-69.45-11.83-103.53-31.12-57.95 23.26-95.29 66.31-95.29 139 0 124.58 109.7 200.89 245 200.89s245-76.31 245-200.89c.02-71.11-35.7-113.84-91.51-137.45z"/></svg>`
    );
    const cherry = new Type(
      "Cherry Tomato",
      "#ff4518",
      `<svg viewBox="0 0 100 125"><path d="M53.959 21.958l1.26-4.023-4.68 3.476a26.407 26.407 0 00-2.432-.116c-.878 0-1.745.045-2.601.129l-4.696-3.337 1.313 3.901c-11.613 2.71-20.266 13.12-20.266 25.558 0 14.497 11.753 26.25 26.25 26.25s26.25-11.753 26.25-26.25c0-12.486-8.719-22.927-20.398-25.588z"/><path d="M56.53 67.604a21.7 21.7 0 01-2.805.946M61.261 64.91a22.081 22.081 0 007.008-8.818"/><path d="M59.816 31.593l-8.905.094-2.662 8.498-2.842-8.44-8.905.094 7.149-5.311-2.841-8.44 7.26 5.158 7.149-5.31-2.663 8.498z"/></svg>`
    );

    await getRepository(Type).save([tomato, cherry]);

    await getRepository(Variety).save([
      new Variety("Cherokee Purple", "#98082f", tomato),
      new Variety("Yellow Pear", "#fadc17", cherry),
      new Variety("Black Krum", "#6c0521", cherry),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // TODO: delete seed data?
  }
}
