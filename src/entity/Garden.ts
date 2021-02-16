import { Point } from "geojson";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Bed } from "./Bed";
import { Plant } from "./Plant";
import { Planting } from "./Planting";

@Entity()
export class Garden {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column("geometry", { spatialFeatureType: "Point", srid: 4326 })
  location!: Point;

  @OneToMany(() => Bed, (bed) => bed.garden, {
    onDelete: "CASCADE",
  })
  beds!: Bed[];

  @OneToMany(() => Plant, (plant) => plant.garden, {
    onDelete: "CASCADE",
  })
  plants!: Plant[];

  @OneToMany(() => Planting, (planting) => planting.garden, {
    onDelete: "CASCADE",
  })
  plantings!: Planting[];
}
