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

    update: new Endpoint<T, Partial<T>, { id: string }>(
      "put",
      `/${endpoint}/:id`
    ),

    delete: new Endpoint<T, undefined, { id: string }>(
      "delete",
      `/${endpoint}/:id`
    ),
  };
}
