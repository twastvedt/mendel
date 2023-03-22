import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Garden } from "./Garden";
import { Polygon, LineString } from "./geoJson";
import { Plant } from "./Plant";
import { Variety } from "./Variety";

@Entity()
export class Planting extends EntityBase {
  @Column("geometry", {
    nullable: true,
    spatialFeatureType: "GeometryCollection",
  })
  shape?: Polygon | LineString;

  @Column("date", { nullable: true })
  plantDate?: Date;

  @Column("boolean")
  areSeedlings: boolean;

  @Column("integer", { nullable: true })
  germinationRank?: number;

  @Column("integer", { nullable: true })
  growthRank?: number;

  @Column("integer", { nullable: true })
  healthRank?: number;

  @Column("integer", { nullable: true })
  yeildRank?: number;

  @Column("integer", { nullable: true })
  varietyId?: number;

  @ManyToOne(() => Variety, (variety) => variety.plantings)
  variety?: Variety;

  @Column("integer", { nullable: true })
  gardenId?: number;

  @ManyToOne(() => Garden, (garden) => garden.plantings, {
    onDelete: "CASCADE",
  })
  garden?: Garden;

  @OneToMany(() => Plant, (plant) => plant.planting, {
    eager: true,
  })
  plants?: Plant[];

  constructor() {
    super();

    this.areSeedlings = false;
  }

  static copy(oldPlanting: Planting): Planting {
    return Object.assign({}, oldPlanting);
  }

  static cleanCopy(oldPlanting: Planting): Planting {
    const newPlanting = Planting.copy(oldPlanting);

    delete newPlanting.variety;
    delete newPlanting.garden;

    if (newPlanting.plants) {
      newPlanting.plants = newPlanting.plants.map((p) => Plant.cleanCopy(p));
    }

    return newPlanting;
  }
}
