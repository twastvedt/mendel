import { Entity, Column, OneToMany } from "typeorm";
import { Bed } from "./Bed";
import { EntityBase } from "./EntityBase";
import { Point } from "./geoJson";
import { Plan } from "./Plan";

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

  @OneToMany(() => Plan, (plan) => plan.garden, {
    cascade: true,
  })
  plans!: Plan[];
}
