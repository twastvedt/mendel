import type { Polygon } from "geojson";
import { Entity, Column, ManyToOne } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Garden } from "./Garden";

@Entity()
export class Bed extends EntityBase {
  @Column("geometry", { spatialFeatureType: "Polygon", srid: 26915 })
  shape!: Polygon;

  @Column()
  startDate!: Date;

  @Column({ nullable: true })
  endDate?: Date;

  @ManyToOne(() => Garden, (garden) => garden.plants)
  garden!: Garden;
}
