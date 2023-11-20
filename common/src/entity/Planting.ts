import type { Relation } from "typeorm";
import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import type { EntityLocal } from "./EntityBase.js";
import { EntityBase } from "./EntityBase.js";
import type { LineString } from "./geoJson.js";
import type { PlanLocal } from "./Plan.js";
import { Plan } from "./Plan.js";
import type { PlantLocal } from "./Plant.js";
import { Plant } from "./Plant.js";
import type { VarietyLocal } from "./Variety.js";
import { Variety } from "./Variety.js";

export type PlantingLocal = EntityLocal<
  Planting,
  "varietyId" | "planId" | "areSeedlings",
  { variety?: VarietyLocal; plan?: PlanLocal; plants: PlantLocal[] }
>;

@Entity()
export class Planting extends EntityBase {
  @Column("geometry", {
    nullable: true,
    spatialFeatureType: "LineString",
  })
  shape?: LineString;

  /**
   * Is the line represented by `shape` (if present) an area?
   */
  @Column("boolean", { nullable: true })
  isArea?: boolean;

  @Column("date", { nullable: true })
  plantDate?: Date;

  @Column("boolean", { default: false })
  areSeedlings = false;

  @Column("integer", { nullable: true })
  germinationRank?: number;

  @Column("integer", { nullable: true })
  growthRank?: number;

  @Column("integer", { nullable: true })
  healthRank?: number;

  @Column("integer", { nullable: true })
  yeildRank?: number;

  @Column("integer")
  varietyId!: number;

  @ManyToOne(() => Variety, (variety) => variety.plantings)
  variety?: Relation<Variety>;

  @Column("integer")
  planId!: number;

  @ManyToOne(() => Plan, (plan) => plan.plantings, {
    onDelete: "CASCADE",
  })
  plan?: Relation<Plan>;

  @OneToMany(() => Plant, (plant) => plant.planting, {
    eager: true,
    cascade: true,
  })
  plants!: Relation<Plant>[];

  static localCopy(
    planting: Planting | PlantingLocal,
    deep = true,
  ): PlantingLocal {
    const newPlanting: PlantingLocal = Object.assign({}, planting);

    delete newPlanting.variety;
    delete newPlanting.plan;

    if (deep) {
      newPlanting.plants = planting.plants?.map((p) => Plant.localCopy(p));
    } else {
      newPlanting.plants = [];
    }

    return newPlanting;
  }

  static initialize(planting: Planting): Planting {
    Object.setPrototypeOf(planting, Planting.prototype);

    planting.plants ??= [];

    return planting;
  }
}
