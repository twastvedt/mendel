import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import { features } from "./SeedBeds.json";
import { Bed } from "../entity/Bed";

export class SeedBeds1603059702825 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await getRepository(Bed).save(
      features.map((f) => ({
        shape: JSON.stringify(f),
        startDate: new Date(2019, 5, 15),
      }))
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // TODO: delete seed data?
  }
}
