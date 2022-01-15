import { EntityNoId } from "@/api/BaseApi";
import type { Point } from "geojson";
import { Entity, Column, ManyToOne } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Garden } from "./Garden";
import { Planting } from "./Planting";
import { Variety } from "./Variety";

@Entity()
export class Plant extends EntityBase {
  @Column("geometry", { spatialFeatureType: "Point", srid: 26915 })
  location!: Point;

  @Column({ nullable: true })
  plantDate?: Date;

  @Column({ nullable: true })
  varietyId?: number;

  @ManyToOne(() => Variety, (variety) => variety.plants)
  variety?: Variety;

  @Column({ nullable: true })
  gardenId?: number;

  @ManyToOne(() => Garden, (garden) => garden.plants)
  garden?: Garden;

  @Column({ nullable: true })
  plantingId?: number;

  @ManyToOne(() => Planting, (planting) => planting.plants)
  planting?: Planting;

  static cleanCopy(oldPlant: EntityNoId<Plant>): EntityNoId<Plant> {
    const newPlant = new Plant();

    newPlant.location = oldPlant.location;
    newPlant.plantDate = oldPlant.plantDate;
    newPlant.plantingId = oldPlant.plantingId || oldPlant.planting?.id;
    newPlant.gardenId = oldPlant.gardenId || oldPlant.garden?.id;
    newPlant.varietyId = oldPlant.varietyId || oldPlant.variety?.id;

    return newPlant;
  }

  static copy(oldPlant: Plant): Plant {
    const newPlant = new Plant();

    Object.assign(newPlant, oldPlant);

    return newPlant;
  }
}
