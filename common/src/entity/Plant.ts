import { Entity, Column, ManyToOne } from "typeorm";
import { EntityBase, EntityLocal } from "./EntityBase";
import { Point } from "./geoJson";
import { Planting, PlantingLocal } from "./Planting";

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
  planting?: Planting;

  static localCopy(plant: Plant | PlantLocal): PlantLocal {
    const newPlant: PlantLocal = Object.assign({}, plant);

    delete newPlant.planting;

    return newPlant;
  }
}
