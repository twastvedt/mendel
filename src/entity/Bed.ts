import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Model } from "./Model";

@Entity()
export class Bed implements Model {
  endpoint = "bed";

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ spatialFeatureType: "Polygon" })
  shape!: string;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;
}
