import { Polygon } from "geojson";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Garden } from "./Garden";
import { Plant } from "./Plant";

@Entity()
export class Planting {
  @PrimaryGeneratedColumn()
  id!: number;

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

  @OneToMany(() => Plant, (plant) => plant.planting, {
    onDelete: "CASCADE",
  })
  plants!: Plant[];

  @ManyToOne(() => Garden, (garden) => garden.plantings)
  garden!: Garden;

  constructor() {
    this.areSeedlings = false;
  }
}
