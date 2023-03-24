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
  varieties!: Variety[];

  static cleanCopy<T extends Family>(family: T): Omit<T, "varieties"> {
    const newFamily = Object.assign({}, family);

    delete newFamily.varieties;

    return newFamily;
  }
}
