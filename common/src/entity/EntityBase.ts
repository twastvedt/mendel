import { PrimaryGeneratedColumn } from "typeorm";
import { Optional, Modify } from "../typeHelpers";

export interface EntityLocalBase {
  id?: number;
}

export class EntityBase {
  @PrimaryGeneratedColumn()
  id!: number;
}

export type EntityLocal<
  T extends EntityBase,
  TOptional extends Exclude<keyof T, "id">,
  TModified = {}
> = Modify<Optional<T, TOptional | "id">, TModified>;

export type HasId<T extends EntityLocalBase> = T & Required<Pick<T, "id">>;
