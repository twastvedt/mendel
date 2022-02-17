import { Entity, Column, ManyToOne } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Garden } from "./Garden";
import { Point } from "./geoJson";
import { Planting } from "./Planting";
import { Variety } from "./Variety";

@Entity()
export class Plant extends EntityBase {
  @Column("geometry", { spatialFeatureType: "Point" })
  location!: Point;

  @Column({ nullable: true })
  plantDate?: Date;

  @Column({ nullable: true })
  varietyId?: number;

  @ManyToOne(() => Variety, (variety) => variety.plants)
  variety?: Variety;

  @Column({ nullable: true })
  gardenId?: number;

  @ManyToOne(() => Garden, (garden) => garden.plants, {
    onDelete: "CASCADE",
  })
  garden?: Garden;

  @Column({ nullable: true })
  plantingId?: number;

  @ManyToOne(() => Planting, (planting) => planting.plants, {
    onDelete: "CASCADE",
  })
  planting?: Planting;

  static cleanCopy(oldPlant: Plant): Plant {
    const newPlant = Object.assign({}, oldPlant);

    delete newPlant.variety;
    delete newPlant.garden;
    delete newPlant.planting;

    return newPlant;
  }
}
