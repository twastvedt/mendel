import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Family } from "./Family";

@Entity()
export class Variety {
  constructor(name: string, color: string, family: Family) {
    this.name = name;
    this.color = color;
    this.family = family;
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  color!: string;

  @ManyToOne(() => Family, (family) => family.varieties)
  family!: Family;
}
