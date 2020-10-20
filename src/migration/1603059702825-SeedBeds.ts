import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import { features } from "./SeedBeds.json";
import { Bed } from "../entity/Bed";
import { Polygon } from "geojson";

export class SeedBeds1603059702825 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await getRepository(Bed).save(
      features
        .filter((f) => f.geometry.type === "Polygon")
        .map((f) => ({
          shape: f.geometry as Polygon,
          startDate: new Date(2019, 5, 15),
        }))
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // TODO: delete seed data?
  }
}
