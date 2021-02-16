import { Endpoint } from "./Endpoint";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function baseApi<T>(endpoint: string) {
  return {
    one: new Endpoint<T, undefined, { id: number }>("get", `/${endpoint}/:id`),

    all: new Endpoint<T[]>("get", `/${endpoint}/`),

    create: new Endpoint<T, Partial<T>>("post", `/${endpoint}/`),

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
