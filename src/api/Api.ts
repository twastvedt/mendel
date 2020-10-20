import { Bed } from "@/entity/Bed";
import { Endpoint } from "./Endpoint";

export class Beds {
  static base = "/beds/";

  static one = new Endpoint<Bed, undefined, { id: string }>(
    "get",
    `${Beds.base}:id`
  );

  static all = new Endpoint<Bed[]>("get", Beds.base);

  static create = new Endpoint<Bed, Partial<Bed>>("post", `${Beds.base}`);

  static update = new Endpoint<Bed, Partial<Bed>, { id: string }>(
    "put",
    `${Beds.base}:id`
  );

  static delete = new Endpoint<Bed, undefined, { id: string }>(
    "delete",
    `${Beds.base}:id`
  );
}
