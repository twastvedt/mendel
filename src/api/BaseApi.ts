import { EntityBase } from "@/entity/EntityBase";
import { Endpoint } from "./Endpoint";

export type EntityId<T extends EntityBase> = T & Required<Pick<T, "id">>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function baseApi<T extends EntityBase>(endpoint: string) {
  return {
    one: new Endpoint<T, undefined, { id: number }>("get", `/${endpoint}/:id`),

    all: new Endpoint<T[]>("get", `/${endpoint}/`),

    create: new Endpoint<T, T>("post", `/${endpoint}/`),

    update: new Endpoint<void, EntityId<T>>("put", `/${endpoint}`),

    delete: new Endpoint<void, undefined, { id: number }>(
      "delete",
      `/${endpoint}/:id`
    ),
  };
}
