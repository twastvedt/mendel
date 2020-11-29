import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Variety } from "./Variety";

@Entity()
export class Family {
  constructor(
    name: string,
    color: string,
    icon: string,
    spacing: number,
    nitrogen = undefined
  ) {
    this.name = name;
    this.icon = icon;
    this.color = color;
    this.spacing = spacing;
    this.nitrogen = nitrogen;
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  icon!: string;

  @Column()
  color!: string;

  @Column({ nullable: true })
  nitrogen?: number;

  /**
   * Space between plants, in inches.
   */
  @Column()
  spacing!: number;

  @OneToMany(() => Variety, (v) => v.family, {
    onDelete: "CASCADE",
  })
  varieties!: Variety[];
}
