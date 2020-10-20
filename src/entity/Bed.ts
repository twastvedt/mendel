import { Polygon } from "geojson";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Model } from "./Model";

@Entity()
export class Bed implements Model {
  endpoint = "bed";

  @PrimaryGeneratedColumn()
  id!: number;

  @Column("geometry", { spatialFeatureType: "Polygon", srid: 26915 })
  shape!: Polygon;

  @Column()
  startDate!: Date;

  @Column({ nullable: true })
  endDate?: Date;
}
