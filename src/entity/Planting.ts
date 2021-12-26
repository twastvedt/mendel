import type { Polygon } from "geojson";
import { Entity, Column, OneToMany, ManyToOne } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Garden } from "./Garden";
import { Plant } from "./Plant";
import { Variety } from "./Variety";

@Entity()
export class Planting extends EntityBase {
  @Column("geometry", { spatialFeatureType: "Polygon", srid: 26915 })
  shape!: Polygon;

  @Column()
  plantDate!: Date;

  @Column()
  quantity?: number;

  @Column()
  areSeedlings: boolean;

  @Column()
  germinationRank?: number;

  @Column()
  growthRank?: number;

  @Column()
  healthRank?: number;

  @Column()
  yeildRank?: number;

  @ManyToOne(() => Variety, (variety) => variety.plantings)
  variety!: Variety;

  @OneToMany(() => Plant, (plant) => plant.planting, {
    onDelete: "CASCADE",
  })
  plants!: Plant[];

  @ManyToOne(() => Garden, (garden) => garden.plantings)
  garden!: Garden;

  constructor() {
    super();

    this.areSeedlings = false;
  }
}
