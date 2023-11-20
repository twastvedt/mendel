import type { Relation } from "typeorm";
import { Entity, Column, OneToMany } from "typeorm";
import type { BedLocal } from "./Bed.js";
import { Bed } from "./Bed.js";
import type { EntityLocal } from "./EntityBase.js";
import { EntityBase } from "./EntityBase.js";
import type { Point } from "./geoJson.js";
import type { PlanLocal } from "./Plan.js";
import { Plan } from "./Plan.js";

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
  beds!: Relation<Bed>[];

  @OneToMany(() => Plan, (plan) => plan.garden, {
    cascade: true,
  })
  plans!: Relation<Plan>[];
}
