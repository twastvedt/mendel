import { Polygon } from "geojson";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Garden } from "./Garden";

@Entity()
export class Bed {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("geometry", { spatialFeatureType: "Polygon", srid: 26915 })
  shape!: Polygon;

  @Column()
  startDate!: Date;

  @Column({ nullable: true })
  endDate?: Date;

  @ManyToOne(() => Garden, (garden) => garden.plants)
  garden!: Garden;
}
