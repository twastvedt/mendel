import { Entity, Column, OneToMany } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Variety } from "./Variety";

@Entity()
export class Family extends EntityBase {
  constructor(
    name: string,
    color: string,
    icon: string,
    spacing: number,
    nitrogen?: number
  ) {
    super();

    this.name = name;
    this.icon = icon;
    this.color = color;
    this.spacing = spacing;
    this.nitrogen = nitrogen;
  }

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

  static clone(family: Family): Family {
    return Object.assign({}, family);
  }

  static cleanClone(family: Family): Family {
    const newFamily = Family.clone(family);

    newFamily.varieties = [];

    return newFamily;
  }
}
