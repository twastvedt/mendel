import type { Relation } from "typeorm";
import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import type { EntityLocal } from "./EntityBase.js";
import { EntityBase } from "./EntityBase.js";
import type { FamilyLocal } from "./Family.js";
import { Family } from "./Family.js";
import type { PlantingLocal } from "./Planting.js";
import { Planting } from "./Planting.js";

export type VarietyLocal = EntityLocal<
  Variety,
  "familyId",
  { plantings: PlantingLocal[]; family?: FamilyLocal }
>;

@Entity()
export class Variety extends EntityBase {
  constructor(name: string, color: string, family?: Family | number) {
    super();

    this.name = name;
    this.color = color;

    if (typeof family === "number") {
      this.familyId = family;
    } else {
      this.family = family;

      if (family?.id != null) {
        this.familyId = family.id;
      }
    }
  }

  @Column("varchar")
  name!: string;

  @Column("varchar")
  color!: string;

  @Column("integer")
  familyId!: number;

  @ManyToOne(() => Family, (family) => family.varieties, {
    onDelete: "CASCADE",
  })
  family?: Relation<Family>;

  @OneToMany(() => Planting, (planting) => planting.variety, {
    onDelete: "CASCADE",
    cascade: true,
  })
  plantings!: Relation<Planting>[];

  static localCopy(variety: Variety | VarietyLocal, deep = true): VarietyLocal {
    const newVariety: VarietyLocal = Object.assign({}, variety);

    delete newVariety.family;

    if (deep) {
      newVariety.plantings = variety.plantings?.map((p) =>
        Planting.localCopy(p, true),
      );
    } else {
      newVariety.plantings = [];
    }

    return newVariety;
  }
}
