import { Entity, Column, ManyToOne } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Garden } from "./Garden";
import { MultiPoint, Polygon } from "./geoJson";
import { Variety } from "./Variety";

@Entity()
export class Planting extends EntityBase {
  @Column("geometry", { spatialFeatureType: "MultiPoint" })
  locations!: MultiPoint;

  @Column("geometry", { nullable: true, spatialFeatureType: "Polygon" })
  shape?: Polygon;

  @Column({ nullable: true })
  plantDate?: Date;

  @Column()
  areSeedlings: boolean;

  @Column({ nullable: true })
  germinationRank?: number;

  @Column({ nullable: true })
  growthRank?: number;

  @Column({ nullable: true })
  healthRank?: number;

  @Column({ nullable: true })
  yeildRank?: number;

  @Column({ nullable: true })
  varietyId?: number;

  @ManyToOne(() => Variety, (variety) => variety.plantings)
  variety?: Variety;

  @Column({ nullable: true })
  gardenId?: number;

  @ManyToOne(() => Garden, (garden) => garden.plantings, {
    onDelete: "CASCADE",
  })
  garden?: Garden;

  constructor() {
    super();

    this.areSeedlings = false;
    this.locations = {
      type: "MultiPoint",
      coordinates: [],
    };
  }

  static copy(oldPlanting: Planting): Planting {
    return Object.assign({}, oldPlanting);
  }

  static cleanCopy(oldPlanting: Planting): Planting {
    const newPlanting = Planting.copy(oldPlanting);

    delete newPlanting.variety;
    delete newPlanting.garden;

    return newPlanting;
  }
}
