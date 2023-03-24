import { Entity, Column, OneToMany } from "typeorm";
import { Bed, BedLocal } from "./Bed";
import { EntityBase, EntityLocal } from "./EntityBase";
import { Point } from "./geoJson";
import { Plan, PlanLocal } from "./Plan";

export type GardenLocal = EntityLocal<
  Garden,
  never,
  {
    plans: PlanLocal[];
    beds: BedLocal[];
  }
>;

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
