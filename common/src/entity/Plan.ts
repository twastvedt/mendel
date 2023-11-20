import type {
  Relation} from "typeorm";
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import type { EntityLocal } from "./EntityBase.js";
import { EntityBase } from "./EntityBase.js";
import type { PlantingLocal } from "./Planting.js";
import { Planting } from "./Planting.js";
import type { GardenLocal } from "./Garden.js";
import { Garden } from "./Garden.js";

export type PlanLocal = EntityLocal<
  Plan,
  "gardenId" | "createdDate" | "updatedDate" | "draft",
  { plantings: PlantingLocal[]; garden?: GardenLocal }
>;

@Entity()
export class Plan extends EntityBase {
  @Column("varchar")
  name!: string;

  @Column("varchar", { nullable: true })
  description?: string;

  @Column("smallint")
  year!: number;

  @Column("boolean", { default: false })
  draft = false;

  @Column("integer")
  gardenId!: number;

  @ManyToOne(() => Garden, (garden) => garden.plans, {
    onDelete: "CASCADE",
  })
  garden?: Relation<Garden>;

  @OneToMany(() => Planting, (planting) => planting.plan, {
    eager: true,
    cascade: true,
  })
  plantings!: Relation<Planting>[];

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;

  static localCopy<T extends PlanLocal>(plan: T, deep = true): T & PlanLocal {
    const newPlan: T = Object.assign({}, plan);

    delete newPlan.garden;

    if (deep) {
      newPlan.plantings = plan.plantings?.map((p) =>
        Planting.localCopy(p, true),
      );
    } else {
      newPlan.plantings = [];
    }

    return newPlan;
  }
}
