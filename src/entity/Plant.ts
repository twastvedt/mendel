import { Point } from "geojson";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Garden } from "./Garden";
import { Planting } from "./Planting";

@Entity()
export class Plant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("geometry", { spatialFeatureType: "Point", srid: 26915 })
  location!: Point;

  @Column()
  plantDate?: Date;

  @ManyToOne(() => Garden, (garden) => garden.plants)
  garden!: Garden;

  @ManyToOne(() => Planting, (planting) => planting.plants)
  planting?: Planting;
}
