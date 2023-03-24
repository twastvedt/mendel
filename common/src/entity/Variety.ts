import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { EntityBase, EntityLocal } from "./EntityBase";
import { Family, FamilyLocal } from "./Family";
import { Planting, PlantingLocal } from "./Planting";

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
  family?: Family;

  @OneToMany(() => Planting, (planting) => planting.variety, {
    onDelete: "CASCADE",
    cascade: true,
  })
  plantings!: Planting[];

  static localCopy(variety: Variety | VarietyLocal, deep = true): VarietyLocal {
    const newVariety: VarietyLocal = Object.assign({}, variety);

    delete newVariety.family;

    if (deep) {
      newVariety.plantings = variety.plantings?.map((p) =>
        Planting.localCopy(p, true)
      );
    } else {
      newVariety.plantings = [];
    }

    return newVariety;
  }
}
