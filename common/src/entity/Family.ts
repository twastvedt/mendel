import type { Relation } from "typeorm";
import { Entity, Column, OneToMany } from "typeorm";
import type { EntityLocal } from "./EntityBase.js";
import { EntityBase } from "./EntityBase.js";
import type { VarietyLocal } from "./Variety.js";
import { Variety } from "./Variety.js";

export type FamilyLocal = EntityLocal<
  Family,
  never,
  { varieties: VarietyLocal[] }
>;

@Entity()
export class Family extends EntityBase {
  constructor(
    name: string,
    color: string,
    icon: string,
    spacing: number,
    nitrogen?: number,
  ) {
    super();

    this.name = name;
    this.icon = icon;
    this.color = color;
    this.spacing = spacing;
    this.nitrogen = nitrogen;
  }

  @Column("varchar")
  name!: string;

  @Column("varchar")
  icon!: string;

  @Column("varchar")
  color!: string;

  @Column("varchar", { nullable: true })
  nitrogen?: number;

  /**
   * Space between plants, in inches.
   */
  @Column("float")
  spacing!: number;

  @OneToMany(() => Variety, (v) => v.family, { cascade: true })
  varieties!: Relation<Variety>[];

  static localCopy(family: FamilyLocal, deep = true): FamilyLocal {
    const newFamily: FamilyLocal = Object.assign({}, family);

    if (deep) {
      newFamily.varieties = family.varieties?.map((v) =>
        Variety.localCopy(v, true),
      );
    } else {
      newFamily.varieties = [];
    }

    return newFamily;
  }
}
