import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Family } from "./Family";

@Entity()
export class Variety {
  constructor(name: string, color: string, family: Family) {
    this.name = name;
    this.color = color;
    this.family = family;

    if (family?.id != null) {
      this.familyId = family.id;
    }
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  color!: string;

  @Column()
  familyId?: number;

  @ManyToOne(() => Family, (family) => family.varieties)
  @JoinColumn({ name: nameof(Variety.prototype.familyId) })
  family!: Family;
}
