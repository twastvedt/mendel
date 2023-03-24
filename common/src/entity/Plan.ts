import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { EntityBase } from "./EntityBase";
import { Planting } from "./Planting";
import { Garden } from "./Garden";

@Entity()
export class Plan extends EntityBase {
  @Column("varchar")
  name!: string;

  @Column("varchar", { nullable: true })
  description?: string;

  @Column("smallint")
  year!: number;

  @Column("boolean")
  draft = false;

  @Column("integer")
  gardenId?: number;

  @ManyToOne(() => Garden, (garden) => garden.plans, {
    onDelete: "CASCADE",
  })
  garden?: Garden;

  @OneToMany(() => Planting, (planting) => planting.plan, {
    eager: true,
    cascade: true,
  })
  plantings!: Planting[];

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;

  cleanCopy(): Plan {
    const newPlan = this.copy();

    delete newPlan.garden;

    if (newPlan.plantings.length) {
      newPlan.plantings = newPlan.plantings.map((p) => p.cleanCopy());
    }

    return newPlan;
  }

  static initialize(plan: Partial<Plan>): Plan {
    Object.setPrototypeOf(plan, Plan.prototype);

    plan.plantings = [];

    return plan as Plan;
  }
}
