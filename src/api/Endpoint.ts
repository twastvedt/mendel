/* eslint-disable @typescript-eslint/no-unused-vars */

// Methods supported by both Axios and Express.
export type Method =
  | "get"
  | "delete"
  | "head"
  | "options"
  | "post"
  | "put"
  | "patch"
  | "purge";

export class Endpoint<
  Response,
  Data extends Record<string, unknown> | undefined = undefined,
  Params extends Record<string, string | number | Date> | undefined = undefined
> {
  constructor(public method: Method, public resource: string = "") {}
}
