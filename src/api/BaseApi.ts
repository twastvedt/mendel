import { EntityBase } from "@/entity/EntityBase";
import { Endpoint } from "./Endpoint";

export type EntityNoId<T extends EntityBase> = Omit<T, "id"> &
  Partial<Pick<T, "id">>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function baseApi<T extends EntityBase>(endpoint: string) {
  return {
    one: new Endpoint<T, undefined, { id: number }>("get", `/${endpoint}/:id`),

    all: new Endpoint<T[]>("get", `/${endpoint}/`),

    create: new Endpoint<T, EntityNoId<T>>("post", `/${endpoint}/`),

    update: new Endpoint<void, Partial<T> & Pick<T, "id">, { id: number }>(
      "put",
      `/${endpoint}/:id`
    ),

    delete: new Endpoint<void, undefined, { id: number }>(
      "delete",
      `/${endpoint}/:id`
    ),
  };
}
