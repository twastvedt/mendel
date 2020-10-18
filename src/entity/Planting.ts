import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Plant } from "./Plant";

@Entity()
export class Planting {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ spatialFeatureType: "Polygon" })
  shape!: string;

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

  @OneToMany(() => Plant, (plant) => plant.planting)
  plants!: Plant[];

  constructor() {
    this.areSeedlings = false;
  }
}
