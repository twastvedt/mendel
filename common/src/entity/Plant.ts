import type { Relation } from "typeorm";
import { Entity, Column, ManyToOne } from "typeorm";
import type { EntityLocal } from "./EntityBase.js";
import { EntityBase } from "./EntityBase.js";
import type { Point } from "./geoJson.js";
import type { PlantingLocal } from "./Planting.js";
import { Planting } from "./Planting.js";

export type PlantLocal = EntityLocal<
  Plant,
  "plantingId",
  { planting?: PlantingLocal }
>;

@Entity()
export class Plant extends EntityBase {
  @Column("geometry", { nullable: true, spatialFeatureType: "Point" })
  location!: Point;

  @Column("integer")
  plantingId!: number;

  @ManyToOne(() => Planting, (planting) => planting.plants, {
    onDelete: "CASCADE",
  })
  planting?: Relation<Planting>;

  static localCopy(plant: Plant | PlantLocal): PlantLocal {
    const newPlant: PlantLocal = Object.assign({}, plant);

    delete newPlant.planting;

    return newPlant;
  }
}
