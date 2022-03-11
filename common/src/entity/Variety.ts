import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Family } from "./Family";
import { Plant } from "./Plant";
import { Planting } from "./Planting";

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

  @Column()
  name!: string;

  @Column()
  color!: string;

  @Column()
  familyId?: number;

  @ManyToOne(() => Family, (family) => family.varieties, {
    onDelete: "CASCADE",
  })
  family?: Family;

  @OneToMany(() => Plant, (plant) => plant.variety, {
    onDelete: "CASCADE",
  })
  plants?: Plant[];

  @OneToMany(() => Planting, (planting) => planting.variety, {
    onDelete: "CASCADE",
  })
  plantings?: Planting[];

  static cleanCopy(variety: Variety): Variety {
    const newVariety = Object.assign({}, variety);

    delete newVariety.family;
    delete newVariety.plants;
    delete newVariety.plantings;

    return newVariety;
  }
}
