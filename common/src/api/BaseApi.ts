import { EntityBase } from "../entity/EntityBase";
import { Endpoint } from "./Endpoint";

export type EntityId<T extends EntityBase> = T & Required<Pick<T, "id">>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function baseApi<T extends EntityBase>(endpoint: string) {
  return {
    one: new Endpoint<{ id: number }, undefined, T>("get", `/${endpoint}/:id`),

    all: new Endpoint<undefined, undefined, T[]>("get", `/${endpoint}/`),

    create: new Endpoint<undefined, T | T[], EntityId<T> | EntityId<T>[]>(
      "post",
      `/${endpoint}/`
    ),

    update: new Endpoint<undefined, EntityId<T>, undefined>(
      "put",
      `/${endpoint}`
    ),

    delete: new Endpoint<{ id: number }, undefined, undefined>(
      "delete",
      `/${endpoint}/:id`
    ),
  };
}
