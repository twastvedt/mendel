import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Family } from "./Family";
import { Plant } from "./Plant";
import { Planting } from "./Planting";

@Entity()
export class Variety extends EntityBase {
  constructor(name: string, color: string, family: Family) {
    super();

    this.name = name;
    this.color = color;
    this.family = family;

    if (family?.id != null) {
      this.familyId = family.id;
    }
  }

  @Column()
  name!: string;

  @Column()
  color!: string;

  @Column()
  familyId?: number;

  @OneToMany(() => Plant, (plant) => plant.variety, {
    onDelete: "CASCADE",
  })
  plants?: Plant[];

  @OneToMany(() => Planting, (planting) => planting.variety, {
    onDelete: "CASCADE",
  })
  plantings?: Planting[];

  @ManyToOne(() => Family, (family) => family.varieties)
  @JoinColumn({ name: nameof(Variety.prototype.familyId) })
  family?: Family;
}
