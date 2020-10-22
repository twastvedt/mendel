import { Polygon } from "geojson";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}
