import { EntityBase } from "../entity/EntityBase";
import { Endpoint } from "./Endpoint";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function baseApi<T extends EntityBase, TLocal>(endpoint: string) {
  return {
    one: new Endpoint<{ id: number }, undefined, T>("get", `/${endpoint}/:id`),

    all: new Endpoint<undefined, undefined, T[]>("get", `/${endpoint}/`),

    create: new Endpoint<undefined, TLocal | TLocal[], T | T[]>(
      "post",
      `/${endpoint}/`
    ),

    update: new Endpoint<undefined, Partial<TLocal> & EntityBase, undefined>(
      "put",
      `/${endpoint}`
    ),

    delete: new Endpoint<{ id: number }, undefined, undefined>(
      "delete",
      `/${endpoint}/:id`
    ),
  };
}
