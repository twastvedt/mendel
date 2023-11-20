import { Entity, Column, ManyToOne, type Relation } from "typeorm";
import { EntityBase, type EntityLocal } from "./EntityBase.js";
import { Garden, type GardenLocal } from "./Garden.js";
import type { Polygon } from "./geoJson.js";

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
  garden?: Relation<Garden>;
}
