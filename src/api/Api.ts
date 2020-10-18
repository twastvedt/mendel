import { Bed } from "@/entity/Bed";
import { Endpoint } from "./Endpoint";

export class Beds {
  static one = new Endpoint<Bed, undefined, { id: string }>("get", `/beds/:id`);

  static all = new Endpoint<Bed[]>("get", "/beds");

  static create = new Endpoint<Bed, Partial<Bed>>("post", "/beds");

  static update = new Endpoint<Bed, Partial<Bed>, { id: string }>(
    "put",
    `/beds/:id`
  );

  static delete = new Endpoint<Bed, undefined, { id: string }>(
    "delete",
    `/beds/:id`
  );
}
