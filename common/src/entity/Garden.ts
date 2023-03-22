import { Entity, Column, OneToMany } from "typeorm";
import { Bed } from "./Bed";
import { EntityBase } from "./EntityBase";
import { Point } from "./geoJson";
import { Planting } from "./Planting";

@Entity()
export class Garden extends EntityBase {
  @Column("varchar")
  name!: string;

  @Column("geometry", { spatialFeatureType: "Point", srid: 4326 })
  location!: Point;

  @OneToMany(() => Bed, (bed) => bed.garden, {
    eager: true,
    cascade: true,
  })
  beds!: Bed[];

  @OneToMany(() => Planting, (planting) => planting.garden, {
    eager: true,
    cascade: true,
  })
  plantings!: Planting[];
}
