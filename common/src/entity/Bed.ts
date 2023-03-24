import { Entity, Column, ManyToOne } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Garden } from "./Garden";
import { Polygon } from "./geoJson";

@Entity()
export class Bed extends EntityBase {
  @Column("geometry", { spatialFeatureType: "Polygon" })
  shape!: Polygon;

  @Column("date")
  startDate!: Date;

  @Column("date", { nullable: true })
  endDate?: Date;

  @Column("integer")
  gardenId?: number;

  @ManyToOne(() => Garden, (garden) => garden.beds, {
    onDelete: "CASCADE",
  })
  garden?: Garden;
}
