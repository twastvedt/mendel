import { Entity, Column, ManyToOne } from "typeorm";
import { EntityBase, EntityLocal } from "./EntityBase";
import { Garden, GardenLocal } from "./Garden";
import { Polygon } from "./geoJson";

export type BedLocal = EntityLocal<Bed, "gardenId", { garden?: GardenLocal }>;

@Entity()
export class Bed extends EntityBase {
  @Column("geometry", { spatialFeatureType: "Polygon" })
  shape!: Polygon;

  @Column("date")
  startDate!: Date;

  @Column("date", { nullable: true })
  endDate?: Date;

  @Column("integer")
  gardenId!: number;

  @ManyToOne(() => Garden, (garden) => garden.beds, {
    onDelete: "CASCADE",
  })
  garden?: Garden;
}
