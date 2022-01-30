import { Entity, Column, ManyToOne } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Garden } from "./Garden";
import { Polygon } from "./geoJson";

@Entity()
export class Bed extends EntityBase {
  @Column("geometry", { spatialFeatureType: "Polygon" })
  shape!: Polygon;

  @Column()
  startDate!: Date;

  @Column({ nullable: true })
  endDate?: Date;

  @ManyToOne(() => Garden, (garden) => garden.plants)
  garden!: Garden;
}
