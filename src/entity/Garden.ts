import type { Point } from "geojson";
import { Entity, Column, OneToMany } from "typeorm";
import { Bed } from "./Bed";
import { EntityBase } from "./EntityBase";
import { Plant } from "./Plant";
import { Planting } from "./Planting";

@Entity()
export class Garden extends EntityBase {
  @Column()
  name!: string;

  @Column("geometry", { spatialFeatureType: "Point", srid: 4326 })
  location!: Point;

  @OneToMany(() => Bed, (bed) => bed.garden, {
    eager: true,
    onDelete: "CASCADE",
  })
  beds!: Bed[];

  @OneToMany(() => Plant, (plant) => plant.garden, {
    eager: true,
    onDelete: "CASCADE",
  })
  plants!: Plant[];

  @OneToMany(() => Planting, (planting) => planting.garden, {
    eager: true,
    onDelete: "CASCADE",
  })
  plantings!: Planting[];

  removePlant(id: number): void {
    const i = this.plants.findIndex((p) => p.id === id);

    if (i !== -1) {
      this.plants.splice(i, 1);
    }
  }
}
