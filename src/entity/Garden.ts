import { Entity, Column, OneToMany } from "typeorm";
import { Bed } from "./Bed";
import { EntityBase } from "./EntityBase";
import { Point } from "./geoJson";
import { Plant } from "./Plant";
import { Planting } from "./Planting";

@Entity()
export class Garden extends EntityBase {
  @Column()
  name!: string;

  @Column("geometry", { spatialFeatureType: "Point", srid: 4326 })
  location!: Point;

  @OneToMany(() => Bed, (bed) => bed.garden, {
    eager: true,
  })
  beds!: Bed[];

  @OneToMany(() => Plant, (plant) => plant.garden, {
    eager: true,
  })
  plants!: Plant[];

  @OneToMany(() => Planting, (planting) => planting.garden, {
    eager: true,
  })
  plantings!: Planting[];
}
