import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Type } from "./Type";

@Entity()
export class Variety {
  constructor(name: string, color: string, type: Type) {
    this.name = name;
    this.color = color;
    this.type = type;
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  color!: string;

  @ManyToOne(() => Type, (type) => type.varieties)
  type!: Type;
}
