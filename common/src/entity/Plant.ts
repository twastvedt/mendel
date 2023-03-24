import { Entity, Column, ManyToOne } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Point } from "./geoJson";
import { Planting } from "./Planting";

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

  static copy(oldPlant: Plant): Plant {
    return Object.assign({}, oldPlant);
  }

  static cleanCopy(oldPlant: Plant): Plant {
    const newPlant = Plant.copy(oldPlant);

    delete newPlant.planting;

    return newPlant;
  }
}
