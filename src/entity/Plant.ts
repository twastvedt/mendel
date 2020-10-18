import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Planting } from "./Planting";

@Entity()
export class Plant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ spatialFeatureType: "Point" })
  location!: string;

  @Column()
  plantDate?: Date;

  @ManyToOne(() => Planting, (planting) => planting.plants)
  planting?: Planting;
}
